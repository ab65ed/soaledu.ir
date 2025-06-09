import express from 'express';
import { authenticateUser, requirePermission } from '../middlewares/auth';
import { Permission } from '../middlewares/roles';
import {
  getWallet,
  recordDesignerEarning,
  requestWithdrawal,
  getWithdrawals,
  getTransactions,
  getFinancialReport,
  getNotificationSettings,
  updateNotificationSettings,
  getDashboardStats,
  approveWithdrawal
} from '../controllers/designer-finance';

const router = express.Router();

// Middleware برای تمام مسیرها - احراز هویت
router.use(authenticateUser);

// دریافت اطلاعات کیف پول
router.get('/wallet', getWallet);

// ثبت درآمد طراح (55% سود)
router.post('/earnings', recordDesignerEarning);

// درخواست برداشت وجه با شبا/کارت
router.post('/withdrawal', requestWithdrawal);

// دریافت لیست درخواست‌های برداشت
router.get('/withdrawals', getWithdrawals);

// دریافت تاریخچه تراکنش‌ها
router.get('/transactions', getTransactions);

// دریافت گزارش مالی
router.get('/report', getFinancialReport);

// تنظیمات نوتیفیکیشن 6 ساعته
router.get('/notifications', getNotificationSettings);
router.put('/notifications', updateNotificationSettings);

// آمار داشبورد
router.get('/dashboard', getDashboardStats);

// Admin Routes
router.post('/admin/withdrawal/:withdrawalId/approve', requirePermission(Permission.ADMIN), approveWithdrawal);

export default router;
