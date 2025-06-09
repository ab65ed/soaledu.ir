"use strict";
/**
 * Enterprise Security Logger
 * Comprehensive logging for security monitoring and audit trails
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.errorLogger = exports.requestLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
// ============================= LOG LEVELS ============================= //
const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};
const LOG_COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'grey',
    debug: 'white',
    silly: 'rainbow'
};
winston_1.default.addColors(LOG_COLORS);
// ============================= FORMATTERS ============================= //
// Security log format (structured for SIEM systems)
const securityFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level: level.toUpperCase(),
        message,
        ...meta,
        // Add security-specific fields
        eventType: meta.eventType || 'general',
        severity: getSeverityLevel(level),
        source: 'exam-edu-backend'
    });
}));
// Console format (human-readable for development)
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
}));
// ============================= HELPER FUNCTIONS ============================= //
function getSeverityLevel(level) {
    switch (level) {
        case 'error': return 'HIGH';
        case 'warn': return 'MEDIUM';
        case 'info': return 'LOW';
        default: return 'INFO';
    }
}
function sanitizeForLogging(data) {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const sensitiveFields = [
        'password', 'confirmPassword', 'token', 'accessToken',
        'refreshToken', 'apiKey', 'secret', 'privateKey',
        'authorization', 'cookie', 'session'
    ];
    const sanitized = { ...data };
    function recursiveSanitize(obj, path = '') {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        for (const key in obj) {
            const fullPath = path ? `${path}.${key}` : key;
            const lowerKey = key.toLowerCase();
            if (sensitiveFields.some(field => lowerKey.includes(field))) {
                obj[key] = '[REDACTED]';
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                obj[key] = recursiveSanitize(obj[key], fullPath);
            }
        }
        return obj;
    }
    return recursiveSanitize(sanitized);
}
// ============================= TRANSPORTS ============================= //
const logDir = path_1.default.join(process.cwd(), 'logs');
// General application logs
const generalFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '30d',
    format: securityFormat,
    level: 'info'
});
// Security-specific logs
const securityFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logDir, 'security-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '100m',
    maxFiles: '90d', // Keep security logs longer
    format: securityFormat,
    level: 'warn' // Only warnings and errors
});
// Error logs
const errorFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '90d',
    format: securityFormat,
    level: 'error'
});
// Audit trail for compliance
const auditFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logDir, 'audit-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '100m',
    maxFiles: '365d', // Keep audit logs for 1 year
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston_1.default.format.json())
});
// Console transport for development
const consoleTransport = new winston_1.default.transports.Console({
    format: consoleFormat,
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
});
// ============================= LOGGER CONFIGURATION ============================= //
const logger = winston_1.default.createLogger({
    levels: LOG_LEVELS,
    transports: [
        generalFileTransport,
        securityFileTransport,
        errorFileTransport,
        auditFileTransport,
        consoleTransport
    ],
    exitOnError: false, // Don't crash on unhandled exceptions
    handleExceptions: true,
    handleRejections: true
});
exports.logger = logger;
// Security event logger
logger.security = (message, event) => {
    const sanitizedEvent = sanitizeForLogging(event);
    logger.warn(message, {
        ...sanitizedEvent,
        category: 'SECURITY',
        timestamp: new Date().toISOString()
    });
};
// Audit trail logger
logger.audit = (message, event) => {
    const sanitizedEvent = sanitizeForLogging(event);
    auditFileTransport.write({
        level: 'info',
        message,
        ...sanitizedEvent,
        category: 'AUDIT',
        timestamp: new Date().toISOString()
    });
};
// Authentication events
logger.auth = {
    success: (userId, ip, userAgent, requestId) => {
        logger.security('Authentication successful', {
            eventType: 'authentication',
            action: 'login_success',
            userId,
            ip,
            userAgent,
            requestId,
            success: true
        });
    },
    failure: (email, ip, reason, userAgent, requestId) => {
        logger.security('Authentication failed', {
            eventType: 'authentication',
            action: 'login_failure',
            ip,
            userAgent,
            requestId,
            success: false,
            metadata: { email: sanitizeForLogging(email), reason }
        });
    },
    logout: (userId, ip, userAgent, requestId) => {
        logger.security('User logout', {
            eventType: 'authentication',
            action: 'logout',
            userId,
            ip,
            userAgent,
            requestId,
            success: true
        });
    },
    register: (userId, email, ip, userAgent, requestId) => {
        logger.audit('User registration', {
            eventType: 'user_action',
            action: 'register',
            userId,
            ip,
            requestId,
            metadata: { email: sanitizeForLogging(email), userAgent }
        });
    }
};
// Authorization events
logger.authz = {
    denied: (userId, resource, action, ip, requestId) => {
        logger.security('Access denied', {
            eventType: 'authorization',
            action: 'access_denied',
            userId,
            resource,
            ip,
            requestId,
            success: false,
            metadata: { attempted_action: action }
        });
    },
    granted: (userId, resource, action, ip, requestId) => {
        logger.audit('Access granted', {
            eventType: 'user_action',
            action: 'access_granted',
            userId,
            resource,
            ip,
            requestId,
            metadata: { granted_action: action }
        });
    }
};
// Validation and injection attempts
logger.validation = {
    failed: (ip, errors, url, userAgent, requestId) => {
        logger.security('Validation failed', {
            eventType: 'validation',
            action: 'validation_failure',
            ip,
            userAgent,
            requestId,
            resource: url,
            success: false,
            metadata: { errors: sanitizeForLogging(errors) }
        });
    },
    injectionAttempt: (ip, type, payload, url, userAgent, requestId) => {
        logger.security('Injection attempt detected', {
            eventType: 'injection',
            action: `${type}_injection_attempt`,
            ip,
            userAgent,
            requestId,
            resource: url,
            success: false,
            metadata: {
                injection_type: type,
                payload: payload.substring(0, 100) // Limit payload size in logs
            }
        });
    }
};
// Rate limiting events
logger.rateLimit = {
    exceeded: (ip, endpoint, limit, userAgent, requestId) => {
        logger.security('Rate limit exceeded', {
            eventType: 'rateLimit',
            action: 'rate_limit_exceeded',
            ip,
            userAgent,
            requestId,
            resource: endpoint,
            success: false,
            metadata: { limit, window: '15m' }
        });
    }
};
// Suspicious activity
logger.suspicious = {
    activity: (ip, description, metadata = {}, userAgent, requestId) => {
        logger.security('Suspicious activity detected', {
            eventType: 'suspicious',
            action: 'suspicious_activity',
            ip,
            userAgent,
            requestId,
            success: false,
            metadata: {
                description,
                ...sanitizeForLogging(metadata)
            }
        });
    },
    botDetected: (ip, method, userAgent, requestId, metadata) => {
        logger.security('Bot detected', {
            eventType: 'suspicious',
            action: 'bot_detected',
            ip,
            userAgent,
            requestId,
            success: false,
            metadata: {
                detection_method: method,
                ...sanitizeForLogging(metadata)
            }
        });
    }
};
// ============================= REQUEST LOGGER ============================= //
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    // Log request start
    logger.http('HTTP Request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
    // Log response
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'http';
        logger.log(logLevel, 'HTTP Response', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            requestId: req.requestId,
            timestamp: new Date().toISOString()
        });
    });
    next();
};
exports.requestLogger = requestLogger;
// ============================= ERROR LOGGER ============================= //
const errorLogger = (error, req, res, next) => {
    logger.error('Unhandled error', {
        message: error.message,
        stack: error.stack,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
    next(error);
};
exports.errorLogger = errorLogger;
exports.default = logger;
//# sourceMappingURL=logger.js.map