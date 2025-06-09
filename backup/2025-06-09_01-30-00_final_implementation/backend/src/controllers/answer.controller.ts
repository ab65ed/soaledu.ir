/**
 * Answer controller
 * 
 * This file contains controller functions for answer routes.
 */

import { Request, Response, NextFunction } from 'express';
import Answer from '../models/answer.model';
import Exam from '../models/exam.model';
import Question from '../models/question.model';
import { ApiError } from '../middlewares/errorHandler';
import { RequestWithUser } from '../types';

/**
 * @desc    Submit an answer for a question in an exam
 * @route   POST /api/v1/exams/:examId/answers
 * @access  Private
 */
export const submitAnswer = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { examId } = req.params;
    const { questionId, selectedOption } = req.body;
    
    // Validate required fields
    if (!questionId || selectedOption === undefined) {
      return next(new ApiError('Question ID and selected option are required', 400));
    }
    
    // Get exam
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return next(new ApiError('Exam not found', 404));
    }
    
    // Check if user owns this exam
    if (!exam.user?.equals(req.user!.id) && req.user!.role !== 'admin') {
      return next(new ApiError('Not authorized to submit answers for this exam', 403));
    }
    
    // Check if exam is in progress
    if (exam.status !== 'active') {
      return next(new ApiError(`Cannot submit answers for ${exam.status} exam`, 400));
    }
    
    // Check if exam is timed out
    if (exam.isTimedOut()) {
      await exam.expire();
      return next(new ApiError('Exam has expired due to time limit', 400));
    }
    
    // Check if question exists in the exam
    const questionExists = exam.questions.some(q => q.equals(questionId));
    
    if (!questionExists) {
      return next(new ApiError('Question does not belong to this exam', 400));
    }
    
    // Get question to validate selected option
    const question = await Question.findById(questionId);
    
    if (!question) {
      return next(new ApiError('Question not found', 404));
    }
    
    // Validate selected option
    if (selectedOption < 0 || selectedOption >= (question.options?.length || 0)) {
      return next(new ApiError('Selected option is out of range', 400));
    }
    
    // Check if answer is correct (for multiple choice questions)
    const isCorrect = question.correctOptions && question.correctOptions.includes(selectedOption);
    
    // Create or update answer
    const answer = await Answer.findOneAndUpdate(
      {
        user: req.user!.id,
        exam: examId,
        question: questionId,
      },
      {
        selectedOption,
        isCorrect: isCorrect || false,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        answer: {
          id: answer!._id,
          question: answer!.question,
          selectedOption: answer!.selectedOption,
          isCorrect: answer!.isCorrect,
        },
      },
    });
  } catch (error: any) {
    // Handle duplicate key error (user already answered this question)
    if (error.code === 11000) {
      return next(new ApiError('You have already answered this question', 400));
    }
    
    next(error);
  }
};

/**
 * @desc    Get all answers for an exam
 * @route   GET /api/v1/exams/:examId/answers
 * @access  Private
 */
export const getAnswers = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { examId } = req.params;
    
    // Get exam
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return next(new ApiError('Exam not found', 404));
    }
    
    // Check if user owns this exam
    if (!exam.user?.equals(req.user!.id) && req.user!.role !== 'admin') {
      return next(new ApiError('Not authorized to view answers for this exam', 403));
    }
    
    // Get answers
    const answers = await Answer.find({
      user: req.user!.id,
      exam: examId,
    }).populate({
      path: 'question',
      select: 'text options correctOptions',
    });
    
    res.status(200).json({
      status: 'success',
      results: answers.length,
      data: {
        answers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single answer
 * @route   GET /api/v1/answers/:id
 * @access  Private
 */
export const getAnswer = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const answer = await Answer.findById(req.params.id).populate({
      path: 'question',
      select: 'text options correctOptions',
    });
    
    if (!answer) {
      return next(new ApiError('Answer not found', 404));
    }
    
    // Check if user owns this answer
    if (!answer.user.equals(req.user!.id) && req.user!.role !== 'admin') {
      return next(new ApiError('Not authorized to view this answer', 403));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        answer,
      },
    });
  } catch (error) {
    next(error);
  }
}; 