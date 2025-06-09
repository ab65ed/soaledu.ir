"use strict";
/**
 * Exam controller
 *
 * This file contains controller functions for exam routes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeExam = exports.getExam = exports.getExams = exports.createExam = void 0;
const exam_model_1 = __importDefault(require("../models/exam.model"));
const question_model_1 = __importDefault(require("../models/question.model"));
const examConfig_model_1 = __importDefault(require("../models/examConfig.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const score_model_1 = __importDefault(require("../models/score.model"));
const errorHandler_1 = require("../middlewares/errorHandler");
const logger_1 = __importDefault(require("../config/logger"));
/**
 * @desc    Create a new exam
 * @route   POST /api/v1/exams
 * @access  Private
 */
const createExam = async (req, res, next) => {
    try {
        const { examConfigId } = req.body;
        if (!examConfigId) {
            return next(new errorHandler_1.ApiError('Exam configuration ID is required', 400));
        }
        // Get exam configuration
        const examConfig = await examConfig_model_1.default.findById(examConfigId).populate('exam');
        if (!examConfig) {
            return next(new errorHandler_1.ApiError('Exam configuration not found', 404));
        }
        // Get the associated exam
        const baseExam = await exam_model_1.default.findById(examConfig.exam);
        if (!baseExam) {
            return next(new errorHandler_1.ApiError('Base exam not found', 404));
        }
        // Check if user is authorized to use this exam
        if (!baseExam.creator?.equals(req.user.id) && req.user.role !== 'admin') {
            return next(new errorHandler_1.ApiError('Not authorized to use this exam configuration', 403));
        }
        // Get questions from the base exam
        const questions = await question_model_1.default.find({ _id: { $in: baseExam.questions } });
        if (questions.length === 0) {
            return next(new errorHandler_1.ApiError('No questions available for this exam', 400));
        }
        // Set exam cost (could be based on various factors)
        const examCost = 1; // 1 credit per exam
        // Check if user has enough credits
        const user = await user_model_1.default.findById(req.user.id);
        if (!user || user.wallet.balance < examCost) {
            return next(new errorHandler_1.ApiError('Insufficient credits to create exam', 400));
        }
        // Deduct credits from user wallet
        await user.addWalletTransaction(examCost, 'debit', 'Exam creation');
        // Create exam instance for the user
        const exam = await exam_model_1.default.create({
            creator: baseExam.creator,
            user: req.user.id,
            title: baseExam.title,
            description: baseExam.description,
            questions: baseExam.questions,
            category: baseExam.category,
            difficulty: baseExam.difficulty,
            hasNegativeMarking: examConfig.negativeMarking,
            negativeMarkingValue: examConfig.negativeMarkingValue,
            duration: examConfig.timeLimit, // timeLimit is in minutes
            passingScore: examConfig.passingScore,
        });
        // Log exam creation
        logger_1.default.info(`Exam created: ${exam._id} by user ${req.user.id}`);
        res.status(201).json({
            status: 'success',
            data: {
                exam: {
                    id: exam._id,
                    title: exam.title,
                    hasNegativeMarking: exam.hasNegativeMarking,
                    duration: exam.duration,
                    status: exam.status,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createExam = createExam;
/**
 * @desc    Get all exams for current user
 * @route   GET /api/v1/exams
 * @access  Private
 */
const getExams = async (req, res, next) => {
    try {
        const exams = await exam_model_1.default.find({ user: req.user.id })
            .populate([
            { path: 'category', select: 'name' },
            { path: 'lesson', select: 'name' },
        ])
            .select('-questions') // Don't include questions in the response
            .sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            results: exams.length,
            data: {
                exams,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getExams = getExams;
/**
 * @desc    Get a single exam with questions
 * @route   GET /api/v1/exams/:id
 * @access  Private
 */
const getExam = async (req, res, next) => {
    try {
        const exam = await exam_model_1.default.findById(req.params.id)
            .populate([
            { path: 'category', select: 'name' },
            { path: 'lesson', select: 'name' },
            {
                path: 'questions',
                select: 'text options thumbnail difficulty',
            },
        ]);
        if (!exam) {
            return next(new errorHandler_1.ApiError('Exam not found', 404));
        }
        // Check if user owns this exam
        if (!exam.user?.equals(req.user.id) && req.user.role !== 'admin') {
            return next(new errorHandler_1.ApiError('Not authorized to access this exam', 403));
        }
        // Start the exam if it's in 'draft' status
        if (exam.status === 'draft') {
            await exam.start();
        }
        // Check if exam is timed out
        if (exam.status === 'active' && exam.isTimedOut()) {
            await exam.expire();
            return next(new errorHandler_1.ApiError('Exam has expired due to time limit', 400));
        }
        res.status(200).json({
            status: 'success',
            data: {
                exam,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getExam = getExam;
/**
 * @desc    Complete an exam
 * @route   PUT /api/v1/exams/:id/complete
 * @access  Private
 */
const completeExam = async (req, res, next) => {
    try {
        const exam = await exam_model_1.default.findById(req.params.id);
        if (!exam) {
            return next(new errorHandler_1.ApiError('Exam not found', 404));
        }
        // Check if user owns this exam
        if (!exam.user?.equals(req.user.id) && req.user.role !== 'admin') {
            return next(new errorHandler_1.ApiError('Not authorized to complete this exam', 403));
        }
        // Check if exam is already completed or expired
        if (exam.status === 'completed' || exam.status === 'expired') {
            return next(new errorHandler_1.ApiError(`Exam is already ${exam.status}`, 400));
        }
        // Check if exam is timed out
        if (exam.status === 'active' && exam.isTimedOut()) {
            await exam.expire();
            return next(new errorHandler_1.ApiError('Exam has expired due to time limit', 400));
        }
        // Complete the exam
        await exam.complete();
        // Calculate score
        const score = await score_model_1.default.calculateScore(exam._id.toString(), req.user.id);
        // Log exam completion
        logger_1.default.info(`Exam completed: ${exam._id} by user ${req.user.id} with score ${score.percentage}%`);
        res.status(200).json({
            status: 'success',
            data: {
                exam: {
                    id: exam._id,
                    status: exam.status,
                    completedAt: exam.completedAt,
                },
                score: {
                    correctCount: score.correctCount,
                    incorrectCount: score.incorrectCount,
                    unansweredCount: score.unansweredCount,
                    totalScore: score.totalScore,
                    percentage: score.percentage,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.completeExam = completeExam;
//# sourceMappingURL=exam.controller.js.map