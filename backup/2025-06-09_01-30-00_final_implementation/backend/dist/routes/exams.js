"use strict";
/**
 * Exam Management Routes
 *
 * Handles all exam-related operations including CRUD, scheduling, and result processing
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
// Temporary: Cast models to any until they are converted to TypeScript
// TODO: Replace with actual typed model imports (e.g., import Exam, { IExamModel } from '../models/exam.model');
const Exam = require('../models/exam.model');
const Question = require('../models/question.model');
const User = require('../models/user.model');
const router = express_1.default.Router();
// Simple test route without auth
router.get('/', async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Exams API is working',
            data: { message: 'Welcome to Exam-Edu API' }
        });
    }
    catch (error) {
        next(error);
    }
});
// Create new exam (Admin only)
router.post('/create', auth_1.protectRoute, async (req, res, next) => {
    try {
        if (!req.user || !['admin'].includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'فقط ادمین می‌تواند آزمون ایجاد کند'
            });
            return;
        }
        const { title, description, duration, difficulty, category, lesson, questions, // Expecting array of question IDs
        hasNegativeMarking, negativeMarkingValue, passingScore, allowReview, showResults, shuffleQuestions, shuffleOptions, tags, isPublic } = req.body;
        if (!title || !duration || !questions || !Array.isArray(questions) || questions.length === 0) {
            res.status(400).json({
                success: false,
                message: 'عنوان، مدت زمان و سوالات (به صورت آرایه) الزامی است'
            });
            return;
        }
        const existingQuestions = await Question.find({
            _id: { $in: questions },
            isActive: true
        });
        if (existingQuestions.length !== questions.length) {
            res.status(400).json({
                success: false,
                message: 'برخی از سوالات انتخاب شده معتبر نیستند'
            });
            return;
        }
        const examData = {
            creator: req.user.id,
            title,
            description,
            duration,
            difficulty: difficulty || 'Medium',
            category,
            lesson,
            questions,
            hasNegativeMarking: hasNegativeMarking || false,
            negativeMarkingValue: negativeMarkingValue || 0.25,
            passingScore: passingScore || 60,
            allowReview: allowReview !== false,
            showResults: showResults !== false,
            shuffleQuestions: shuffleQuestions || false,
            shuffleOptions: shuffleOptions || false,
            tags: tags || [],
            isPublic: isPublic || false,
            status: 'draft'
        };
        const newExam = new Exam(examData);
        await newExam.save();
        await newExam.populate('creator', 'name email');
        await newExam.populate('category', 'name');
        await newExam.populate('lesson', 'name');
        await newExam.populate('questions');
        res.status(201).json({
            success: true,
            message: 'آزمون با موفقیت ایجاد شد',
            data: newExam
        });
    }
    catch (error) {
        next(error);
    }
});
// Get all exams (Admin only)
router.get('/admin/all', auth_1.protectRoute, async (req, res, next) => {
    try {
        if (!req.user || !['admin'].includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'فقط ادمین می‌تواند تمام آزمون‌ها را مشاهده کند'
            });
            return;
        }
        const { page = '1', limit = '10', category, status, search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        // Build query
        const query = {};
        // Admin sees all exams
        if (category)
            query.category = category;
        if (status)
            query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const exams = await Exam.find(query)
            .populate('creator', 'name email')
            .populate('category', 'name')
            .populate('lesson', 'name')
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();
        const total = await Exam.countDocuments(query);
        const statistics = await Exam.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalExams: { $sum: 1 },
                    draftExams: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
                    publishedExams: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
                    scheduledExams: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
                    archivedExams: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: {
                exams,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: total,
                    pages: Math.ceil(total / limitNum)
                },
                statistics: statistics[0] || { totalExams: 0, draftExams: 0, publishedExams: 0, scheduledExams: 0, archivedExams: 0 }
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get available exams for students
router.get('/available', auth_1.protectRoute, async (req, res, next) => {
    try {
        const { page = '1', limit = '12', difficulty, category, search } = req.query;
        const numPage = parseInt(page);
        const numLimit = parseInt(limit);
        const skip = (numPage - 1) * numLimit;
        const filter = {
            $or: [
                { status: 'published', isScheduled: false },
                {
                    status: 'scheduled',
                    isScheduled: true,
                    scheduledStartDate: { $lte: new Date() },
                    scheduledEndDate: { $gte: new Date() }
                }
            ]
        };
        if (difficulty)
            filter.difficulty = difficulty;
        if (category)
            filter.category = category;
        if (search) {
            const searchStr = search;
            filter.$and = filter.$and || [];
            filter.$and.push({
                $or: [
                    { title: { $regex: searchStr, $options: 'i' } },
                    { description: { $regex: searchStr, $options: 'i' } }
                ]
            });
        }
        const exams = await Exam.find(filter)
            .populate('creator', 'name')
            .populate('category', 'name')
            .populate('lesson', 'name')
            .select('-questions')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(numLimit)
            .lean();
        const total = await Exam.countDocuments(filter);
        res.json({
            success: true,
            data: {
                exams,
                pagination: {
                    page: numPage,
                    limit: numLimit,
                    total,
                    pages: Math.ceil(total / numLimit)
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get single exam details
router.get('/:id', auth_1.protectRoute, async (req, res, next) => {
    try {
        const examId = req.params.id;
        const exam = await Exam.findById(examId)
            .populate('creator', 'name email')
            .populate('category', 'name')
            .populate('lesson', 'name')
            .populate('questions');
        if (!exam) {
            res.status(404).json({ success: false, message: 'آزمون پیدا نشد' });
            return;
        }
        const isCreator = exam.creator?._id?.toString() === req.user?.id;
        const isAdmin = req.user?.role === 'admin';
        const isAvailable = exam.isAvailable ? exam.isAvailable() : false; // Check if method exists
        if (!isCreator && !isAdmin && !isAvailable) {
            res.status(403).json({ success: false, message: 'دسترسی به این آزمون مجاز نیست' });
            return;
        }
        if (req.user?.role === 'student' && !isCreator && exam.questions && Array.isArray(exam.questions)) {
            exam.questions = exam.questions.map((q) => q.getForDisplay ? q.getForDisplay() : q); // Check if method exists
        }
        res.json({ success: true, data: exam });
    }
    catch (error) {
        next(error);
    }
});
// Update exam (Admin only)
router.put('/:id', auth_1.protectRoute, async (req, res, next) => {
    try {
        const examId = req.params.id;
        const exam = await Exam.findById(examId);
        if (!exam) {
            res.status(404).json({ success: false, message: 'آزمون پیدا نشد' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const isCreator = exam.creator?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            res.status(403).json({ success: false, message: 'فقط سازنده آزمون یا ادمین می‌تواند آن را ویرایش کند' });
            return;
        }
        if (['active', 'completed'].includes(exam.status)) {
            res.status(400).json({ success: false, message: 'نمی‌توان آزمون فعال یا تکمیل شده را ویرایش کرد' });
            return;
        }
        const updateData = { ...req.body };
        delete updateData.creator;
        if (updateData.questions && Array.isArray(updateData.questions)) {
            const existingQuestions = await Question.find({ _id: { $in: updateData.questions }, isActive: true });
            if (existingQuestions.length !== updateData.questions.length) {
                res.status(400).json({ success: false, message: 'برخی از سوالات انتخاب شده معتبر نیستند' });
                return;
            }
        }
        Object.assign(exam, updateData);
        await exam.save();
        await exam.populate('creator', 'name email');
        await exam.populate('category', 'name');
        await exam.populate('lesson', 'name');
        await exam.populate('questions');
        res.json({ success: true, message: 'آزمون با موفقیت به‌روزرسانی شد', data: exam });
    }
    catch (error) {
        next(error);
    }
});
// Publish exam (Admin only)
router.patch('/:id/publish', auth_1.protectRoute, async (req, res, next) => {
    try {
        const examId = req.params.id;
        const exam = await Exam.findById(examId);
        if (!exam) {
            res.status(404).json({ success: false, message: 'آزمون پیدا نشد' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const isCreator = exam.creator?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
            return;
        }
        if (exam.status !== 'draft') {
            res.status(400).json({ success: false, message: 'فقط آزمون‌های پیش‌نویس قابل انتشار هستند' });
            return;
        }
        if (typeof exam.publish !== 'function')
            throw new Error('exam.publish is not a function');
        await exam.publish();
        res.json({ success: true, message: 'آزمون با موفقیت منتشر شد', data: exam });
    }
    catch (error) {
        next(error);
    }
});
// Schedule exam (Admin only)
router.patch('/:id/schedule', auth_1.protectRoute, async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            res.status(400).json({ success: false, message: 'تاریخ شروع و پایان الزامی است' });
            return;
        }
        const examId = req.params.id;
        const exam = await Exam.findById(examId);
        if (!exam) {
            res.status(404).json({ success: false, message: 'آزمون پیدا نشد' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const isCreator = exam.creator?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
            return;
        }
        if (!['draft', 'published'].includes(exam.status)) {
            res.status(400).json({ success: false, message: 'فقط آزمون‌های پیش‌نویس یا منتشر شده قابل زمان‌بندی هستند' });
            return;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start <= new Date()) {
            res.status(400).json({ success: false, message: 'تاریخ شروع باید در آینده باشد' });
            return;
        }
        if (end <= start) {
            res.status(400).json({ success: false, message: 'تاریخ پایان باید بعد از تاریخ شروع باشد' });
            return;
        }
        if (typeof exam.schedule !== 'function')
            throw new Error('exam.schedule is not a function');
        await exam.schedule(start, end);
        res.json({ success: true, message: 'آزمون با موفقیت زمان‌بندی شد', data: exam });
    }
    catch (error) {
        next(error);
    }
});
// Archive exam (Admin only)
router.patch('/:id/archive', auth_1.protectRoute, async (req, res, next) => {
    try {
        const examId = req.params.id;
        const exam = await Exam.findById(examId);
        if (!exam) {
            res.status(404).json({ success: false, message: 'آزمون پیدا نشد' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const isCreator = exam.creator?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
            return;
        }
        if (typeof exam.archive !== 'function')
            throw new Error('exam.archive is not a function');
        await exam.archive();
        res.json({ success: true, message: 'آزمون با موفقیت آرشیو شد', data: exam });
    }
    catch (error) {
        next(error);
    }
});
// Delete exam (Admin only)
router.delete('/:id', auth_1.protectRoute, async (req, res, next) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ success: false, message: 'فقط ادمین می‌تواند آزمون را حذف کند' });
            return;
        }
        const examId = req.params.id;
        const exam = await Exam.findById(examId);
        if (!exam) {
            res.status(404).json({ success: false, message: 'آزمون پیدا نشد' });
            return;
        }
        if (['active', 'completed'].includes(exam.status)) {
            res.status(400).json({ success: false, message: 'نمی‌توان آزمون فعال یا تکمیل شده را حذف کرد' });
            return;
        }
        await Exam.findByIdAndDelete(examId);
        res.json({ success: true, message: 'آزمون با موفقیت حذف شد' });
    }
    catch (error) {
        next(error);
    }
});
// Start exam (Student only)
router.post('/:id/start', auth_1.protectRoute, async (req, res, next) => {
    try {
        const examId = req.params.id;
        const examTemplate = await Exam.findById(examId);
        if (!examTemplate) {
            res.status(404).json({ success: false, message: 'آزمون پیدا نشد' });
            return;
        }
        if (typeof examTemplate.isAvailable !== 'function' || !examTemplate.isAvailable()) {
            res.status(400).json({ success: false, message: 'این آزمون در حال حاضر در دسترس نیست' });
            return;
        }
        const existingSession = await Exam.findOne({ user: req.user?.id, originalExam: examTemplate._id, status: 'active' });
        if (existingSession) {
            res.status(400).json({ success: false, message: 'شما قبلاً این آزمون را شروع کرده‌اید' });
            return;
        }
        const examSessionData = {
            originalExam: examTemplate._id,
            creator: examTemplate.creator,
            user: req.user?.id,
            title: examTemplate.title,
            description: examTemplate.description,
            duration: examTemplate.duration,
            difficulty: examTemplate.difficulty,
            category: examTemplate.category,
            lesson: examTemplate.lesson,
            questions: examTemplate.questions, // Assuming these are ObjectIds
            hasNegativeMarking: examTemplate.hasNegativeMarking,
            negativeMarkingValue: examTemplate.negativeMarkingValue,
            passingScore: examTemplate.passingScore,
            allowReview: examTemplate.allowReview,
            showResults: examTemplate.showResults,
            shuffleQuestions: examTemplate.shuffleQuestions,
            shuffleOptions: examTemplate.shuffleOptions,
            // status will be set by start()
        };
        const examSession = new Exam(examSessionData);
        if (typeof examSession.start !== 'function')
            throw new Error('examSession.start is not a function');
        await examSession.start();
        await examSession.populate('questions');
        if (examSession.shuffleQuestions && Array.isArray(examSession.questions)) {
            examSession.questions.sort(() => Math.random() - 0.5);
        }
        if (Array.isArray(examSession.questions)) {
            examSession.questions = examSession.questions.map((q) => q.getForDisplay ? q.getForDisplay() : q);
        }
        res.json({
            success: true,
            message: 'آزمون شروع شد',
            data: { examId: examSession._id, timeRemaining: examSession.duration * 60, exam: examSession }
        });
    }
    catch (error) {
        next(error);
    }
});
// Submit exam (Student only)
router.post('/:id/submit', auth_1.protectRoute, async (req, res, next) => {
    try {
        const { answers } = req.body; // Assuming answers is an object: { questionId: userAnswer }
        const examSessionId = req.params.id;
        const examSession = await Exam.findOne({ _id: examSessionId, user: req.user?.id, status: 'active' }).populate('questions');
        if (!examSession) {
            res.status(404).json({ success: false, message: 'جلسه آزمون پیدا نشد' });
            return;
        }
        if (typeof examSession.isTimedOut !== 'function' || examSession.isTimedOut()) {
            if (typeof examSession.expire === 'function')
                await examSession.expire();
            res.status(400).json({ success: false, message: 'زمان آزمون به پایان رسیده است' });
            return;
        }
        let totalScore = 0;
        let correctAnswers = 0;
        if (!Array.isArray(examSession.questions))
            throw new Error('examSession.questions is not an array');
        const totalQuestions = examSession.questions.length;
        const results = examSession.questions.map((question) => {
            const userAnswer = answers[question._id.toString()];
            if (typeof question.checkAnswer !== 'function')
                throw new Error(`question.checkAnswer is not a function for question ID: ${question._id}`);
            const isCorrect = question.checkAnswer(userAnswer);
            let pointsAwarded = 0;
            if (isCorrect) {
                correctAnswers++;
                pointsAwarded = question.points || 1;
                totalScore += pointsAwarded;
            }
            else if (examSession.hasNegativeMarking && userAnswer !== undefined) {
                pointsAwarded = -(examSession.negativeMarkingValue * (question.points || 1));
                totalScore += pointsAwarded;
            }
            return { questionId: question._id, userAnswer, isCorrect, points: pointsAwarded };
        });
        totalScore = Math.max(0, totalScore);
        const maxPossibleScore = examSession.questions.reduce((sum, q) => sum + (q.points || 1), 0);
        const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
        const passed = percentage >= examSession.passingScore;
        if (typeof examSession.complete !== 'function')
            throw new Error('examSession.complete is not a function');
        await examSession.complete({ score: totalScore, percentage, passed, results }); // Pass calculated results
        res.json({
            success: true,
            message: 'آزمون با موفقیت ارسال شد',
            data: { examSession, totalScore, percentage, passed, results } // Send back enriched data
        });
    }
    catch (error) {
        next(error);
    }
});
// Auto-save answers (Student only)
router.post('/:id/auto-save', auth_1.protectRoute, async (req, res, next) => {
    try {
        const { answers } = req.body;
        const examSessionId = req.params.id;
        const examSession = await Exam.findOne({ _id: examSessionId, user: req.user?.id, status: 'active' });
        if (!examSession) {
            res.status(404).json({ success: false, message: 'جلسه آزمون پیدا نشد' });
            return;
        }
        // TODO: Implement actual storage of auto-saved answers, perhaps in a separate field on ExamSession or new collection
        // For now, just acknowledge. In a real app, this would update examSession.currentAnswers or similar.
        // examSession.currentAnswers = answers;
        // await examSession.save();
        res.json({ success: true, message: 'پاسخ‌ها ذخیره شد' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=exams.js.map