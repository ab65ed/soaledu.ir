/**
 * JWT Token Blocklist Middleware
 *
 * مدیریت بلاک‌لیست توکن‌های JWT برای امنیت بیشتر
 * این میان‌افزار امکان ابطال توکن‌ها در زمان logout یا تغییر رمز عبور را فراهم می‌کند
 */
import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        iat: number;
        exp: number;
        jti?: string;
    };
}
/**
 * میان‌افزار بررسی وضعیت توکن در بلاک‌لیست
 */
export declare const checkTokenBlocklist: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response | void;
/**
 * افزودن توکن به بلاک‌لیست (برای logout)
 */
export declare const blockToken: (token: string) => boolean;
/**
 * ابطال تمام توکن‌های کاربر (برای تغییر رمز عبور)
 */
export declare const invalidateUserTokens: (userId: string) => void;
/**
 * دریافت آمار بلاک‌لیست
 */
export declare const getBlocklistStats: () => {
    blockedTokensCount: number;
    invalidatedUsersCount: number;
};
/**
 * پاکسازی بلاک‌لیست (برای تست)
 */
export declare const clearBlocklist: () => void;
/**
 * میان‌افزار لاگ کردن استفاده از توکن
 */
export declare const logTokenUsage: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response | void;
declare const _default: {
    checkTokenBlocklist: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response | void;
    blockToken: (token: string) => boolean;
    invalidateUserTokens: (userId: string) => void;
    getBlocklistStats: () => {
        blockedTokensCount: number;
        invalidatedUsersCount: number;
    };
    clearBlocklist: () => void;
    logTokenUsage: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response | void;
};
export default _default;
