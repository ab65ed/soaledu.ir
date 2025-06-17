/**
 * Finance Routes
 * روت‌های مدیریت مالی با کنترل دسترسی ادمین
 */

import { Router } from 'express';
import { protectRoute } from '../middlewares/auth';

const router = Router();

// Apply authentication to all routes
router.use(protectRoute);

// Mock routes for finance management
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      totalRevenue: 0,
      totalTransactions: 0,
      pendingPayments: 0
    },
    message: 'داشبورد مالی - پیاده‌سازی موقت'
  });
});

router.get('/transactions', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'لیست تراکنش‌ها - پیاده‌سازی موقت'
  });
});

router.get('/reports', (req, res) => {
  res.json({
    success: true,
    data: {
      dailyRevenue: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0
    },
    message: 'گزارشات مالی - پیاده‌سازی موقت'
  });
});

export default router; 