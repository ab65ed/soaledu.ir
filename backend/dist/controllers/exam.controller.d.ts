/**
 * Exam controller
 *
 * This file contains controller functions for exam routes.
 */
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../types';
/**
 * @desc    Create a new exam
 * @route   POST /api/v1/exams
 * @access  Private
 */
export declare const createExam: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Get all exams for current user
 * @route   GET /api/v1/exams
 * @access  Private
 */
export declare const getExams: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Get a single exam with questions
 * @route   GET /api/v1/exams/:id
 * @access  Private
 */
export declare const getExam: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Complete an exam
 * @route   PUT /api/v1/exams/:id/complete
 * @access  Private
 */
export declare const completeExam: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
