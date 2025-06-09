/**
 * Test Exam CRUD Controller
 * کنترلر عملیات CRUD آزمون‌های تستی
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
export declare class TestExamCrudController {
    /**
     * Create a new test exam
     * POST /api/test-exams
     */
    static create(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get all test exams with filtering and pagination
     * GET /api/test-exams
     */
    static list(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get a single test exam by ID
     * GET /api/test-exams/:id
     */
    static getById(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Update a test exam
     * PUT /api/test-exams/:id
     */
    static update(req: AuthenticatedRequest, res: Response): Promise<void>;
}
