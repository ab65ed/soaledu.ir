import { Request, Response } from 'express';
/**
 * Get all blog posts for admin (including drafts)
 * دریافت تمام مقالات برای ادمین (شامل پیش‌نویس‌ها)
 */
export declare const getAdminBlogPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get blog statistics for admin dashboard
 * دریافت آمار وبلاگ برای داشبورد ادمین
 */
export declare const getAdminBlogStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get blog analytics
 * دریافت آنالیتیک وبلاگ
 */
export declare const getBlogAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get post analytics
 * دریافت آنالیتیک پست
 */
export declare const getPostAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Bulk update posts
 * به‌روزرسانی دسته‌ای پست‌ها
 */
export declare const bulkUpdatePosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Bulk delete posts
 * حذف دسته‌ای پست‌ها
 */
export declare const bulkDeletePosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Send survey to blog readers
 * ارسال نظرسنجی به خوانندگان وبلاگ
 */
export declare const sendBlogSurvey: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get survey results
 * دریافت نتایج نظرسنجی
 */
export declare const getBlogSurveyResults: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Send new post notification
 * ارسال اعلان پست جدید
 */
export declare const sendNewPostNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
