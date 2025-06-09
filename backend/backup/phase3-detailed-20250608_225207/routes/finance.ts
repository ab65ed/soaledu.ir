/**
 * Finance Routes
 * مسیرهای API برای سیستم مالی
 * 
 * @author Exam-Edu Platform
 * @version 1.1.0
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { FinanceController } from '../controllers/finance';
import { authenticateToken } from '../middlewares/auth';
import { requirePermission } from '../middlewares/roles';
import { Permission } from '../types/roles';
import { requirePermission } from '../middlewares/roles';
import { Permission } from '../types/roles';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * Calculate exam pricing
 * POST /api/finance/calculate-price
 */
router.post('/calculate-price',
  [
    body('questionCount')
      .isInt({ min: 10, max: 50 })
      .withMessage('تعداد سوالات باید بین 10 تا 50 باشد'),
    body('userType')
      .optional()
      .isIn(['regular', 'student', 'premium'])
      .withMessage('نوع کاربر نامعتبر است'),
    body('isFirstPurchase')
      .optional()
      .isBoolean()
      .withMessage('وضعیت اولین خرید باید boolean باشد'),
    body('bulkCount')
      .optional()
      .isInt({ min: 0 })
      .withMessage('تعداد خرید عمده باید عدد مثبت باشد')
  ],
  FinanceController.calculatePrice
);

/**
 * Calculate flashcard pricing
 * POST /api/finance/calculate-flashcard-price
 */
router.post('/calculate-flashcard-price',
  [
    body('flashcardIds')
      .isArray({ min: 1 })
      .withMessage('شناسه فلش‌کارت‌ها الزامی است'),
    body('flashcardIds.*')
      .isLength({ min: 1 })
      .withMessage('شناسه فلش‌کارت نامعتبر است'),
    body('userType')
      .optional()
      .isIn(['regular', 'student', 'premium'])
      .withMessage('نوع کاربر نامعتبر است'),
    body('isFirstPurchase')
      .optional()
      .isBoolean()
      .withMessage('وضعیت اولین خرید باید boolean باشد')
  ],
  FinanceController.calculateFlashcardPrice
);

/**
 * Get exam price by exam ID
 * GET /api/finance/exam-price/:examId
 */
router.get('/exam-price/:examId',
  [
    param('examId')
      .isLength({ min: 1 })
      .withMessage('شناسه آزمون الزامی است')
  ],
  FinanceController.getExamPrice
);

/**
 * Get flashcard price by flashcard ID
 * GET /api/finance/flashcard-price/:flashcardId
 */
router.get('/flashcard-price/:flashcardId',
  [
    param('flashcardId')
      .isLength({ min: 1 })
      .withMessage('شناسه فلش‌کارت الزامی است')
  ],
  FinanceController.getFlashcardPrice
);

/**
 * Create payment transaction
 * POST /api/finance/create-payment
 */
router.post('/create-payment',
  [
    body('examId')
      .isLength({ min: 1 })
      .withMessage('شناسه آزمون الزامی است'),
    body('paymentMethod')
      .isIn(['credit_card', 'bank_transfer', 'wallet', 'zarinpal', 'mellat'])
      .withMessage('روش پرداخت نامعتبر است'),
    body('returnUrl')
      .isURL()
      .withMessage('آدرس بازگشت نامعتبر است')
  ],
  FinanceController.createPayment
);

/**
 * Verify payment
 * POST /api/finance/verify-payment
 */
router.post('/verify-payment',
  [
    body('transactionId')
      .isLength({ min: 1 })
      .withMessage('شناسه تراکنش الزامی است'),
    body('paymentReference')
      .isLength({ min: 1 })
      .withMessage('مرجع پرداخت الزامی است')
  ],
  FinanceController.verifyPayment
);

/**
 * Get user payment history
 * GET /api/finance/payment-history
 */
router.get('/payment-history',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('شماره صفحه باید عدد مثبت باشد'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    query('status')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'refunded'])
      .withMessage('وضعیت تراکنش نامعتبر است')
  ],
  FinanceController.getPaymentHistory
);

/**
 * Get financial statistics
 * GET /api/finance/statistics
 */
router.get('/statistics',
  [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('تاریخ شروع نامعتبر است'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('تاریخ پایان نامعتبر است')
  ],
  FinanceController.getStatistics
);

/**
 * ADMIN ROUTES
 * مسیرهای مدیریت مالی برای ادمین
 */

/**
 * Get admin financial overview
 * GET /api/finance/admin/overview
 */
router.get('/admin/overview',
  requirePermission([Permission.MANAGE_PAYMENTS, Permission.MANAGE_SYSTEM]),
  FinanceController.getAdminFinancialOverview
);

/**
 * Get all designer wallets
 * GET /api/finance/admin/designer-wallets
 */
router.get('/admin/designer-wallets',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('شماره صفحه باید عدد مثبت باشد'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    query('search')
      .optional()
      .isLength({ min: 1 })
      .withMessage('متن جستجو نامعتبر است'),
    query('sortBy')
      .optional()
      .isIn(['balance', 'totalEarnings', 'totalWithdrawals', 'lastUpdated'])
      .withMessage('فیلد مرتب‌سازی نامعتبر است'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('ترتیب مرتب‌سازی نامعتبر است')
  ],
  requirePermission([Permission.MANAGE_PAYMENTS, Permission.MANAGE_SYSTEM]),
  FinanceController.getAllDesignerWallets
);

/**
 * Get withdrawal requests
 * GET /api/finance/admin/withdrawal-requests
 */
router.get('/admin/withdrawal-requests',
  [
    query('status')
      .optional()
      .isIn(['PENDING', 'APPROVED', 'REJECTED', 'ALL'])
      .withMessage('وضعیت درخواست نامعتبر است'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('شماره صفحه باید عدد مثبت باشد'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('تعداد نتایج باید بین 1 تا 100 باشد')
  ],
  requirePermission([Permission.MANAGE_PAYMENTS, Permission.MANAGE_SYSTEM]),
  FinanceController.getWithdrawalRequests
);

/**
 * Process withdrawal request (approve/reject)
 * PUT /api/finance/admin/withdrawal-requests/:id
 */
router.put('/admin/withdrawal-requests/:id',
  [
    param('id')
      .isLength({ min: 1 })
      .withMessage('شناسه درخواست الزامی است'),
    body('action')
      .isIn(['APPROVE', 'REJECT'])
      .withMessage('عمل باید APPROVE یا REJECT باشد'),
    body('adminNotes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('یادداشت ادمین نباید بیش از 500 کاراکتر باشد')
  ],
  requirePermission([Permission.MANAGE_PAYMENTS, Permission.MANAGE_SYSTEM]),
  FinanceController.processWithdrawalRequest
);

/**
 * Get financial analytics
 * GET /api/finance/admin/analytics
 */
router.get('/admin/analytics',
  [
    query('period')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('دوره زمانی نامعتبر است')
  ],
  requirePermission([Permission.MANAGE_PAYMENTS, Permission.MANAGE_SYSTEM]),
  FinanceController.getFinancialAnalytics
);

/**
 * Get all transactions (admin view)
 * GET /api/finance/admin/transactions
 */
router.get('/admin/transactions',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('شماره صفحه باید عدد مثبت باشد'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    query('type')
      .optional()
      .isIn(['PURCHASE', 'EARNING', 'WITHDRAWAL', 'REFUND', 'ALL'])
      .withMessage('نوع تراکنش نامعتبر است'),
    query('userId')
      .optional()
      .isLength({ min: 1 })
      .withMessage('شناسه کاربر نامعتبر است'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('تاریخ شروع نامعتبر است'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('تاریخ پایان نامعتبر است'),
    query('search')
      .optional()
      .isLength({ min: 1 })
      .withMessage('متن جستجو نامعتبر است')
  ],
  requirePermission([Permission.MANAGE_PAYMENTS, Permission.MANAGE_SYSTEM]),
  FinanceController.getAllTransactions
);

/**
 * ADMIN ROUTES
 * مسیرهای مدیریت مالی برای ادمین
 */

/**
 * Get admin financial overview
 * GET /api/finance/admin/overview
 */
router.get('/admin/overview',
  FinanceController.getAdminFinancialOverview
);

/**
 * Get all designer wallets
 * GET /api/finance/admin/designer-wallets
 */
router.get('/admin/designer-wallets',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('شماره صفحه باید عدد مثبت باشد'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    query('search')
      .optional()
      .isLength({ min: 1 })
      .withMessage('متن جستجو نامعتبر است'),
    query('sortBy')
      .optional()
      .isIn(['balance', 'totalEarnings', 'totalWithdrawals', 'lastUpdated'])
      .withMessage('فیلد مرتب‌سازی نامعتبر است'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('ترتیب مرتب‌سازی نامعتبر است')
  ],
  FinanceController.getAllDesignerWallets
);

/**
 * Get withdrawal requests
 * GET /api/finance/admin/withdrawal-requests
 */
router.get('/admin/withdrawal-requests',
  [
    query('status')
      .optional()
      .isIn(['PENDING', 'APPROVED', 'REJECTED', 'ALL'])
      .withMessage('وضعیت درخواست نامعتبر است'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('شماره صفحه باید عدد مثبت باشد'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('تعداد نتایج باید بین 1 تا 100 باشد')
  ],
  FinanceController.getWithdrawalRequests
);

/**
 * Process withdrawal request (approve/reject)
 * PUT /api/finance/admin/withdrawal-requests/:id
 */
router.put('/admin/withdrawal-requests/:id',
  [
    param('id')
      .isLength({ min: 1 })
      .withMessage('شناسه درخواست الزامی است'),
    body('action')
      .isIn(['APPROVE', 'REJECT'])
      .withMessage('عمل باید APPROVE یا REJECT باشد'),
    body('adminNotes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('یادداشت ادمین نباید بیش از 500 کاراکتر باشد')
  ],
  FinanceController.processWithdrawalRequest
);

/**
 * Get financial analytics
 * GET /api/finance/admin/analytics
 */
router.get('/admin/analytics',
  [
    query('period')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('دوره زمانی نامعتبر است')
  ],
  FinanceController.getFinancialAnalytics
);

/**
 * Get all transactions (admin view)
 * GET /api/finance/admin/transactions
 */
router.get('/admin/transactions',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('شماره صفحه باید عدد مثبت باشد'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('تعداد نتایج باید بین 1 تا 100 باشد'),
    query('type')
      .optional()
      .isIn(['PURCHASE', 'EARNING', 'WITHDRAWAL', 'REFUND', 'ALL'])
      .withMessage('نوع تراکنش نامعتبر است'),
    query('userId')
      .optional()
      .isLength({ min: 1 })
      .withMessage('شناسه کاربر نامعتبر است'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('تاریخ شروع نامعتبر است'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('تاریخ پایان نامعتبر است'),
    query('search')
      .optional()
      .isLength({ min: 1 })
      .withMessage('متن جستجو نامعتبر است')
  ],
  FinanceController.getAllTransactions
);

export default router; 