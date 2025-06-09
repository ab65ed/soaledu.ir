/**
 * Wallet Routes
 * مسیرهای API برای مدیریت کیف پول
 */

import express from 'express';
import { body, query } from 'express-validator';
import { WalletController } from '../controllers/wallet';
import { authenticateToken } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permissions';
import { Permission } from '../models/roles';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * Get wallet statistics
 * GET /api/wallet/stats
 */
router.get('/stats', 
  requirePermission(Permission.MANAGE_PAYMENTS),
  WalletController.getWalletStats
);

/**
 * Get wallet transactions
 * GET /api/wallet/transactions
 */
router.get('/transactions', [
  query('page').optional().isInt({ min: 1 }).withMessage('شماره صفحه باید عدد مثبت باشد'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
  query('userId').optional().isString().withMessage('شناسه کاربر معتبر نیست'),
  query('type').optional().isIn(['charge', 'deduct', 'purchase', 'refund', 'bonus', 'penalty']).withMessage('نوع تراکنش معتبر نیست'),
  query('status').optional().isIn(['pending', 'completed', 'failed', 'cancelled']).withMessage('وضعیت تراکنش معتبر نیست'),
  query('startDate').optional().isISO8601().withMessage('تاریخ شروع معتبر نیست'),
  query('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست')
], WalletController.getWalletTransactions);

/**
 * Charge wallet
 * POST /api/wallet/charge
 */
router.post('/charge', [
  requirePermission(Permission.MANAGE_PAYMENTS),
  body('userId')
    .notEmpty()
    .withMessage('شناسه کاربر الزامی است')
    .isString()
    .withMessage('شناسه کاربر معتبر نیست'),
  body('amount')
    .isInt({ min: 1000, max: 100000000 })
    .withMessage('مبلغ باید بین 1000 تا 100000000 تومان باشد'),
  body('description')
    .isLength({ min: 5, max: 500 })
    .withMessage('توضیحات باید بین 5 تا 500 کاراکتر باشد'),
  body('type')
    .isIn(['charge', 'bonus'])
    .withMessage('نوع تراکنش برای شارژ باید charge یا bonus باشد')
], WalletController.chargeWallet);

/**
 * Deduct from wallet
 * POST /api/wallet/deduct
 */
router.post('/deduct', [
  requirePermission(Permission.MANAGE_PAYMENTS),
  body('userId')
    .notEmpty()
    .withMessage('شناسه کاربر الزامی است')
    .isString()
    .withMessage('شناسه کاربر معتبر نیست'),
  body('amount')
    .isInt({ min: 1000, max: 100000000 })
    .withMessage('مبلغ باید بین 1000 تا 100000000 تومان باشد'),
  body('description')
    .isLength({ min: 5, max: 500 })
    .withMessage('توضیحات باید بین 5 تا 500 کاراکتر باشد'),
  body('type')
    .isIn(['deduct', 'purchase', 'penalty'])
    .withMessage('نوع تراکنش برای کسر باید deduct، purchase یا penalty باشد')
], WalletController.deductFromWallet);

/**
 * Get user wallet balance
 * GET /api/wallet/balance/:userId
 */
router.get('/balance/:userId', [
  requirePermission(Permission.VIEW_USER_PROFILES)
], WalletController.getUserWalletBalance);

/**
 * Get user transaction history
 * GET /api/wallet/user/:userId/transactions
 */
router.get('/user/:userId/transactions', [
  query('page').optional().isInt({ min: 1 }).withMessage('شماره صفحه باید عدد مثبت باشد'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('تعداد نتایج باید بین 1 تا 50 باشد'),
  query('type').optional().isIn(['charge', 'deduct', 'purchase', 'refund', 'bonus', 'penalty']).withMessage('نوع تراکنش معتبر نیست'),
  query('status').optional().isIn(['pending', 'completed', 'failed', 'cancelled']).withMessage('وضعیت تراکنش معتبر نیست')
], WalletController.getUserTransactions);

/**
 * Process refund
 * POST /api/wallet/refund
 */
router.post('/refund', [
  requirePermission(Permission.PROCESS_REFUNDS),
  body('transactionId')
    .notEmpty()
    .withMessage('شناسه تراکنش الزامی است'),
  body('amount')
    .optional()
    .isInt({ min: 1000 })
    .withMessage('مبلغ بازگشت باید حداقل 1000 تومان باشد'),
  body('reason')
    .isLength({ min: 10, max: 500 })
    .withMessage('دلیل بازگشت وجه باید بین 10 تا 500 کاراکتر باشد')
], WalletController.processRefund);

/**
 * Get wallet analytics
 * GET /api/wallet/analytics
 */
router.get('/analytics', [
  requirePermission(Permission.VIEW_FINANCIAL_REPORTS),
  query('period').optional().isIn(['day', 'week', 'month', 'year']).withMessage('دوره زمانی معتبر نیست'),
  query('startDate').optional().isISO8601().withMessage('تاریخ شروع معتبر نیست'),
  query('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست')
], WalletController.getWalletAnalytics);

/**
 * Export wallet transactions
 * GET /api/wallet/export
 */
router.get('/export', [
  requirePermission(Permission.EXPORT_DATA),
  query('format').optional().isIn(['csv', 'excel', 'pdf']).withMessage('فرمت صادرات معتبر نیست'),
  query('startDate').optional().isISO8601().withMessage('تاریخ شروع معتبر نیست'),
  query('endDate').optional().isISO8601().withMessage('تاریخ پایان معتبر نیست'),
  query('userId').optional().isString().withMessage('شناسه کاربر معتبر نیست'),
  query('type').optional().isIn(['charge', 'deduct', 'purchase', 'refund', 'bonus', 'penalty']).withMessage('نوع تراکنش معتبر نیست')
], WalletController.exportTransactions);

/**
 * Bulk wallet operations
 * POST /api/wallet/bulk
 */
router.post('/bulk', [
  requirePermission(Permission.MANAGE_PAYMENTS),
  body('operations')
    .isArray({ min: 1, max: 100 })
    .withMessage('عملیات‌ها باید آرایه‌ای با حداقل 1 و حداکثر 100 عضو باشد'),
  body('operations.*.userId')
    .notEmpty()
    .withMessage('شناسه کاربر الزامی است'),
  body('operations.*.amount')
    .isInt({ min: 1000, max: 10000000 })
    .withMessage('مبلغ باید بین 1000 تا 10000000 تومان باشد'),
  body('operations.*.type')
    .isIn(['charge', 'deduct', 'bonus', 'penalty'])
    .withMessage('نوع عملیات معتبر نیست'),
  body('operations.*.description')
    .isLength({ min: 5, max: 200 })
    .withMessage('توضیحات باید بین 5 تا 200 کاراکتر باشد')
], WalletController.bulkWalletOperations);

export default router; 