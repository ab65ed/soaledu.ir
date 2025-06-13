/**
 * Institutional Discount Routes
 * 
 * مسیرهای API برای مدیریت تخفیف‌های سازمانی
 */

import express from 'express';
import {
  uploadInstitutionalDiscountList,
  getInstitutionalDiscountGroups,
  getInstitutionalDiscountGroupById,
  deleteInstitutionalDiscountGroup,
  upload,
  getUsageReport,
  getRevenueReport,
  getConversionReport,
  getComparisonReport
} from '../controllers/institutionalDiscountController';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = express.Router();

/**
 * بارگذاری فایل اکسل تخفیف‌های سازمانی
 * POST /api/admin/institutional-discounts/upload
 */
router.post(
  '/upload',
  authenticateToken,
  requireRole('admin'),
  upload.single('file'),
  uploadInstitutionalDiscountList
);

/**
 * دریافت لیست گروه‌های تخفیف سازمانی
 * GET /api/admin/institutional-discounts/groups
 */
router.get(
  '/groups',
  authenticateToken,
  requireRole('admin'),
  getInstitutionalDiscountGroups
);

/**
 * دریافت جزئیات یک گروه تخفیف
 * GET /api/admin/institutional-discounts/groups/:id
 */
router.get(
  '/groups/:id',
  authenticateToken,
  requireRole('admin'),
  getInstitutionalDiscountGroupById
);

/**
 * حذف گروه تخفیف (غیرفعال کردن)
 * DELETE /api/admin/institutional-discounts/groups/:id
 */
router.delete(
  '/groups/:id',
  authenticateToken,
  requireRole('admin'),
  deleteInstitutionalDiscountGroup
);

/**
 * گزارش استفاده از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/usage
 */
router.get(
  '/reports/usage',
  authenticateToken,
  requireRole('admin'),
  getUsageReport
);

/**
 * گزارش درآمد از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/revenue
 */
router.get(
  '/reports/revenue',
  authenticateToken,
  requireRole('admin'),
  getRevenueReport
);

/**
 * گزارش نرخ تبدیل (Conversion Rate)
 * GET /api/admin/institutional-discounts/reports/conversion
 */
router.get(
  '/reports/conversion',
  authenticateToken,
  requireRole('admin'),
  getConversionReport
);

/**
 * گزارش مقایسه‌ای گروه‌های تخفیف
 * GET /api/admin/institutional-discounts/reports/comparison
 */
router.get(
  '/reports/comparison',
  authenticateToken,
  requireRole('admin'),
  getComparisonReport
);

export default router; 