import { Request, Response } from 'express';
import { z } from 'zod';

// Parse.js import
const Parse = require('parse/node');

// Types
enum UserRole {
  ADMIN = 'admin',
  QUESTION_DESIGNER = 'question-designer',
  EXPERT = 'expert',
  STUDENT = 'student'
}

// Extended Request interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// Validation schemas
const courseExamSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  courseType: z.string().min(1, 'نوع درس الزامی است'),
  grade: z.string().min(1, 'مقطع الزامی است'),
  group: z.string().min(1, 'گروه الزامی است'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false)
});

const updateCourseExamSchema = courseExamSchema.partial();

const addQuestionToCourseExamSchema = z.object({
  courseExamId: z.string().min(1, 'شناسه درس-آزمون الزامی است'),
  title: z.string().min(1, 'عنوان سوال الزامی است'),
  content: z.string().min(1, 'محتوای سوال الزامی است'),
  type: z.enum(['multiple-choice', 'true-false', 'descriptive']),
  options: z.array(z.object({
    label: z.string(),
    content: z.string(),
    isCorrect: z.boolean()
  })).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  source: z.string().optional(),
  explanation: z.string().optional(),
  tags: z.array(z.string()).default([])
});

// Course-Exam Controller
export class CourseExamController {
  
  // Get all course exams
  static async getAllCourseExams(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      // Build query based on user role
      const query = new Parse.Query('CourseExam');
      
      // Students and non-admin users can only see published course exams
      if (user.role === UserRole.STUDENT) {
        query.equalTo('isPublished', true);
      }
      
      // Apply filters from query parameters
      const { grade, group, tags, search, published } = req.query;
      
      if (grade) {
        query.equalTo('grade', grade);
      }
      
      if (group) {
        query.equalTo('group', group);
      }
      
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.containsAll('tags', tagArray);
      }
      
      if (search) {
        const searchQuery = new Parse.Query('CourseExam');
        const titleQuery = new Parse.Query('CourseExam');
        const descQuery = new Parse.Query('CourseExam');
        
        titleQuery.contains('title', search as string);
        descQuery.contains('description', search as string);
        
        query._orQuery([titleQuery, descQuery]);
      }
      
      if (published !== undefined) {
        query.equalTo('isPublished', published === 'true');
      }
      
      // Pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      query.limit(limit);
      query.skip(skip);
      query.descending('updatedAt');
      
      const results = await query.find();
      const total = await query.count();
      
      const courseExams = results.map(courseExam => ({
        id: courseExam.id,
        title: courseExam.get('title'),
        courseType: courseExam.get('courseType'),
        grade: courseExam.get('grade'),
        group: courseExam.get('group'),
        description: courseExam.get('description'),
        tags: courseExam.get('tags') || [],
        isPublished: courseExam.get('isPublished'),
        questionCount: courseExam.get('questionCount') || 0,
        totalSales: courseExam.get('totalSales') || 0,
        revenue: courseExam.get('revenue') || 0,
        createdAt: courseExam.get('createdAt'),
        updatedAt: courseExam.get('updatedAt'),
        authorId: courseExam.get('authorId')
      }));
      
      res.json({
        success: true,
        data: courseExams,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
      
    } catch (error) {
      console.error('Error fetching course exams:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت درس-آزمون‌ها'
      });
    }
  }
  
  // Get course exam by ID
  static async getCourseExamById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;
      
      const query = new Parse.Query('CourseExam');
      const courseExam = await query.get(id);
      
      if (!courseExam) {
        return res.status(404).json({
          success: false,
          message: 'درس-آزمون یافت نشد'
        });
      }
      
      // Check if user can access this course exam
      const isPublished = courseExam.get('isPublished');
      if (!isPublished && user.role === UserRole.STUDENT) {
        return res.status(403).json({
          success: false,
          message: 'شما مجوز دسترسی به این درس-آزمون را ندارید'
        });
      }
      
      // Get questions count
      const questionQuery = new Parse.Query('Question');
      questionQuery.equalTo('courseExamId', id);
      const questionCount = await questionQuery.count();
      
      res.json({
        success: true,
        data: {
          id: courseExam.id,
          title: courseExam.get('title'),
          courseType: courseExam.get('courseType'),
          grade: courseExam.get('grade'),
          group: courseExam.get('group'),
          description: courseExam.get('description'),
          tags: courseExam.get('tags') || [],
          isPublished: courseExam.get('isPublished'),
          questionCount,
          totalSales: courseExam.get('totalSales') || 0,
          revenue: courseExam.get('revenue') || 0,
          createdAt: courseExam.get('createdAt'),
          updatedAt: courseExam.get('updatedAt'),
          authorId: courseExam.get('authorId')
        }
      });
      
    } catch (error) {
      console.error('Error fetching course exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت درس-آزمون'
      });
    }
  }
  
  // Create new course exam
  static async createCourseExam(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = courseExamSchema.parse(req.body);
      const user = req.user!;
      
      const CourseExam = Parse.Object.extend('CourseExam');
      const courseExam = new CourseExam();
      
      courseExam.set('title', validatedData.title);
      courseExam.set('courseType', validatedData.courseType);
      courseExam.set('grade', validatedData.grade);
      courseExam.set('group', validatedData.group);
      courseExam.set('description', validatedData.description || '');
      courseExam.set('tags', validatedData.tags);
      courseExam.set('isPublished', validatedData.isPublished);
      courseExam.set('authorId', user.id);
      courseExam.set('questionCount', 0);
      courseExam.set('totalSales', 0);
      courseExam.set('revenue', 0);
      
      const savedCourseExam = await courseExam.save();
      
      res.status(201).json({
        success: true,
        message: 'درس-آزمون با موفقیت ایجاد شد',
        data: {
          id: savedCourseExam.id,
          title: savedCourseExam.get('title'),
          courseType: savedCourseExam.get('courseType'),
          grade: savedCourseExam.get('grade'),
          group: savedCourseExam.get('group'),
          description: savedCourseExam.get('description'),
          tags: savedCourseExam.get('tags'),
          isPublished: savedCourseExam.get('isPublished'),
          questionCount: 0,
          totalSales: 0,
          revenue: 0,
          createdAt: savedCourseExam.get('createdAt'),
          updatedAt: savedCourseExam.get('updatedAt'),
          authorId: savedCourseExam.get('authorId')
        }
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      console.error('Error creating course exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ایجاد درس-آزمون'
      });
    }
  }
  
  // Add question to course exam
  static async addQuestionToCourseExam(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = addQuestionToCourseExamSchema.parse(req.body);
      const user = req.user!;
      
      // Check if course exam exists
      const courseExamQuery = new Parse.Query('CourseExam');
      const courseExam = await courseExamQuery.get(validatedData.courseExamId);
      
      if (!courseExam) {
        return res.status(404).json({
          success: false,
          message: 'درس-آزمون یافت نشد'
        });
      }
      
      // Create new question
      const Question = Parse.Object.extend('Question');
      const question = new Question();
      
      question.set('courseExamId', validatedData.courseExamId);
      question.set('title', validatedData.title);
      question.set('content', validatedData.content);
      question.set('type', validatedData.type);
      question.set('options', validatedData.options || []);
      question.set('correctAnswer', validatedData.correctAnswer);
      question.set('difficulty', validatedData.difficulty);
      question.set('source', validatedData.source || '');
      question.set('explanation', validatedData.explanation || '');
      question.set('tags', validatedData.tags);
      question.set('authorId', user.id);
      question.set('isActive', true);
      
      const savedQuestion = await question.save();
      
      // Update question count in course exam
      const questionQuery = new Parse.Query('Question');
      questionQuery.equalTo('courseExamId', validatedData.courseExamId);
      questionQuery.equalTo('isActive', true);
      const questionCount = await questionQuery.count();
      
      courseExam.set('questionCount', questionCount);
      await courseExam.save();
      
      res.status(201).json({
        success: true,
        message: 'سوال با موفقیت به درس-آزمون اضافه شد',
        data: {
          id: savedQuestion.id,
          courseExamId: savedQuestion.get('courseExamId'),
          title: savedQuestion.get('title'),
          content: savedQuestion.get('content'),
          type: savedQuestion.get('type'),
          options: savedQuestion.get('options'),
          correctAnswer: savedQuestion.get('correctAnswer'),
          difficulty: savedQuestion.get('difficulty'),
          source: savedQuestion.get('source'),
          explanation: savedQuestion.get('explanation'),
          tags: savedQuestion.get('tags'),
          authorId: savedQuestion.get('authorId'),
          isActive: savedQuestion.get('isActive'),
          createdAt: savedQuestion.get('createdAt'),
          updatedAt: savedQuestion.get('updatedAt')
        }
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      console.error('Error adding question to course exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در اضافه کردن سوال به درس-آزمون'
      });
    }
  }
  
  // Get questions for a course exam
  static async getCourseExamQuestions(req: Request, res: Response): Promise<void> {
    try {
      const { courseExamId } = req.params;
      const user = req.user!;
      
      // Check if course exam exists and user has access
      const courseExamQuery = new Parse.Query('CourseExam');
      const courseExam = await courseExamQuery.get(courseExamId);
      
      if (!courseExam) {
        return res.status(404).json({
          success: false,
          message: 'درس-آزمون یافت نشد'
        });
      }
      
      const isPublished = courseExam.get('isPublished');
      if (!isPublished && user.role === UserRole.STUDENT) {
        return res.status(403).json({
          success: false,
          message: 'شما مجوز دسترسی به سوالات این درس-آزمون را ندارید'
        });
      }
      
      // Get questions
      const questionQuery = new Parse.Query('Question');
      questionQuery.equalTo('courseExamId', courseExamId);
      questionQuery.equalTo('isActive', true);
      
      // Apply filters
      const { difficulty, type, authorId } = req.query;
      
      if (difficulty) {
        questionQuery.equalTo('difficulty', difficulty);
      }
      
      if (type) {
        questionQuery.equalTo('type', type);
      }
      
      if (authorId) {
        questionQuery.equalTo('authorId', authorId);
      }
      
      // Pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      
      questionQuery.limit(limit);
      questionQuery.skip(skip);
      questionQuery.descending('createdAt');
      
      const questions = await questionQuery.find();
      const total = await questionQuery.count();
      
      const questionsData = questions.map(question => ({
        id: question.id,
        courseExamId: question.get('courseExamId'),
        title: question.get('title'),
        content: question.get('content'),
        type: question.get('type'),
        options: question.get('options') || [],
        difficulty: question.get('difficulty'),
        source: question.get('source'),
        explanation: question.get('explanation'),
        tags: question.get('tags') || [],
        authorId: question.get('authorId'),
        isActive: question.get('isActive'),
        createdAt: question.get('createdAt'),
        updatedAt: question.get('updatedAt')
      }));
      
      res.json({
        success: true,
        data: questionsData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        courseExam: {
          id: courseExam.id,
          title: courseExam.get('title'),
          isPublished: courseExam.get('isPublished')
        }
      });
      
    } catch (error) {
      console.error('Error fetching course exam questions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت سوالات درس-آزمون'
      });
    }
  }
  
  // Update course exam
  static async updateCourseExam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateCourseExamSchema.parse(req.body);
      const user = req.user!;
      
      const query = new Parse.Query('CourseExam');
      const courseExam = await query.get(id);
      
      if (!courseExam) {
        return res.status(404).json({
          success: false,
          message: 'درس-آزمون یافت نشد'
        });
      }
      
      // Check ownership for non-admin users
      if (user.role !== UserRole.ADMIN && courseExam.get('authorId') !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'شما مجوز ویرایش این درس-آزمون را ندارید'
        });
      }
      
      // Update fields
      Object.keys(validatedData).forEach(key => {
        if (validatedData[key as keyof typeof validatedData] !== undefined) {
          courseExam.set(key, validatedData[key as keyof typeof validatedData]);
        }
      });
      
      const updatedCourseExam = await courseExam.save();
      
      res.json({
        success: true,
        message: 'درس-آزمون با موفقیت به‌روزرسانی شد',
        data: {
          id: updatedCourseExam.id,
          title: updatedCourseExam.get('title'),
          courseType: updatedCourseExam.get('courseType'),
          grade: updatedCourseExam.get('grade'),
          group: updatedCourseExam.get('group'),
          description: updatedCourseExam.get('description'),
          tags: updatedCourseExam.get('tags'),
          isPublished: updatedCourseExam.get('isPublished'),
          questionCount: updatedCourseExam.get('questionCount'),
          totalSales: updatedCourseExam.get('totalSales'),
          revenue: updatedCourseExam.get('revenue'),
          createdAt: updatedCourseExam.get('createdAt'),
          updatedAt: updatedCourseExam.get('updatedAt'),
          authorId: updatedCourseExam.get('authorId')
        }
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      console.error('Error updating course exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در به‌روزرسانی درس-آزمون'
      });
    }
  }
  
  // Delete course exam
  static async deleteCourseExam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;
      
      const query = new Parse.Query('CourseExam');
      const courseExam = await query.get(id);
      
      if (!courseExam) {
        return res.status(404).json({
          success: false,
          message: 'درس-آزمون یافت نشد'
        });
      }
      
      // Check ownership for non-admin users
      if (user.role !== UserRole.ADMIN && courseExam.get('authorId') !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'شما مجوز حذف این درس-آزمون را ندارید'
        });
      }
      
      // Delete all associated questions
      const questionQuery = new Parse.Query('Question');
      questionQuery.equalTo('courseExamId', id);
      const questions = await questionQuery.find();
      
      await Parse.Object.destroyAll(questions);
      
      // Delete course exam
      await courseExam.destroy();
      
      res.json({
        success: true,
        message: 'درس-آزمون و تمام سوالات آن با موفقیت حذف شد'
      });
      
    } catch (error) {
      console.error('Error deleting course exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در حذف درس-آزمون'
      });
    }
  }
  
  // Publish course exam with validation
  static async publishCourseExam(req: AuthenticatedRequest, res: Response) {
    try {
      const { courseExamId } = req.params;
      const user = req.user!;
      
      if (!courseExamId) {
        res.status(400).json({
          success: false,
          message: 'شناسه درس-آزمون الزامی است'
        });
        return;
      }
      
      // Get course exam
      const courseExamQuery = new Parse.Query('CourseExam');
      const courseExam = await courseExamQuery.get(courseExamId);
      
      if (!courseExam) {
        res.status(404).json({
          success: false,
          message: 'درس-آزمون یافت نشد'
        });
        return;
      }
      
      // Check if user owns this course exam
      if (courseExam.get('authorId') !== user.id && user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'شما مجوز انتشار این درس-آزمون را ندارید'
        });
        return;
      }
      
      // Validate publishing requirements
      const { validateCourseExamPublishing } = require('../validations/courseExamValidation');
      const validationResult = await validateCourseExamPublishing(courseExamId);
      
      if (!validationResult.isValid) {
        res.status(400).json({
          success: false,
          message: 'درس-آزمون شرایط انتشار را ندارد',
          errors: validationResult.errors,
          questionStats: validationResult.questionStats
        });
        return;
      }
      
      // Publish course exam
      courseExam.set('isPublished', true);
      courseExam.set('isDraft', false);
      courseExam.set('publishedAt', new Date());
      courseExam.set('publishedBy', user.id);
      
      const publishedCourseExam = await courseExam.save();
      
      // Log activity
      const ActivityLog = Parse.Object.extend('ActivityLog');
      const activityLog = new ActivityLog();
      activityLog.set('action', 'PUBLISH_COURSE_EXAM');
      activityLog.set('resourceType', 'CourseExam');
      activityLog.set('resourceId', courseExamId);
      activityLog.set('userId', user.id);
      activityLog.set('metadata', {
        title: courseExam.get('title'),
        questionStats: validationResult.questionStats
      });
      await activityLog.save();
      
      res.json({
        success: true,
        message: 'درس-آزمون با موفقیت منتشر شد',
        data: {
          id: publishedCourseExam.id,
          title: publishedCourseExam.get('title'),
          isPublished: true,
          publishedAt: publishedCourseExam.get('publishedAt'),
          questionStats: validationResult.questionStats
        }
      });
      
    } catch (error) {
      console.error('Error publishing course exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در انتشار درس-آزمون'
      });
    }
  }
  
  // Get publishing validation status
  // Get first exam result for designer dashboard
  static async getFirstExamResult(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = req.user!;
      
      // Check permissions
      if (user.role !== UserRole.ADMIN && user.id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'شما مجوز دسترسی به این اطلاعات را ندارید'
        });
      }
      
      // Find first exam result
      const examResultQuery = new Parse.Query('ExamResult');
      examResultQuery.equalTo('userId', userId);
      examResultQuery.ascending('createdAt');
      examResultQuery.limit(1);
      
      const firstResult = await examResultQuery.first();
      
      if (!firstResult) {
        return res.json({
          success: true,
          data: null
        });
      }
      
      // Get exam details
      const examQuery = new Parse.Query('CourseExam');
      const exam = await examQuery.get(firstResult.get('examId'));
      
      res.json({
        success: true,
        data: {
          id: firstResult.id,
          examTitle: exam.get('title'),
          score: firstResult.get('score'),
          totalQuestions: firstResult.get('totalQuestions'),
          correctAnswers: firstResult.get('correctAnswers'),
          completedAt: firstResult.get('createdAt'),
          feedback: firstResult.get('feedback') || [],
          improvementAreas: firstResult.get('improvementAreas') || []
        }
      });
      
    } catch (error) {
      console.error('Error fetching first exam result:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت نتیجه آزمون'
      });
    }
  }
  
  // Charge user wallet (Admin only)
  static async chargeWallet(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      // Only admins can charge wallets
      if (user.role !== UserRole.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'فقط مدیران مجوز شارژ کیف پول دارند'
        });
      }
      
      const { userId, userName, amount, reason, type } = req.body;
      
      // Validate input
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'اطلاعات ورودی نامعتبر است'
        });
      }
      
      // Get user wallet
      const walletQuery = new Parse.Query('Wallet');
      walletQuery.equalTo('userId', userId);
      let wallet = await walletQuery.first();
      
      if (!wallet) {
        // Create new wallet if doesn't exist
        wallet = new Parse.Object('Wallet');
        wallet.set('userId', userId);
        wallet.set('balance', 0);
      }
      
      // Update balance
      const currentBalance = wallet.get('balance') || 0;
      wallet.set('balance', currentBalance + amount);
      await wallet.save();
      
      // Create transaction record
      const transaction = new Parse.Object('WalletTransaction');
      transaction.set('userId', userId);
      transaction.set('amount', amount);
      transaction.set('type', 'credit');
      transaction.set('category', type || 'manual');
      transaction.set('description', reason);
      transaction.set('adminId', user.id);
      transaction.set('status', 'completed');
      await transaction.save();
      
      // Log the action
      const auditLog = new Parse.Object('AuditLog');
      auditLog.set('action', 'wallet_charge');
      auditLog.set('adminId', user.id);
      auditLog.set('targetUserId', userId);
      auditLog.set('details', {
        amount,
        reason,
        type,
        userName,
        newBalance: currentBalance + amount
      });
      await auditLog.save();
      
      res.json({
        success: true,
        message: 'کیف پول با موفقیت شارژ شد',
        data: {
          newBalance: currentBalance + amount,
          transactionId: transaction.id
        }
      });
      
    } catch (error) {
      console.error('Error charging wallet:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در شارژ کیف پول'
      });
    }
  }
  
  // Send survey to roles
  static async sendSurvey(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      // Only admins and experts can send surveys
      if (![UserRole.ADMIN, UserRole.EXPERT].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'شما مجوز ارسال نظرسنجی ندارید'
        });
      }
      
      const { title, description, questions, targetRoles, expiresAt } = req.body;
      
      // Validate input
      if (!title || !questions || !targetRoles || questions.length === 0 || targetRoles.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'اطلاعات ورودی ناکامل است'
        });
      }
      
      // Create survey
      const survey = new Parse.Object('Survey');
      survey.set('title', title);
      survey.set('description', description || '');
      survey.set('questions', questions);
      survey.set('targetRoles', targetRoles);
      survey.set('isActive', true);
      survey.set('expiresAt', new Date(expiresAt));
      survey.set('createdBy', user.id);
      survey.set('responseCount', 0);
      await survey.save();
      
      // Get users with target roles
      const userQuery = new Parse.Query('_User');
      userQuery.containedIn('role', targetRoles);
      const targetUsers = await userQuery.find();
      
      // Create notifications for each target user
      const notifications = targetUsers.map(targetUser => {
        const notification = new Parse.Object('Notification');
        notification.set('userId', targetUser.id);
        notification.set('type', 'survey');
        notification.set('title', `نظرسنجی جدید: ${title}`);
        notification.set('message', description || 'لطفاً در نظرسنجی شرکت کنید');
        notification.set('data', {
          surveyId: survey.id,
          surveyTitle: title
        });
        notification.set('isRead', false);
        return notification;
      });
      
      // Save all notifications
      await Parse.Object.saveAll(notifications);
      
      // Log the action
      const auditLog = new Parse.Object('AuditLog');
      auditLog.set('action', 'survey_sent');
      auditLog.set('adminId', user.id);
      auditLog.set('details', {
        surveyId: survey.id,
        title,
        targetRoles,
        targetUserCount: targetUsers.length
      });
      await auditLog.save();
      
      res.json({
        success: true,
        message: 'نظرسنجی با موفقیت ارسال شد',
        data: {
          surveyId: survey.id,
          sentToUsers: targetUsers.length
        }
      });
      
    } catch (error) {
      console.error('Error sending survey:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ارسال نظرسنجی'
      });
    }
  }
  
  // Get surveys
  static async getSurveys(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      const query = new Parse.Query('Survey');
      
      // Filter based on user role
      if (user.role === UserRole.STUDENT) {
        query.containsAll('targetRoles', [user.role]);
        query.equalTo('isActive', true);
        query.greaterThan('expiresAt', new Date());
      }
      
      query.descending('createdAt');
      query.limit(50);
      
      const results = await query.find();
      
      const surveys = results.map(survey => ({
        id: survey.id,
        title: survey.get('title'),
        description: survey.get('description'),
        questions: survey.get('questions'),
        targetRoles: survey.get('targetRoles'),
        isActive: survey.get('isActive'),
        expiresAt: survey.get('expiresAt'),
        responseCount: survey.get('responseCount') || 0,
        createdAt: survey.get('createdAt')
      }));
      
      res.json({
        success: true,
        data: surveys
      });
      
    } catch (error) {
      console.error('Error fetching surveys:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت نظرسنجی‌ها'
      });
    }
  }

  static async getPublishingValidation(req: Request, res: Response) {
    try {
      const { courseExamId } = req.params;
      
      if (!courseExamId) {
        res.status(400).json({
          success: false,
          message: 'شناسه درس-آزمون الزامی است'
        });
        return;
      }
      
      const { validateCourseExamPublishing } = require('../validations/courseExamValidation');
      const validationResult = await validateCourseExamPublishing(courseExamId);
      
      res.json({
        success: true,
        data: validationResult
      });
      
    } catch (error) {
      console.error('Error validating course exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در اعتبارسنجی درس-آزمون'
      });
    }
  }
}

// Apply middleware to controller methods
export const getCourseExams = [
  authenticate,
  authorize(PermissionAction.READ, PermissionResource.COURSE_EXAM),
  logActivity('read', 'course-exam'),
  CourseExamController.getAllCourseExams
];

export const getCourseExam = [
  authenticate,
  authorize(PermissionAction.READ, PermissionResource.COURSE_EXAM),
  logActivity('read', 'course-exam'),
  CourseExamController.getCourseExamById
];

export const createCourseExam = [
  authenticate,
  authorize(PermissionAction.CREATE, PermissionResource.COURSE_EXAM),
  logActivity('create', 'course-exam'),
  CourseExamController.createCourseExam
];

export const updateCourseExam = [
  authenticate,
  authorize(PermissionAction.UPDATE, PermissionResource.COURSE_EXAM),
  logActivity('update', 'course-exam'),
  CourseExamController.updateCourseExam
];

export const deleteCourseExam = [
  authenticate,
  authorize(PermissionAction.DELETE, PermissionResource.COURSE_EXAM),
  logActivity('delete', 'course-exam'),
  CourseExamController.deleteCourseExam
];

export const addQuestion = [
  authenticate,
  authorize(PermissionAction.CREATE, PermissionResource.QUESTION),
  logActivity('create', 'question'),
  CourseExamController.addQuestionToCourseExam
];

export const getCourseExamQuestions = [
  authenticate,
  authorize(PermissionAction.READ, PermissionResource.QUESTION),
  logActivity('read', 'question'),
  CourseExamController.getCourseExamQuestions
];

// Export individual middleware functions with proper role checks
export const publishCourseExam = [
  // Authentication and authorization would be handled by middleware
  CourseExamController.publishCourseExam
];

export const getPublishingValidation = [
  CourseExamController.getPublishingValidation
]; 