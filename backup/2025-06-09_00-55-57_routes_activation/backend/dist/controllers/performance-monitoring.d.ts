/**
 * Performance Monitoring Controller
 *
 * کنترلر مانیتورینگ عملکرد برای course-exam، question و A/B testing
 */
import { Request, Response } from 'express';
/**
 * دریافت آمار عملکرد کلی سیستم
 */
export declare const getSystemPerformance: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت آمار عملکرد A/B Testing
 */
export declare const getABTestPerformance: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت پیشنهادات بهینه‌سازی
 */
export declare const getOptimizationSuggestions: (req: Request, res: Response) => Promise<void>;
/**
 * اعمال پیشنهاد بهینه‌سازی
 */
export declare const applyOptimization: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * دریافت آمار استفاده از ایندکس‌ها
 */
export declare const getIndexUsageStats: (req: Request, res: Response) => Promise<void>;
