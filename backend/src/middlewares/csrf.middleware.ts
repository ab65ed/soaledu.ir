/**
 * Modern CSRF Protection Middleware
 * 
 * پیاده‌سازی مدرن محافظت در برابر حملات CSRF با استفاده از Double Submit Cookie
 * این روش امن‌تر و مدرن‌تر از کتابخانه‌های قدیمی است
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

interface CSRFRequest extends Request {
  csrfToken?: string;
}

// تنظیمات CSRF
export const CSRFConfig = {
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token', // اضافه کردن headerName برای تست‌ها
  headerNames: ['x-csrf-token', 'x-xsrf-token', 'csrf-token'],
  tokenLength: 32,
  cookieOptions: {
    httpOnly: false, // باید false باشد تا فرانت‌اند بتواند بخواند
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000 // 24 ساعت
  }
};

/**
 * تولید توکن CSRF امن
 */
function generateCSRFToken(): string {
  return crypto.randomBytes(CSRFConfig.tokenLength).toString('hex');
}

/**
 * میان‌افزار تنظیم توکن CSRF
 * این میان‌افزار باید قبل از مسیرهایی که نیاز به محافظت دارند اعمال شود
 */
export const setupCSRFToken = (req: CSRFRequest, res: Response, next: NextFunction): void => {
  try {
    // بررسی وجود توکن در کوکی
    let csrfToken = req.cookies[CSRFConfig.cookieName];
    
    // اگر توکن وجود ندارد، یکی جدید تولید کن
    if (!csrfToken) {
      csrfToken = generateCSRFToken();
      res.cookie(CSRFConfig.cookieName, csrfToken, CSRFConfig.cookieOptions);
      
      logger.debug('New CSRF token generated', {
        ip: req.ip,
        url: req.originalUrl
      });
    }
    
    // توکن را در request قرار بده تا کنترلرها بتوانند از آن استفاده کنند
    req.csrfToken = csrfToken;
    
    next();
  } catch (error) {
    logger.error('Error in CSRF token setup:', error);
    next(error);
  }
};

/**
 * میان‌افزار اعتبارسنجی CSRF
 * این میان‌افزار باید برای مسیرهای POST, PUT, DELETE, PATCH اعمال شود
 */
export const validateCSRFToken = (req: CSRFRequest, res: Response, next: NextFunction): void => {
  try {
    // روش‌های GET و OPTIONS نیاز به اعتبارسنجی CSRF ندارند
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }
    
    // دریافت توکن از کوکی
    const cookieToken = req.cookies[CSRFConfig.cookieName];
    
    // دریافت توکن از هدر
    let headerToken: string | undefined;
    
    for (const headerName of CSRFConfig.headerNames) {
      headerToken = req.get(headerName);
      if (headerToken) break;
    }
    
    // بررسی وجود هر دو توکن
    if (!cookieToken) {
      logger.warn('CSRF validation failed: Missing cookie token', {
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
      logger.warn('CSRF validation failed: Missing header token', {
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
      logger.warn('CSRF validation failed: Token length mismatch', {
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
    
    if (!crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
      logger.warn('CSRF validation failed: Token mismatch', {
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
    
    logger.debug('CSRF validation successful', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method
    });
    
    next();
  } catch (error) {
    logger.error('Error in CSRF validation:', error);
    
    res.status(500).json({
      success: false,
      message: 'خطای داخلی سرور در اعتبارسنجی امنیتی',
      error: 'CSRF_VALIDATION_ERROR'
    });
  }
};

/**
 * میان‌افزار ارائه توکن CSRF به کلاینت
 * این میان‌افزار برای endpoint هایی استفاده می‌شود که کلاینت نیاز به دریافت توکن دارد
 */
export const provideCSRFToken = (req: CSRFRequest, res: Response): void => {
  const csrfToken = req.csrfToken || req.cookies[CSRFConfig.cookieName];
  
  if (!csrfToken) {
    logger.error('CSRF token not available for provision');
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

/**
 * میان‌افزار حذف توکن CSRF (برای logout)
 */
export const clearCSRFToken = (req: Request, res: Response, next: NextFunction): void => {
  res.clearCookie(CSRFConfig.cookieName, {
    path: '/',
    domain: req.hostname
  });
  
  logger.debug('CSRF token cleared', {
    ip: req.ip,
    url: req.originalUrl
  });
  
  next();
};

/**
 * میان‌افزار تجدید توکن CSRF (برای عملیات حساس)
 */
export const refreshCSRFToken = (req: CSRFRequest, res: Response, next: NextFunction): void => {
  const newToken = generateCSRFToken();
  
  res.cookie(CSRFConfig.cookieName, newToken, CSRFConfig.cookieOptions);
  req.csrfToken = newToken;
  
  logger.debug('CSRF token refreshed', {
    ip: req.ip,
    url: req.originalUrl
  });
  
  next();
};

export default {
  setupCSRFToken,
  validateCSRFToken,
  provideCSRFToken,
  clearCSRFToken,
  refreshCSRFToken,
  CSRFConfig
}; 