import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: any;
}
/**
 * کنترلر مدیریت کش
 * برای نظارت و کنترل کش سوالات
 */
export declare class CacheManagementController {
    /**
     * دریافت آمار کش
     * GET /api/cache/stats
     */
    static getCacheStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * دریافت آمار attempt کاربر خاص
     * GET /api/cache/user-attempts/:userId/:examId
     */
    static getUserAttemptStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * پاک کردن کل کش
     * DELETE /api/cache/clear
     */
    static clearCache(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * پاک کردن کش دسته‌بندی خاص
     * DELETE /api/cache/clear/:category
     */
    static clearCacheByCategory(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * پیش‌گرم کردن کش برای دسته‌بندی‌های پرطرفدار
     * POST /api/cache/warmup
     */
    static warmupCache(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * تولید پیشنهادات بهینه‌سازی کش
     */
    private static generateRecommendations;
    /**
     * دریافت جزئیات pool های کش
     * GET /api/cache/pools
     */
    static getCachePools(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export default CacheManagementController;
