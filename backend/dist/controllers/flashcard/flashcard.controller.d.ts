/**
 * Flashcard Controller
 * کنترلر مدیریت فلش‌کارت‌ها
 *
 * شامل تمام عملیات CRUD، تولید خودکار، خرید و مدیریت جلسات مطالعه
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
/**
 * Get all public flashcards
 * دریافت تمام فلش‌کارت‌های عمومی
 */
export declare const getFlashcards: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Get single flashcard
 * دریافت یک فلش‌کارت
 */
export declare const getFlashcard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Create new flashcard
 * ایجاد فلش‌کارت جدید
 */
export declare const createFlashcard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Update flashcard
 * ویرایش فلش‌کارت
 */
export declare const updateFlashcard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Delete flashcard
 * حذف فلش‌کارت
 */
export declare const deleteFlashcard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Generate flashcards from questions
 * تولید فلش‌کارت از سوالات
 */
export declare const generateFromQuestions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Purchase flashcard
 * خرید فلش‌کارت
 */
export declare const purchaseFlashcard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Get user purchases
 * دریافت خریدهای کاربر
 */
export declare const getUserPurchases: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Record study session
 * ثبت جلسه مطالعه
 */
export declare const recordStudySession: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Get categories
 * دریافت دسته‌بندی‌ها
 */
export declare const getCategories: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Get user statistics
 * دریافت آمار کاربر
 */
export declare const getUserStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
