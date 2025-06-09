"use strict";
/**
 * Analytics Routes
 *
 * Handles analytics data aggregation, metrics calculation, and reporting
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const Analytics_1 = __importDefault(require("../models/Analytics")); // Assuming Analytics model is or will be .ts
const exam_model_1 = __importDefault(require("../models/exam.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// import Payment from '../models/payment.model'; // This might not be used or named Transaction
const ticket_model_1 = __importDefault(require("../models/ticket.model"));
const question_model_1 = __importDefault(require("../models/question.model"));
const router = express_1.default.Router();
// Assuming Transaction model might be different or you have a specific one for payments
// For now, using a generic Mongoose Model type if Transaction is a Mongoose model.
// Replace 'any' with your actual Transaction model if it's defined elsewhere.
let TransactionModel; // Placeholder
try {
    TransactionModel = require('../models/transaction.model'); // Or payment.model, adjust as needed
}
catch (e) {
    console.warn("Transaction model not found, using placeholder for Payment/Transaction related analytics. This might lead to runtime errors if Transaction model is used.");
    // Fallback or mock if necessary for routes that use Transaction
    TransactionModel = {
        aggregate: async () => Promise.resolve([]), // Mock aggregate
        countDocuments: async () => Promise.resolve(0) // Mock countDocuments
    };
}
// Middleware to check admin access
const requireAdmin = (req, res, next) => {
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
router.get('/dashboard', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date(), useCache = 'true', // Default to string 'true' to match query param type
         } = req.query;
        // Check cache first if enabled
        if (useCache === 'true') {
            const cachedData = await Analytics_1.default.getCachedAnalytics('daily_summary', 'daily', // period
            startDate, endDate, 10 * 60 * 1000 // 10 minutes cache (maxAge)
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
        const dashboardData = await Analytics_1.default.getDashboardAnalytics(startDate, endDate);
        // Cache the results
        if (useCache === 'true') {
            await Analytics_1.default.cacheAnalytics('daily_summary', // metricType
            'daily', // period
            startDate, // startDate
            endDate, // endDate
            dashboardData // data
            );
        }
        res.json({
            success: true,
            data: dashboardData,
            cached: false
        });
    }
    catch (error) {
        // console.error('Error fetching dashboard analytics:', error); // Keep for debugging if needed
        // res.status(500).json({
        //   success: false,
        //   message: 'خطا در دریافت آمار داشبورد'
        // });
        next(error);
    }
});
// Get exam performance analytics
router.get('/exam-performance', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date(), groupBy = 'day' // day, week, month
         } = req.query;
        const examAnalytics = await Analytics_1.default.getExamPerformanceAnalytics(startDate, endDate);
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
        const timeSeriesData = await exam_model_1.default.aggregate([
            {
                $match: {
                    status: 'completed',
                    completedAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
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
    }
    catch (error) {
        next(error);
    }
});
// Get user engagement analytics
router.get('/user-engagement', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date() } = req.query;
        const engagementData = await Analytics_1.default.getUserEngagementAnalytics(startDate, endDate);
        // Additional user activity metrics
        const userActivityPipeline = [
            {
                $match: {
                    lastLogin: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
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
        const usersByRole = await user_model_1.default.aggregate(userActivityPipeline);
        res.json({
            success: true,
            data: {
                ...engagementData,
                usersByRole
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get payment metrics
router.get('/payment-metrics', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date(), groupBy = 'day' } = req.query;
        const paymentMetrics = await Analytics_1.default.getPaymentMetrics(startDate, endDate);
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
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
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
    }
    catch (error) {
        next(error);
    }
});
// Get ticket statistics
router.get('/ticket-statistics', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date() } = req.query;
        const ticketStats = await Analytics_1.default.getTicketStatistics(startDate, endDate);
        // Additional ticket metrics
        const ticketTrends = await ticket_model_1.default.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
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
    }
    catch (error) {
        next(error);
    }
});
// Get question analytics
router.get('/question-analytics', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date(), category, difficulty, type } = req.query;
        const questionAnalytics = await Analytics_1.default.getQuestionAnalytics(startDate, endDate);
        // Additional filtering if specified
        let additionalFilters = {}; // Use 'any' or a more specific type
        if (category)
            additionalFilters.category = category;
        if (difficulty)
            additionalFilters.difficulty = difficulty;
        if (type)
            additionalFilters.type = type;
        // Top performing questions
        const topQuestions = await question_model_1.default.find({
            isActive: true,
            'analytics.totalAttempts': { $gt: 0 },
            ...additionalFilters
        })
            .sort({ 'analytics.usageCount': -1 })
            .limit(10)
            .populate('category', 'name')
            .select('text type difficulty analytics category');
        // Worst performing questions
        const worstQuestions = await question_model_1.default.aggregate([
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
    }
    catch (error) {
        next(error);
    }
});
// Generate comprehensive report
router.post('/generate-report', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const { reportType = 'comprehensive', // comprehensive, exam, user, payment, ticket, question
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date(), format = 'json', // json, csv
         } = req.body;
        let reportData = {};
        switch (reportType) {
            case 'comprehensive':
                reportData = await Analytics_1.default.getDashboardAnalytics(startDate, endDate);
                break;
            case 'exam':
                reportData = await Analytics_1.default.getExamPerformanceAnalytics(startDate, endDate);
                break;
            case 'user':
                reportData = await Analytics_1.default.getUserEngagementAnalytics(startDate, endDate);
                break;
            case 'payment':
                reportData = await Analytics_1.default.getPaymentMetrics(startDate, endDate);
                break;
            case 'ticket':
                reportData = await Analytics_1.default.getTicketStatistics(startDate, endDate);
                break;
            case 'question':
                reportData = await Analytics_1.default.getQuestionAnalytics(startDate, endDate);
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
            generatedBy: req.user.id, // Add non-null assertion if user is guaranteed by auth middleware
            data: reportData
        };
        // Cache the report
        await Analytics_1.default.cacheAnalytics(`${reportType}_report`, 'custom', startDate, endDate, report);
        if (format === 'csv') {
            res.status(501).json({ success: false, message: 'صادرات CSV هنوز پیاده‌سازی نشده' });
            return;
        }
        res.json({
            success: true,
            data: report
        });
    }
    catch (error) {
        next(error);
    }
});
// Get real-time metrics (for polling)
router.get('/real-time', auth_1.protectRoute, requireAdmin, async (req, res, next) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // Get today's key metrics
        const [todayExams, todayUsers, todayTransactions, todayTickets, activeUsers] = await Promise.all([
            exam_model_1.default.countDocuments({
                status: 'completed',
                completedAt: { $gte: today }
            }),
            user_model_1.default.countDocuments({
                createdAt: { $gte: today }
            }),
            TransactionModel.countDocuments({
                status: 'completed',
                createdAt: { $gte: today }
            }),
            ticket_model_1.default.countDocuments({
                createdAt: { $gte: today }
            }),
            user_model_1.default.countDocuments({
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map