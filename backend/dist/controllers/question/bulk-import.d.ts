/**
 * Question Bulk Import Controller
 * کنترلر بارگزاری انبوه سوالات از فایل اکسل
 *
 * ویژگی‌های اصلی:
 * - پردازش فایل‌های اکسل (.xlsx, .xls)
 * - اعتبارسنجی کامل داده‌ها
 * - پردازش ناهمزمان
 * - گزارش تفصیلی نتایج
 * - محدودیت دسترسی (طراح سوال و ادمین)
 *
 * @author Exam-Edu Platform
 * @version 1.0.0
 */
import { Request, Response } from 'express';
import multer from 'multer';
export declare const uploadMiddleware: multer.Multer;
/**
 * بارگزاری و پردازش فایل اکسل سوالات
 * POST /api/questions/bulk-upload
 */
export declare const bulkUploadQuestions: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت وضعیت پردازش
 * GET /api/questions/bulk-upload/status
 */
export declare const getBulkUploadStatus: (req: Request, res: Response) => Promise<void>;
/**
 * دانلود فایل نمونه
 * GET /api/questions/bulk-upload/template
 */
export declare const downloadTemplate: (req: Request, res: Response) => Promise<void>;
