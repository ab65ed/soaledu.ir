// @ts-nocheck
import express, { Response } from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Result from '../models/Result';
import Exam from '../models/exam.model';
import User from '../models/user.model';
import { authenticateToken, requireRole } from '../middlewares/auth';
import { validateRequest } from '../validations';
import Validator from 'fastest-validator';
import { RequestWithUser, IExamResult } from '../types';

const validator = new Validator();

// Validation schemas
const getResultsSchema = {
  page: { type: 'number', optional: true, min: 1, default: 1 },
  limit: { type: 'number', optional: true, min: 1, max: 100, default: 10 },
  examId: { type: 'string', optional: true },
  userId: { type: 'string', optional: true },
  status: { type: 'string', optional: true, enum: ['completed', 'abandoned', 'timeout'] },
  dateFrom: { type: 'string', optional: true },
  dateTo: { type: 'string', optional: true }
};

const exportResultsSchema = {
  examId: { type: 'string', required: true },
  format: { type: 'string', optional: true, enum: ['csv', 'json'], default: 'csv' },
  includeAnswers: { type: 'boolean', optional: true, default: false }
};

// Interface for query parameters
interface GetResultsQuery {
  page?: number;
  limit?: number;
  examId?: string;
  userId?: string;
  status?: 'completed' | 'abandoned' | 'timeout';
  dateFrom?: string;
  dateTo?: string;
}

// Interface for export request body
interface ExportResultsBody {
  examId: string;
  format?: 'csv' | 'json';
  includeAnswers?: boolean;
}

// Interface for analytics query
interface AnalyticsQuery {
  dateRange?: string;
}

/**
 * @route GET /api/results
 * @desc Get results with filtering and pagination
 * @access Private (Admin only)
 */
router.get('/',
  authenticateToken,
  requireRole(['admin']),
  validateRequest(getResultsSchema, 'query'),
  async (req: RequestWithUser, res: Response) => {
    try {
      const { page = 1, limit = 10, examId, userId, status, dateFrom, dateTo } = req.query as GetResultsQuery;

      // Build filter
      const filter: any = {};
      if (examId) filter.exam = examId;
      if (userId) filter.user = userId;
      if (status) filter.status = status;

      if (dateFrom || dateTo) {
        filter.completedAt = {};
        if (dateFrom) filter.completedAt.$gte = new Date(dateFrom);
        if (dateTo) filter.completedAt.$lte = new Date(dateTo);
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get results with optimized population and projection
      const results = await Result.find(filter)
        .populate('user', 'name email avatar')
        .populate('exam', 'title category difficulty duration')
        .select('score percentage isPassed completedAt duration status analytics.averageTimePerQuestion')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count
      const total = await Result.countDocuments(filter);

      res.json({
        success: true,
        data: {
          results,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching results:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت نتایج'
      });
    }
  }
);

/**
 * @route GET /api/results/user/:userId
 * @desc Get user's exam results
 * @access Private (User can see own results, Admin can see all)
 */
router.get('/user/:userId', authenticateToken, async (req: RequestWithUser, res: Response) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز'
      });
    }

    const results = await Result.find({ user: userId })
      .populate('exam', 'title category duration passingScore')
      .sort({ completedAt: -1 })
      .lean();

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت نتایج کاربر'
    });
  }
});

/**
 * @route GET /api/results/exam/:examId/user/:userId
 * @desc Get specific exam result for user
 * @access Private
 */
router.get('/exam/:examId/user/:userId', authenticateToken, async (req: RequestWithUser, res: Response) => {
  try {
    const { examId, userId } = req.params;

    // Check authorization
    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز'
      });
    }

    const result = await Result.findOne({ exam: examId, user: userId })
      .populate('exam', 'title category questions')
      .populate('user', 'name email')
      .lean();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'نتیجه‌ای یافت نشد'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching exam result:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت نتیجه آزمون'
    });
  }
});

/**
 * @route GET /api/results/analytics/exam/:examId
 * @desc Get exam analytics
 * @access Private (Admin only)
 */
router.get('/analytics/exam/:examId',
  authenticateToken,
  requireRole(['admin']),
  async (req: RequestWithUser, res: Response) => {
    try {
      const { examId } = req.params;

      // Get basic stats
      const basicStats = await (Result as any).getExamStats(examId);

      // Get score distribution
      const scoreDistribution = await (Result as any).getScoreDistribution(examId);

      // Get question analytics
      const questionAnalytics = await Result.aggregate([
        { $match: { exam: new mongoose.Types.ObjectId(examId) } },
        { $unwind: '$answers' },
        {
          $group: {
            _id: '$answers.questionId',
            questionNumber: { $first: '$answers.questionNumber' },
            totalAnswers: { $sum: 1 },
            correctAnswers: {
              $sum: { $cond: ['$answers.isCorrect', 1, 0] }
            },
            averageTime: { $avg: '$answers.timeSpent' }
          }
        },
        {
          $addFields: {
            correctRate: {
              $multiply: [
                { $divide: ['$correctAnswers', '$totalAnswers'] },
                100
              ]
            }
          }
        },
        { $sort: { questionNumber: 1 } }
      ]);

      // Get recent activity
      const recentActivity = await Result.find({ exam: examId })
        .populate('user', 'name')
        .sort({ completedAt: -1 })
        .limit(10)
        .lean();

      res.json({
        success: true,
        data: {
          ...basicStats,
          scoreDistribution,
          questionAnalytics,
          recentActivity
        }
      });
    } catch (error) {
      console.error('Error fetching exam analytics:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار آزمون'
      });
    }
  }
);

/**
 * @route GET /api/results/analytics/overall
 * @desc Get overall analytics
 * @access Private (Admin only)
 */
router.get('/analytics/overall',
  authenticateToken,
  requireRole(['admin']),
  async (req: RequestWithUser, res: Response) => {
    try {
      const { dateRange = '30d' } = req.query as AnalyticsQuery;

      // Calculate date filter
      const days = parseInt(dateRange.replace('d', ''));
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - days);

      // Get overall stats
      const overallStats = await Result.aggregate([
        { $match: { completedAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            averageScore: { $avg: '$percentage' },
            totalUsers: { $addToSet: '$user' }
          }
        },
        {
          $addFields: {
            totalUsers: { $size: '$totalUsers' }
          }
        }
      ]);

      // Get total exams count
      const totalExams = await Exam.countDocuments();

      // Get popular exams
      const popularExams = await Result.aggregate([
        { $match: { completedAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: '$exam',
            attempts: { $sum: 1 },
            averageScore: { $avg: '$percentage' }
          }
        },
        {
          $lookup: {
            from: 'exams',
            localField: '_id',
            foreignField: '_id',
            as: 'examInfo'
          }
        },
        { $unwind: '$examInfo' },
        {
          $project: {
            title: '$examInfo.title',
            category: '$examInfo.category',
            attempts: 1,
            averageScore: 1
          }
        },
        { $sort: { attempts: -1 } },
        { $limit: 5 }
      ]);

      // Get daily activity
      const dailyActivity = await Result.aggregate([
        { $match: { completedAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$completedAt'
              }
            },
            attempts: { $sum: 1 },
            averageScore: { $avg: '$percentage' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get top performers
      const topPerformers = await Result.find({ completedAt: { $gte: dateFilter } })
        .populate('user', 'name')
        .populate('exam', 'title')
        .sort({ percentage: -1 })
        .limit(10)
        .lean();

      res.json({
        success: true,
        data: {
          totalExams,
          ...(overallStats[0] || { totalAttempts: 0, averageScore: 0, totalUsers: 0 }),
          popularExams,
          recentActivity: dailyActivity,
          topPerformers
        }
      });
    } catch (error) {
      console.error('Error fetching overall analytics:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار کلی'
      });
    }
  }
);

/**
 * @route GET /api/results/analytics/user/:userId/trends
 * @desc Get user performance trends
 * @access Private
 */
router.get('/analytics/user/:userId/trends', authenticateToken, async (req: RequestWithUser, res: Response) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز'
      });
    }

    // Get score progression
    const scoreProgression = await Result.find({ user: userId })
      .select('percentage completedAt exam')
      .populate('exam', 'title')
      .sort({ completedAt: 1 })
      .lean();

    // Get category performance
    const categoryPerformance = await Result.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'exams',
          localField: 'exam',
          foreignField: '_id',
          as: 'examInfo'
        }
      },
      { $unwind: '$examInfo' },
      {
        $group: {
          _id: '$examInfo.category',
          attempts: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    // Get recent results
    const recentResults = await Result.find({ user: userId })
      .populate('exam', 'title category')
      .sort({ completedAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        scoreProgression,
        categoryPerformance,
        recentResults
      }
    });
  } catch (error) {
    console.error('Error fetching user trends:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت روند عملکرد کاربر'
    });
  }
});

/**
 * @route POST /api/results/export
 * @desc Export exam results
 * @access Private (Admin only)
 */
router.post('/export',
  authenticateToken,
  requireRole(['admin']),
  validateRequest(exportResultsSchema),
  async (req: RequestWithUser, res: Response) => {
    try {
      const { examId, format = 'csv', includeAnswers = false } = req.body as ExportResultsBody;

      // Get results
      const results = await Result.find({ exam: examId })
        .populate('user', 'name email')
        .populate('exam', 'title category')
        .sort({ completedAt: -1 })
        .lean();

      if (format === 'csv') {
        // Generate CSV
        const csv = generateCSV(results, includeAnswers);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=exam-results-${examId}.csv`);
        res.send(csv);
      } else {
        // Return JSON
        res.json({
          success: true,
          data: results
        });
      }
    } catch (error) {
      console.error('Error exporting results:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در صادرات نتایج'
      });
    }
  }
);

/**
 * @route DELETE /api/results/:resultId
 * @desc Delete a result
 * @access Private (Admin only)
 */
router.delete('/:resultId',
  authenticateToken,
  requireRole(['admin']),
  async (req: RequestWithUser, res: Response) => {
    try {
      const { resultId } = req.params;

      const result = await Result.findByIdAndDelete(resultId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'نتیجه یافت نشد'
        });
      }

      res.json({
        success: true,
        message: 'نتیجه با موفقیت حذف شد'
      });
    } catch (error) {
      console.error('Error deleting result:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در حذف نتیجه'
      });
    }
  }
);

// Helper function to generate CSV
function generateCSV(results: any[], includeAnswers: boolean): string {
  const headers = [
    'نام کاربر',
    'ایمیل',
    'عنوان آزمون',
    'دسته‌بندی',
    'نمره',
    'درصد',
    'وضعیت',
    'زمان شروع',
    'زمان پایان',
    'مدت زمان (ثانیه)'
  ];

  if (includeAnswers) {
    headers.push('پاسخ‌های صحیح', 'پاسخ‌های غلط', 'بدون پاسخ');
  }

  let csv = headers.join(',') + '\n';

  results.forEach(result => {
    const row = [
      result.user.name,
      result.user.email,
      result.exam.title,
      result.exam.category,
      result.score,
      result.percentage,
      result.isPassed ? 'قبول' : 'مردود',
      result.startedAt,
      result.completedAt,
      result.duration
    ];

    if (includeAnswers) {
      row.push(result.correctAnswers, result.incorrectAnswers, result.unansweredQuestions);
    }

    csv += row.join(',') + '\n';
  });

  return csv;
}

export default router; 