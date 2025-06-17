"use strict";
/**
 * Middleware نظارت بر عملکرد API
 * ثبت متریک‌های درخواست‌ها و پاسخ‌ها
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitStatsMiddleware = exports.statsMiddleware = exports.healthCheckMiddleware = exports.errorMonitoringMiddleware = exports.monitoringMiddleware = void 0;
const monitoring_service_1 = require("../services/monitoring.service");
const logger_1 = __importDefault(require("../config/logger"));
/**
 * Middleware اصلی نظارت
 */
const monitoringMiddleware = (req, res, next) => {
    const startTime = Date.now();
    req.startTime = startTime;
    req.requestId = generateRequestId();
    // Log incoming request
    logger_1.default.info('📥 درخواست جدید:', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date().toISOString()
    });
    // Override res.json to capture response
    const originalJson = res.json;
    res.json = function (body) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const success = res.statusCode < 400;
        // Record metrics
        monitoring_service_1.monitoringService.recordRequest(success, responseTime);
        // Log response
        logger_1.default.info('📤 پاسخ ارسال شد:', {
            requestId: req.requestId,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            success,
            contentLength: JSON.stringify(body).length
        });
        // Call original json method
        return originalJson.call(this, body);
    };
    // Handle errors
    res.on('finish', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const success = res.statusCode < 400;
        if (!success) {
            logger_1.default.warn('⚠️ درخواست ناموفق:', {
                requestId: req.requestId,
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                responseTime: `${responseTime}ms`
            });
        }
    });
    next();
};
exports.monitoringMiddleware = monitoringMiddleware;
/**
 * Middleware خطایاب
 */
const errorMonitoringMiddleware = (error, req, res, next) => {
    // Record error in monitoring service
    monitoring_service_1.monitoringService.recordError(error, 'api_error');
    // Log detailed error
    logger_1.default.error('💥 خطای API:', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack
        },
        timestamp: new Date().toISOString()
    });
    next(error);
};
exports.errorMonitoringMiddleware = errorMonitoringMiddleware;
/**
 * Middleware بررسی سلامت
 */
const healthCheckMiddleware = (req, res, next) => {
    if (req.path === '/health' || req.path === '/api/health') {
        const healthReport = monitoring_service_1.monitoringService.getHealthReport();
        res.status(healthReport.status === 'critical' ? 503 : 200).json({
            success: true,
            status: healthReport.status,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            metrics: {
                memory: {
                    used: Math.round(healthReport.metrics.memory.heapUsed / 1024 / 1024),
                    total: Math.round(healthReport.metrics.memory.heapTotal / 1024 / 1024),
                    unit: 'MB'
                },
                cpu: {
                    usage: healthReport.metrics.cpu.usage,
                    loadAverage: healthReport.metrics.cpu.loadAverage
                },
                database: {
                    connected: healthReport.metrics.database.connected,
                    responseTime: healthReport.metrics.database.responseTime,
                    activeConnections: healthReport.metrics.database.activeConnections
                },
                requests: {
                    total: healthReport.metrics.requests.total,
                    successful: healthReport.metrics.requests.successful,
                    failed: healthReport.metrics.requests.failed,
                    successRate: healthReport.metrics.requests.total > 0
                        ? Math.round((healthReport.metrics.requests.successful / healthReport.metrics.requests.total) * 100)
                        : 100,
                    averageResponseTime: healthReport.metrics.requests.averageResponseTime
                },
                errors: {
                    total: healthReport.metrics.errors.count,
                    recentTypes: Object.keys(healthReport.metrics.errors.types).slice(0, 5)
                }
            },
            recommendations: healthReport.recommendations
        });
        return;
    }
    next();
};
exports.healthCheckMiddleware = healthCheckMiddleware;
/**
 * Middleware آمار API
 */
const statsMiddleware = (req, res, next) => {
    if (req.path === '/stats' || req.path === '/api/stats') {
        const currentMetrics = monitoring_service_1.monitoringService.getCurrentMetrics();
        res.json({
            success: true,
            message: 'آمار سیستم',
            data: {
                timestamp: currentMetrics.timestamp,
                system: {
                    uptime: process.uptime(),
                    platform: process.platform,
                    nodeVersion: process.version,
                    memory: {
                        heap: {
                            used: Math.round(currentMetrics.memory.heapUsed / 1024 / 1024),
                            total: Math.round(currentMetrics.memory.heapTotal / 1024 / 1024)
                        },
                        rss: Math.round(currentMetrics.memory.rss / 1024 / 1024),
                        external: Math.round(currentMetrics.memory.external / 1024 / 1024),
                        unit: 'MB'
                    },
                    cpu: currentMetrics.cpu
                },
                database: currentMetrics.database,
                api: {
                    requests: currentMetrics.requests,
                    errors: {
                        total: currentMetrics.errors.count,
                        byType: currentMetrics.errors.types,
                        recent: currentMetrics.errors.recent.slice(0, 5)
                    }
                }
            }
        });
        return;
    }
    next();
};
exports.statsMiddleware = statsMiddleware;
/**
 * تولید شناسه منحصر به فرد برای درخواست
 */
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Middleware بررسی rate limiting آماری
 */
const rateLimitStatsMiddleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `rate_${ip}`;
    // Simple in-memory rate limiting stats
    // In production, use Redis or similar
    if (!global.rateLimitStats) {
        global.rateLimitStats = new Map();
    }
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;
    const ipStats = global.rateLimitStats.get(key) || { count: 0, resetTime: now + windowMs };
    if (now > ipStats.resetTime) {
        ipStats.count = 1;
        ipStats.resetTime = now + windowMs;
    }
    else {
        ipStats.count++;
    }
    global.rateLimitStats.set(key, ipStats);
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - ipStats.count));
    res.setHeader('X-RateLimit-Reset', new Date(ipStats.resetTime).toISOString());
    if (ipStats.count > maxRequests) {
        logger_1.default.warn('🚫 محدودیت نرخ درخواست:', {
            ip,
            requests: ipStats.count,
            limit: maxRequests,
            resetTime: new Date(ipStats.resetTime).toISOString()
        });
        res.status(429).json({
            success: false,
            message: 'تعداد درخواست‌های شما از حد مجاز بیشتر است',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((ipStats.resetTime - now) / 1000)
        });
        return;
    }
    next();
};
exports.rateLimitStatsMiddleware = rateLimitStatsMiddleware;
/**
 * تمیز کردن آمار rate limiting (هر ساعت)
 */
setInterval(() => {
    if (global.rateLimitStats) {
        const now = Date.now();
        for (const [key, stats] of global.rateLimitStats.entries()) {
            if (now > stats.resetTime) {
                global.rateLimitStats.delete(key);
            }
        }
    }
}, 3600000); // Every hour 
//# sourceMappingURL=monitoring.middleware.js.map