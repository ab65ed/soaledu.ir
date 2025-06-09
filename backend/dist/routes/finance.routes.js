"use strict";
/**
 * Finance Routes
 * روت‌های مدیریت مالی با کنترل دسترسی ادمین
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roles_1 = require("../middlewares/roles");
const roles_2 = require("../models/roles");
const router = express_1.default.Router();
/**
 * @swagger
 * /finance/pricing:
 *   get:
 *     summary: Get all pricing information
 *     description: دریافت اطلاعات قیمت‌گذاری (همه کاربران)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: اطلاعات قیمت‌گذاری
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     courseExams:
 *                       type: array
 *                       items:
 *                         type: object
 *                     testExams:
 *                       type: array
 *                       items:
 *                         type: object
 *                     flashcards:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/pricing', ...roles_1.financeAccess.viewPrices, async (req, res) => {
    try {
        // Implementation for getting pricing information
        res.json({
            success: true,
            data: {
                courseExams: [
                    { type: 'single', price: 5000, currency: 'IRT' },
                    { type: 'package', price: 25000, currency: 'IRT' }
                ],
                testExams: [
                    { type: 'single', price: 3000, currency: 'IRT' },
                    { type: 'unlimited', price: 15000, currency: 'IRT' }
                ],
                flashcards: [
                    { type: 'deck', price: 2000, currency: 'IRT' },
                    { type: 'category', price: 8000, currency: 'IRT' }
                ]
            },
            message: 'اطلاعات قیمت‌گذاری با موفقیت دریافت شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت اطلاعات قیمت‌گذاری'
        });
    }
});
/**
 * @swagger
 * /finance/pricing:
 *   put:
 *     summary: Update pricing information
 *     description: ویرایش اطلاعات قیمت‌گذاری (فقط ادمین)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseExams:
 *                 type: array
 *                 items:
 *                   type: object
 *               testExams:
 *                 type: array
 *                 items:
 *                   type: object
 *               flashcards:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: قیمت‌گذاری با موفقیت ویرایش شد
 *       403:
 *         description: عدم مجوز کافی
 */
router.put('/pricing', ...roles_1.financeAccess.manage, (0, roles_1.logActivity)(roles_2.ActivityType.UPDATE, 'pricing'), async (req, res) => {
    try {
        // Implementation for updating pricing
        res.json({
            success: true,
            message: 'قیمت‌گذاری با موفقیت ویرایش شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در ویرایش قیمت‌گذاری'
        });
    }
});
/**
 * @swagger
 * /finance/payments:
 *   get:
 *     summary: Get payment history
 *     description: دریافت تاریخچه پرداخت‌ها (فقط ادمین)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *         description: تعداد پرداخت‌ها در هر صفحه
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *         description: وضعیت پرداخت
 *     responses:
 *       200:
 *         description: لیست پرداخت‌ها
 *       403:
 *         description: عدم مجوز کافی
 */
router.get('/payments', ...roles_1.financeAccess.manage, async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        // Implementation for getting payment history
        res.json({
            success: true,
            data: {
                payments: [],
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: 0
                },
                filters: { status }
            },
            message: 'تاریخچه پرداخت‌ها با موفقیت دریافت شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت تاریخچه پرداخت‌ها'
        });
    }
});
/**
 * @swagger
 * /finance/payment-requests:
 *   get:
 *     summary: Get payment requests
 *     description: دریافت درخواست‌های پرداخت (ادمین یا طراحان)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: وضعیت درخواست
 *       - name: userId
 *         in: query
 *         schema:
 *           type: string
 *         description: شناسه کاربر (فقط برای ادمین)
 *     responses:
 *       200:
 *         description: لیست درخواست‌های پرداخت
 */
router.get('/payment-requests', roles_1.authenticateToken, async (req, res) => {
    try {
        const { status, userId } = req.query;
        // Implementation for getting payment requests
        res.json({
            success: true,
            data: {
                paymentRequests: [],
                summary: {
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    totalAmount: 0
                }
            },
            message: 'درخواست‌های پرداخت با موفقیت دریافت شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت درخواست‌های پرداخت'
        });
    }
});
/**
 * @swagger
 * /finance/payment-requests:
 *   post:
 *     summary: Create payment request
 *     description: ایجاد درخواست پرداخت (طراحان)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *               - bankAccount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: مبلغ درخواستی
 *               description:
 *                 type: string
 *                 description: توضیحات درخواست
 *               bankAccount:
 *                 type: object
 *                 properties:
 *                   accountNumber:
 *                     type: string
 *                   bankName:
 *                     type: string
 *                   iban:
 *                     type: string
 *     responses:
 *       201:
 *         description: درخواست پرداخت با موفقیت ایجاد شد
 *       403:
 *         description: عدم مجوز کافی
 */
router.post('/payment-requests', ...roles_1.financeAccess.requestPayment, async (req, res) => {
    try {
        // Implementation for creating payment request
        res.status(201).json({
            success: true,
            data: { id: 'new-payment-request-id' },
            message: 'درخواست پرداخت با موفقیت ایجاد شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در ایجاد درخواست پرداخت'
        });
    }
});
/**
 * @swagger
 * /finance/payment-requests/{id}/approve:
 *   post:
 *     summary: Approve payment request
 *     description: تایید درخواست پرداخت (فقط ادمین)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه درخواست پرداخت
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 description: یادداشت ادمین
 *     responses:
 *       200:
 *         description: درخواست پرداخت تایید شد
 *       403:
 *         description: عدم مجوز کافی
 *       404:
 *         description: درخواست یافت نشد
 */
router.post('/payment-requests/:id/approve', ...roles_1.financeAccess.manage, (0, roles_1.logActivity)(roles_2.ActivityType.APPROVE, 'payment_request'), async (req, res) => {
    try {
        const { id } = req.params;
        // Implementation for approving payment request
        res.json({
            success: true,
            message: 'درخواست پرداخت تایید شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در تایید درخواست پرداخت'
        });
    }
});
/**
 * @swagger
 * /finance/payment-requests/{id}/reject:
 *   post:
 *     summary: Reject payment request
 *     description: رد درخواست پرداخت (فقط ادمین)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه درخواست پرداخت
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: دلیل رد درخواست
 *     responses:
 *       200:
 *         description: درخواست پرداخت رد شد
 *       403:
 *         description: عدم مجوز کافی
 *       404:
 *         description: درخواست یافت نشد
 */
router.post('/payment-requests/:id/reject', ...roles_1.financeAccess.manage, (0, roles_1.logActivity)(roles_2.ActivityType.REJECT, 'payment_request'), async (req, res) => {
    try {
        const { id } = req.params;
        // Implementation for rejecting payment request
        res.json({
            success: true,
            message: 'درخواست پرداخت رد شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در رد درخواست پرداخت'
        });
    }
});
/**
 * @swagger
 * /finance/reports/revenue:
 *   get:
 *     summary: Get revenue report
 *     description: دریافت گزارش درآمد (فقط ادمین)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: تاریخ شروع
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: تاریخ پایان
 *       - name: groupBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: گروه‌بندی بر اساس
 *     responses:
 *       200:
 *         description: گزارش درآمد
 *       403:
 *         description: عدم مجوز کافی
 */
router.get('/reports/revenue', ...roles_1.financeAccess.manage, async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'month' } = req.query;
        // Implementation for revenue report
        res.json({
            success: true,
            data: {
                totalRevenue: 0,
                revenue: [],
                breakdown: {
                    courseExams: 0,
                    testExams: 0,
                    flashcards: 0
                },
                period: { startDate, endDate, groupBy }
            },
            message: 'گزارش درآمد با موفقیت دریافت شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت گزارش درآمد'
        });
    }
});
/**
 * @swagger
 * /finance/wallet:
 *   get:
 *     summary: Get user wallet balance
 *     description: دریافت موجودی کیف پول کاربر
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: موجودی کیف پول
 */
router.get('/wallet', roles_1.authenticateToken, async (req, res) => {
    try {
        // Implementation for getting wallet balance
        res.json({
            success: true,
            data: {
                balance: 0,
                currency: 'IRT',
                transactions: []
            },
            message: 'موجودی کیف پول با موفقیت دریافت شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت موجودی کیف پول'
        });
    }
});
/**
 * @swagger
 * /finance/process-payment:
 *   post:
 *     summary: Process payment
 *     description: پردازش پرداخت
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - itemType
 *               - itemId
 *             properties:
 *               amount:
 *                 type: number
 *                 description: مبلغ پرداخت
 *               itemType:
 *                 type: string
 *                 enum: [course_exam, test_exam, flashcard]
 *                 description: نوع آیتم
 *               itemId:
 *                 type: string
 *                 description: شناسه آیتم
 *               paymentMethod:
 *                 type: string
 *                 enum: [wallet, gateway]
 *                 default: gateway
 *     responses:
 *       200:
 *         description: پرداخت با موفقیت انجام شد
 *       400:
 *         description: خطا در پرداخت
 */
router.post('/process-payment', ...roles_1.financeAccess.processPayment, async (req, res) => {
    try {
        // Implementation for processing payment
        res.json({
            success: true,
            data: {
                transactionId: 'new-transaction-id',
                status: 'completed'
            },
            message: 'پرداخت با موفقیت انجام شد'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در پردازش پرداخت'
        });
    }
});
exports.default = router;
//# sourceMappingURL=finance.routes.js.map