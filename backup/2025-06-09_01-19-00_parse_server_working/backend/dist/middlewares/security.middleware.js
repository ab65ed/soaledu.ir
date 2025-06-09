"use strict";
/**
 * Enterprise Security Middleware
 * Comprehensive protection against common attacks and vulnerabilities
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySecurity = exports.validateContentType = exports.securityLogger = exports.handleValidationErrors = exports.timingCheck = exports.honeypotCheck = exports.requestId = exports.loginValidation = exports.registerValidation = exports.hppMiddleware = exports.mongoSanitizeMiddleware = exports.passwordResetRateLimit = exports.registerRateLimit = exports.authRateLimit = exports.generalRateLimit = exports.corsMiddleware = exports.securityHeaders = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../utils/logger");
// ============================= CONSTANTS ============================= //
const RATE_LIMIT_CONFIG = {
    // General API rate limiting
    general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.',
        standardHeaders: true,
        legacyHeaders: false,
    },
    // Authentication endpoints (stricter)
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 attempts per window
        message: 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً 15 دقیقه صبر کنید.',
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true, // Don't count successful requests
    },
    // Registration endpoint
    register: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3, // 3 registrations per hour per IP
        message: 'تعداد ثبت‌نام‌های شما بیش از حد مجاز است. لطفاً یک ساعت صبر کنید.',
        standardHeaders: true,
        legacyHeaders: false,
    },
    // Password reset
    passwordReset: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3, // 3 password reset attempts per hour
        message: 'تعداد درخواست‌های بازیابی رمز عبور بیش از حد مجاز است.',
        standardHeaders: true,
        legacyHeaders: false,
    }
};
// Disposable email domains (should be fetched from external service in production)
const DISPOSABLE_EMAIL_DOMAINS = new Set([
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', 'throwaway.email', 'tempmail.plus',
    'mohmal.com', 'yopmail.com', 'maildrop.cc', '33mail.com',
    'tempmail.net', 'guerrillamailblock.com', 'sharklasers.com',
    'grr.la', 'guerrillamail.de', 'guerrillamail.net'
]);
// Common weak passwords
const WEAK_PASSWORDS = new Set([
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', '123123',
    'پسورد', 'رمزعبور', '۱۲۳۴۵۶', 'admin123', 'test123',
    'passw0rd', 'p@ssword', '1234567890', 'qwerty123'
]);
// ============================= SECURITY HEADERS ============================= //
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false, // Disable for development
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});
// ============================= CORS CONFIGURATION ============================= //
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://exam-edu.com', // Replace with your domain
        ];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            logger_1.logger.warn('CORS blocked request from origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'X-Rate-Limit-Remaining']
};
exports.corsMiddleware = (0, cors_1.default)(corsOptions);
// ============================= RATE LIMITERS ============================= //
exports.generalRateLimit = (0, express_rate_limit_1.default)(RATE_LIMIT_CONFIG.general);
exports.authRateLimit = (0, express_rate_limit_1.default)(RATE_LIMIT_CONFIG.auth);
exports.registerRateLimit = (0, express_rate_limit_1.default)(RATE_LIMIT_CONFIG.register);
exports.passwordResetRateLimit = (0, express_rate_limit_1.default)(RATE_LIMIT_CONFIG.passwordReset);
// ============================= INPUT SANITIZATION ============================= //
// MongoDB injection protection
exports.mongoSanitizeMiddleware = (0, express_mongo_sanitize_1.default)({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        logger_1.logger.warn('MongoDB injection attempt detected', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            key,
            url: req.url
        });
    }
});
// HTTP Parameter Pollution protection
exports.hppMiddleware = (0, hpp_1.default)({
    whitelist: ['tags', 'categories'] // Allow arrays for these fields
});
// ============================= CUSTOM VALIDATORS ============================= //
// Enhanced name validator
const isValidName = (value) => {
    if (!value || typeof value !== 'string') {
        throw new Error('نام الزامی است');
    }
    const normalized = value.normalize('NFKC').trim();
    // Persian/Arabic/English characters only
    const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
    if (!nameRegex.test(normalized)) {
        throw new Error('نام فقط می‌تواند شامل حروف فارسی یا انگلیسی باشد');
    }
    // Must have at least 2 words
    const words = normalized.split(/\s+/).filter(word => word.length > 0);
    if (words.length < 2) {
        throw new Error('لطفاً نام و نام خانوادگی خود را وارد کنید');
    }
    // Each word should be at least 2 characters
    if (words.some(word => word.length < 2)) {
        throw new Error('هر بخش از نام باید حداقل 2 کاراکتر باشد');
    }
    // No more than 5 words
    if (words.length > 5) {
        throw new Error('نام نمی‌تواند بیشتر از 5 بخش داشته باشد');
    }
    return true;
};
// Enhanced email validator
const isValidEmail = (value) => {
    if (!value || typeof value !== 'string') {
        throw new Error('ایمیل الزامی است');
    }
    const normalized = value.toLowerCase().trim();
    // Basic email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalized)) {
        throw new Error('فرمت ایمیل صحیح نیست');
    }
    // Check domain length limits
    const [localPart, domainPart] = normalized.split('@');
    if (localPart.length > 64 || domainPart.length > 255) {
        throw new Error('ایمیل بیش از حد طولانی است');
    }
    // Check against disposable email domains
    if (DISPOSABLE_EMAIL_DOMAINS.has(domainPart)) {
        throw new Error('استفاده از ایمیل‌های موقت مجاز نیست');
    }
    // Check for suspicious patterns
    if (localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
        throw new Error('ساختار ایمیل معتبر نیست');
    }
    return true;
};
// Enhanced password validator
const isStrongPassword = (value, { req }) => {
    if (!value || typeof value !== 'string') {
        throw new Error('رمز عبور الزامی است');
    }
    // Length check
    if (value.length < 12) {
        throw new Error('رمز عبور باید حداقل 12 کاراکتر باشد');
    }
    if (value.length > 128) {
        throw new Error('رمز عبور بیش از حد طولانی است');
    }
    // Complexity check
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;
    if (!complexityRegex.test(value)) {
        throw new Error('رمز عبور باید شامل حروف کوچک، بزرگ، اعداد و کاراکترهای خاص باشد');
    }
    // Check against common passwords
    if (WEAK_PASSWORDS.has(value.toLowerCase())) {
        throw new Error('رمز عبور انتخابی بسیار رایج است');
    }
    // Check for personal information
    if (req.body.name) {
        const nameParts = req.body.name.toLowerCase().split(/\s+/);
        if (nameParts.some((part) => value.toLowerCase().includes(part) && part.length > 2)) {
            throw new Error('رمز عبور نباید شامل اطلاعات شخصی باشد');
        }
    }
    if (req.body.email) {
        const emailLocal = req.body.email.split('@')[0].toLowerCase();
        if (value.toLowerCase().includes(emailLocal) && emailLocal.length > 3) {
            throw new Error('رمز عبور نباید شامل اطلاعات شخصی باشد');
        }
    }
    // Check for national code in password
    if (req.body.nationalCode) {
        const cleanNationalCode = req.body.nationalCode.replace(/\D/g, '');
        if (value.includes(cleanNationalCode) || value.includes(cleanNationalCode.substring(0, 6))) {
            throw new Error('رمز عبور نباید شامل کد ملی باشد');
        }
    }
    // Check for repetitive patterns
    const hasRepeatingPattern = /(.{3,})\1/.test(value);
    if (hasRepeatingPattern) {
        throw new Error('رمز عبور نباید شامل الگوهای تکراری باشد');
    }
    // Check for sequential characters
    const hasSequential = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(value);
    if (hasSequential) {
        throw new Error('رمز عبور نباید شامل حروف یا اعداد پی در پی باشد');
    }
    return true;
};
// Enhanced Iranian national code validator
const isValidNationalCode = (value) => {
    if (!value || typeof value !== 'string') {
        throw new Error('کد ملی الزامی است');
    }
    // Normalize and clean input
    const cleanCode = value
        .replace(/[۰-۹]/g, (match) => String.fromCharCode(match.charCodeAt(0) - '۰'.charCodeAt(0) + '0'.charCodeAt(0))) // Convert Persian digits
        .replace(/[٠-٩]/g, (match) => String.fromCharCode(match.charCodeAt(0) - '٠'.charCodeAt(0) + '0'.charCodeAt(0))) // Convert Arabic digits
        .replace(/\D/g, '') // Remove all non-digit characters
        .trim();
    // Length validation
    if (cleanCode.length !== 10) {
        throw new Error('کد ملی باید دقیقاً 10 رقم باشد');
    }
    // Format validation (only digits)
    const nationalCodeRegex = /^[0-9]{10}$/;
    if (!nationalCodeRegex.test(cleanCode)) {
        throw new Error('کد ملی فقط باید شامل اعداد باشد');
    }
    // Check for repeated digits
    const repeatedCodes = ['0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
        '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'];
    if (repeatedCodes.includes(cleanCode)) {
        throw new Error('کد ملی نمی‌تواند شامل ارقام تکراری باشد');
    }
    // Check for obviously invalid patterns
    if (/(\d)(\1){9}/.test(cleanCode)) {
        throw new Error('کد ملی نمی‌تواند شامل ارقام یکسان باشد');
    }
    // Sequential patterns check
    const hasSequentialPattern = /(0123456789|1234567890|9876543210|0987654321)/.test(cleanCode);
    if (hasSequentialPattern) {
        throw new Error('کد ملی نمی‌تواند شامل الگوی متوالی باشد');
    }
    // Main validation algorithm (checksum)
    let sum = 0;
    const chars = cleanCode.split('');
    // Calculate weighted sum
    for (let i = 0; i < 9; i++) {
        sum += parseInt(chars[i], 10) * (10 - i);
    }
    const remainder = sum % 11;
    const lastDigit = remainder < 2 ? remainder : 11 - remainder;
    const providedLastDigit = parseInt(chars[9], 10);
    if (providedLastDigit !== lastDigit) {
        throw new Error('کد ملی وارد شده معتبر نیست');
    }
    return true;
};
// ============================= VALIDATION RULES ============================= //
exports.registerValidation = [
    (0, express_validator_1.body)('name')
        .custom(isValidName)
        .trim()
        .escape(),
    (0, express_validator_1.body)('email')
        .custom(isValidEmail)
        .normalizeEmail({ all_lowercase: true }),
    (0, express_validator_1.body)('nationalCode')
        .custom(isValidNationalCode)
        .trim(),
    (0, express_validator_1.body)('password')
        .custom(isStrongPassword),
    (0, express_validator_1.body)('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('رمز عبور و تکرار آن یکسان نیستند');
        }
        return true;
    }),
    (0, express_validator_1.body)('educationalGroup')
        .isIn(['ریاضی فیزیک', 'علوم تجربی', 'علوم انسانی', 'فنی حرفه‌ای', 'کاردانش', 'سایر'])
        .withMessage('گروه آموزشی انتخاب شده معتبر نیست'),
    (0, express_validator_1.body)('acceptTerms')
        .isBoolean()
        .custom((value) => {
        if (value !== true) {
            throw new Error('پذیرش قوانین و مقررات الزامی است');
        }
        return true;
    }),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .custom(isValidEmail)
        .normalizeEmail({ all_lowercase: true }),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('رمز عبور الزامی است')
        .isLength({ max: 128 })
        .withMessage('رمز عبور بیش از حد طولانی است'),
];
// ============================= SECURITY MIDDLEWARE ============================= //
// Request ID for tracking
const requestId = (req, res, next) => {
    const id = crypto_1.default.randomUUID();
    req.requestId = id;
    res.setHeader('X-Request-ID', id);
    next();
};
exports.requestId = requestId;
// Bot detection (honeypot)
const honeypotCheck = (req, res, next) => {
    const honeypotField = req.body._honeypot || req.body.website || req.body.url;
    if (honeypotField && honeypotField.length > 0) {
        logger_1.logger.warn('Bot detected via honeypot', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            honeypotValue: honeypotField,
            requestId: req.requestId
        });
        // Don't reveal that this is a honeypot
        return res.status(429).json({
            success: false,
            message: 'درخواست شما در حال پردازش است. لطفاً کمی صبر کنید.'
        });
    }
    next();
};
exports.honeypotCheck = honeypotCheck;
// Form timing check (anti-automation)
const timingCheck = (req, res, next) => {
    const formStartTime = req.body._timestamp;
    if (formStartTime) {
        const fillTime = Date.now() - formStartTime;
        const minFillTime = 5000; // 5 seconds minimum
        const maxFillTime = 30 * 60 * 1000; // 30 minutes maximum
        if (fillTime < minFillTime || fillTime > maxFillTime) {
            logger_1.logger.warn('Suspicious form timing detected', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                fillTime,
                requestId: req.requestId
            });
            return res.status(429).json({
                success: false,
                message: 'لطفاً فرم را با دقت پر کنید.'
            });
        }
    }
    next();
};
exports.timingCheck = timingCheck;
// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.logger.warn('Validation errors detected', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            errors: errors.array(),
            requestId: req.requestId,
            body: req.body
        });
        const formattedErrors = {};
        errors.array().forEach(error => {
            formattedErrors[error.param] = error.msg;
        });
        return res.status(400).json({
            success: false,
            message: 'اطلاعات وارد شده معتبر نیست',
            errors: formattedErrors
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
// Security logging middleware
const securityLogger = (req, res, next) => {
    const startTime = Date.now();
    // Log security-relevant requests
    const securityEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    if (securityEndpoints.some(endpoint => req.path.includes(endpoint))) {
        logger_1.logger.info('Security endpoint accessed', {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            requestId: req.requestId,
            timestamp: new Date().toISOString()
        });
    }
    // Log response on finish
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        if (res.statusCode >= 400) {
            logger_1.logger.warn('HTTP error response', {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                requestId: req.requestId,
                duration,
                timestamp: new Date().toISOString()
            });
        }
    });
    next();
};
exports.securityLogger = securityLogger;
// Content type validation
const validateContentType = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const contentType = req.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            return res.status(415).json({
                success: false,
                message: 'Unsupported Media Type. Expected application/json'
            });
        }
    }
    next();
};
exports.validateContentType = validateContentType;
// Export all middleware as a single function for easy use
const applySecurity = (app) => {
    app.use(exports.requestId);
    app.use(exports.securityHeaders);
    app.use(exports.corsMiddleware);
    app.use(exports.mongoSanitizeMiddleware);
    app.use(exports.hppMiddleware);
    app.use(exports.generalRateLimit);
    app.use(exports.validateContentType);
    app.use(exports.securityLogger);
};
exports.applySecurity = applySecurity;
exports.default = {
    applySecurity: exports.applySecurity,
    securityHeaders: exports.securityHeaders,
    corsMiddleware: exports.corsMiddleware,
    generalRateLimit: exports.generalRateLimit,
    authRateLimit: exports.authRateLimit,
    registerRateLimit: exports.registerRateLimit,
    passwordResetRateLimit: exports.passwordResetRateLimit,
    registerValidation: exports.registerValidation,
    loginValidation: exports.loginValidation,
    handleValidationErrors: exports.handleValidationErrors,
    honeypotCheck: exports.honeypotCheck,
    timingCheck: exports.timingCheck,
    requestId: exports.requestId,
    securityLogger: exports.securityLogger
};
//# sourceMappingURL=security.middleware.js.map