/**
 * Enterprise Security Logger
 * Comprehensive logging for security monitoring and audit trails
 */
import winston from 'winston';
import { Request } from 'express';
declare const logger: winston.Logger;
interface SecurityEvent {
    eventType: 'authentication' | 'authorization' | 'validation' | 'injection' | 'rateLimit' | 'suspicious';
    action: string;
    ip?: string;
    userAgent?: string;
    userId?: string;
    requestId?: string;
    resource?: string;
    success?: boolean;
    metadata?: any;
}
interface AuditEvent {
    eventType: 'user_action' | 'admin_action' | 'system_action' | 'data_access';
    action: string;
    userId?: string;
    ip?: string;
    resource?: string;
    before?: any;
    after?: any;
    requestId?: string;
    metadata?: any;
}
export declare const requestLogger: (req: Request, res: any, next: any) => void;
export declare const errorLogger: (error: Error, req: Request, res: any, next: any) => void;
export { logger };
export default logger;
declare module 'winston' {
    interface Logger {
        security: (message: string, event: SecurityEvent) => void;
        audit: (message: string, event: AuditEvent) => void;
        auth: {
            success: (userId: string, ip: string, userAgent?: string, requestId?: string) => void;
            failure: (email: string, ip: string, reason: string, userAgent?: string, requestId?: string) => void;
            logout: (userId: string, ip: string, userAgent?: string, requestId?: string) => void;
            register: (userId: string, email: string, ip: string, userAgent?: string, requestId?: string) => void;
        };
        authz: {
            denied: (userId: string, resource: string, action: string, ip: string, requestId?: string) => void;
            granted: (userId: string, resource: string, action: string, ip: string, requestId?: string) => void;
        };
        validation: {
            failed: (ip: string, errors: any[], url: string, userAgent?: string, requestId?: string) => void;
            injectionAttempt: (ip: string, type: string, payload: string, url: string, userAgent?: string, requestId?: string) => void;
        };
        rateLimit: {
            exceeded: (ip: string, endpoint: string, limit: number, userAgent?: string, requestId?: string) => void;
        };
        suspicious: {
            activity: (ip: string, description: string, metadata?: any, userAgent?: string, requestId?: string) => void;
            botDetected: (ip: string, method: string, userAgent?: string, requestId?: string, metadata?: any) => void;
        };
    }
}
declare global {
    namespace Express {
        interface Request {
            requestId?: string;
        }
    }
}
