"use strict";
/**
 * Error handling middleware
 * میدلور مدیریت خطاها
 *
 * This middleware catches and formats errors for consistent API responses.
 * این میدلور خطاها را برای پاسخ‌های سازگار API دریافت و فرمت می‌کند.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = exports.createErrorResponse = exports.createSuccessResponse = exports.errorHandler = exports.ApiError = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../config/logger"));
const env_1 = require("../config/env");
/**
 * Custom error class for API errors
 * کلاس خطای سفارشی برای خطاهای API
 */
class ApiError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'error' : 'error';
        this.isOperational = true;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
/**
 * Persian error messages mapping
 * نگاشت پیام‌های خطای فارسی
 */
const errorMessages = {
    // Validation errors
    VALIDATION_ERROR: 'داده‌های ورودی نامعتبر',
    REQUIRED_FIELD: 'فیلد الزامی',
    INVALID_FORMAT: 'فرمت نامعتبر',
    TOO_SHORT: 'کوتاه‌تر از حد مجاز',
    TOO_LONG: 'طولانی‌تر از حد مجاز',
    INVALID_EMAIL: 'فرمت ایمیل نامعتبر',
    INVALID_PHONE: 'فرمت شماره تلفن نامعتبر',
    // Database errors
    DUPLICATE_ENTRY: 'این مقدار قبلاً ثبت شده است',
    NOT_FOUND: 'یافت نشد',
    CONNECTION_ERROR: 'خطا در اتصال به پایگاه داده',
    // Authentication errors
    UNAUTHORIZED: 'دسترسی غیرمجاز',
    TOKEN_INVALID: 'توکن نامعتبر است. لطفاً مجدداً وارد شوید',
    TOKEN_EXPIRED: 'توکن منقضی شده است. لطفاً مجدداً وارد شوید',
    // Parse Server errors
    PARSE_OBJECT_NOT_FOUND: 'آبجکت مورد نظر یافت نشد',
    PARSE_INVALID_QUERY: 'پرس‌وجوی نامعتبر',
    PARSE_CONNECTION_FAILED: 'اتصال به Parse Server ناموفق',
    // General errors
    SERVER_ERROR: 'خطای سرور',
    BAD_REQUEST: 'درخواست نامعتبر',
    FORBIDDEN: 'دسترسی مجاز نیست',
    RATE_LIMIT: 'تعداد درخواست‌ها بیش از حد مجاز'
};
exports.errorMessages = errorMessages;
/**
 * Convert Zod validation errors to Persian
 * تبدیل خطاهای اعتبارسنجی Zod به فارسی
 */
const formatZodError = (error) => {
    const errors = error.errors.map(err => {
        const field = err.path.join('.');
        let message = '';
        switch (err.code) {
            case 'too_small':
                if (err.type === 'string') {
                    message = `${field} باید حداقل ${err.minimum} کاراکتر باشد`;
                }
                else {
                    message = `${field} باید حداقل ${err.minimum} باشد`;
                }
                break;
            case 'too_big':
                if (err.type === 'string') {
                    message = `${field} نباید بیشتر از ${err.maximum} کاراکتر باشد`;
                }
                else {
                    message = `${field} نباید بیشتر از ${err.maximum} باشد`;
                }
                break;
            case 'invalid_type':
                message = `${field} باید از نوع ${err.expected} باشد`;
                break;
            case 'invalid_string':
                if (err.validation === 'email') {
                    message = `${field} باید آدرس ایمیل معتبر باشد`;
                }
                else if (err.validation === 'url') {
                    message = `${field} باید آدرس معتبر باشد`;
                }
                else {
                    message = `${field} فرمت نامعتبر دارد`;
                }
                break;
            case 'invalid_enum_value':
                message = `${field} باید یکی از مقادیر مجاز باشد: ${err.options.join(', ')}`;
                break;
            case 'custom':
                message = err.message || `${field} نامعتبر است`;
                break;
            default:
                message = err.message || `${field} نامعتبر است`;
        }
        return { field, message };
    });
    return {
        message: errorMessages.VALIDATION_ERROR,
        errors
    };
};
/**
 * Error handler middleware compatible with React Query
 * میدلور مدیریت خطا سازگار با React Query
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // لاگ خطا
    logger_1.default.error(`${err.name}: ${err.message}`, {
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    let statusCode = 500;
    let message = errorMessages.SERVER_ERROR;
    let errors = [];
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        const zodError = formatZodError(err);
        message = zodError.message;
        errors = zodError.errors;
    }
    // Mongoose bad ObjectId
    else if (err.name === 'CastError') {
        statusCode = 404;
        message = errorMessages.NOT_FOUND;
        errors = [{ field: 'id', message: 'شناسه وارد شده نامعتبر است' }];
    }
    // Mongoose duplicate key
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = errorMessages.DUPLICATE_ENTRY;
        errors = [{ field, message: `${field} قبلاً ثبت شده است` }];
    }
    // Mongoose validation error
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = errorMessages.VALIDATION_ERROR;
        errors = Object.values(err.errors).map((val) => ({
            field: val.path,
            message: val.message
        }));
    }
    // JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = errorMessages.TOKEN_INVALID;
        errors = [{ field: 'token', message: errorMessages.TOKEN_INVALID }];
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = errorMessages.TOKEN_EXPIRED;
        errors = [{ field: 'token', message: errorMessages.TOKEN_EXPIRED }];
    }
    // Parse Server errors
    else if (err.code === 101) { // Parse object not found
        statusCode = 404;
        message = errorMessages.PARSE_OBJECT_NOT_FOUND;
        errors = [{ field: 'object', message: errorMessages.PARSE_OBJECT_NOT_FOUND }];
    }
    else if (err.code === 102) { // Parse invalid query
        statusCode = 400;
        message = errorMessages.PARSE_INVALID_QUERY;
        errors = [{ field: 'query', message: errorMessages.PARSE_INVALID_QUERY }];
    }
    // Custom API errors
    else if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors || [];
    }
    // Rate limiting errors
    else if (err.message && err.message.includes('Too many requests')) {
        statusCode = 429;
        message = errorMessages.RATE_LIMIT;
        errors = [{ field: 'rate', message: errorMessages.RATE_LIMIT }];
    }
    // Generic server errors
    else if (err.message) {
        message = err.message;
        errors = [{ field: 'server', message: err.message }];
    }
    // React Query compatible response format
    const response = {
        status: 'error',
        statusCode,
        message,
        errors,
        ...(env_1.NODE_ENV === 'development' && {
            stack: err.stack,
            originalError: err
        })
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
/**
 * Create success response for React Query
 * ایجاد پاسخ موفقیت‌آمیز برای React Query
 */
const createSuccessResponse = (data, message) => {
    return {
        status: 'success',
        message: message || 'عملیات با موفقیت انجام شد',
        data
    };
};
exports.createSuccessResponse = createSuccessResponse;
/**
 * Create error response for React Query
 * ایجاد پاسخ خطا برای React Query
 */
const createErrorResponse = (message, statusCode = 400, errors) => {
    return {
        status: 'error',
        statusCode,
        message,
        errors: errors || []
    };
};
exports.createErrorResponse = createErrorResponse;
//# sourceMappingURL=errorHandler.js.map