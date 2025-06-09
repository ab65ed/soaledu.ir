/**
 * Scalability Controller
 *
 * Handles database optimization, indexing, and performance monitoring
 */
import { Request, Response } from 'express';
/**
 * دریافت نمای کلی مقیاس‌پذیری
 */
export declare const getScalabilityOverview: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت لیست ایندکس‌ها
 */
export declare const getIndexes: (req: Request, res: Response) => Promise<void>;
/**
 * ایجاد ایندکس جدید
 */
export declare const createIndex: (req: Request, res: Response) => Promise<void>;
/**
 * حذف ایندکس
 */
export declare const deleteIndex: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت پیشنهادات بهینه‌سازی
 */
export declare const getOptimizationSuggestions: (req: Request, res: Response) => Promise<void>;
/**
 * اجرای پیشنهاد بهینه‌سازی
 */
export declare const implementSuggestion: (req: Request, res: Response) => Promise<void>;
/**
 * رد پیشنهاد بهینه‌سازی
 */
export declare const rejectSuggestion: (req: Request, res: Response) => Promise<void>;
/**
 * تولید پیشنهادات جدید بر اساس الگوهای کوئری
 */
export declare const generateSuggestions: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت متریک‌های عملکرد
 */
export declare const getPerformanceMetrics: (req: Request, res: Response) => Promise<void>;
