/**
 * Test Exam TypeScript Controller
 * کنترلر TypeScript آزمون تستی
 * 
 * ویژگی‌های اصلی:
 * - CRUD کامل آزمون‌ها
 * - تولید سوالات بر اساس توزیع سختی
 * - مدیریت جلسات آزمون
 * - محاسبه نتایج و تحلیل گرافیکی  
 * - شخصی‌سازی تنظیمات
 * - مسیر یادگیری
 * - کش هوشمند برای خرید و تکرار آزمون‌ها
 * 
 * @author Exam-Edu Platform
 * @version 2.0.0
 */

import { Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import Parse from 'parse/node';
import QuestionCacheService from '../services/QuestionCacheService';
import ExamPurchaseCacheService from '../services/ExamPurchaseCacheService';
import {
  TestExamData,
  TestExamSessionData,
  TestExamResultData,
  PersonalizationConfig,
  TestExamStatus,
  SessionStatus,
  ResultStatus,
  DEFAULT_EXAM_CONFIG,
  validateDifficultyDistribution,
  validatePersonalizationConfig,
  calculateExamScore,
  generateLearningPath,
  ExamAnalyticsData,
  QuestionDifficulty,
  getQuestionPoints,
  ExamAnswer
} from '../models/test-exam';

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface ValidationErrorItem {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string;
}

export class TestExamController {
  /**
   * Create a new test exam
   * POST /api/test-exams
   */
  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'خطاهای اعتبارسنجی',
          errors: errors.array().map((err: any) => ({
            field: err.path || err.param,
            message: err.msg
          }))
        });
        return;
      }

      const {
        title,
        description,
        type,
        configuration,
        personalization,
        subjectId // اضافه شده برای کش جدید
      } = req.body;

      // Validate configuration
      if (configuration?.difficultyDistribution && 
          !validateDifficultyDistribution(configuration.difficultyDistribution)) {
        res.status(400).json({
          success: false,
          message: 'توزیع سختی نامعتبر است'
        });
        return;
      }

      // Validate personalization
      if (personalization && !validatePersonalizationConfig(personalization)) {
        res.status(400).json({
          success: false,
          message: 'تنظیمات شخصی‌سازی نامعتبر است'
        });
        return;
      }

      // Create exam object
      const TestExam = Parse.Object.extend('TestExam');
      const exam = new TestExam();

      exam.set('title', title);
      exam.set('description', description || '');
      exam.set('type', type);
      exam.set('status', TestExamStatus.DRAFT);
      exam.set('authorId', req.user?.id);
      exam.set('isPublished', false);
      exam.set('subjectId', subjectId); // اضافه شده

      // Set configuration
      const finalConfig = {
        ...DEFAULT_EXAM_CONFIG,
        ...configuration,
        personalization
      };
      exam.set('configuration', finalConfig);

      // Initialize metadata
      exam.set('metadata', {
        version: 1,
        lastModified: new Date(),
        participantCount: 0,
        averageScore: 0,
        passRate: 0,
        difficultyStats: {
          easy: { averageScore: 0, attemptCount: 0 },
          medium: { averageScore: 0, attemptCount: 0 },
          hard: { averageScore: 0, attemptCount: 0 }
        },
        categoryStats: {}
      });

      // Set author relationship
      if (req.user) {
        const User = Parse.Object.extend('User');
        const user = new User();
        user.id = req.user.id;
        exam.set('author', user);
      }

      // ACL settings
      const acl = new Parse.ACL();
      if (req.user?.id) {
        acl.setReadAccess(req.user.id, true);
        acl.setWriteAccess(req.user.id, true);
      }
      acl.setPublicReadAccess(false);
      exam.setACL(acl);

      const savedExam = await exam.save();

      res.status(201).json({
        success: true,
        message: 'آزمون با موفقیت ایجاد شد',
        data: savedExam.toJSON()
      });

    } catch (error) {
      console.error('Error creating test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ایجاد آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get all test exams with filtering and pagination
   * GET /api/test-exams
   */
  static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        status,
        search,
        publishedOnly = 'true',
        authorId,
        categories,
        difficulty
      } = req.query;

      const TestExam = Parse.Object.extend('TestExam');
      let query = new Parse.Query(TestExam);

      // Filters
      if (publishedOnly === 'true') {
        query.equalTo('isPublished', true);
        query.equalTo('status', TestExamStatus.ACTIVE);
      }

      if (authorId) {
        query.equalTo('authorId', authorId);
      }

      if (type) {
        query.equalTo('type', type);
      }

      if (status) {
        query.equalTo('status', status);
      }

      if (categories && typeof categories === 'string') {
        const categoryArray = categories.split(',');
        query.containedIn('configuration.categories', categoryArray);
      }

      // Search
      if (search && typeof search === 'string') {
        const titleQuery = new Parse.Query(TestExam);
        titleQuery.contains('title', search);
        
        const descQuery = new Parse.Query(TestExam);
        descQuery.contains('description', search);
        
        const searchQuery = Parse.Query.or(titleQuery, descQuery);
        query = Parse.Query.and(query, searchQuery);
      }

      // Include relations
      query.include(['author']);

      // Pagination
      const limitNum = parseInt(limit as string);
      const pageNum = parseInt(page as string);
      query.limit(limitNum);
      query.skip((pageNum - 1) * limitNum);
      query.descending('createdAt');

      const [exams, totalCount] = await Promise.all([
        query.find(),
        query.count()
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      res.json({
        success: true,
        data: exams.map(exam => exam.toJSON()),
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      });

    } catch (error) {
      console.error('Error listing test exams:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت لیست آزمون‌ها',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get a single test exam by ID
   * GET /api/test-exams/:id
   */
  static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const TestExam = Parse.Object.extend('TestExam');
      const query = new Parse.Query(TestExam);
      query.include(['author']);
      
      const exam = await query.get(id);

      if (!exam) {
        res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      // Check access permissions
      const isPublished = exam.get('isPublished');
      const authorId = exam.get('authorId');
      
      if (!isPublished && authorId !== req.user?.id) {
        res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      res.json({
        success: true,
        data: exam.toJSON()
      });

    } catch (error) {
      console.error('Error getting test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Update a test exam
   * PUT /api/test-exams/:id
   */
  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'خطاهای اعتبارسنجی',
          errors: errors.array().map((err: any) => ({
            field: err.path || err.param,
            message: err.msg
          }))
        });
        return;
      }

      const TestExam = Parse.Object.extend('TestExam');
      const query = new Parse.Query(TestExam);
      const exam = await query.get(id);

      if (!exam) {
        res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      // Check ownership
      if (exam.get('authorId') !== req.user?.id) {
        res.status(403).json({
          success: false,
          message: 'تنها نویسنده می‌تواند آزمون را ویرایش کند'
        });
        return;
      }

      const {
        title,
        description,
        type,
        configuration,
        personalization,
        status
      } = req.body;

      // Validate configuration if provided
      if (configuration?.difficultyDistribution && 
          !validateDifficultyDistribution(configuration.difficultyDistribution)) {
        res.status(400).json({
          success: false,
          message: 'توزیع سختی نامعتبر است'
        });
        return;
      }

      // Validate personalization if provided
      if (personalization && !validatePersonalizationConfig(personalization)) {
        res.status(400).json({
          success: false,
          message: 'تنظیمات شخصی‌سازی نامعتبر است'
        });
        return;
      }

      // Update fields
      if (title) exam.set('title', title);
      if (description !== undefined) exam.set('description', description);
      if (type) exam.set('type', type);
      if (status) exam.set('status', status);

      if (configuration) {
        const currentConfig = exam.get('configuration') || {};
        exam.set('configuration', {
          ...currentConfig,
          ...configuration,
          personalization
        });
      }

      // Update metadata
      const metadata = exam.get('metadata') || {};
      metadata.lastModified = new Date();
      metadata.version = (metadata.version || 1) + 1;
      exam.set('metadata', metadata);

      const updatedExam = await exam.save();

      res.json({
        success: true,
        message: 'آزمون با موفقیت به‌روزرسانی شد',
        data: updatedExam.toJSON()
      });

    } catch (error) {
      console.error('Error updating test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در به‌روزرسانی آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Generate questions for exam based on configuration
   * POST /api/test-exams/:id/generate-questions
   */
  static async generateQuestions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { configuration, personalization, isRepetition } = req.body;

      const TestExam = Parse.Object.extend('TestExam');
      const query = new Parse.Query(TestExam);
      const exam = await query.get(id);

      if (!exam) {
        res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      // Check ownership for creation, but allow access for purchased exams
      if (!isRepetition && exam.get('authorId') !== req.user?.id) {
        res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      // For repetition, check if user has purchased the exam
      if (isRepetition) {
        const hasAccess = await TestExamController.checkUserExamAccess(req.user?.id, id);
        if (!hasAccess) {
          res.status(403).json({
            success: false,
            message: 'شما این آزمون را خریداری نکرده‌اید'
          });
          return;
        }
      }

      const config = configuration || exam.get('configuration');
      const subjectId = exam.get('subjectId') || 'general';
      const difficultyDist = personalization?.difficultyDistribution || config.difficultyDistribution;

      // استفاده از سرویس کش هوشمند جدید
      const purchaseCacheService = ExamPurchaseCacheService.getInstance();
      const allQuestions = [];

      // دریافت سوالات از کش برای هر سطح سختی
      for (const [difficulty, count] of Object.entries(difficultyDist)) {
        if (typeof count === 'number' && count > 0) {
          const examConfig = {
            subjectId,
            categories: config.categories || [],
            difficulty: difficulty.toUpperCase(),
            tags: config.tags || [],
            totalQuestions: count as number,
            userId: req.user?.id,
            examId: isRepetition ? id : undefined,
            isRepetition: isRepetition || false
          };

          try {
            const result = await purchaseCacheService.getExamQuestions(examConfig);
            allQuestions.push(...result.questions);
            
            // اگر اولین خرید است، آمار کش را ذخیره کن
            if (!isRepetition && result.cacheInfo.type !== 'repetition') {
              console.log(`Cache ${result.cacheInfo.type} used for ${difficulty}: ${result.cacheInfo.hitRate}% hit rate`);
            }
          } catch (error) {
            // اگر حداکثر تکرار تجاوز شده، خطا برگردان
            if (error instanceof Error && error.message.includes('حداکثر تعداد تکرار')) {
              res.status(400).json({
                success: false,
                message: error.message,
                code: 'MAX_REPETITIONS_EXCEEDED'
              });
              return;
            }
            throw error;
          }
        }
      }

      if (allQuestions.length === 0) {
        res.status(400).json({
          success: false,
          message: 'سوال مناسبی برای این آزمون یافت نشد'
        });
        return;
      }

      // اگر shuffle فعال باشد، ترتیب نهایی سوالات را تغییر دهیم
      let finalQuestions = allQuestions;
      if (config.shuffleQuestions && !isRepetition) {
        finalQuestions = [...allQuestions];
        for (let i = finalQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
        }
      }

      // Create question items
      const questionItems = finalQuestions.map((q, index) => ({
        questionId: q._id || q.id,
        question: q,
        difficulty: q.difficulty,
        category: q.category,
        tags: q.tags || [],
        order: index + 1
      }));

      // Update exam
      exam.set('questions', questionItems);
      exam.set('questionIds', finalQuestions.map(q => q._id || q.id));

      const updatedExam = await exam.save();

      // اگر خرید جدید است، آن را ثبت کن
      if (!isRepetition) {
        await purchaseCacheService.recordExamPurchase(
          req.user?.id,
          id,
          subjectId,
          finalQuestions
        );
      }

      // دریافت آمار کش و تکرار
      const cacheStats = purchaseCacheService.getCacheStats();
      const repetitionStats = purchaseCacheService.getExamRepetitionStats(req.user?.id, id);

      res.json({
        success: true,
        message: isRepetition ? 'سوالات تکرار آزمون دریافت شد' : 'سوالات آزمون جدید تولید شد',
        data: {
          exam: updatedExam.toJSON(),
          questionsGenerated: finalQuestions.length,
          distribution: {
            easy: questionItems.filter(q => q.difficulty === 'EASY').length,
            medium: questionItems.filter(q => q.difficulty === 'MEDIUM').length,
            hard: questionItems.filter(q => q.difficulty === 'HARD').length
          },
          cacheInfo: {
            type: isRepetition ? 'repetition' : 'purchase-based',
            sharedCacheHitRate: cacheStats.sharedCaches.hitRate,
            memoryUsage: `${(cacheStats.sharedCaches.memoryUsage / 1024 / 1024).toFixed(2)} MB`
          },
          repetitionInfo: repetitionStats ? {
            currentRepetition: repetitionStats.repetitionCount,
            maxRepetitions: repetitionStats.maxRepetitions,
            remainingRepetitions: repetitionStats.remainingRepetitions,
            canRepeat: repetitionStats.canRepeat
          } : {
            currentRepetition: 1,
            maxRepetitions: 2,
            remainingRepetitions: 1,
            canRepeat: true
          }
        }
      });

    } catch (error) {
      console.error('Error generating questions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در تولید سوالات',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Start an exam session
   * POST /api/test-exams/:id/start
   */
  static async startExam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const TestExam = Parse.Object.extend('TestExam');
      const examQuery = new Parse.Query(TestExam);
      const exam = await examQuery.get(id);

      if (!exam) {
        res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      // Check if exam is published and active
      if (!exam.get('isPublished') || exam.get('status') !== TestExamStatus.ACTIVE) {
        res.status(400).json({
          success: false,
          message: 'آزمون در دسترس نیست'
        });
        return;
      }

      // Check if user has access to this exam (payment verification)
      const hasAccess = await TestExamController.checkUserExamAccess(req.user?.id, id);
      if (!hasAccess) {
        // Get exam pricing information
        const configuration = exam.get('configuration');
        const questionCount = configuration?.totalQuestions || 40;
        
        res.status(402).json({
          success: false,
          message: 'برای دسترسی به این آزمون باید هزینه آن را پرداخت کنید',
          requiresPayment: true,
          examInfo: {
            id,
            title: exam.get('title'),
            questionCount,
            description: exam.get('description')
          }
        });
        return;
      }

      // Check for existing active session
      const ExamSession = Parse.Object.extend('ExamSession');
      const sessionQuery = new Parse.Query(ExamSession);
      sessionQuery.equalTo('examId', id);
      sessionQuery.equalTo('participantId', req.user?.id);
      sessionQuery.containedIn('status', [SessionStatus.NOT_STARTED, SessionStatus.IN_PROGRESS]);

      const existingSession = await sessionQuery.first();

      if (existingSession) {
        res.json({
          success: true,
          message: 'جلسه فعال موجود است',
          data: existingSession.toJSON()
        });
        return;
      }

      // Create new session
      const session = new ExamSession();
      session.set('examId', id);
      session.set('participantId', req.user?.id);
      session.set('status', SessionStatus.IN_PROGRESS);
      session.set('startTime', new Date());
      session.set('currentQuestionIndex', 0);
      session.set('answers', {});

      const config = exam.get('configuration');
      if (config.timeLimit) {
        session.set('timeRemaining', config.timeLimit * 60); // Convert to seconds
      }

      session.set('metadata', {
        timeSpent: 0,
        questionsVisited: 0,
        questionsAnswered: 0,
        questionsMarkedForReview: 0,
        timeDistribution: [],
        pauseCount: 0,
        pauseDuration: 0
      });

      // Set ACL
      const acl = new Parse.ACL();
      if (req.user?.id) {
        acl.setReadAccess(req.user.id, true);
        acl.setWriteAccess(req.user.id, true);
      }
      session.setACL(acl);

      const savedSession = await session.save();

      res.status(201).json({
        success: true,
        message: 'جلسه آزمون شروع شد',
        data: savedSession.toJSON()
      });

    } catch (error) {
      console.error('Error starting exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در شروع آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Check if user has access to exam (payment verification)
   */
  private static async checkUserExamAccess(userId: string, examId: string): Promise<boolean> {
    try {
      // Check if user has purchased access to this exam
      const UserExamAccess = Parse.Object.extend('UserExamAccess');
      const accessQuery = new Parse.Query(UserExamAccess);
      accessQuery.equalTo('userId', userId);
      accessQuery.equalTo('examId', examId);
      accessQuery.equalTo('isActive', true);

      const access = await accessQuery.first();
      return !!access;
    } catch (error) {
      console.error('Error checking user exam access:', error);
      return false;
    }
  }

  /**
   * Submit an answer
   * POST /api/test-exams/sessions/:sessionId/answers
   */
  static async submitAnswer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { questionId, answer, timeSpent } = req.body;

      const ExamSession = Parse.Object.extend('ExamSession');
      const query = new Parse.Query(ExamSession);
      const session = await query.get(sessionId);

      if (!session) {
        res.status(404).json({
          success: false,
          message: 'جلسه آزمون یافت نشد'
        });
        return;
      }

      // Check ownership
      if (session.get('participantId') !== req.user?.id) {
        res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      // Check session status
      if (session.get('status') !== SessionStatus.IN_PROGRESS) {
        res.status(400).json({
          success: false,
          message: 'جلسه آزمون فعال نیست'
        });
        return;
      }

      const answers = session.get('answers') || {};
      answers[questionId] = {
        questionId,
        selectedOptions: answer.selectedOptions,
        textAnswer: answer.textAnswer,
        timeSpent,
        answeredAt: new Date(),
        reviewMarked: answer.reviewMarked || false
      };

      session.set('answers', answers);

      // Update metadata
      const metadata = session.get('metadata') || {};
      metadata.questionsAnswered = Object.keys(answers).length;
      metadata.timeSpent += timeSpent;
      session.set('metadata', metadata);

      const updatedSession = await session.save();

      res.json({
        success: true,
        message: 'پاسخ ثبت شد',
        data: updatedSession.toJSON()
      });

    } catch (error) {
      console.error('Error submitting answer:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ثبت پاسخ',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Finish exam and calculate results
   * POST /api/test-exams/sessions/:sessionId/finish
   */
  static async finishExam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      const ExamSession = Parse.Object.extend('ExamSession');
      const sessionQuery = new Parse.Query(ExamSession);
      const session = await sessionQuery.get(sessionId);

      if (!session) {
        res.status(404).json({
          success: false,
          message: 'جلسه آزمون یافت نشد'
        });
        return;
      }

      // Check ownership
      if (session.get('participantId') !== req.user?.id) {
        res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      // Get exam
      const TestExam = Parse.Object.extend('TestExam');
      const examQuery = new Parse.Query(TestExam);
      const exam = await examQuery.get(session.get('examId'));

      if (!exam) {
        res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      // Calculate results
      const result = await this.calculateExamResult(session, exam);

      // Update session
      session.set('status', SessionStatus.COMPLETED);
      session.set('endTime', new Date());
      session.set('score', result.score);
      session.set('percentage', result.percentage);
      session.set('resultStatus', result.resultStatus);

      await session.save();

      // Save result
      const ExamResult = Parse.Object.extend('ExamResult');
      const resultObj = new ExamResult();
      
      Object.keys(result).forEach(key => {
        resultObj.set(key, result[key as keyof typeof result]);
      });

      // Set ACL
      const acl = new Parse.ACL();
      if (req.user?.id) {
        acl.setReadAccess(req.user.id, true);
        acl.setWriteAccess(req.user.id, true);
      }
      resultObj.setACL(acl);

      const savedResult = await resultObj.save();

      // Update exam metadata
      await this.updateExamStats(exam, result);

      res.json({
        success: true,
        message: 'آزمون با موفقیت تمام شد',
        data: {
          session: session.toJSON(),
          result: savedResult.toJSON()
        }
      });

    } catch (error) {
      console.error('Error finishing exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در تمام کردن آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get exam results
   * GET /api/test-exams/sessions/:sessionId/results
   */
  static async getResults(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      const ExamResult = Parse.Object.extend('ExamResult');
      const query = new Parse.Query(ExamResult);
      query.equalTo('sessionId', sessionId);
      
      const result = await query.first();

      if (!result) {
        res.status(404).json({
          success: false,
          message: 'نتیجه آزمون یافت نشد'
        });
        return;
      }

      // Check ownership
      if (result.get('participantId') !== req.user?.id) {
        res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      res.json({
        success: true,
        data: result.toJSON()
      });

    } catch (error) {
      console.error('Error getting results:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت نتایج',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Private method to calculate exam result
   */
  private static async calculateExamResult(session: any, exam: any): Promise<TestExamResultData> {
    const answers = session.get('answers') || {};
    const questions = exam.get('questions') || [];
    const answerArray: ExamAnswer[] = Object.values(answers);

    // Calculate basic metrics
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    let totalScore = 0;
    let maxScore = 0;

    const detailedResults = questions.map((questionItem: any) => {
      const userAnswer = answers[questionItem.questionId];
      const questionPoints = getQuestionPoints(questionItem.difficulty);
      maxScore += questionPoints;

      let isCorrect = false;
      let points = 0;

      if (userAnswer) {
        // Here you would check the answer against the correct answer
        // This is a simplified version
        isCorrect = true; // Placeholder - implement actual checking logic
        if (isCorrect) {
          points = questionPoints;
          correctAnswers++;
          totalScore += points;
        }
      }

      return {
        questionId: questionItem.questionId,
        userAnswer: userAnswer || {
          questionId: questionItem.questionId,
          timeSpent: 0,
          answeredAt: new Date()
        },
        isCorrect,
        points,
        maxPoints: questionPoints,
        timeSpent: userAnswer?.timeSpent || 0,
        difficulty: questionItem.difficulty,
        category: questionItem.category,
        tags: questionItem.tags || []
      };
    });

    const incorrectAnswers = totalQuestions - correctAnswers;
    const unansweredQuestions = totalQuestions - Object.keys(answers).length;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const config = exam.get('configuration');
    const resultStatus = percentage >= config.passingScore ? ResultStatus.PASSED : ResultStatus.FAILED;

    // Calculate analytics
    const analytics = this.calculateAnalytics(detailedResults, session.get('metadata'));

    const result: TestExamResultData = {
      sessionId: session.id,
      examId: exam.id,
      participantId: session.get('participantId'),
      score: totalScore,
      percentage,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      timeSpent: session.get('metadata')?.timeSpent || 0,
      resultStatus,
      detailedResults,
      analytics,
      learningPath: generateLearningPath({} as any), // This will be properly implemented
      createdAt: new Date()
    };

    return result;
  }

  /**
   * Private method to calculate analytics
   */
  private static calculateAnalytics(detailedResults: any[], metadata: any): ExamAnalyticsData {
    // Initialize analytics structure
    const analytics: ExamAnalyticsData = {
      difficultyBreakdown: {
        [QuestionDifficulty.EASY]: { total: 0, correct: 0, percentage: 0, averageTime: 0 },
        [QuestionDifficulty.MEDIUM]: { total: 0, correct: 0, percentage: 0, averageTime: 0 },
        [QuestionDifficulty.HARD]: { total: 0, correct: 0, percentage: 0, averageTime: 0 }
      },
      categoryBreakdown: {},
      typeBreakdown: {},
      timeAnalysis: {
        totalTime: metadata?.timeSpent || 0,
        averageTimePerQuestion: 0,
        fastestQuestion: 0,
        slowestQuestion: 0,
        timeDistribution: [],
        efficiency: 0
      },
      performanceMetrics: {
        accuracy: 0,
        speed: 0,
        consistency: 0,
        improvement: 0
      },
      strengthsAndWeaknesses: {
        strengths: [],
        weaknesses: [],
        recommendations: []
      }
    };

    // Calculate difficulty breakdown
    detailedResults.forEach(result => {
      const difficulty = result.difficulty as QuestionDifficulty;
      if (analytics.difficultyBreakdown[difficulty]) {
        analytics.difficultyBreakdown[difficulty].total++;
        if (result.isCorrect) {
          analytics.difficultyBreakdown[difficulty].correct++;
        }
      }

      // Category breakdown
      const category = result.category;
      if (!analytics.categoryBreakdown[category]) {
        analytics.categoryBreakdown[category] = {
          total: 0,
          correct: 0,
          percentage: 0,
          averageTime: 0
        };
      }
      analytics.categoryBreakdown[category].total++;
      if (result.isCorrect) {
        analytics.categoryBreakdown[category].correct++;
      }
    });

    // Calculate percentages
    Object.keys(analytics.difficultyBreakdown).forEach(difficulty => {
      const stats = analytics.difficultyBreakdown[difficulty as QuestionDifficulty];
      stats.percentage = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    });

    Object.keys(analytics.categoryBreakdown).forEach(category => {
      const stats = analytics.categoryBreakdown[category];
      stats.percentage = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    });

    // Calculate time analysis
    const times = detailedResults.map(r => r.timeSpent).filter(t => t > 0);
    if (times.length > 0) {
      analytics.timeAnalysis.averageTimePerQuestion = times.reduce((a, b) => a + b, 0) / times.length;
      analytics.timeAnalysis.fastestQuestion = Math.min(...times);
      analytics.timeAnalysis.slowestQuestion = Math.max(...times);
      analytics.timeAnalysis.timeDistribution = times;
    }

    // Calculate performance metrics
    const totalQuestions = detailedResults.length;
    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    analytics.performanceMetrics.accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    if (analytics.timeAnalysis.totalTime > 0) {
      analytics.performanceMetrics.speed = (totalQuestions / analytics.timeAnalysis.totalTime) * 60; // questions per minute
    }

    return analytics;
  }

  /**
   * Private method to update exam statistics
   */
  private static async updateExamStats(exam: any, result: TestExamResultData): Promise<void> {
    const metadata = exam.get('metadata') || {};
    
    metadata.participantCount = (metadata.participantCount || 0) + 1;
    metadata.averageScore = ((metadata.averageScore || 0) * (metadata.participantCount - 1) + result.percentage) / metadata.participantCount;
    
    if (result.resultStatus === ResultStatus.PASSED) {
      metadata.passRate = ((metadata.passRate || 0) * (metadata.participantCount - 1) + 100) / metadata.participantCount;
    } else {
      metadata.passRate = ((metadata.passRate || 0) * (metadata.participantCount - 1)) / metadata.participantCount;
    }

    exam.set('metadata', metadata);
    await exam.save();
  }
} 