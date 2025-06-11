/**
 * Question Controller
 * کنترلر مدیریت سوالات
 *
 * ویژگی‌های اصلی:
 * - CRUD کامل سوالات
 * - ذخیره لحظه‌ای (Auto-save)
 * - جستجوی پیشرفته
 * - اعتبارسنجی 4 گزینه
 */
import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
declare class QuestionController {
    /**
     * Create a new question
     * POST /api/questions
     */
    static create(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get all questions with filtering and pagination
     * GET /api/questions
     */
    static list(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get a single question by ID
     * GET /api/questions/:id
     */
    static getById(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Update a question
     * PUT /api/questions/:id
     */
    static update(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Delete a question
     * DELETE /api/questions/:id
     */
    static delete(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Auto-save question (real-time save)
     * PATCH /api/questions/:id/auto-save
     */
    static autoSave(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Publish a question
     * PATCH /api/questions/:id/publish
     */
    static publish(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Unpublish a question
     * PATCH /api/questions/:id/unpublish
     */
    static unpublish(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Validate question data without saving
     * POST /api/questions/validate
     */
    static validate(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Duplicate a question
     * POST /api/questions/:id/duplicate
     */
    static duplicate(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Search questions by text
     * GET /api/questions/search
     */
    static search(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get available tags
     * GET /api/questions/tags
     */
    static getTags(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get available categories
     * GET /api/questions/categories
     */
    static getCategories(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get question statistics
     * GET /api/questions/stats
     */
    static getStats(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export default QuestionController;
