"use strict";
/**
 * Modern CSRF Protection Middleware
 *
 * پیاده‌سازی مدرن محافظت در برابر حملات CSRF با استفاده از Double Submit Cookie
 * این روش امن‌تر و مدرن‌تر از کتابخانه‌های قدیمی است
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshCSRFToken = exports.clearCSRFToken = exports.provideCSRFToken = exports.validateCSRFToken = exports.setupCSRFToken = exports.CSRFConfig = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../utils/logger");
// تنظیمات CSRF
exports.CSRFConfig = {
    cookieName: 'csrf-token',
    headerName: 'x-csrf-token', // اضافه کردن headerName برای تست‌ها
    headerNames: ['x-csrf-token', 'x-xsrf-token', 'csrf-token'],
    tokenLength: 32,
    cookieOptions: {
        httpOnly: false, // باید false باشد تا فرانت‌اند بتواند بخواند
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 ساعت
    }
};
/**
 * تولید توکن CSRF امن
 */
function generateCSRFToken() {
    return crypto_1.default.randomBytes(exports.CSRFConfig.tokenLength).toString('hex');
}
/**
 * میان‌افزار تنظیم توکن CSRF
 * این میان‌افزار باید قبل از مسیرهایی که نیاز به محافظت دارند اعمال شود
 */
const setupCSRFToken = (req, res, next) => {
    try {
        // بررسی وجود توکن در کوکی
        let csrfToken = req.cookies[exports.CSRFConfig.cookieName];
        // اگر توکن وجود ندارد، یکی جدید تولید کن
        if (!csrfToken) {
            csrfToken = generateCSRFToken();
            res.cookie(exports.CSRFConfig.cookieName, csrfToken, exports.CSRFConfig.cookieOptions);
            logger_1.logger.debug('New CSRF token generated', {
                ip: req.ip,
                url: req.originalUrl
            });
        }
        // توکن را در request قرار بده تا کنترلرها بتوانند از آن استفاده کنند
        req.csrfToken = csrfToken;
        next();
    }
    catch (error) {
        logger_1.logger.error('Error in CSRF token setup:', error);
        next(error);
    }
};
exports.setupCSRFToken = setupCSRFToken;
/**
 * میان‌افزار اعتبارسنجی CSRF
 * این میان‌افزار باید برای مسیرهای POST, PUT, DELETE, PATCH اعمال شود
 */
const validateCSRFToken = (req, res, next) => {
    try {
        // روش‌های GET و OPTIONS نیاز به اعتبارسنجی CSRF ندارند
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
            return next();
        }
        // دریافت توکن از کوکی
        const cookieToken = req.cookies[exports.CSRFConfig.cookieName];
        // دریافت توکن از هدر
        let headerToken;
        for (const headerName of exports.CSRFConfig.headerNames) {
            headerToken = req.get(headerName);
            if (headerToken)
                break;
        }
        // بررسی وجود هر دو توکن
        if (!cookieToken) {
            logger_1.logger.warn('CSRF validation failed: Missing cookie token', {
                ip: req.ip,
                url: req.originalUrl,
                method: req.method
            });
            res.status(403).json({
                success: false,
                message: 'درخواست غیرمجاز: توکن امنیتی موجود نیست',
                error: 'CSRF_TOKEN_MISSING'
            });
            return;
        }
        if (!headerToken) {
            logger_1.logger.warn('CSRF validation failed: Missing header token', {
                ip: req.ip,
                url: req.originalUrl,
                method: req.method
            });
            res.status(403).json({
                success: false,
                message: 'درخواست غیرمجاز: توکن امنیتی در هدر موجود نیست',
                error: 'CSRF_HEADER_MISSING'
            });
            return;
        }
        // مقایسه امن توکن‌ها با بررسی طول
        const cookieBuffer = Buffer.from(cookieToken);
        const headerBuffer = Buffer.from(headerToken);
        // بررسی طول tokenها قبل از مقایسه
        if (cookieBuffer.length !== headerBuffer.length) {
            logger_1.logger.warn('CSRF validation failed: Token length mismatch', {
                ip: req.ip,
                url: req.originalUrl,
                method: req.method,
                cookieTokenLength: cookieBuffer.length,
                headerTokenLength: headerBuffer.length
            });
            res.status(403).json({
                success: false,
                message: 'درخواست غیرمجاز: توکن امنیتی نامعتبر',
                error: 'CSRF_TOKEN_INVALID'
            });
            return;
        }
        if (!crypto_1.default.timingSafeEqual(cookieBuffer, headerBuffer)) {
            logger_1.logger.warn('CSRF validation failed: Token mismatch', {
                ip: req.ip,
                url: req.originalUrl,
                method: req.method,
                cookieTokenLength: cookieToken.length,
                headerTokenLength: headerToken.length
            });
            res.status(403).json({
                success: false,
                message: 'درخواست غیرمجاز: توکن امنیتی نامعتبر',
                error: 'CSRF_TOKEN_INVALID'
            });
            return;
        }
        logger_1.logger.debug('CSRF validation successful', {
            ip: req.ip,
            url: req.originalUrl,
            method: req.method
        });
        next();
    }
    catch (error) {
        logger_1.logger.error('Error in CSRF validation:', error);
        res.status(500).json({
            success: false,
            message: 'خطای داخلی سرور در اعتبارسنجی امنیتی',
            error: 'CSRF_VALIDATION_ERROR'
        });
    }
};
exports.validateCSRFToken = validateCSRFToken;
/**
 * میان‌افزار ارائه توکن CSRF به کلاینت
 * این میان‌افزار برای endpoint هایی استفاده می‌شود که کلاینت نیاز به دریافت توکن دارد
 */
const provideCSRFToken = (req, res) => {
    const csrfToken = req.csrfToken || req.cookies[exports.CSRFConfig.cookieName];
    if (!csrfToken) {
        logger_1.logger.error('CSRF token not available for provision');
        res.status(500).json({
            success: false,
            message: 'خطا در تولید توکن امنیتی',
            error: 'CSRF_TOKEN_UNAVAILABLE'
        });
        return;
    }
    res.json({
        success: true,
        csrfToken,
        message: 'توکن امنیتی با موفقیت دریافت شد'
    });
};
exports.provideCSRFToken = provideCSRFToken;
/**
 * میان‌افزار حذف توکن CSRF (برای logout)
 */
const clearCSRFToken = (req, res, next) => {
    res.clearCookie(exports.CSRFConfig.cookieName, {
        path: '/',
        domain: req.hostname
    });
    logger_1.logger.debug('CSRF token cleared', {
        ip: req.ip,
        url: req.originalUrl
    });
    next();
};
exports.clearCSRFToken = clearCSRFToken;
/**
 * میان‌افزار تجدید توکن CSRF (برای عملیات حساس)
 */
const refreshCSRFToken = (req, res, next) => {
    const newToken = generateCSRFToken();
    res.cookie(exports.CSRFConfig.cookieName, newToken, exports.CSRFConfig.cookieOptions);
    req.csrfToken = newToken;
    logger_1.logger.debug('CSRF token refreshed', {
        ip: req.ip,
        url: req.originalUrl
    });
    next();
};
exports.refreshCSRFToken = refreshCSRFToken;
exports.default = {
    setupCSRFToken: exports.setupCSRFToken,
    validateCSRFToken: exports.validateCSRFToken,
    provideCSRFToken: exports.provideCSRFToken,
    clearCSRFToken: exports.clearCSRFToken,
    refreshCSRFToken: exports.refreshCSRFToken,
    CSRFConfig: exports.CSRFConfig
};
//# sourceMappingURL=csrf.middleware.js.map