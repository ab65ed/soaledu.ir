"use strict";
/**
 * Flashcard Routes
 * مسیرهای API فلش‌کارت
 *
 * تعریف تمام endpoint های مربوط به فلش‌کارت‌ها
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const flashcard_1 = require("../controllers/flashcard");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Public routes (no authentication required)
/**
 * @swagger
 * /api/v1/flashcards:
 *   get:
 *     summary: Get all public flashcards
 *     description: دریافت تمام فلش‌کارت‌های عمومی با فیلتر و صفحه‌بندی
 *     tags: [Flashcards]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: فیلتر بر اساس دسته‌بندی
 *       - in: query
 *         name: subcategory
 *         schema:
 *           type: string
 *         description: فیلتر بر اساس زیردسته
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: فیلتر بر اساس سطح سختی
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: جستجو در متن سوال و پاسخ
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: تعداد آیتم در هر صفحه
 *     responses:
 *       200:
 *         description: لیست فلش‌کارت‌ها با موفقیت دریافت شد
 *       500:
 *         description: خطای سرور
 */
router.get('/', flashcard_1.getFlashcards);
/**
 * @swagger
 * /api/v1/flashcards/categories:
 *   get:
 *     summary: Get flashcard categories
 *     description: دریافت دسته‌بندی‌های فلش‌کارت
 *     tags: [Flashcards]
 *     responses:
 *       200:
 *         description: دسته‌بندی‌ها با موفقیت دریافت شد
 *       500:
 *         description: خطای سرور
 */
router.get('/categories', flashcard_1.getCategories);
// Protected routes (authentication required)
/**
 * @swagger
 * /api/v1/flashcards/stats:
 *   get:
 *     summary: Get user flashcard statistics
 *     description: دریافت آمار فلش‌کارت کاربر
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: آمار کاربر با موفقیت دریافت شد
 *       401:
 *         description: احراز هویت مورد نیاز
 *       500:
 *         description: خطای سرور
 */
router.get('/stats', auth_1.authenticateToken, flashcard_1.getUserStats);
/**
 * @swagger
 * /api/v1/flashcards/my-purchases:
 *   get:
 *     summary: Get user's purchased flashcards
 *     description: دریافت فلش‌کارت‌های خریداری شده کاربر
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: تعداد آیتم در هر صفحه
 *     responses:
 *       200:
 *         description: خریدهای کاربر با موفقیت دریافت شد
 *       401:
 *         description: احراز هویت مورد نیاز
 *       500:
 *         description: خطای سرور
 */
router.get('/my-purchases', auth_1.authenticateToken, flashcard_1.getUserPurchases);
/**
 * @swagger
 * /api/v1/flashcards/generate-from-questions:
 *   post:
 *     summary: Generate flashcards from questions
 *     description: تولید خودکار فلش‌کارت از سوالات
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceQuestionIds
 *               - includeExplanation
 *               - autoPublish
 *             properties:
 *               sourceQuestionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               includeExplanation:
 *                 type: boolean
 *               autoPublish:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: فلش‌کارت‌ها با موفقیت تولید شدند
 *       400:
 *         description: داده‌های ورودی نامعتبر
 *       401:
 *         description: احراز هویت مورد نیاز
 *       404:
 *         description: سوال منتشر شده‌ای یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.post('/generate-from-questions', auth_1.authenticateToken, flashcard_1.generateFromQuestions);
/**
 * @swagger
 * /api/v1/flashcards:
 *   post:
 *     summary: Create a new flashcard
 *     description: ایجاد فلش‌کارت جدید
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *               - category
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 300
 *               category:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: فلش‌کارت با موفقیت ایجاد شد
 *       400:
 *         description: داده‌های ورودی نامعتبر
 *       401:
 *         description: احراز هویت مورد نیاز
 *       500:
 *         description: خطای سرور
 */
router.post('/', auth_1.authenticateToken, flashcard_1.createFlashcard);
/**
 * @swagger
 * /api/v1/flashcards/{id}:
 *   get:
 *     summary: Get a single flashcard
 *     description: دریافت فلش‌کارت خاص با شناسه
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه فلش‌کارت
 *     responses:
 *       200:
 *         description: فلش‌کارت با موفقیت دریافت شد
 *       404:
 *         description: فلش‌کارت یافت نشد
 *       403:
 *         description: دسترسی مجاز نیست
 *       500:
 *         description: خطای سرور
 */
router.get('/:id', flashcard_1.getFlashcard);
/**
 * @swagger
 * /api/v1/flashcards/{id}:
 *   put:
 *     summary: Update a flashcard
 *     description: ویرایش فلش‌کارت
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه فلش‌کارت
 *     responses:
 *       200:
 *         description: فلش‌کارت با موفقیت به‌روزرسانی شد
 *       400:
 *         description: داده‌های ورودی نامعتبر
 *       401:
 *         description: احراز هویت مورد نیاز
 *       403:
 *         description: دسترسی مجاز نیست
 *       404:
 *         description: فلش‌کارت یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.put('/:id', auth_1.authenticateToken, flashcard_1.updateFlashcard);
/**
 * @swagger
 * /api/v1/flashcards/{id}:
 *   delete:
 *     summary: Delete a flashcard
 *     description: حذف فلش‌کارت
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه فلش‌کارت
 *     responses:
 *       200:
 *         description: فلش‌کارت با موفقیت حذف شد
 *       401:
 *         description: احراز هویت مورد نیاز
 *       403:
 *         description: دسترسی مجاز نیست
 *       404:
 *         description: فلش‌کارت یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.delete('/:id', auth_1.authenticateToken, flashcard_1.deleteFlashcard);
/**
 * @swagger
 * /api/v1/flashcards/{id}/purchase:
 *   post:
 *     summary: Purchase flashcard access
 *     description: خرید دسترسی به فلش‌کارت
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه فلش‌کارت
 *     responses:
 *       200:
 *         description: خرید با موفقیت انجام شد
 *       400:
 *         description: قبلاً خریداری شده
 *       401:
 *         description: احراز هویت مورد نیاز
 *       404:
 *         description: فلش‌کارت یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.post('/:id/purchase', auth_1.authenticateToken, flashcard_1.purchaseFlashcard);
/**
 * @swagger
 * /api/v1/flashcards/{id}/study:
 *   post:
 *     summary: Record study session
 *     description: ثبت جلسه مطالعه
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه فلش‌کارت
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - responseTime
 *               - isCorrect
 *               - difficulty
 *             properties:
 *               responseTime:
 *                 type: number
 *                 minimum: 0
 *               isCorrect:
 *                 type: boolean
 *               difficulty:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: جلسه مطالعه ثبت شد
 *       400:
 *         description: داده‌های ورودی نامعتبر
 *       401:
 *         description: احراز هویت مورد نیاز
 *       403:
 *         description: دسترسی به فلش‌کارت ندارید
 *       500:
 *         description: خطای سرور
 */
router.post('/:id/study', auth_1.authenticateToken, flashcard_1.recordStudySession);
exports.default = router;
//# sourceMappingURL=flashcard.js.map