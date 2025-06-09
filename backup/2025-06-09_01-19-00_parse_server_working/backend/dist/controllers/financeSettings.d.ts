/**
 * Finance Settings Controller
 * کنترلر تنظیمات مالی برای مدیریت سهم‌بندی درآمد و تنظیمات مالی
 *
 * ویژگی‌های اصلی:
 * - مدیریت سهم طراحان و پلتفرم
 * - تنظیمات قیمت‌گذاری
 * - مدیریت تخفیف‌ها
 * - تنظیمات خاص هر آزمون
 *
 * @author Exam-Edu Platform
 * @version 1.0.0
 */
import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: any;
}
export declare const DEFAULT_FINANCE_SETTINGS: {
    revenueSharing: {
        designerShare: number;
        platformFee: number;
    };
    pricing: {
        exam: {
            '10-20': number;
            '21-30': number;
            '31-50': number;
        };
        flashcard: {
            default: number;
            min: number;
            max: number;
        };
    };
    discounts: {
        firstTime: number;
        bulkPurchase: number;
        student: number;
        seasonal: number;
    };
    limits: {
        minPrice: number;
        maxPrice: number;
    };
};
export declare class FinanceSettingsController {
    /**
     * Get global finance settings
     * GET /api/finance-settings/global
     */
    static getGlobalSettings(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Update global finance settings
     * PUT /api/finance-settings/global
     */
    static updateGlobalSettings(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get exam-specific finance settings
     * GET /api/finance-settings/exam/:examId
     */
    static getExamSettings(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Set exam-specific finance settings
     * PUT /api/finance-settings/exam/:examId
     */
    static setExamSettings(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Reset exam settings to global defaults
     * DELETE /api/finance-settings/exam/:examId
     */
    static resetExamSettings(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get all exams with custom finance settings
     * GET /api/finance-settings/custom-exams
     */
    static getCustomExams(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Calculate revenue sharing for a specific amount
     * POST /api/finance-settings/calculate-sharing
     */
    static calculateSharing(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export {};
