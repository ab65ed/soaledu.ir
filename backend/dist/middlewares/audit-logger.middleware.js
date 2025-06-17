"use strict";
/**
 * Comprehensive Audit Logging Middleware
 * سیستم جامع ثبت عملیات و رویدادهای امنیتی
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = exports.logSuspiciousActivity = exports.logUnauthorizedAccess = exports.logFailedAuth = exports.logSecurityEvent = exports.completeAuditLog = exports.startAuditLog = void 0;
const logger_1 = require("../utils/logger");
const crypto_1 = __importDefault(require("crypto"));
// ============================= Configuration ============================= //
const AUDIT_CONFIG = {
    // عملیات‌هایی که باید ثبت شوند
    CRITICAL_ACTIONS: [
        'login', 'logout', 'register', 'password_change', 'password_reset',
        'role_change', 'permission_change', 'user_delete', 'user_create',
        'exam_create', 'exam_delete', 'exam_publish', 'question_create',
        'question_delete', 'payment_process', 'data_export', 'system_config'
    ],
    // URL patterns که باید ثبت شوند
    MONITORED_PATTERNS: [
        /^\/api\/auth\/.*/,
        /^\/api\/admin\/.*/,
        /^\/api\/users\/.*/,
        /^\/api\/exams\/.*/,
        /^\/api\/questions\/.*/,
        /^\/api\/payments\/.*/,
        /^\/api\/reports\/.*/
    ],
    // فیلدهایی که نباید در log ثبت شوند
    SENSITIVE_FIELDS: [
        'password', 'confirmPassword', 'token', 'refreshToken',
        'creditCard', 'cvv', 'bankAccount', 'nationalCode'
    ],
    // حداکثر اندازه request/response body برای ثبت
    MAX_BODY_SIZE: 10000 // 10KB
};
// ============================= Helper Functions ============================= //
/**
 * پاکسازی داده‌های حساس از object
 */
function sanitizeData(data) {
    if (!data || typeof data !== 'object') {
        return data;
    }
    const sanitized = { ...data };
    AUDIT_CONFIG.SENSITIVE_FIELDS.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });
    // پاکسازی nested objects
    Object.keys(sanitized).forEach(key => {
        if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeData(sanitized[key]);
        }
    });
    return sanitized;
}
/**
 * تعیین severity بر اساس action و status code
 */
function determineSeverity(action, statusCode, method) {
    // عملیات‌های بحرانی
    if (AUDIT_CONFIG.CRITICAL_ACTIONS.includes(action)) {
        return 'critical';
    }
    // خطاهای امنیتی
    if (statusCode === 401 || statusCode === 403) {
        return 'high';
    }
    // خطاهای سرور
    if (statusCode >= 500) {
        return 'high';
    }
    // خطاهای کلاینت
    if (statusCode >= 400) {
        return 'medium';
    }
    // عملیات‌های تغییر داده
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        return 'medium';
    }
    return 'low';
}
/**
 * تعیین category بر اساس URL و action
 */
function determineCategory(url, action) {
    if (url.includes('/auth/') || ['login', 'logout', 'register'].includes(action)) {
        return 'authentication';
    }
    if (url.includes('/admin/') || action.includes('role') || action.includes('permission')) {
        return 'authorization';
    }
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(action)) {
        return 'data_modification';
    }
    if (url.includes('/reports/') || url.includes('/export/')) {
        return 'data_access';
    }
    if (url.includes('/system/') || url.includes('/config/')) {
        return 'system';
    }
    return 'security';
}
/**
 * استخراج action از URL و method
 */
function extractAction(url, method) {
    const pathParts = url.split('/').filter(part => part && part !== 'api');
    if (pathParts.length === 0) {
        return method.toLowerCase();
    }
    const resource = pathParts[0];
    const operation = pathParts[1];
    // عملیات‌های خاص
    const actionMap = {
        'POST /auth/login': 'login',
        'POST /auth/logout': 'logout',
        'POST /auth/register': 'register',
        'POST /auth/forgot-password': 'password_reset_request',
        'POST /auth/reset-password': 'password_reset',
        'PUT /auth/change-password': 'password_change',
        'POST /exams': 'exam_create',
        'DELETE /exams': 'exam_delete',
        'POST /questions': 'question_create',
        'DELETE /questions': 'question_delete',
        'POST /payments': 'payment_process'
    };
    const key = `${method} /${resource}${operation ? '/' + operation : ''}`;
    return actionMap[key] || `${method.toLowerCase()}_${resource}`;
}
// ============================= Middleware Functions ============================= //
/**
 * شروع audit logging برای request
 */
const startAuditLog = (req, res, next) => {
    // تولید شناسه یکتا برای این درخواست
    req.auditEventId = crypto_1.default.randomUUID();
    req.startTime = Date.now();
    // بررسی اینکه آیا این URL باید monitor شود
    const shouldMonitor = AUDIT_CONFIG.MONITORED_PATTERNS.some(pattern => pattern.test(req.url));
    if (shouldMonitor) {
        // ثبت شروع درخواست
        logger_1.logger.info('Request started', {
            eventId: req.auditEventId,
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
    }
    next();
};
exports.startAuditLog = startAuditLog;
/**
 * تکمیل audit logging برای response
 */
const completeAuditLog = (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    let responseBody;
    // Override کردن res.send برای capture کردن response
    res.send = function (body) {
        responseBody = body;
        return originalSend.call(this, body);
    };
    // Override کردن res.json برای capture کردن response
    res.json = function (body) {
        responseBody = body;
        return originalJson.call(this, body);
    };
    // ثبت audit log در پایان response
    res.on('finish', () => {
        const shouldMonitor = AUDIT_CONFIG.MONITORED_PATTERNS.some(pattern => pattern.test(req.url));
        if (!shouldMonitor) {
            return;
        }
        const responseTime = req.startTime ? Date.now() - req.startTime : 0;
        const action = extractAction(req.url, req.method);
        const severity = determineSeverity(action, res.statusCode, req.method);
        const category = determineCategory(req.url, action);
        const auditEvent = {
            eventId: req.auditEventId || crypto_1.default.randomUUID(),
            timestamp: new Date(),
            userId: req.user?.id,
            userEmail: req.user?.email,
            userRole: req.user?.role,
            action,
            resource: req.url.split('/')[2] || 'unknown',
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent') || 'unknown',
            statusCode: res.statusCode,
            responseTime,
            requestBody: req.body ? sanitizeData(req.body) : undefined,
            responseBody: responseBody ? sanitizeData(responseBody) : undefined,
            severity,
            category,
            metadata: {
                contentType: req.get('Content-Type'),
                contentLength: req.get('Content-Length'),
                referer: req.get('Referer'),
                origin: req.get('Origin')
            }
        };
        // محدود کردن اندازه body ها
        if (JSON.stringify(auditEvent.requestBody || {}).length > AUDIT_CONFIG.MAX_BODY_SIZE) {
            auditEvent.requestBody = '[BODY_TOO_LARGE]';
        }
        if (JSON.stringify(auditEvent.responseBody || {}).length > AUDIT_CONFIG.MAX_BODY_SIZE) {
            auditEvent.responseBody = '[BODY_TOO_LARGE]';
        }
        // ثبت در log با سطح مناسب
        switch (severity) {
            case 'critical':
                logger_1.logger.error('Critical audit event', auditEvent);
                break;
            case 'high':
                logger_1.logger.warn('High severity audit event', auditEvent);
                break;
            case 'medium':
                logger_1.logger.info('Medium severity audit event', auditEvent);
                break;
            default:
                logger_1.logger.debug('Low severity audit event', auditEvent);
        }
        // در production، می‌توان این داده‌ها را به سیستم‌های مانیتورینگ خارجی نیز ارسال کرد
        // مثل Elasticsearch، Splunk، یا سرویس‌های cloud monitoring
    });
    next();
};
exports.completeAuditLog = completeAuditLog;
/**
 * ثبت رویدادهای امنیتی خاص
 */
const logSecurityEvent = (eventType, details, req, severity = 'high') => {
    const securityEvent = {
        eventId: crypto_1.default.randomUUID(),
        timestamp: new Date(),
        action: eventType,
        ip: req.ip,
        userAgent: req.get('User-Agent') || 'unknown',
        url: req.url,
        method: req.method,
        severity,
        category: 'security',
        metadata: sanitizeData(details)
    };
    logger_1.logger.warn('Security event detected', securityEvent);
};
exports.logSecurityEvent = logSecurityEvent;
/**
 * ثبت تلاش‌های ناموفق authentication
 */
const logFailedAuth = (req, reason, email) => {
    (0, exports.logSecurityEvent)('failed_authentication', {
        reason,
        email: email || 'unknown',
        timestamp: new Date().toISOString()
    }, req, 'high');
};
exports.logFailedAuth = logFailedAuth;
/**
 * ثبت دسترسی‌های غیرمجاز
 */
const logUnauthorizedAccess = (req, resource, requiredRole) => {
    (0, exports.logSecurityEvent)('unauthorized_access', {
        resource,
        requiredRole,
        userRole: req.user?.role,
        userId: req.user?.id,
        timestamp: new Date().toISOString()
    }, req, 'high');
};
exports.logUnauthorizedAccess = logUnauthorizedAccess;
/**
 * ثبت تلاش‌های مشکوک
 */
const logSuspiciousActivity = (req, activityType, details) => {
    (0, exports.logSecurityEvent)('suspicious_activity', {
        activityType,
        ...details,
        timestamp: new Date().toISOString()
    }, req, 'critical');
};
exports.logSuspiciousActivity = logSuspiciousActivity;
// ============================= Export ============================= //
exports.auditLogger = {
    startAuditLog: exports.startAuditLog,
    completeAuditLog: exports.completeAuditLog,
    logSecurityEvent: exports.logSecurityEvent,
    logFailedAuth: exports.logFailedAuth,
    logUnauthorizedAccess: exports.logUnauthorizedAccess,
    logSuspiciousActivity: exports.logSuspiciousActivity
};
//# sourceMappingURL=audit-logger.middleware.js.map