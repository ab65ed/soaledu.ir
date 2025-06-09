"use strict";
/**
 * Wallet Routes
 * مسیرهای API برای مدیریت کیف پول
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const wallet_1 = require("../controllers/wallet");
const auth_1 = require("../middlewares/auth");
const permissions_1 = require("../middlewares/permissions");
const roles_1 = require("../models/roles");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
/**
 * Get wallet statistics
 * GET /api/wallet/stats
 */
router.get('/stats', (0, permissions_1.requirePermission)(roles_1.Permission.MANAGE_PAYMENTS), wallet_1.WalletController.getWalletStats);
/**
 * Get wallet transactions
 * GET /api/wallet/transactions
 */
router.get('/transactions', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    (0, express_validator_1.query)('userId').optional().isString().withMessage('شناسه کاربر معتبر نیست'),
    (0, express_validator_1.query)('type').optional().isIn(['charge', 'deduct', 'purchase', 'refund', 'bonus', 'penalty']).withMessage('نوع تراکنش معتبر نیست'),
    (0, express_validator_1.query)('status').optional().isIn(['pending', 'completed', 'failed', 'cancelled']).withMessage('وضعیت تراکنش معتبر نیست'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('تاریخ شروع معتبر نیست'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست')
], wallet_1.WalletController.getWalletTransactions);
/**
 * Charge wallet
 * POST /api/wallet/charge
 */
router.post('/charge', [
    (0, permissions_1.requirePermission)(roles_1.Permission.MANAGE_PAYMENTS),
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('شناسه کاربر الزامی است')
        .isString()
        .withMessage('شناسه کاربر معتبر نیست'),
    (0, express_validator_1.body)('amount')
        .isInt({ min: 1000, max: 100000000 })
        .withMessage('مبلغ باید بین 1000 تا 100000000 تومان باشد'),
    (0, express_validator_1.body)('description')
        .isLength({ min: 5, max: 500 })
        .withMessage('توضیحات باید بین 5 تا 500 کاراکتر باشد'),
    (0, express_validator_1.body)('type')
        .isIn(['charge', 'bonus'])
        .withMessage('نوع تراکنش برای شارژ باید charge یا bonus باشد')
], wallet_1.WalletController.chargeWallet);
/**
 * Deduct from wallet
 * POST /api/wallet/deduct
 */
router.post('/deduct', [
    (0, permissions_1.requirePermission)(roles_1.Permission.MANAGE_PAYMENTS),
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('شناسه کاربر الزامی است')
        .isString()
        .withMessage('شناسه کاربر معتبر نیست'),
    (0, express_validator_1.body)('amount')
        .isInt({ min: 1000, max: 100000000 })
        .withMessage('مبلغ باید بین 1000 تا 100000000 تومان باشد'),
    (0, express_validator_1.body)('description')
        .isLength({ min: 5, max: 500 })
        .withMessage('توضیحات باید بین 5 تا 500 کاراکتر باشد'),
    (0, express_validator_1.body)('type')
        .isIn(['deduct', 'purchase', 'penalty'])
        .withMessage('نوع تراکنش برای کسر باید deduct، purchase یا penalty باشد')
], wallet_1.WalletController.deductFromWallet);
/**
 * Get user wallet balance
 * GET /api/wallet/balance/:userId
 */
router.get('/balance/:userId', [
    (0, permissions_1.requirePermission)(roles_1.Permission.VIEW_USER_PROFILES)
], wallet_1.WalletController.getUserWalletBalance);
/**
 * Get user transaction history
 * GET /api/wallet/user/:userId/transactions
 */
router.get('/user/:userId/transactions', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('شماره صفحه باید عدد مثبت باشد'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 50 }).withMessage('تعداد نتایج باید بین 1 تا 50 باشد'),
    (0, express_validator_1.query)('type').optional().isIn(['charge', 'deduct', 'purchase', 'refund', 'bonus', 'penalty']).withMessage('نوع تراکنش معتبر نیست'),
    (0, express_validator_1.query)('status').optional().isIn(['pending', 'completed', 'failed', 'cancelled']).withMessage('وضعیت تراکنش معتبر نیست')
], wallet_1.WalletController.getUserTransactions);
/**
 * Process refund
 * POST /api/wallet/refund
 */
router.post('/refund', [
    (0, permissions_1.requirePermission)(roles_1.Permission.PROCESS_REFUNDS),
    (0, express_validator_1.body)('transactionId')
        .notEmpty()
        .withMessage('شناسه تراکنش الزامی است'),
    (0, express_validator_1.body)('amount')
        .optional()
        .isInt({ min: 1000 })
        .withMessage('مبلغ بازگشت باید حداقل 1000 تومان باشد'),
    (0, express_validator_1.body)('reason')
        .isLength({ min: 10, max: 500 })
        .withMessage('دلیل بازگشت وجه باید بین 10 تا 500 کاراکتر باشد')
], wallet_1.WalletController.processRefund);
/**
 * Get wallet analytics
 * GET /api/wallet/analytics
 */
router.get('/analytics', [
    (0, permissions_1.requirePermission)(roles_1.Permission.VIEW_FINANCIAL_REPORTS),
    (0, express_validator_1.query)('period').optional().isIn(['day', 'week', 'month', 'year']).withMessage('دوره زمانی معتبر نیست'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('تاریخ شروع معتبر نیست'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست')
], wallet_1.WalletController.getWalletAnalytics);
/**
 * Export wallet transactions
 * GET /api/wallet/export
 */
router.get('/export', [
    (0, permissions_1.requirePermission)(roles_1.Permission.EXPORT_DATA),
    (0, express_validator_1.query)('format').optional().isIn(['csv', 'excel', 'pdf']).withMessage('فرمت صادرات معتبر نیست'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('تاریخ شروع معتبر نیست'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست'),
    (0, express_validator_1.query)('userId').optional().isString().withMessage('شناسه کاربر معتبر نیست'),
    (0, express_validator_1.query)('type').optional().isIn(['charge', 'deduct', 'purchase', 'refund', 'bonus', 'penalty']).withMessage('نوع تراکنش معتبر نیست')
], wallet_1.WalletController.exportTransactions);
/**
 * Bulk wallet operations
 * POST /api/wallet/bulk
 */
router.post('/bulk', [
    (0, permissions_1.requirePermission)(roles_1.Permission.MANAGE_PAYMENTS),
    (0, express_validator_1.body)('operations')
        .isArray({ min: 1, max: 100 })
        .withMessage('عملیات‌ها باید آرایه‌ای با حداقل 1 و حداکثر 100 عضو باشد'),
    (0, express_validator_1.body)('operations.*.userId')
        .notEmpty()
        .withMessage('شناسه کاربر الزامی است'),
    (0, express_validator_1.body)('operations.*.amount')
        .isInt({ min: 1000, max: 10000000 })
        .withMessage('مبلغ باید بین 1000 تا 10000000 تومان باشد'),
    (0, express_validator_1.body)('operations.*.type')
        .isIn(['charge', 'deduct', 'bonus', 'penalty'])
        .withMessage('نوع عملیات معتبر نیست'),
    (0, express_validator_1.body)('operations.*.description')
        .isLength({ min: 5, max: 200 })
        .withMessage('توضیحات باید بین 5 تا 200 کاراکتر باشد')
], wallet_1.WalletController.bulkWalletOperations);
exports.default = router;
//# sourceMappingURL=wallet.js.map