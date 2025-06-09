/**
 * کنترلر تماس با ما - Contact Controller
 * @description مدیریت پیام‌های تماس کاربران با Parse Server
 */
import { Request, Response } from 'express';
/**
 * ایجاد پیام تماس جدید
 * POST /api/contact
 */
export declare const createContact: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت لیست پیام‌های تماس
 * GET /api/contact
 */
export declare const getContacts: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت پیام تماس بر اساس ID
 * GET /api/contact/:id
 */
export declare const getContactById: (req: Request, res: Response) => Promise<void>;
/**
 * بروزرسانی پیام تماس
 * PUT /api/contact/:id
 */
export declare const updateContact: (req: Request, res: Response) => Promise<void>;
/**
 * حذف پیام تماس
 * DELETE /api/contact/:id
 */
export declare const deleteContact: (req: Request, res: Response) => Promise<void>;
/**
 * دریافت آمار پیام‌های تماس
 * GET /api/contact/stats
 */
export declare const getContactStats: (req: Request, res: Response) => Promise<void>;
