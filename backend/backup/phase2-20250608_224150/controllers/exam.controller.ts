/**
 * Exam controller
 * 
 * This file contains controller functions for exam routes.
 */

import { Request, Response, NextFunction } from 'express';
import Exam from '../models/exam.model';
import Question from '../models/question.model';
import ExamConfig from '../models/examConfig.model';
import User from '../models/user.model';
import Score from '../models/score.model';
import { ApiError } from '../middlewares/errorHandler';
import logger from '../config/logger';
import { RequestWithUser } from '../types';

/**
 * @desc    Create a new exam
 * @route   POST /api/v1/exams
 * @access  Private
 */
export const createExam = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { examConfigId } = req.body;
    
    if (!examConfigId) {
      return next(new ApiError('Exam configuration ID is required', 400));
    }
    
    // Get exam configuration
    const examConfig = await ExamConfig.findById(examConfigId).populate('exam');
    
    if (!examConfig) {
      return next(new ApiError('Exam configuration not found', 404));
    }
    
    // Get the associated exam
    const baseExam = await Exam.findById(examConfig.exam);
    
    if (!baseExam) {
      return next(new ApiError('Base exam not found', 404));
    }
    
    // Check if user is authorized to use this exam
    if (!baseExam.creator?.equals(req.user!.id) && req.user!.role !== 'admin') {
      return next(new ApiError('Not authorized to use this exam configuration', 403));
    }
    
    // Get questions from the base exam
    const questions = await Question.find({ _id: { $in: baseExam.questions } });
    
    if (questions.length === 0) {
      return next(new ApiError('No questions available for this exam', 400));
    }
    
    // Set exam cost (could be based on various factors)
    const examCost = 1; // 1 credit per exam
    
    // Check if user has enough credits
    const user = await User.findById(req.user!.id);
    
    if (!user || user.wallet.balance < examCost) {
      return next(new ApiError('Insufficient credits to create exam', 400));
    }
    
    // Deduct credits from user wallet
    await user.addWalletTransaction(
      examCost,
      'debit',
      'Exam creation'
    );
    
    // Create exam instance for the user
    const exam = await Exam.create({
      creator: baseExam.creator,
      user: req.user!.id,
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
    logger.info(`Exam created: ${exam._id} by user ${req.user!.id}`);
    
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
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all exams for current user
 * @route   GET /api/v1/exams
 * @access  Private
 */
export const getExams = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const exams = await Exam.find({ user: req.user!.id })
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
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single exam with questions
 * @route   GET /api/v1/exams/:id
 * @access  Private
 */
export const getExam = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate([
        { path: 'category', select: 'name' },
        { path: 'lesson', select: 'name' },
        { 
          path: 'questions',
          select: 'text options thumbnail difficulty',
        },
      ]);
    
    if (!exam) {
      return next(new ApiError('Exam not found', 404));
    }
    
    // Check if user owns this exam
    if (!exam.user?.equals(req.user!.id) && req.user!.role !== 'admin') {
      return next(new ApiError('Not authorized to access this exam', 403));
    }
    
    // Start the exam if it's in 'draft' status
    if (exam.status === 'draft') {
      await exam.start();
    }
    
    // Check if exam is timed out
    if (exam.status === 'active' && exam.isTimedOut()) {
      await exam.expire();
      return next(new ApiError('Exam has expired due to time limit', 400));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        exam,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Complete an exam
 * @route   PUT /api/v1/exams/:id/complete
 * @access  Private
 */
export const completeExam = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return next(new ApiError('Exam not found', 404));
    }
    
    // Check if user owns this exam
    if (!exam.user?.equals(req.user!.id) && req.user!.role !== 'admin') {
      return next(new ApiError('Not authorized to complete this exam', 403));
    }
    
    // Check if exam is already completed or expired
    if (exam.status === 'completed' || exam.status === 'expired') {
      return next(new ApiError(`Exam is already ${exam.status}`, 400));
    }
    
    // Check if exam is timed out
    if (exam.status === 'active' && exam.isTimedOut()) {
      await exam.expire();
      return next(new ApiError('Exam has expired due to time limit', 400));
    }
    
    // Complete the exam
    await exam.complete();
    
    // Calculate score
    const score = await Score.calculateScore(exam._id.toString(), req.user!.id);
    
    // Log exam completion
    logger.info(`Exam completed: ${exam._id} by user ${req.user!.id} with score ${score.percentage}%`);
    
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
  } catch (error) {
    next(error);
  }
}; 