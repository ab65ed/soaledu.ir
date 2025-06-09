/**
 * Answer controller
 *
 * This file contains controller functions for answer routes.
 */
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../types';
/**
 * @desc    Submit an answer for a question in an exam
 * @route   POST /api/v1/exams/:examId/answers
 * @access  Private
 */
export declare const submitAnswer: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Get all answers for an exam
 * @route   GET /api/v1/exams/:examId/answers
 * @access  Private
 */
export declare const getAnswers: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Get a single answer
 * @route   GET /api/v1/answers/:id
 * @access  Private
 */
export declare const getAnswer: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
