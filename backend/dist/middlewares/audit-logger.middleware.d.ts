/**
 * Comprehensive Audit Logging Middleware
 * سیستم جامع ثبت عملیات و رویدادهای امنیتی
 */
import { Request, Response, NextFunction } from 'express';
interface AuditEvent {
    eventId: string;
    timestamp: Date;
    userId?: string;
    userEmail?: string;
    userRole?: string;
    action: string;
    resource: string;
    method: string;
    url: string;
    ip: string;
    userAgent: string;
    statusCode?: number;
    responseTime?: number;
    requestBody?: any;
    responseBody?: any;
    metadata?: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security';
}
interface RequestWithUser extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
    startTime?: number;
    auditEventId?: string;
}
/**
 * شروع audit logging برای request
 */
export declare const startAuditLog: (req: RequestWithUser, res: Response, next: NextFunction) => void;
/**
 * تکمیل audit logging برای response
 */
export declare const completeAuditLog: (req: RequestWithUser, res: Response, next: NextFunction) => void;
/**
 * ثبت رویدادهای امنیتی خاص
 */
export declare const logSecurityEvent: (eventType: string, details: Record<string, any>, req: Request, severity?: AuditEvent["severity"]) => void;
/**
 * ثبت تلاش‌های ناموفق authentication
 */
export declare const logFailedAuth: (req: Request, reason: string, email?: string) => void;
/**
 * ثبت دسترسی‌های غیرمجاز
 */
export declare const logUnauthorizedAccess: (req: Request, resource: string, requiredRole?: string) => void;
/**
 * ثبت تلاش‌های مشکوک
 */
export declare const logSuspiciousActivity: (req: Request, activityType: string, details: Record<string, any>) => void;
export declare const auditLogger: {
    startAuditLog: (req: RequestWithUser, res: Response, next: NextFunction) => void;
    completeAuditLog: (req: RequestWithUser, res: Response, next: NextFunction) => void;
    logSecurityEvent: (eventType: string, details: Record<string, any>, req: Request, severity?: AuditEvent["severity"]) => void;
    logFailedAuth: (req: Request, reason: string, email?: string) => void;
    logUnauthorizedAccess: (req: Request, resource: string, requiredRole?: string) => void;
    logSuspiciousActivity: (req: Request, activityType: string, details: Record<string, any>) => void;
};
export {};
