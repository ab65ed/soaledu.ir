/**
 * Error handling middleware
 * میدلور مدیریت خطاها
 *
 * This middleware catches and formats errors for consistent API responses.
 * این میدلور خطاها را برای پاسخ‌های سازگار API دریافت و فرمت می‌کند.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Custom error class for API errors
 * کلاس خطای سفارشی برای خطاهای API
 */
export declare class ApiError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    errors?: Array<{
        field: string;
        message: string;
    }>;
    constructor(message: string, statusCode: number, errors?: Array<{
        field: string;
        message: string;
    }>);
}
/**
 * Persian error messages mapping
 * نگاشت پیام‌های خطای فارسی
 */
declare const errorMessages: {
    VALIDATION_ERROR: string;
    REQUIRED_FIELD: string;
    INVALID_FORMAT: string;
    TOO_SHORT: string;
    TOO_LONG: string;
    INVALID_EMAIL: string;
    INVALID_PHONE: string;
    DUPLICATE_ENTRY: string;
    NOT_FOUND: string;
    CONNECTION_ERROR: string;
    UNAUTHORIZED: string;
    TOKEN_INVALID: string;
    TOKEN_EXPIRED: string;
    PARSE_OBJECT_NOT_FOUND: string;
    PARSE_INVALID_QUERY: string;
    PARSE_CONNECTION_FAILED: string;
    SERVER_ERROR: string;
    BAD_REQUEST: string;
    FORBIDDEN: string;
    RATE_LIMIT: string;
};
/**
 * Error handler middleware compatible with React Query
 * میدلور مدیریت خطا سازگار با React Query
 */
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
/**
 * Create success response for React Query
 * ایجاد پاسخ موفقیت‌آمیز برای React Query
 */
export declare const createSuccessResponse: (data: any, message?: string) => {
    status: string;
    message: string;
    data: any;
};
/**
 * Create error response for React Query
 * ایجاد پاسخ خطا برای React Query
 */
export declare const createErrorResponse: (message: string, statusCode?: number, errors?: Array<{
    field: string;
    message: string;
}>) => {
    status: string;
    statusCode: number;
    message: string;
    errors: {
        field: string;
        message: string;
    }[];
};
export { errorMessages };
