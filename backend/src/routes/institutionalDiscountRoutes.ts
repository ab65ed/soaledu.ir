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

export default router; 