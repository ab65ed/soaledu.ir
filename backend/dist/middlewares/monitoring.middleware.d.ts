/**
 * Middleware نظارت بر عملکرد API
 * ثبت متریک‌های درخواست‌ها و پاسخ‌ها
 */
import { Request, Response, NextFunction } from 'express';
interface MonitoringRequest extends Request {
    startTime?: number;
    requestId?: string;
}
/**
 * Middleware اصلی نظارت
 */
export declare const monitoringMiddleware: (req: MonitoringRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware خطایاب
 */
export declare const errorMonitoringMiddleware: (error: Error, req: MonitoringRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware بررسی سلامت
 */
export declare const healthCheckMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware آمار API
 */
export declare const statsMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware بررسی rate limiting آماری
 */
export declare const rateLimitStatsMiddleware: (req: MonitoringRequest, res: Response, next: NextFunction) => void;
export {};
