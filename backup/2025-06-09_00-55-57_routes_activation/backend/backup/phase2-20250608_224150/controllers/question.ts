/**
 * Question Controller
 * کنترلر مدیریت سوالات
 * 
 * عملیات پشتیبانی شده:
 * - ایجاد سوال جدید
 * - دریافت سوالات با فیلتر
 * - ویرایش سوال 
 * - حذف سوال
 * - اتصال به course-exam
 * - ذخیره لحظه‌ای
 * 
 * @author Exam-Edu Platform
 * @version 1.0.0
 */

import { z } from 'zod';
import Parse from 'parse/node';
import { Request, Response } from 'express';
import { 
  authenticate, 
  authorize, 
  requireRole, 
  hasPermission, 
  logActivity,
  PermissionAction,
  PermissionResource
} from '../middlewares/roles';

// ==================== Validation Schemas ====================

const QuestionOptionSchema = z.object({
  label: z.string().min(1, 'برچسب گزینه الزامی است'),
  content: z.string().min(1, 'محتوای گزینه الزامی است'),
  isCorrect: z.boolean()
});

const QuestionMetadataSchema = z.object({
  points: z.number().min(0).default(1),
  timeLimit: z.number().min(0).optional(),
  chapter: z.string().optional()
});

const CreateQuestionSchema = z.object({
  courseExamId: z.string().min(1, 'شناسه درس-آزمون الزامی است'),
  title: z.string().min(5, 'عنوان باید حداقل 5 کاراکتر باشد').max(200, 'عنوان حداکثر 200 کاراکتر'),
  content: z.string().min(10, 'شرح سوال باید حداقل 10 کاراکتر باشد').max(2000, 'شرح حداکثر 2000 کاراکتر'),
  type: z.enum(['multiple-choice', 'true-false', 'descriptive'], {
    errorMap: () => ({ message: 'نوع سوال نامعتبر است' })
  }),
  options: z.array(QuestionOptionSchema).optional(),
  correctAnswer: z.string().min(1, 'پاسخ صحیح الزامی است'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'سطح سختی نامعتبر است' })
  }),
  source: z.string().optional(),
  sourcePage: z.number().min(1).max(9999).optional(),
  explanation: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: QuestionMetadataSchema.optional()
});

const UpdateQuestionSchema = CreateQuestionSchema.partial().omit({ courseExamId: true });

const QuestionFiltersSchema = z.object({
  courseExamId: z.string().optional(),
  type: z.enum(['multiple-choice', 'true-false', 'descriptive']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  authorId: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// ==================== Controller Class ====================

export class QuestionController {
  
  /**
   * دریافت تمام سوالات با فیلتر و صفحه‌بندی
   */
  static async getAllQuestions(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      
      // Validate filters
      const filters = QuestionFiltersSchema.parse(req.query);
      
      // Create Parse query
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      
      // Apply courseExamId filter
      if (filters.courseExamId) {
        query.equalTo('courseExamId', filters.courseExamId);
      }
      
      // Apply type filter
      if (filters.type) {
        query.equalTo('type', filters.type);
      }
      
      // Apply difficulty filter
      if (filters.difficulty) {
        query.equalTo('difficulty', filters.difficulty);
      }
      
      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        query.containedIn('tags', filters.tags);
      }
      
      // Apply search filter
      if (filters.search) {
        const titleQuery = new Parse.Query(Question);
        titleQuery.matches('title', new RegExp(filters.search, 'i'));
        
        const contentQuery = new Parse.Query(Question);
        contentQuery.matches('content', new RegExp(filters.search, 'i'));
        
        query._orQuery([titleQuery, contentQuery]);
      }
      
      // Apply author filter (non-admin users see only their questions)
      if (filters.authorId || user.role !== 'admin') {
        const authorId = filters.authorId || user.id;
        query.equalTo('authorId', authorId);
      }
      
      // Apply active filter
      if (filters.isActive !== undefined) {
        query.equalTo('isActive', filters.isActive);
      }
      
      // Apply pagination
      query.skip((filters.page - 1) * filters.limit);
      query.limit(filters.limit);
      
      // Sort by creation date (newest first)
      query.descending('createdAt');
      
      // Include author information
      query.include('author');
      
      // Execute query
      const results = await query.find();
      const total = await query.count();
      
      // Format response
      const questions = results.map(question => ({
        id: question.id,
        courseExamId: question.get('courseExamId'),
        title: question.get('title'),
        content: question.get('content'),
        type: question.get('type'),
        options: question.get('options') || [],
        correctAnswer: question.get('correctAnswer'),
        difficulty: question.get('difficulty'),
        source: question.get('source'),
        sourcePage: question.get('sourcePage'),
        explanation: question.get('explanation'),
        tags: question.get('tags') || [],
        createdAt: question.get('createdAt'),
        updatedAt: question.get('updatedAt'),
        authorId: question.get('authorId'),
        isActive: question.get('isActive'),
        metadata: question.get('metadata') || {}
      }));
      
      res.json({
        success: true,
        data: {
          questions,
          pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages: Math.ceil(total / filters.limit)
          }
        }
      });
      
    } catch (error) {
      console.error('Error getting questions:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'داده‌های ورودی نامعتبر',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت سوالات'
      });
    }
  }

  /**
   * دریافت سوال با شناسه
   */
  static async getQuestionById(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'شناسه سوال الزامی است'
        });
        return;
      }

      // Create Parse query
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      
      // Include author information
      query.include('author');
      
      const question = await query.get(id);
      
      if (!question) {
        res.status(404).json({
          success: false,
          error: 'سوال یافت نشد'
        });
        return;
      }

      // Check permissions (users can only see their own questions unless admin/expert)
      const questionAuthorId = question.get('authorId');
      if (user.role !== 'admin' && user.role !== 'expert' && questionAuthorId !== user.id) {
        res.status(403).json({
          success: false,
          error: 'شما مجوز مشاهده این سوال را ندارید'
        });
        return;
      }

      // Format response
      const questionData = {
        id: question.id,
        courseExamId: question.get('courseExamId'),
        title: question.get('title'),
        content: question.get('content'),
        type: question.get('type'),
        options: question.get('options') || [],
        correctAnswer: question.get('correctAnswer'),
        difficulty: question.get('difficulty'),
        source: question.get('source'),
        sourcePage: question.get('sourcePage'),
        explanation: question.get('explanation'),
        tags: question.get('tags') || [],
        createdAt: question.get('createdAt'),
        updatedAt: question.get('updatedAt'),
        authorId: question.get('authorId'),
        isActive: question.get('isActive'),
        metadata: question.get('metadata') || {}
      };
      
      res.json({
        success: true,
        data: questionData
      });
      
    } catch (error) {
      console.error('Error getting question:', error);
      
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت سوال'
      });
    }
  }

  /**
   * ایجاد سوال جدید
   */
  static async createQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      
      // Validate input data
      const questionData = CreateQuestionSchema.parse(req.body);
      
      // Validate question type specific rules
      if (questionData.type === 'multiple-choice') {
        if (!questionData.options || questionData.options.length !== 4) {
          res.status(400).json({
            success: false,
            error: 'سوالات چهارگزینه‌ای باید دقیقاً 4 گزینه داشته باشند'
          });
          return;
        }
        
        const correctOptions = questionData.options.filter(opt => opt.isCorrect);
        if (correctOptions.length !== 1) {
          res.status(400).json({
            success: false,
            error: 'سوالات چهارگزینه‌ای باید دقیقاً یک گزینه صحیح داشته باشند'
          });
          return;
        }
      } else if (questionData.type === 'true-false') {
        if (!questionData.options || questionData.options.length !== 2) {
          res.status(400).json({
            success: false,
            error: 'سوالات درست/غلط باید دقیقاً 2 گزینه داشته باشند'
          });
          return;
        }
        
        const correctOptions = questionData.options.filter(opt => opt.isCorrect);
        if (correctOptions.length !== 1) {
          res.status(400).json({
            success: false,
            error: 'سوالات درست/غلط باید دقیقاً یک گزینه صحیح داشته باشند'
          });
          return;
        }
      }

      // Create Parse object
      const Question = Parse.Object.extend('Question');
      const question = new Question();
      
      // Set question data
      question.set('courseExamId', questionData.courseExamId);
      question.set('title', questionData.title);
      question.set('content', questionData.content);
      question.set('type', questionData.type);
      question.set('options', questionData.options || []);
      question.set('correctAnswer', questionData.correctAnswer);
      question.set('difficulty', questionData.difficulty);
      question.set('source', questionData.source);
      question.set('sourcePage', questionData.sourcePage);
      question.set('explanation', questionData.explanation);
      question.set('tags', questionData.tags);
      question.set('authorId', user.id);
      question.set('isActive', true);
      question.set('metadata', questionData.metadata || {});
      
      // Save to Parse Server
      const savedQuestion = await question.save();
      
      // Format response
      const responseData = {
        id: savedQuestion.id,
        courseExamId: savedQuestion.get('courseExamId'),
        title: savedQuestion.get('title'),
        content: savedQuestion.get('content'),
        type: savedQuestion.get('type'),
        options: savedQuestion.get('options') || [],
        correctAnswer: savedQuestion.get('correctAnswer'),
        difficulty: savedQuestion.get('difficulty'),
        source: savedQuestion.get('source'),
        sourcePage: savedQuestion.get('sourcePage'),
        explanation: savedQuestion.get('explanation'),
        tags: savedQuestion.get('tags') || [],
        createdAt: savedQuestion.get('createdAt'),
        updatedAt: savedQuestion.get('updatedAt'),
        authorId: savedQuestion.get('authorId'),
        isActive: savedQuestion.get('isActive'),
        metadata: savedQuestion.get('metadata') || {}
      };
      
      res.status(201).json({
        success: true,
        message: 'سوال با موفقیت ایجاد شد',
        data: responseData
      });
      
    } catch (error) {
      console.error('Error creating question:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'داده‌های ورودی نامعتبر',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'خطا در ایجاد سوال'
      });
    }
  }

  /**
   * به‌روزرسانی سوال
   */
  static async updateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'شناسه سوال الزامی است'
        });
        return;
      }
      
      // Validate input data
      const updateData = UpdateQuestionSchema.parse(req.body);
      
      // Get existing question
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      const question = await query.get(id);
      
      if (!question) {
        res.status(404).json({
          success: false,
          error: 'سوال یافت نشد'
        });
        return;
      }
      
      // Check permissions (users can only edit their own questions unless admin)
      const questionAuthorId = question.get('authorId');
      if (user.role !== 'admin' && questionAuthorId !== user.id) {
        res.status(403).json({
          success: false,
          error: 'شما مجوز ویرایش این سوال را ندارید'
        });
        return;
      }
      
      // Update question data
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] !== undefined) {
          question.set(key, updateData[key as keyof typeof updateData]);
        }
      });
      
      // Save updated question
      const updatedQuestion = await question.save();
      
      // Format response
      const responseData = {
        id: updatedQuestion.id,
        courseExamId: updatedQuestion.get('courseExamId'),
        title: updatedQuestion.get('title'),
        content: updatedQuestion.get('content'),
        type: updatedQuestion.get('type'),
        options: updatedQuestion.get('options') || [],
        correctAnswer: updatedQuestion.get('correctAnswer'),
        difficulty: updatedQuestion.get('difficulty'),
        source: updatedQuestion.get('source'),
        sourcePage: updatedQuestion.get('sourcePage'),
        explanation: updatedQuestion.get('explanation'),
        tags: updatedQuestion.get('tags') || [],
        createdAt: updatedQuestion.get('createdAt'),
        updatedAt: updatedQuestion.get('updatedAt'),
        authorId: updatedQuestion.get('authorId'),
        isActive: updatedQuestion.get('isActive'),
        metadata: updatedQuestion.get('metadata') || {}
      };
      
      res.json({
        success: true,
        message: 'سوال با موفقیت به‌روزرسانی شد',
        data: responseData
      });
      
    } catch (error) {
      console.error('Error updating question:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'داده‌های ورودی نامعتبر',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'خطا در به‌روزرسانی سوال'
      });
    }
  }

  /**
   * حذف سوال
   */
  static async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'شناسه سوال الزامی است'
        });
        return;
      }
      
      // Get existing question
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      const question = await query.get(id);
      
      if (!question) {
        res.status(404).json({
          success: false,
          error: 'سوال یافت نشد'
        });
        return;
      }
      
      // Check permissions (users can only delete their own questions unless admin)
      const questionAuthorId = question.get('authorId');
      if (user.role !== 'admin' && questionAuthorId !== user.id) {
        res.status(403).json({
          success: false,
          error: 'شما مجوز حذف این سوال را ندارید'
        });
        return;
      }
      
      // Store question data for logging
      const questionData = {
        title: question.get('title'),
        type: question.get('type'),
        courseExamId: question.get('courseExamId')
      };
      
      // Delete question
      await question.destroy();
      
      res.json({
        success: true,
        message: 'سوال با موفقیت حذف شد'
      });
      
    } catch (error) {
      console.error('Error deleting question:', error);
      
      res.status(500).json({
        success: false,
        error: 'خطا در حذف سوال'
      });
    }
  }

  /**
   * کپی کردن سوال
   */
  static async duplicateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'شناسه سوال الزامی است'
        });
        return;
      }
      
      // Get existing question
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      const originalQuestion = await query.get(id);
      
      if (!originalQuestion) {
        res.status(404).json({
          success: false,
          error: 'سوال یافت نشد'
        });
        return;
      }
      
      // Check permissions (users can duplicate questions they can read)
      const questionAuthorId = originalQuestion.get('authorId');
      if (user.role !== 'admin' && user.role !== 'expert' && questionAuthorId !== user.id) {
        res.status(403).json({
          success: false,
          error: 'شما مجوز کپی کردن این سوال را ندارید'
        });
        return;
      }
      
      // Create new question with copied data
      const newQuestion = new Question();
      
      // Copy all fields except id and timestamps
      newQuestion.set('courseExamId', originalQuestion.get('courseExamId'));
      newQuestion.set('title', `${originalQuestion.get('title')} (کپی)`);
      newQuestion.set('content', originalQuestion.get('content'));
      newQuestion.set('type', originalQuestion.get('type'));
      newQuestion.set('options', originalQuestion.get('options') || []);
      newQuestion.set('correctAnswer', originalQuestion.get('correctAnswer'));
      newQuestion.set('difficulty', originalQuestion.get('difficulty'));
      newQuestion.set('source', originalQuestion.get('source'));
      newQuestion.set('sourcePage', originalQuestion.get('sourcePage'));
      newQuestion.set('explanation', originalQuestion.get('explanation'));
      newQuestion.set('tags', originalQuestion.get('tags') || []);
      newQuestion.set('authorId', user.id); // Set current user as author
      newQuestion.set('isActive', true);
      newQuestion.set('metadata', originalQuestion.get('metadata') || {});
      
      // Save duplicated question
      const savedQuestion = await newQuestion.save();
      
      // Format response
      const responseData = {
        id: savedQuestion.id,
        courseExamId: savedQuestion.get('courseExamId'),
        title: savedQuestion.get('title'),
        content: savedQuestion.get('content'),
        type: savedQuestion.get('type'),
        options: savedQuestion.get('options') || [],
        correctAnswer: savedQuestion.get('correctAnswer'),
        difficulty: savedQuestion.get('difficulty'),
        source: savedQuestion.get('source'),
        sourcePage: savedQuestion.get('sourcePage'),
        explanation: savedQuestion.get('explanation'),
        tags: savedQuestion.get('tags') || [],
        createdAt: savedQuestion.get('createdAt'),
        updatedAt: savedQuestion.get('updatedAt'),
        authorId: savedQuestion.get('authorId'),
        isActive: savedQuestion.get('isActive'),
        metadata: savedQuestion.get('metadata') || {}
      };
      
      res.status(201).json({
        success: true,
        message: 'سوال با موفقیت کپی شد',
        data: responseData
      });
      
    } catch (error) {
      console.error('Error duplicating question:', error);
      
      res.status(500).json({
        success: false,
        error: 'خطا در کپی کردن سوال'
      });
    }
  }

  /**
   * ذخیره لحظه‌ای سوال
   */
  static async autoSaveQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'شناسه سوال الزامی است'
        });
        return;
      }
      
      // Validate input data (partial update)
      const updateData = UpdateQuestionSchema.parse(req.body);
      
      // Get existing question
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      const question = await query.get(id);
      
      if (!question) {
        res.status(404).json({
          success: false,
          error: 'سوال یافت نشد'
        });
        return;
      }
      
      // Check permissions (users can only auto-save their own questions)
      const questionAuthorId = question.get('authorId');
      if (questionAuthorId !== user.id) {
        res.status(403).json({
          success: false,
          error: 'شما مجوز ذخیره این سوال را ندارید'
        });
        return;
      }
      
      // Update question data
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] !== undefined) {
          question.set(key, updateData[key as keyof typeof updateData]);
        }
      });
      
      // Update auto-save metadata
      const metadata = question.get('metadata') || {};
      metadata.lastAutoSave = new Date();
      metadata.autoSaveStatus = 'saved';
      question.set('metadata', metadata);
      
      // Save updated question
      await question.save();
      
      res.json({
        success: true,
        message: 'سوال به صورت خودکار ذخیره شد',
        autoSave: true,
        lastAutoSave: metadata.lastAutoSave.toISOString()
      });
      
    } catch (error) {
      console.error('Error auto-saving question:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'داده‌های ورودی نامعتبر',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'خطا در ذخیره خودکار سوال'
      });
    }
  }

  /**
   * انتشار سوالات یک درس-آزمون برای آزمون تستی
   */
  static async publishQuestionsToTestExam(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      const { courseExamId } = req.params;
      const { questionIds, testExamId } = req.body;
      
      // Validate input
      if (!courseExamId) {
        res.status(400).json({
          success: false,
          error: 'شناسه درس-آزمون الزامی است'
        });
        return;
      }
      
      // Check if user has permission to publish questions
      if (!hasPermission(user, PermissionAction.PUBLISH, PermissionResource.QUESTION)) {
        res.status(403).json({
          success: false,
          error: 'شما مجوز انتشار سوالات را ندارید'
        });
        return;
      }
      
      // Get questions to publish
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      query.equalTo('courseExamId', courseExamId);
      query.equalTo('isActive', true);
      
      if (questionIds && questionIds.length > 0) {
        query.containedIn('objectId', questionIds);
      }
      
      const questions = await query.find();
      
      if (questions.length === 0) {
        res.status(404).json({
          success: false,
          error: 'هیچ سوال فعالی برای انتشار یافت نشد'
        });
        return;
      }
      
      // Create test exam questions
      const TestExamQuestion = Parse.Object.extend('TestExamQuestion');
      const publishedQuestions = [];
      
      for (const question of questions) {
        const testExamQuestion = new TestExamQuestion();
        testExamQuestion.set('questionId', question.id);
        testExamQuestion.set('testExamId', testExamId);
        testExamQuestion.set('courseExamId', courseExamId);
        testExamQuestion.set('title', question.get('title'));
        testExamQuestion.set('content', question.get('content'));
        testExamQuestion.set('type', question.get('type'));
        testExamQuestion.set('options', question.get('options'));
        testExamQuestion.set('correctAnswer', question.get('correctAnswer'));
        testExamQuestion.set('difficulty', question.get('difficulty'));
        testExamQuestion.set('tags', question.get('tags'));
        testExamQuestion.set('metadata', question.get('metadata'));
        testExamQuestion.set('publishedBy', user.id);
        testExamQuestion.set('publishedAt', new Date());
        
        await testExamQuestion.save();
        publishedQuestions.push({
          id: testExamQuestion.id,
          questionId: question.id,
          title: question.get('title')
        });
      }
      
      // Update course exam statistics
      const CourseExam = Parse.Object.extend('CourseExam');
      const courseExamQuery = new Parse.Query(CourseExam);
      const courseExam = await courseExamQuery.get(courseExamId);
      
      if (courseExam) {
        const currentPublished = courseExam.get('publishedQuestions') || 0;
        courseExam.set('publishedQuestions', currentPublished + publishedQuestions.length);
        courseExam.set('lastPublishedAt', new Date());
        await courseExam.save();
      }
      
      res.json({
        success: true,
        message: `${publishedQuestions.length} سوال با موفقیت برای آزمون تستی منتشر شد`,
        data: {
          courseExamId,
          testExamId,
          publishedQuestions,
          totalPublished: publishedQuestions.length
        }
      });
      
    } catch (error) {
      console.error('Error publishing questions to test exam:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در انتشار سوالات برای آزمون تستی'
      });
    }
  }

  /**
   * دریافت آمار سوالات یک درس-آزمون
   */
  static async getCourseExamQuestionStats(req: Request, res: Response): Promise<void> {
    try {
      const { courseExamId } = req.params;
      
      if (!courseExamId) {
        res.status(400).json({
          success: false,
          error: 'شناسه درس-آزمون الزامی است'
        });
        return;
      }
      
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      query.equalTo('courseExamId', courseExamId);
      
      // Get total questions
      const totalQuestions = await query.count();
      
      // Get published questions
      const publishedQuery = new Parse.Query(Question);
      publishedQuery.equalTo('courseExamId', courseExamId);
      publishedQuery.equalTo('isActive', true);
      const publishedQuestions = await publishedQuery.count();
      
      // Get draft questions
      const draftQuestions = totalQuestions - publishedQuestions;
      
      // Get difficulty stats
      const difficultyStats = {
        easy: 0,
        medium: 0,
        hard: 0
      };
      
      for (const difficulty of ['easy', 'medium', 'hard']) {
        const diffQuery = new Parse.Query(Question);
        diffQuery.equalTo('courseExamId', courseExamId);
        diffQuery.equalTo('difficulty', difficulty);
        difficultyStats[difficulty as keyof typeof difficultyStats] = await diffQuery.count();
      }
      
      // Get type stats
      const typeStats = {
        'multiple-choice': 0,
        'true-false': 0,
        'descriptive': 0
      };
      
      for (const type of ['multiple-choice', 'true-false', 'descriptive']) {
        const typeQuery = new Parse.Query(Question);
        typeQuery.equalTo('courseExamId', courseExamId);
        typeQuery.equalTo('type', type);
        typeStats[type as keyof typeof typeStats] = await typeQuery.count();
      }
      
      // Get recent activity
      const recentQuery = new Parse.Query(Question);
      recentQuery.equalTo('courseExamId', courseExamId);
      recentQuery.descending('updatedAt');
      recentQuery.limit(5);
      const recentQuestions = await recentQuery.find();
      
      const recentActivity = recentQuestions.map(q => ({
        id: q.id,
        title: q.get('title'),
        type: q.get('type'),
        difficulty: q.get('difficulty'),
        updatedAt: q.get('updatedAt')
      }));
      
      res.json({
        success: true,
        data: {
          courseExamId,
          totalQuestions,
          publishedQuestions,
          draftQuestions,
          difficultyStats,
          typeStats,
          recentActivity
        }
      });
      
    } catch (error) {
      console.error('Error getting course exam question stats:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت آمار سوالات درس-آزمون'
      });
    }
  }

  /**
   * اتصال سوال به درس-آزمون جدید
   */
  static async linkQuestionToCourseExam(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      const { questionId } = req.params;
      const { newCourseExamId } = req.body;
      
      if (!questionId || !newCourseExamId) {
        res.status(400).json({
          success: false,
          error: 'شناسه سوال و درس-آزمون جدید الزامی است'
        });
        return;
      }
      
      // Get the question
      const Question = Parse.Object.extend('Question');
      const query = new Parse.Query(Question);
      const question = await query.get(questionId);
      
      if (!question) {
        res.status(404).json({
          success: false,
          error: 'سوال یافت نشد'
        });
        return;
      }
      
      // Check permission
      if (question.get('authorId') !== user.id && user.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'شما مجوز ویرایش این سوال را ندارید'
        });
        return;
      }
      
      // Verify new course exam exists
      const CourseExam = Parse.Object.extend('CourseExam');
      const courseExamQuery = new Parse.Query(CourseExam);
      const newCourseExam = await courseExamQuery.get(newCourseExamId);
      
      if (!newCourseExam) {
        res.status(404).json({
          success: false,
          error: 'درس-آزمون جدید یافت نشد'
        });
        return;
      }
      
      const oldCourseExamId = question.get('courseExamId');
      
      // Update question
      question.set('courseExamId', newCourseExamId);
      question.set('updatedAt', new Date());
      await question.save();
      
      // Update course exam statistics
      if (oldCourseExamId) {
        const oldCourseExam = await courseExamQuery.get(oldCourseExamId);
        if (oldCourseExam) {
          const oldCount = oldCourseExam.get('questionCount') || 0;
          oldCourseExam.set('questionCount', Math.max(0, oldCount - 1));
          await oldCourseExam.save();
        }
      }
      
      const newCount = newCourseExam.get('questionCount') || 0;
      newCourseExam.set('questionCount', newCount + 1);
      await newCourseExam.save();
      
      res.json({
        success: true,
        message: 'سوال با موفقیت به درس-آزمون جدید متصل شد',
        data: {
          questionId,
          oldCourseExamId,
          newCourseExamId,
          questionTitle: question.get('title')
        }
      });
      
    } catch (error) {
      console.error('Error linking question to course exam:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در اتصال سوال به درس-آزمون'
      });
    }
  }

  /**
   * دریافت سوالات منتشر شده یک درس-آزمون
   */
  static async getPublishedQuestions(req: Request, res: Response): Promise<void> {
    try {
      const { courseExamId } = req.params;
      
      if (!courseExamId) {
        res.status(400).json({
          success: false,
          error: 'شناسه درس-آزمون الزامی است'
        });
        return;
      }
      
      const TestExamQuestion = Parse.Object.extend('TestExamQuestion');
      const query = new Parse.Query(TestExamQuestion);
      query.equalTo('courseExamId', courseExamId);
      query.descending('publishedAt');
      
      const publishedQuestions = await query.find();
      
      const questions = publishedQuestions.map(q => ({
        id: q.id,
        questionId: q.get('questionId'),
        testExamId: q.get('testExamId'),
        title: q.get('title'),
        type: q.get('type'),
        difficulty: q.get('difficulty'),
        publishedAt: q.get('publishedAt'),
        publishedBy: q.get('publishedBy')
      }));
      
      res.json({
        success: true,
        data: {
          courseExamId,
          publishedQuestions: questions,
          totalPublished: questions.length
        }
      });
      
    } catch (error) {
      console.error('Error getting published questions:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت سوالات منتشر شده'
      });
    }
  }
} 