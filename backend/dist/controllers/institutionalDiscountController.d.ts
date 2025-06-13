/**
 * Institutional Discount Controller
 *
 * کنترلر مدیریت تخفیف‌های سازمانی برای بارگذاری و پردازش فایل‌های اکسل
 */
import { Request, Response } from 'express';
import multer from 'multer';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare const upload: multer.Multer;
/**
 * بارگذاری فایل اکسل تخفیف‌های سازمانی
 * POST /api/admin/institutional-discounts/upload
 */
export declare const uploadInstitutionalDiscountList: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت لیست گروه‌های تخفیف سازمانی
 * GET /api/admin/institutional-discounts/groups
 */
export declare const getInstitutionalDiscountGroups: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت جزئیات یک گروه تخفیف
 * GET /api/admin/institutional-discounts/groups/:id
 */
export declare const getInstitutionalDiscountGroupById: (req: Request, res: Response) => Promise<void>;
/**
 * حذف گروه تخفیف (غیرفعال کردن)
 * DELETE /api/admin/institutional-discounts/groups/:id
 */
export declare const deleteInstitutionalDiscountGroup: (req: Request, res: Response) => Promise<void>;
/**
 * گزارش استفاده از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/usage
 */
export declare const getUsageReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * گزارش درآمد از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/revenue
 */
export declare const getRevenueReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * گزارش نرخ تبدیل (Conversion Rate)
 * GET /api/admin/institutional-discounts/reports/conversion
 */
export declare const getConversionReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * گزارش مقایسه‌ای گروه‌های تخفیف
 * GET /api/admin/institutional-discounts/reports/comparison
 */
export declare const getComparisonReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
