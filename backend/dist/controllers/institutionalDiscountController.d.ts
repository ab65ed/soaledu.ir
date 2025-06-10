/**
 * Institutional Discount Controller
 *
 * کنترلر مدیریت تخفیف‌های سازمانی برای بارگذاری و پردازش فایل‌های اکسل
 */
import { Request, Response } from 'express';
import multer from 'multer';
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
