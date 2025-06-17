"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const Result_1 = __importDefault(require("../models/Result"));
const exam_model_1 = __importDefault(require("../models/exam.model"));
const auth_1 = require("../middlewares/auth");
const validations_1 = require("../validations");
const zod_1 = require("zod");
// Validation schemas using Zod
const getResultsSchema = zod_1.z.object({
    page: zod_1.z.number().min(1).optional().default(1),
    limit: zod_1.z.number().min(1).max(100).optional().default(10),
    examId: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    status: zod_1.z.enum(['completed', 'abandoned', 'timeout']).optional(),
    dateFrom: zod_1.z.string().optional(),
    dateTo: zod_1.z.string().optional()
});
const exportResultsSchema = zod_1.z.object({
    examId: zod_1.z.string({ message: 'شناسه آزمون الزامی است' }),
    format: zod_1.z.enum(['csv', 'json']).optional().default('csv'),
    includeAnswers: zod_1.z.boolean().optional().default(false)
});
/**
 * @route GET /api/results
 * @desc Get results with filtering and pagination
 * @access Private (Admin only)
 */
router.get('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (0, validations_1.validateRequest)(getResultsSchema, 'query'), async (req, res) => {
    try {
        const { page = 1, limit = 10, examId, userId, status, dateFrom, dateTo } = req.query;
        // Build filter
        const filter = {};
        if (examId)
            filter.exam = examId;
        if (userId)
            filter.user = userId;
        if (status)
            filter.status = status;
        if (dateFrom || dateTo) {
            filter.completedAt = {};
            if (dateFrom)
                filter.completedAt.$gte = new Date(dateFrom);
            if (dateTo)
                filter.completedAt.$lte = new Date(dateTo);
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        // Get results with optimized population and projection
        const results = await Result_1.default.find(filter)
            .populate('user', 'name email avatar')
            .populate('exam', 'title category difficulty duration')
            .select('score percentage isPassed completedAt duration status analytics.averageTimePerQuestion')
            .sort({ completedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        // Get total count
        const total = await Result_1.default.countDocuments(filter);
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
    }
    catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت نتایج'
        });
    }
});
/**
 * @route GET /api/results/user/:userId
 * @desc Get user's exam results
 * @access Private (User can see own results, Admin can see all)
 */
router.get('/user/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        // Check authorization
        if (req.user?.role !== 'admin' && req.user?.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'دسترسی غیرمجاز'
            });
        }
        const results = await Result_1.default.find({ user: userId })
            .populate('exam', 'title category duration passingScore')
            .sort({ completedAt: -1 })
            .lean();
        res.json({
            success: true,
            data: results
        });
    }
    catch (error) {
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
router.get('/exam/:examId/user/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { examId, userId } = req.params;
        // Check authorization
        if (req.user?.role !== 'admin' && req.user?.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'دسترسی غیرمجاز'
            });
        }
        const result = await Result_1.default.findOne({ exam: examId, user: userId })
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
    }
    catch (error) {
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
router.get('/analytics/exam/:examId', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const { examId } = req.params;
        // Get basic stats
        const basicStats = await Result_1.default.getExamStats(examId);
        // Get score distribution
        const scoreDistribution = await Result_1.default.getScoreDistribution(examId);
        // Get question analytics
        const questionAnalytics = await Result_1.default.aggregate([
            { $match: { exam: new mongoose_1.default.Types.ObjectId(examId) } },
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
        const recentActivity = await Result_1.default.find({ exam: examId })
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
    }
    catch (error) {
        console.error('Error fetching exam analytics:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار آزمون'
        });
    }
});
/**
 * @route GET /api/results/analytics/overall
 * @desc Get overall analytics
 * @access Private (Admin only)
 */
router.get('/analytics/overall', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const { dateRange = '30d' } = req.query;
        // Calculate date filter
        const days = parseInt(dateRange.replace('d', ''));
        const dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - days);
        // Get overall stats
        const overallStats = await Result_1.default.aggregate([
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
        const totalExams = await exam_model_1.default.countDocuments();
        // Get popular exams
        const popularExams = await Result_1.default.aggregate([
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
        const dailyActivity = await Result_1.default.aggregate([
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
        const topPerformers = await Result_1.default.find({ completedAt: { $gte: dateFilter } })
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
    }
    catch (error) {
        console.error('Error fetching overall analytics:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار کلی'
        });
    }
});
/**
 * @route GET /api/results/analytics/user/:userId/trends
 * @desc Get user performance trends
 * @access Private
 */
router.get('/analytics/user/:userId/trends', auth_1.authenticateToken, async (req, res) => {
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
        const scoreProgression = await Result_1.default.find({ user: userId })
            .select('percentage completedAt exam')
            .populate('exam', 'title')
            .sort({ completedAt: 1 })
            .lean();
        // Get category performance
        const categoryPerformance = await Result_1.default.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(userId) } },
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
        const recentResults = await Result_1.default.find({ user: userId })
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
    }
    catch (error) {
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
router.post('/export', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (0, validations_1.validateRequest)(exportResultsSchema), async (req, res) => {
    try {
        const { examId, format = 'csv', includeAnswers = false } = req.body;
        // Get results
        const results = await Result_1.default.find({ exam: examId })
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
        }
        else {
            // Return JSON
            res.json({
                success: true,
                data: results
            });
        }
    }
    catch (error) {
        console.error('Error exporting results:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در صادرات نتایج'
        });
    }
});
/**
 * @route DELETE /api/results/:resultId
 * @desc Delete a result
 * @access Private (Admin only)
 */
router.delete('/:resultId', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const { resultId } = req.params;
        const result = await Result_1.default.findByIdAndDelete(resultId);
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
    }
    catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در حذف نتیجه'
        });
    }
});
// Helper function to generate CSV
function generateCSV(results, includeAnswers) {
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
exports.default = router;
//# sourceMappingURL=results.js.map