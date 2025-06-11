"use strict";
/**
 * Flashcard Controller
 * کنترلر مدیریت فلش‌کارت‌ها
 *
 * شامل تمام عملیات CRUD، تولید خودکار، خرید و مدیریت جلسات مطالعه
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.getCategories = exports.recordStudySession = exports.getUserPurchases = exports.purchaseFlashcard = exports.generateFromQuestions = exports.deleteFlashcard = exports.updateFlashcard = exports.createFlashcard = exports.getFlashcard = exports.getFlashcards = void 0;
/**
 * Get all public flashcards
 * دریافت تمام فلش‌کارت‌های عمومی
 */
const getFlashcards = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                flashcards: [],
                pagination: {
                    page: 1,
                    limit: 12,
                    total: 0,
                    totalPages: 0
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت فلش‌کارت‌ها'
        });
    }
};
exports.getFlashcards = getFlashcards;
/**
 * Get single flashcard
 * دریافت یک فلش‌کارت
 */
const getFlashcard = async (req, res) => {
    res.json({ success: true, message: 'getFlashcard - فعال شده' });
};
exports.getFlashcard = getFlashcard;
/**
 * Create new flashcard
 * ایجاد فلش‌کارت جدید
 */
const createFlashcard = async (req, res) => {
    res.json({ success: true, message: 'createFlashcard - فعال شده' });
};
exports.createFlashcard = createFlashcard;
/**
 * Update flashcard
 * ویرایش فلش‌کارت
 */
const updateFlashcard = async (req, res) => {
    res.json({ success: true, message: 'updateFlashcard - فعال شده' });
};
exports.updateFlashcard = updateFlashcard;
/**
 * Delete flashcard
 * حذف فلش‌کارت
 */
const deleteFlashcard = async (req, res) => {
    res.json({ success: true, message: 'deleteFlashcard - فعال شده' });
};
exports.deleteFlashcard = deleteFlashcard;
/**
 * Generate flashcards from questions
 * تولید فلش‌کارت از سوالات
 */
const generateFromQuestions = async (req, res) => {
    res.json({ success: true, message: 'generateFromQuestions - فعال شده' });
};
exports.generateFromQuestions = generateFromQuestions;
/**
 * Purchase flashcard
 * خرید فلش‌کارت
 */
const purchaseFlashcard = async (req, res) => {
    res.json({ success: true, message: 'purchaseFlashcard - فعال شده' });
};
exports.purchaseFlashcard = purchaseFlashcard;
/**
 * Get user purchases
 * دریافت خریدهای کاربر
 */
const getUserPurchases = async (req, res) => {
    res.json({ success: true, message: 'getUserPurchases - فعال شده' });
};
exports.getUserPurchases = getUserPurchases;
/**
 * Record study session
 * ثبت جلسه مطالعه
 */
const recordStudySession = async (req, res) => {
    res.json({ success: true, message: 'recordStudySession - فعال شده' });
};
exports.recordStudySession = recordStudySession;
/**
 * Get categories
 * دریافت دسته‌بندی‌ها
 */
const getCategories = async (req, res) => {
    res.json({ success: true, message: 'getCategories - فعال شده' });
};
exports.getCategories = getCategories;
/**
 * Get user statistics
 * دریافت آمار کاربر
 */
const getUserStats = async (req, res) => {
    res.json({ success: true, message: 'getUserStats - فعال شده' });
};
exports.getUserStats = getUserStats;
//# sourceMappingURL=flashcard.controller.js.map