/**
 * Analytics Routes
 *
 * Handles analytics data aggregation, metrics calculation, and reporting
 */

import express, { Request, Response, NextFunction } from 'express';
import { protectRoute as auth } from '../middlewares/auth';
import Analytics, { IAnalyticsModel } from '../models/Analytics'; // Assuming Analytics model is or will be .ts
import Exam from '../models/exam.model';
import User from '../models/user.model';
// import Payment from '../models/payment.model'; // This might not be used or named Transaction
import Ticket from '../models/ticket.model';
import Question from '../models/question.model';
import { RequestWithUser } from '../types';

const router = express.Router();

// Define Transaction type if not already defined globally or in types/index.ts
// This is a placeholder, adjust according to your actual Transaction model structure
interface Transaction {
  _id: any; // Or string, ObjectId etc.
  createdAt: Date;
  status: string;
  amount: number;
  // Add other fields from your Transaction model
}

// Assuming Transaction model might be different or you have a specific one for payments
// For now, using a generic Mongoose Model type if Transaction is a Mongoose model.
// Replace 'any' with your actual Transaction model if it's defined elsewhere.
let TransactionModel: any; // Placeholder
try {
  TransactionModel = require('../models/transaction.model'); // Or payment.model, adjust as needed
} catch (e) {
  console.warn("Transaction model not found, using placeholder for Payment/Transaction related analytics. This might lead to runtime errors if Transaction model is used.")
  // Fallback or mock if necessary for routes that use Transaction
  TransactionModel = {
    aggregate: async () => Promise.resolve([]), // Mock aggregate
    countDocuments: async () => Promise.resolve(0) // Mock countDocuments
  };
}


// Middleware to check admin access
const requireAdmin = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  if (!req.user || !['admin', 'support'].includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: 'دسترسی غیرمجاز - فقط ادمین و پشتیبانی',
    });
    return;
  }
  next();
};

// Get dashboard analytics overview
router.get('/dashboard', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date(),
      useCache = 'true', // Default to string 'true' to match query param type
    } = req.query;

    // Check cache first if enabled
    if (useCache === 'true') { 
      const cachedData = await (Analytics as IAnalyticsModel).getCachedAnalytics(
        'daily_summary',
        'daily', // period
        startDate as string | Date,
        endDate as string | Date,
        10 * 60 * 1000 // 10 minutes cache (maxAge)
      );

      if (cachedData) {
        res.json({
          success: true,
          data: cachedData,
          cached: true,
        });
        return;
      }
    }

    // Generate fresh analytics
    const dashboardData = await (Analytics as IAnalyticsModel).getDashboardAnalytics(startDate as string | Date, endDate as string | Date);

    // Cache the results
    if (useCache === 'true') {
      await (Analytics as IAnalyticsModel).cacheAnalytics(
        'daily_summary', // metricType
        'daily',         // period
        startDate as string | Date, // startDate
        endDate as Date,   // endDate
        dashboardData      // data
      );
    }

    res.json({
      success: true,
      data: dashboardData,
      cached: false
    });
  } catch (error) {
    // console.error('Error fetching dashboard analytics:', error); // Keep for debugging if needed
    // res.status(500).json({
    //   success: false,
    //   message: 'خطا در دریافت آمار داشبورد'
    // });
    next(error);
  }
});

// Get exam performance analytics
router.get('/exam-performance', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date(),
      groupBy = 'day' // day, week, month
    } = req.query;

    const examAnalytics = await (Analytics as IAnalyticsModel).getExamPerformanceAnalytics(startDate as Date, endDate as Date);

    // Additional time-series data for charts
    let groupFormat;
    switch (groupBy) {
      case 'week':
        groupFormat = '%Y-%U';
        break;
      case 'month':
        groupFormat = '%Y-%m';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const timeSeriesData = await Exam.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: {
            $gte: new Date(startDate as string | Date),
            $lte: new Date(endDate as string | Date)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupFormat, date: '$completedAt' }
          },
          examCount: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalTimeSpent: { $sum: '$timeSpent' },
          passCount: {
            $sum: {
              $cond: [{ $gte: ['$score', '$passingScore'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...examAnalytics,
        timeSeriesData
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user engagement analytics
router.get('/user-engagement', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date()
    } = req.query;

    const engagementData = await (Analytics as IAnalyticsModel).getUserEngagementAnalytics(startDate as Date, endDate as Date);

    // Additional user activity metrics
    const userActivityPipeline = [
      {
        $match: {
          lastLogin: {
            $gte: new Date(startDate as string | Date),
            $lte: new Date(endDate as string | Date)
          }
        }
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          averageSessionDuration: { $avg: '$sessionDuration' } // Make sure sessionDuration exists on User model
        }
      }
    ];

    const usersByRole = await User.aggregate(userActivityPipeline);

    res.json({
      success: true,
      data: {
        ...engagementData,
        usersByRole
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get payment metrics
router.get('/payment-metrics', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date(),
      groupBy = 'day'
    } = req.query;

    const paymentMetrics = await (Analytics as IAnalyticsModel).getPaymentMetrics(startDate as Date, endDate as Date);

    // Time-series payment data
    let groupFormat;
    switch (groupBy) {
      case 'week':
        groupFormat = '%Y-%U';
        break;
      case 'month':
        groupFormat = '%Y-%m';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const paymentTimeSeries = await TransactionModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate as string | Date),
            $lte: new Date(endDate as string | Date)
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            status: '$status'
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...paymentMetrics,
        paymentTimeSeries
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get ticket statistics
router.get('/ticket-statistics', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date()
    } = req.query;

    const ticketStats = await (Analytics as IAnalyticsModel).getTicketStatistics(startDate as Date, endDate as Date);

    // Additional ticket metrics
    const ticketTrends = await Ticket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate as string | Date),
            $lte: new Date(endDate as string | Date)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          created: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          },
          escalated: {
            $sum: {
              $cond: [{ $eq: ['$isEscalated', true] }, 1, 0] // Make sure isEscalated exists
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...ticketStats,
        ticketTrends
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get question analytics
router.get('/question-analytics', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date(),
      category,
      difficulty,
      type
    } = req.query;

    const questionAnalytics = await (Analytics as IAnalyticsModel).getQuestionAnalytics(startDate as Date, endDate as Date);

    // Additional filtering if specified
    let additionalFilters: any = {}; // Use 'any' or a more specific type
    if (category) additionalFilters.category = category as string;
    if (difficulty) additionalFilters.difficulty = difficulty as string;
    if (type) additionalFilters.type = type as string;

    // Top performing questions
    const topQuestions = await Question.find({
      isActive: true,
      'analytics.totalAttempts': { $gt: 0 },
      ...additionalFilters
    })
    .sort({ 'analytics.usageCount': -1 })
    .limit(10)
    .populate('category', 'name')
    .select('text type difficulty analytics category');

    // Worst performing questions
    const worstQuestions = await Question.aggregate([
      {
        $match: {
          isActive: true,
          'analytics.totalAttempts': { $gt: 5 }, // At least 5 attempts
          ...additionalFilters
        }
      },
      {
        $addFields: {
          successRate: {
            $multiply: [
              { $divide: ['$analytics.correctAnswers', '$analytics.totalAttempts'] },
              100
            ]
          }
        }
      },
      {
        $sort: { successRate: 1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'categories', // ensure this matches your collection name
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...questionAnalytics,
        topQuestions,
        worstQuestions
      }
    });
  } catch (error) {
    next(error);
  }
});

// Generate comprehensive report
router.post('/generate-report', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      reportType = 'comprehensive', // comprehensive, exam, user, payment, ticket, question
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date(),
      format = 'json', // json, csv
    } = req.body;

    let reportData = {};

    switch (reportType) {
      case 'comprehensive':
        reportData = await (Analytics as IAnalyticsModel).getDashboardAnalytics(startDate as Date, endDate as Date);
        break;
      case 'exam':
        reportData = await (Analytics as IAnalyticsModel).getExamPerformanceAnalytics(startDate as Date, endDate as Date);
        break;
      case 'user':
        reportData = await (Analytics as IAnalyticsModel).getUserEngagementAnalytics(startDate as Date, endDate as Date);
        break;
      case 'payment':
        reportData = await (Analytics as IAnalyticsModel).getPaymentMetrics(startDate as Date, endDate as Date);
        break;
      case 'ticket':
        reportData = await (Analytics as IAnalyticsModel).getTicketStatistics(startDate as Date, endDate as Date);
        break;
      case 'question':
        reportData = await (Analytics as IAnalyticsModel).getQuestionAnalytics(startDate as Date, endDate as Date);
        break;
      default:
        res.status(400).json({ success: false, message: 'نوع گزارش نامعتبر' });
        return;
    }

    // Add metadata
    const report = {
      reportType,
      period: { startDate, endDate },
      generatedAt: new Date(),
      generatedBy: req.user!.id, // Add non-null assertion if user is guaranteed by auth middleware
      data: reportData
    };

    // Cache the report
    await (Analytics as IAnalyticsModel).cacheAnalytics(
      `${reportType}_report`,
      'custom',
      startDate as Date,
      endDate as Date,
      report
    );

    if (format === 'csv') {
      res.status(501).json({ success: false, message: 'صادرات CSV هنوز پیاده‌سازی نشده' });
      return;
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// Get real-time metrics (for polling)
router.get('/real-time', auth, requireAdmin, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get today's key metrics
    const [
      todayExams,
      todayUsers,
      todayTransactions,
      todayTickets,
      activeUsers
    ] = await Promise.all([
      Exam.countDocuments({
        status: 'completed',
        completedAt: { $gte: today }
      }),
      User.countDocuments({
        createdAt: { $gte: today }
      }),
      TransactionModel.countDocuments({
        status: 'completed',
        createdAt: { $gte: today }
      }),
      Ticket.countDocuments({
        createdAt: { $gte: today }
      }),
      User.countDocuments({
        lastLogin: { $gte: new Date(now.getTime() - 15 * 60 * 1000) } // Use getTime() for arithmetic
      })
    ]);

    res.json({
      success: true,
      data: {
        todayExams,
        todayUsers,
        todayTransactions,
        todayTickets,
        activeUsers,
        timestamp: now
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 