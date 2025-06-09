"use strict";
/**
 * Finance Routes
 * مسیرهای API برای سیستم مالی
 *
 * @author Exam-Edu Platform
 * @version 1.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const finance_1 = require("../controllers/finance");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const roles_2 = require("../types/roles");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
/**
 * Calculate exam pricing
 * POST /api/finance/calculate-price
 */
router.post('/calculate-price', [
    (0, express_validator_1.body)('questionCount')
        .isInt({ min: 10, max: 50 })
        .withMessage('تعداد سوالات باید بین 10 تا 50 باشد'),
    (0, express_validator_1.body)('userType')
        .optional()
        .isIn(['regular', 'student', 'premium'])
        .withMessage('نوع کاربر نامعتبر است'),
    (0, express_validator_1.body)('isFirstPurchase')
        .optional()
        .isBoolean()
        .withMessage('وضعیت اولین خرید باید boolean باشد'),
    (0, express_validator_1.body)('bulkCount')
        .optional()
        .isInt({ min: 0 })
        .withMessage('تعداد خرید عمده باید عدد مثبت باشد')
], finance_1.FinanceController.calculatePrice);
/**
 * Calculate flashcard pricing
 * POST /api/finance/calculate-flashcard-price
 */
router.post('/calculate-flashcard-price', [
    (0, express_validator_1.body)('flashcardIds')
        .isArray({ min: 1 })
        .withMessage('شناسه فلش‌کارت‌ها الزامی است'),
    (0, express_validator_1.body)('flashcardIds.*')
        .isLength({ min: 1 })
        .withMessage('شناسه فلش‌کارت نامعتبر است'),
    (0, express_validator_1.body)('userType')
        .optional()
        .isIn(['regular', 'student', 'premium'])
        .withMessage('نوع کاربر نامعتبر است'),
    (0, express_validator_1.body)('isFirstPurchase')
        .optional()
        .isBoolean()
        .withMessage('وضعیت اولین خرید باید boolean باشد')
], finance_1.FinanceController.calculateFlashcardPrice);
/**
 * Get exam price by exam ID
 * GET /api/finance/exam-price/:examId
 */
router.get('/exam-price/:examId', [
    (0, express_validator_1.param)('examId')
        .isLength({ min: 1 })
        .withMessage('شناسه آزمون الزامی است')
], finance_1.FinanceController.getExamPrice);
/**
 * Get flashcard price by flashcard ID
 * GET /api/finance/flashcard-price/:flashcardId
 */
router.get('/flashcard-price/:flashcardId', [
    (0, express_validator_1.param)('flashcardId')
        .isLength({ min: 1 })
        .withMessage('شناسه فلش‌کارت الزامی است')
], finance_1.FinanceController.getFlashcardPrice);
/**
 * Create payment transaction
 * POST /api/finance/create-payment
 */
router.post('/create-payment', [
    (0, express_validator_1.body)('examId')
        .isLength({ min: 1 })
        .withMessage('شناسه آزمون الزامی است'),
    (0, express_validator_1.body)('paymentMethod')
        .isIn(['credit_card', 'bank_transfer', 'wallet', 'zarinpal', 'mellat'])
        .withMessage('روش پرداخت نامعتبر است'),
    (0, express_validator_1.body)('returnUrl')
        .isURL()
        .withMessage('آدرس بازگشت نامعتبر است')
], finance_1.FinanceController.createPayment);
/**
 * Verify payment
 * POST /api/finance/verify-payment
 */
router.post('/verify-payment', [
    (0, express_validator_1.body)('transactionId')
        .isLength({ min: 1 })
        .withMessage('شناسه تراکنش الزامی است'),
    (0, express_validator_1.body)('paymentReference')
        .isLength({ min: 1 })
        .withMessage('مرجع پرداخت الزامی است')
], finance_1.FinanceController.verifyPayment);
/**
 * Get user payment history
 * GET /api/finance/payment-history
 */
router.get('/payment-history', [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['pending', 'completed', 'failed', 'refunded'])
        .withMessage('وضعیت تراکنش نامعتبر است')
], finance_1.FinanceController.getPaymentHistory);
/**
 * Get financial statistics
 * GET /api/finance/statistics
 */
router.get('/statistics', [
    (0, express_validator_1.query)('startDate')
        .optional()
        .isISO8601()
        .withMessage('تاریخ شروع نامعتبر است'),
    (0, express_validator_1.query)('endDate')
        .optional()
        .isISO8601()
        .withMessage('تاریخ پایان نامعتبر است')
], finance_1.FinanceController.getStatistics);
/**
 * ADMIN ROUTES
 * مسیرهای مدیریت مالی برای ادمین
 */
/**
 * Get admin financial overview
 * GET /api/finance/admin/overview
 */
router.get('/admin/overview', (0, roles_1.requirePermission)([roles_2.Permission.MANAGE_PAYMENTS, roles_2.Permission.MANAGE_SYSTEM]), finance_1.FinanceController.getAdminFinancialOverview);
/**
 * Get all designer wallets
 * GET /api/finance/admin/designer-wallets
 */
router.get('/admin/designer-wallets', [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    (0, express_validator_1.query)('search')
        .optional()
        .isLength({ min: 1 })
        .withMessage('متن جستجو نامعتبر است'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['balance', 'totalEarnings', 'totalWithdrawals', 'lastUpdated'])
        .withMessage('فیلد مرتب‌سازی نامعتبر است'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('ترتیب مرتب‌سازی نامعتبر است')
], (0, roles_1.requirePermission)([roles_2.Permission.MANAGE_PAYMENTS, roles_2.Permission.MANAGE_SYSTEM]), finance_1.FinanceController.getAllDesignerWallets);
/**
 * Get withdrawal requests
 * GET /api/finance/admin/withdrawal-requests
 */
router.get('/admin/withdrawal-requests', [
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['PENDING', 'APPROVED', 'REJECTED', 'ALL'])
        .withMessage('وضعیت درخواست نامعتبر است'),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد نتایج باید بین 1 تا 100 باشد')
], (0, roles_1.requirePermission)([roles_2.Permission.MANAGE_PAYMENTS, roles_2.Permission.MANAGE_SYSTEM]), finance_1.FinanceController.getWithdrawalRequests);
/**
 * Process withdrawal request (approve/reject)
 * PUT /api/finance/admin/withdrawal-requests/:id
 */
router.put('/admin/withdrawal-requests/:id', [
    (0, express_validator_1.param)('id')
        .isLength({ min: 1 })
        .withMessage('شناسه درخواست الزامی است'),
    (0, express_validator_1.body)('action')
        .isIn(['APPROVE', 'REJECT'])
        .withMessage('عمل باید APPROVE یا REJECT باشد'),
    (0, express_validator_1.body)('adminNotes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('یادداشت ادمین نباید بیش از 500 کاراکتر باشد')
], (0, roles_1.requirePermission)([roles_2.Permission.MANAGE_PAYMENTS, roles_2.Permission.MANAGE_SYSTEM]), finance_1.FinanceController.processWithdrawalRequest);
/**
 * Get financial analytics
 * GET /api/finance/admin/analytics
 */
router.get('/admin/analytics', [
    (0, express_validator_1.query)('period')
        .optional()
        .isIn(['7d', '30d', '90d', '1y'])
        .withMessage('دوره زمانی نامعتبر است')
], (0, roles_1.requirePermission)([roles_2.Permission.MANAGE_PAYMENTS, roles_2.Permission.MANAGE_SYSTEM]), finance_1.FinanceController.getFinancialAnalytics);
/**
 * Get all transactions (admin view)
 * GET /api/finance/admin/transactions
 */
router.get('/admin/transactions', [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['PURCHASE', 'EARNING', 'WITHDRAWAL', 'REFUND', 'ALL'])
        .withMessage('نوع تراکنش نامعتبر است'),
    (0, express_validator_1.query)('userId')
        .optional()
        .isLength({ min: 1 })
        .withMessage('شناسه کاربر نامعتبر است'),
    (0, express_validator_1.query)('startDate')
        .optional()
        .isISO8601()
        .withMessage('تاریخ شروع نامعتبر است'),
    (0, express_validator_1.query)('endDate')
        .optional()
        .isISO8601()
        .withMessage('تاریخ پایان نامعتبر است'),
    (0, express_validator_1.query)('search')
        .optional()
        .isLength({ min: 1 })
        .withMessage('متن جستجو نامعتبر است')
], (0, roles_1.requirePermission)([roles_2.Permission.MANAGE_PAYMENTS, roles_2.Permission.MANAGE_SYSTEM]), finance_1.FinanceController.getAllTransactions);
/**
 * ADMIN ROUTES
 * مسیرهای مدیریت مالی برای ادمین
 */
/**
 * Get admin financial overview
 * GET /api/finance/admin/overview
 */
router.get('/admin/overview', finance_1.FinanceController.getAdminFinancialOverview);
/**
 * Get all designer wallets
 * GET /api/finance/admin/designer-wallets
 */
router.get('/admin/designer-wallets', [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    (0, express_validator_1.query)('search')
        .optional()
        .isLength({ min: 1 })
        .withMessage('متن جستجو نامعتبر است'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['balance', 'totalEarnings', 'totalWithdrawals', 'lastUpdated'])
        .withMessage('فیلد مرتب‌سازی نامعتبر است'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('ترتیب مرتب‌سازی نامعتبر است')
], finance_1.FinanceController.getAllDesignerWallets);
/**
 * Get withdrawal requests
 * GET /api/finance/admin/withdrawal-requests
 */
router.get('/admin/withdrawal-requests', [
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['PENDING', 'APPROVED', 'REJECTED', 'ALL'])
        .withMessage('وضعیت درخواست نامعتبر است'),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد نتایج باید بین 1 تا 100 باشد')
], finance_1.FinanceController.getWithdrawalRequests);
/**
 * Process withdrawal request (approve/reject)
 * PUT /api/finance/admin/withdrawal-requests/:id
 */
router.put('/admin/withdrawal-requests/:id', [
    (0, express_validator_1.param)('id')
        .isLength({ min: 1 })
        .withMessage('شناسه درخواست الزامی است'),
    (0, express_validator_1.body)('action')
        .isIn(['APPROVE', 'REJECT'])
        .withMessage('عمل باید APPROVE یا REJECT باشد'),
    (0, express_validator_1.body)('adminNotes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('یادداشت ادمین نباید بیش از 500 کاراکتر باشد')
], finance_1.FinanceController.processWithdrawalRequest);
/**
 * Get financial analytics
 * GET /api/finance/admin/analytics
 */
router.get('/admin/analytics', [
    (0, express_validator_1.query)('period')
        .optional()
        .isIn(['7d', '30d', '90d', '1y'])
        .withMessage('دوره زمانی نامعتبر است')
], finance_1.FinanceController.getFinancialAnalytics);
/**
 * Get all transactions (admin view)
 * GET /api/finance/admin/transactions
 */
router.get('/admin/transactions', [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['PURCHASE', 'EARNING', 'WITHDRAWAL', 'REFUND', 'ALL'])
        .withMessage('نوع تراکنش نامعتبر است'),
    (0, express_validator_1.query)('userId')
        .optional()
        .isLength({ min: 1 })
        .withMessage('شناسه کاربر نامعتبر است'),
    (0, express_validator_1.query)('startDate')
        .optional()
        .isISO8601()
        .withMessage('تاریخ شروع نامعتبر است'),
    (0, express_validator_1.query)('endDate')
        .optional()
        .isISO8601()
        .withMessage('تاریخ پایان نامعتبر است'),
    (0, express_validator_1.query)('search')
        .optional()
        .isLength({ min: 1 })
        .withMessage('متن جستجو نامعتبر است')
], finance_1.FinanceController.getAllTransactions);
exports.default = router;
//# sourceMappingURL=finance.js.map