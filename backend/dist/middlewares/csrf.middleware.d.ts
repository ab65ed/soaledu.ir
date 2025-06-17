/**
 * Modern CSRF Protection Middleware
 *
 * پیاده‌سازی مدرن محافظت در برابر حملات CSRF با استفاده از Double Submit Cookie
 * این روش امن‌تر و مدرن‌تر از کتابخانه‌های قدیمی است
 */
import { Request, Response, NextFunction } from 'express';
interface CSRFRequest extends Request {
    csrfToken?: string;
}
export declare const CSRFConfig: {
    cookieName: string;
    headerName: string;
    headerNames: string[];
    tokenLength: number;
    cookieOptions: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "strict";
        maxAge: number;
    };
};
/**
 * میان‌افزار تنظیم توکن CSRF
 * این میان‌افزار باید قبل از مسیرهایی که نیاز به محافظت دارند اعمال شود
 */
export declare const setupCSRFToken: (req: CSRFRequest, res: Response, next: NextFunction) => void;
/**
 * میان‌افزار اعتبارسنجی CSRF
 * این میان‌افزار باید برای مسیرهای POST, PUT, DELETE, PATCH اعمال شود
 */
export declare const validateCSRFToken: (req: CSRFRequest, res: Response, next: NextFunction) => void;
/**
 * میان‌افزار ارائه توکن CSRF به کلاینت
 * این میان‌افزار برای endpoint هایی استفاده می‌شود که کلاینت نیاز به دریافت توکن دارد
 */
export declare const provideCSRFToken: (req: CSRFRequest, res: Response) => void;
/**
 * میان‌افزار حذف توکن CSRF (برای logout)
 */
export declare const clearCSRFToken: (req: Request, res: Response, next: NextFunction) => void;
/**
 * میان‌افزار تجدید توکن CSRF (برای عملیات حساس)
 */
export declare const refreshCSRFToken: (req: CSRFRequest, res: Response, next: NextFunction) => void;
declare const _default: {
    setupCSRFToken: (req: CSRFRequest, res: Response, next: NextFunction) => void;
    validateCSRFToken: (req: CSRFRequest, res: Response, next: NextFunction) => void;
    provideCSRFToken: (req: CSRFRequest, res: Response) => void;
    clearCSRFToken: (req: Request, res: Response, next: NextFunction) => void;
    refreshCSRFToken: (req: CSRFRequest, res: Response, next: NextFunction) => void;
    CSRFConfig: {
        cookieName: string;
        headerName: string;
        headerNames: string[];
        tokenLength: number;
        cookieOptions: {
            httpOnly: boolean;
            secure: boolean;
            sameSite: "strict";
            maxAge: number;
        };
    };
};
export default _default;
