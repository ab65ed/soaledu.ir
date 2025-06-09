import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: any;
}
/**
 * کنترلر مدیریت خرید آزمون‌ها
 * مدیریت کش هوشمند برای خرید و تکرار آزمون‌ها
 */
export declare class ExamPurchaseManagementController {
    /**
     * دریافت آمار کش خرید آزمون‌ها
     * GET /api/exam-purchase/cache-stats
     */
    static getCacheStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * دریافت آمار خرید کاربر برای درس خاص
     * GET /api/exam-purchase/user-stats/:userId/:subjectId
     */
    static getUserPurchaseStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * دریافت آمار تکرار آزمون
     * GET /api/exam-purchase/repetition-stats/:userId/:examId
     */
    static getExamRepetitionStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * تولید سوالات آزمون (خرید جدید یا تکرار)
     * POST /api/exam-purchase/generate-questions
     */
    static generateExamQuestions(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * ثبت خرید جدید آزمون
     * POST /api/exam-purchase/record-purchase
     */
    static recordExamPurchase(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * پاک کردن کل کش (فقط ادمین)
     * DELETE /api/exam-purchase/clear-cache
     */
    static clearAllCaches(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * پاک کردن کش مربوط به درس خاص
     * DELETE /api/exam-purchase/clear-cache/:subjectId
     */
    static clearSubjectCache(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * پیش‌گرم کردن کش برای دروس پرطرفدار
     * POST /api/exam-purchase/warmup-cache
     */
    static warmupCache(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * دریافت لیست آزمون‌های خریداری شده کاربر
     * GET /api/exam-purchase/user-exams/:userId
     */
    static getUserPurchasedExams(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * تست عملکرد کش
     * POST /api/exam-purchase/test-performance
     */
    static testCachePerformance(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export default ExamPurchaseManagementController;
