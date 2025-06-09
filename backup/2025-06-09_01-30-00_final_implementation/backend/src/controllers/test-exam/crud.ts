/**
 * Test Exam CRUD Controller
 * کنترلر عملیات CRUD آزمون‌های تستی
 */

import { Response } from 'express';
import { z } from 'zod';
import Parse from 'parse/node';
import {
  AuthenticatedRequest,
  DEFAULT_EXAM_CONFIG,
  validateDifficultyDistribution,
  validatePersonalizationConfig,
  TestExamStatus
} from './types';

// Validation schemas
const createExamSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  type: z.string(),
  configuration: z.any().optional(),
  personalization: z.any().optional(),
  subjectId: z.string().optional()
});

const updateExamSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  configuration: z.any().optional(),
  personalization: z.any().optional(),
  status: z.string().optional(),
  isPublished: z.boolean().optional()
});

export class TestExamCrudController {
  /**
   * Create a new test exam
   * POST /api/test-exams
   */
  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validatedData = createExamSchema.parse(req.body);
      const {
        title,
        description,
        type,
        configuration,
        personalization,
        subjectId
      } = validatedData;

      // Validate configuration
      if (configuration?.difficultyDistribution && 
          !validateDifficultyDistribution(configuration.difficultyDistribution)) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'توزیع سختی نامعتبر است'
        });
        return;
      }

      // Validate personalization
      if (personalization && !validatePersonalizationConfig(personalization)) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
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
      
      if (subjectId) {
        exam.set('subjectId', subjectId);
      }

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
        status: 'success',
        data: savedExam.toJSON()
      });

    } catch (error) {
      console.error('Error creating test exam:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'داده‌های ورودی نامعتبر',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
        return;
      }
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'خطا در ایجاد آزمون',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
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
        status: 'success',
        data: {
          exams: exams.map(exam => exam.toJSON()),
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalCount,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });

    } catch (error) {
      console.error('Error listing test exams:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'خطا در دریافت لیست آزمون‌ها',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
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
          status: 'error',
          statusCode: 404,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      // Check access permissions
      const isPublished = exam.get('isPublished');
      const authorId = exam.get('authorId');
      
      if (!isPublished && authorId !== req.user?.id) {
        res.status(403).json({
          status: 'error',
          statusCode: 403,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      res.json({
        status: 'success',
        data: exam.toJSON()
      });

    } catch (error) {
      console.error('Error getting test exam:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'خطا در دریافت آزمون',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
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
      const validatedData = updateExamSchema.parse(req.body);

      const TestExam = Parse.Object.extend('TestExam');
      const query = new Parse.Query(TestExam);
      const exam = await query.get(id);

      if (!exam) {
        res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      // Check permissions
      if (exam.get('authorId') !== req.user?.id) {
        res.status(403).json({
          status: 'error',
          statusCode: 403,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      // Update fields
      Object.keys(validatedData).forEach(key => {
        if (validatedData[key] !== undefined) {
          if (key === 'configuration') {
            const currentConfig = exam.get('configuration') || {};
            exam.set('configuration', { ...currentConfig, ...validatedData[key] });
          } else {
            exam.set(key, validatedData[key]);
          }
        }
      });

      // Update metadata
      const metadata = exam.get('metadata') || {};
      metadata.lastModified = new Date();
      metadata.version = (metadata.version || 1) + 1;
      exam.set('metadata', metadata);

      const savedExam = await exam.save();

      res.json({
        status: 'success',
        data: savedExam.toJSON()
      });

    } catch (error) {
      console.error('Error updating test exam:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'داده‌های ورودی نامعتبر',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
        return;
      }
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'خطا در به‌روزرسانی آزمون',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
      });
    }
  }
} 