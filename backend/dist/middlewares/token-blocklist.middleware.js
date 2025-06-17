"use strict";
/**
 * JWT Token Blocklist Middleware
 *
 * مدیریت بلاک‌لیست توکن‌های JWT برای امنیت بیشتر
 * این میان‌افزار امکان ابطال توکن‌ها در زمان logout یا تغییر رمز عبور را فراهم می‌کند
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTokenUsage = exports.clearBlocklist = exports.getBlocklistStats = exports.invalidateUserTokens = exports.blockToken = exports.checkTokenBlocklist = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
// بلاک‌لیست توکن‌ها (در محیط production باید از Redis استفاده شود)
class TokenBlocklist {
    constructor() {
        this.blockedTokens = new Set();
        this.userInvalidationTimes = new Map();
        this.cleanupTimers = new Map();
    }
    /**
     * افزودن توکن به بلاک‌لیست
     */
    addToken(tokenId, exp) {
        this.blockedTokens.add(tokenId);
        // پاکسازی خودکار توکن‌های منقضی شده
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp > currentTime) {
            const timer = setTimeout(() => {
                this.blockedTokens.delete(tokenId);
                this.cleanupTimers.delete(tokenId);
                logger_1.logger.debug('Expired token removed from blocklist', { tokenId });
            }, (exp - currentTime) * 1000);
            this.cleanupTimers.set(tokenId, timer);
        }
        logger_1.logger.info('Token added to blocklist', { tokenId, expiresAt: exp });
    }
    /**
     * بررسی وضعیت توکن در بلاک‌لیست
     */
    isTokenBlocked(tokenId) {
        return this.blockedTokens.has(tokenId);
    }
    /**
     * تنظیم زمان ابطال تمام توکن‌های کاربر (برای تغییر رمز عبور)
     */
    invalidateUserTokens(userId) {
        const invalidationTime = Math.floor(Date.now() / 1000);
        this.userInvalidationTimes.set(userId, invalidationTime);
        logger_1.logger.info('All user tokens invalidated', {
            userId,
            invalidationTime,
            timestamp: new Date().toISOString()
        });
    }
    /**
     * بررسی اینکه آیا توکن کاربر قبل از زمان ابطال صادر شده
     */
    isTokenInvalidatedForUser(userId, tokenIssuedAt) {
        const userInvalidationTime = this.userInvalidationTimes.get(userId);
        if (!userInvalidationTime) {
            return false;
        }
        return tokenIssuedAt < userInvalidationTime;
    }
    /**
     * دریافت آمار بلاک‌لیست
     */
    getStats() {
        return {
            blockedTokensCount: this.blockedTokens.size,
            invalidatedUsersCount: this.userInvalidationTimes.size
        };
    }
    /**
     * پاکسازی دستی بلاک‌لیست (برای تست یا مدیریت)
     */
    clear() {
        // پاک کردن تمام تایمرها
        this.cleanupTimers.forEach((timer) => {
            clearTimeout(timer);
        });
        this.blockedTokens.clear();
        this.userInvalidationTimes.clear();
        this.cleanupTimers.clear();
        logger_1.logger.info('Token blocklist cleared');
    }
}
// نمونه singleton از بلاک‌لیست
const tokenBlocklist = new TokenBlocklist();
/**
 * میان‌افزار بررسی وضعیت توکن در بلاک‌لیست
 */
const checkTokenBlocklist = (req, res, next) => {
    try {
        // Bypass برای route های test
        if (req.path.includes('template-test') || req.path.includes('/test')) {
            return next();
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // اگر توکن وجود نداشت، میان‌افزار auth اصلی مدیریت می‌کند
        }
        const token = authHeader.substring(7); // حذف "Bearer "
        if (!token) {
            return next();
        }
        // decode توکن بدون تأیید (فقط برای خواندن اطلاعات)
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.userId || !decoded.iat) {
            logger_1.logger.warn('Invalid token structure in blocklist check', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.originalUrl
            });
            return res.status(401).json({
                success: false,
                message: 'توکن نامعتبر',
                error: 'INVALID_TOKEN_STRUCTURE'
            });
        }
        // بررسی بلاک‌لیست JTI (اگر موجود باشد)
        if (decoded.jti && tokenBlocklist.isTokenBlocked(decoded.jti)) {
            logger_1.logger.warn('Blocked token access attempt', {
                userId: decoded.userId,
                jti: decoded.jti,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.originalUrl
            });
            return res.status(401).json({
                success: false,
                message: 'دسترسی شما لغو شده است. لطفاً مجدداً وارد شوید',
                error: 'TOKEN_BLOCKED'
            });
        }
        // بررسی ابطال کلی توکن‌های کاربر
        if (tokenBlocklist.isTokenInvalidatedForUser(decoded.userId, decoded.iat)) {
            logger_1.logger.warn('Invalidated user token access attempt', {
                userId: decoded.userId,
                tokenIssuedAt: decoded.iat,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.originalUrl
            });
            return res.status(401).json({
                success: false,
                message: 'به دلیل تغییر رمز عبور، لطفاً مجدداً وارد شوید',
                error: 'TOKEN_INVALIDATED'
            });
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Error in token blocklist check:', error);
        // در صورت خطا، اجازه ادامه بده تا میان‌افزار auth اصلی تصمیم بگیرد
        next();
    }
};
exports.checkTokenBlocklist = checkTokenBlocklist;
/**
 * افزودن توکن به بلاک‌لیست (برای logout)
 */
const blockToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.exp) {
            logger_1.logger.error('Cannot block token: invalid structure');
            return false;
        }
        // استفاده از JTI اگر موجود باشد، در غیر این صورت از کل توکن استفاده کن
        const tokenId = decoded.jti || token;
        tokenBlocklist.addToken(tokenId, decoded.exp);
        return true;
    }
    catch (error) {
        logger_1.logger.error('Error blocking token:', error);
        return false;
    }
};
exports.blockToken = blockToken;
/**
 * ابطال تمام توکن‌های کاربر (برای تغییر رمز عبور)
 */
const invalidateUserTokens = (userId) => {
    tokenBlocklist.invalidateUserTokens(userId);
};
exports.invalidateUserTokens = invalidateUserTokens;
/**
 * دریافت آمار بلاک‌لیست
 */
const getBlocklistStats = () => {
    return tokenBlocklist.getStats();
};
exports.getBlocklistStats = getBlocklistStats;
/**
 * پاکسازی بلاک‌لیست (برای تست)
 */
const clearBlocklist = () => {
    tokenBlocklist.clear();
};
exports.clearBlocklist = clearBlocklist;
/**
 * میان‌افزار لاگ کردن استفاده از توکن
 */
const logTokenUsage = (req, res, next) => {
    if (req.user) {
        logger_1.logger.debug('Token usage logged', {
            userId: req.user.id,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }
    next();
};
exports.logTokenUsage = logTokenUsage;
exports.default = {
    checkTokenBlocklist: exports.checkTokenBlocklist,
    blockToken: exports.blockToken,
    invalidateUserTokens: exports.invalidateUserTokens,
    getBlocklistStats: exports.getBlocklistStats,
    clearBlocklist: exports.clearBlocklist,
    logTokenUsage: exports.logTokenUsage
};
//# sourceMappingURL=token-blocklist.middleware.js.map