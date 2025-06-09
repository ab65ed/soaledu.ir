const express = require('express');
const router = express.Router();
const TestExamController = require('../controllers/testExamController');
const { authenticateUser } = require('../middlewares/auth');
const { validateTestExamCreation, validateTestExamUpdate, validateExamConfiguration } = require('../validations/testExamValidation');
/**
 * Test Exam Routes
 * مسیرهای API برای مدیریت آزمون‌های تستی
 *
 * ویژگی‌های اصلی:
 * - CRUD کامل آزمون‌ها
 * - تولید سوالات بر اساس توزیع سختی
 * - مدیریت جلسات آزمون
 * - محاسبه نتایج و تحلیل گرافیکی
 */
// Public routes (no authentication required)
/**
 * @route   GET /api/test-exams
 * @desc    Get all published test exams with filtering and pagination
 * @access  Public
 * @query   page, limit, type, search
 */
router.get('/', TestExamController.list);
/**
 * @route   GET /api/test-exams/:id
 * @desc    Get a single test exam by ID
 * @access  Public (for published exams)
 */
router.get('/:id', TestExamController.getById);
// Protected routes (authentication required)
/**
 * @route   POST /api/test-exams
 * @desc    Create a new test exam
 * @access  Private
 * @body    title, description, type, configuration
 */
router.post('/', authenticateUser, validateTestExamCreation, TestExamController.create);
/**
 * @route   PUT /api/test-exams/:id
 * @desc    Update a test exam
 * @access  Private (owner only)
 * @body    title, description, type, configuration
 */
router.put('/:id', authenticateUser, validateTestExamUpdate, TestExamController.update);
/**
 * @route   DELETE /api/test-exams/:id
 * @desc    Delete a test exam
 * @access  Private (owner only)
 */
router.delete('/:id', authenticateUser, TestExamController.delete);
/**
 * @route   PATCH /api/test-exams/:id/publish
 * @desc    Publish a test exam
 * @access  Private (owner only)
 */
router.patch('/:id/publish', authenticateUser, TestExamController.publish);
/**
 * @route   PATCH /api/test-exams/:id/unpublish
 * @desc    Unpublish a test exam
 * @access  Private (owner only)
 */
router.patch('/:id/unpublish', authenticateUser, TestExamController.unpublish);
/**
 * @route   POST /api/test-exams/:id/generate-questions
 * @desc    Generate questions for exam based on configuration
 * @access  Private (owner only)
 * @body    configuration (optional)
 */
router.post('/:id/generate-questions', authenticateUser, validateExamConfiguration, TestExamController.generateQuestions);
/**
 * @route   POST /api/test-exams/:id/start
 * @desc    Start an exam session
 * @access  Private
 */
router.post('/:id/start', authenticateUser, TestExamController.startExam);
// Exam Session routes
/**
 * @route   GET /api/exam-sessions/:sessionId
 * @desc    Get exam session details
 * @access  Private (participant only)
 */
router.get('/sessions/:sessionId', authenticateUser, TestExamController.getSession);
/**
 * @route   POST /api/exam-sessions/:sessionId/answer
 * @desc    Submit an answer for a question
 * @access  Private (participant only)
 * @body    questionId, answer
 */
router.post('/sessions/:sessionId/answer', authenticateUser, TestExamController.submitAnswer);
/**
 * @route   POST /api/exam-sessions/:sessionId/finish
 * @desc    Finish exam and calculate results
 * @access  Private (participant only)
 */
router.post('/sessions/:sessionId/finish', authenticateUser, TestExamController.finishExam);
/**
 * @route   GET /api/exam-sessions/:sessionId/results
 * @desc    Get exam results with analytics
 * @access  Private (participant only)
 */
router.get('/sessions/:sessionId/results', authenticateUser, TestExamController.getResults);
// Additional utility routes
/**
 * @route   GET /api/test-exams/my/exams
 * @desc    Get current user's test exams
 * @access  Private
 * @query   page, limit, status, type
 */
router.get('/my/exams', authenticateUser, (req, res) => {
    req.query.authorId = req.user.id;
    req.query.publishedOnly = 'false';
    TestExamController.list(req, res);
});
/**
 * @route   GET /api/test-exams/my/sessions
 * @desc    Get current user's exam sessions
 * @access  Private
 * @query   page, limit, status
 */
router.get('/my/sessions', authenticateUser, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const sessionQuery = new Parse.Query('ExamSession');
        sessionQuery.equalTo('participantId', req.user.id);
        sessionQuery.include('exam');
        if (status) {
            sessionQuery.equalTo('status', status);
        }
        sessionQuery.limit(parseInt(limit));
        sessionQuery.skip((parseInt(page) - 1) * parseInt(limit));
        sessionQuery.descending('createdAt');
        const sessions = await sessionQuery.find();
        // Get total count
        const totalQuery = new Parse.Query('ExamSession');
        totalQuery.equalTo('participantId', req.user.id);
        if (status)
            totalQuery.equalTo('status', status);
        const totalCount = await totalQuery.count();
        const totalPages = Math.ceil(totalCount / parseInt(limit));
        res.json({
            success: true,
            data: sessions.map(s => s.toJSON()),
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            }
        });
    }
    catch (error) {
        console.error('Error getting user sessions:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت جلسات آزمون',
            error: error.message
        });
    }
});
/**
 * @route   GET /api/test-exams/stats/overview
 * @desc    Get overall test exam statistics
 * @access  Public
 */
router.get('/stats/overview', async (req, res) => {
    try {
        // Total published exams
        const totalExamsQuery = new Parse.Query('TestExam');
        totalExamsQuery.equalTo('isPublished', true);
        totalExamsQuery.equalTo('status', 'active');
        const totalExams = await totalExamsQuery.count();
        // Total exam sessions
        const totalSessionsQuery = new Parse.Query('ExamSession');
        const totalSessions = await totalSessionsQuery.count();
        // Completed sessions
        const completedSessionsQuery = new Parse.Query('ExamSession');
        completedSessionsQuery.equalTo('status', 'completed');
        const completedSessions = await completedSessionsQuery.count();
        // Average scores
        const completedSessionsData = await completedSessionsQuery.find();
        const averageScore = completedSessionsData.length > 0
            ? completedSessionsData.reduce((sum, session) => sum + (session.get('percentage') || 0), 0) / completedSessionsData.length
            : 0;
        // Exam types distribution
        const examTypesQuery = new Parse.Query('TestExam');
        examTypesQuery.equalTo('isPublished', true);
        const allExams = await examTypesQuery.find();
        const typeDistribution = allExams.reduce((acc, exam) => {
            const type = exam.get('type') || 'practice';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        res.json({
            success: true,
            data: {
                totalExams,
                totalSessions,
                completedSessions,
                averageScore: Math.round(averageScore * 100) / 100,
                completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
                typeDistribution
            }
        });
    }
    catch (error) {
        console.error('Error getting overview stats:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار کلی',
            error: error.message
        });
    }
});
/**
 * @route   GET /api/test-exams/:id/stats
 * @desc    Get detailed statistics for a specific exam
 * @access  Public (for published exams) / Private (for owner)
 */
router.get('/:id/stats', async (req, res) => {
    try {
        const { id } = req.params;
        // Get exam
        const examQuery = new Parse.Query('TestExam');
        const exam = await examQuery.get(id);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'آزمون یافت نشد'
            });
        }
        // Check access permissions
        const isOwner = req.user && exam.get('authorId') === req.user.id;
        const isPublished = exam.get('isPublished');
        if (!isPublished && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'دسترسی غیرمجاز'
            });
        }
        // Get exam sessions
        const sessionsQuery = new Parse.Query('ExamSession');
        sessionsQuery.equalTo('examId', id);
        const sessions = await sessionsQuery.find();
        // Calculate statistics
        const totalParticipants = sessions.length;
        const completedSessions = sessions.filter(s => s.get('status') === 'completed');
        const completionRate = totalParticipants > 0 ? (completedSessions.length / totalParticipants) * 100 : 0;
        const scores = completedSessions.map(s => s.get('percentage') || 0);
        const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
        const passedSessions = completedSessions.filter(s => s.get('resultStatus') === 'passed');
        const passRate = completedSessions.length > 0 ? (passedSessions.length / completedSessions.length) * 100 : 0;
        // Score distribution
        const scoreRanges = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0
        };
        scores.forEach(score => {
            if (score <= 20)
                scoreRanges['0-20']++;
            else if (score <= 40)
                scoreRanges['21-40']++;
            else if (score <= 60)
                scoreRanges['41-60']++;
            else if (score <= 80)
                scoreRanges['61-80']++;
            else
                scoreRanges['81-100']++;
        });
        res.json({
            success: true,
            data: {
                examInfo: {
                    id: exam.id,
                    title: exam.get('title'),
                    type: exam.get('type'),
                    totalQuestions: exam.get('configuration')?.totalQuestions || 0
                },
                participation: {
                    totalParticipants,
                    completedParticipants: completedSessions.length,
                    completionRate: Math.round(completionRate * 100) / 100
                },
                performance: {
                    averageScore: Math.round(averageScore * 100) / 100,
                    passRate: Math.round(passRate * 100) / 100,
                    highestScore: scores.length > 0 ? Math.max(...scores) : 0,
                    lowestScore: scores.length > 0 ? Math.min(...scores) : 0
                },
                scoreDistribution: scoreRanges
            }
        });
    }
    catch (error) {
        console.error('Error getting exam stats:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار آزمون',
            error: error.message
        });
    }
});
module.exports = router;
//# sourceMappingURL=testExams.js.map