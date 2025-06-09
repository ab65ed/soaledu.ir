/**
 * Question Controller
 * کنترلر مدیریت سوالات با قابلیت ذخیره لحظه‌ای و اعتبارسنجی
 *
 * ویژگی‌های اصلی:
 * - CRUD کامل سوالات
 * - ذخیره لحظه‌ای (Auto-save)
 * - جستجوی پیشرفته
 * - اعتبارسنجی 4 گزینه
 * - صفحه منبع اختیاری
 */
declare class QuestionController {
    /**
     * Create a new question
     * POST /api/questions
     */
    static create(req: any, res: any): Promise<any>;
    /**
     * Get all questions with filtering and pagination
     * GET /api/questions
     */
    static list(req: any, res: any): Promise<void>;
    /**
     * Get a single question by ID
     * GET /api/questions/:id
     */
    static getById(req: any, res: any): Promise<any>;
    /**
     * Update a question
     * PUT /api/questions/:id
     */
    static update(req: any, res: any): Promise<any>;
    /**
     * Delete a question
     * DELETE /api/questions/:id
     */
    static delete(req: any, res: any): Promise<any>;
    /**
     * Auto-save question (real-time save)
     * PATCH /api/questions/:id/auto-save
     */
    static autoSave(req: any, res: any): Promise<any>;
    /**
     * Publish a question
     * PATCH /api/questions/:id/publish
     */
    static publish(req: any, res: any): Promise<any>;
    /**
     * Unpublish a question
     * PATCH /api/questions/:id/unpublish
     */
    static unpublish(req: any, res: any): Promise<any>;
    /**
     * Search questions
     * GET /api/questions/search
     */
    static search(req: any, res: any): Promise<any>;
    /**
     * Get question statistics
     * GET /api/questions/stats
     */
    static getStats(req: any, res: any): Promise<any>;
    /**
     * Get available tags
     * GET /api/questions/tags
     */
    static getTags(req: any, res: any): Promise<void>;
    /**
     * Get categories
     * GET /api/questions/categories
     */
    static getCategories(req: any, res: any): Promise<void>;
    /**
     * Validate question data
     * POST /api/questions/validate
     */
    static validate(req: any, res: any): Promise<void>;
    /**
     * Duplicate a question
     * POST /api/questions/:id/duplicate
     */
    static duplicate(req: any, res: any): Promise<any>;
}
export default QuestionController;
