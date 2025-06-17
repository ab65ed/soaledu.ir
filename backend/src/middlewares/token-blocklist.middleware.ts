/**
 * JWT Token Blocklist Middleware
 * 
 * مدیریت بلاک‌لیست توکن‌های JWT برای امنیت بیشتر
 * این میان‌افزار امکان ابطال توکن‌ها در زمان logout یا تغییر رمز عبور را فراهم می‌کند
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
  jti?: string; // JWT ID
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    iat: number;
    exp: number;
    jti?: string;
  };
}

// بلاک‌لیست توکن‌ها (در محیط production باید از Redis استفاده شود)
class TokenBlocklist {
  private blockedTokens: Set<string> = new Set();
  private userInvalidationTimes: Map<string, number> = new Map();
  private cleanupTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * افزودن توکن به بلاک‌لیست
   */
  addToken(tokenId: string, exp: number): void {
    this.blockedTokens.add(tokenId);
    
    // پاکسازی خودکار توکن‌های منقضی شده
    const currentTime = Math.floor(Date.now() / 1000);
    if (exp > currentTime) {
      const timer = setTimeout(() => {
        this.blockedTokens.delete(tokenId);
        this.cleanupTimers.delete(tokenId);
        logger.debug('Expired token removed from blocklist', { tokenId });
      }, (exp - currentTime) * 1000);
      
      this.cleanupTimers.set(tokenId, timer);
    }
    
    logger.info('Token added to blocklist', { tokenId, expiresAt: exp });
  }

  /**
   * بررسی وضعیت توکن در بلاک‌لیست
   */
  isTokenBlocked(tokenId: string): boolean {
    return this.blockedTokens.has(tokenId);
  }

  /**
   * تنظیم زمان ابطال تمام توکن‌های کاربر (برای تغییر رمز عبور)
   */
  invalidateUserTokens(userId: string): void {
    const invalidationTime = Math.floor(Date.now() / 1000);
    this.userInvalidationTimes.set(userId, invalidationTime);
    
    logger.info('All user tokens invalidated', { 
      userId, 
      invalidationTime,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * بررسی اینکه آیا توکن کاربر قبل از زمان ابطال صادر شده
   */
  isTokenInvalidatedForUser(userId: string, tokenIssuedAt: number): boolean {
    const userInvalidationTime = this.userInvalidationTimes.get(userId);
    
    if (!userInvalidationTime) {
      return false;
    }
    
    return tokenIssuedAt < userInvalidationTime;
  }

  /**
   * دریافت آمار بلاک‌لیست
   */
  getStats(): {
    blockedTokensCount: number;
    invalidatedUsersCount: number;
  } {
    return {
      blockedTokensCount: this.blockedTokens.size,
      invalidatedUsersCount: this.userInvalidationTimes.size
    };
  }

  /**
   * پاکسازی دستی بلاک‌لیست (برای تست یا مدیریت)
   */
  clear(): void {
    // پاک کردن تمام تایمرها
    this.cleanupTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    
    this.blockedTokens.clear();
    this.userInvalidationTimes.clear();
    this.cleanupTimers.clear();
    logger.info('Token blocklist cleared');
  }
}

// نمونه singleton از بلاک‌لیست
const tokenBlocklist = new TokenBlocklist();

/**
 * میان‌افزار بررسی وضعیت توکن در بلاک‌لیست
 */
export const checkTokenBlocklist = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Response | void => {
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
    const decoded = jwt.decode(token) as TokenPayload;
    
    if (!decoded || !decoded.userId || !decoded.iat) {
      logger.warn('Invalid token structure in blocklist check', {
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
      logger.warn('Blocked token access attempt', {
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
      logger.warn('Invalidated user token access attempt', {
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
  } catch (error) {
    logger.error('Error in token blocklist check:', error);
    
    // در صورت خطا، اجازه ادامه بده تا میان‌افزار auth اصلی تصمیم بگیرد
    next();
  }
};

/**
 * افزودن توکن به بلاک‌لیست (برای logout)
 */
export const blockToken = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    
    if (!decoded || !decoded.exp) {
      logger.error('Cannot block token: invalid structure');
      return false;
    }
    
    // استفاده از JTI اگر موجود باشد، در غیر این صورت از کل توکن استفاده کن
    const tokenId = decoded.jti || token;
    
    tokenBlocklist.addToken(tokenId, decoded.exp);
    return true;
  } catch (error) {
    logger.error('Error blocking token:', error);
    return false;
  }
};

/**
 * ابطال تمام توکن‌های کاربر (برای تغییر رمز عبور)
 */
export const invalidateUserTokens = (userId: string): void => {
  tokenBlocklist.invalidateUserTokens(userId);
};

/**
 * دریافت آمار بلاک‌لیست
 */
export const getBlocklistStats = () => {
  return tokenBlocklist.getStats();
};

/**
 * پاکسازی بلاک‌لیست (برای تست)
 */
export const clearBlocklist = (): void => {
  tokenBlocklist.clear();
};

/**
 * میان‌افزار لاگ کردن استفاده از توکن
 */
export const logTokenUsage = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Response | void => {
  if (req.user) {
    logger.debug('Token usage logged', {
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

export default {
  checkTokenBlocklist,
  blockToken,
  invalidateUserTokens,
  getBlocklistStats,
  clearBlocklist,
  logTokenUsage
}; 