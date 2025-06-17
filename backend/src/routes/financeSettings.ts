/**
 * Finance Settings Routes
 * مسیرهای تنظیمات مالی
 */

import express from 'express';
// Validation removed for simplicity
import { protectRoute as auth } from '../middlewares/auth';
import { FinanceSettingsController } from '../controllers/financeSettings';

const router = express.Router();

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || !['admin', 'support'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'دسترسی غیرمجاز - فقط ادمین'
    });
  }
  next();
};

/**
 * Get global finance settings
 * GET /api/finance-settings/global
 */
router.get('/global', auth, requireAdmin, FinanceSettingsController.getGlobalSettings);

/**
 * Update global finance settings
 * PUT /api/finance-settings/global
 */
router.put('/global', auth, requireAdmin, FinanceSettingsController.updateGlobalSettings);

/**
 * Get exam-specific finance settings
 * GET /api/finance-settings/exam/:examId
 */
router.get('/exam/:examId', auth, requireAdmin, FinanceSettingsController.getExamSettings);

/**
 * Set exam-specific finance settings
 * PUT /api/finance-settings/exam/:examId
 */
router.put('/exam/:examId', auth, requireAdmin, FinanceSettingsController.setExamSettings);

/**
 * Reset exam settings to global defaults
 * DELETE /api/finance-settings/exam/:examId
 */
router.delete('/exam/:examId', auth, requireAdmin, FinanceSettingsController.resetExamSettings);

/**
 * Get all exams with custom finance settings
 * GET /api/finance-settings/custom-exams
 */
router.get('/custom-exams', auth, requireAdmin, FinanceSettingsController.getCustomExams);

/**
 * Calculate revenue sharing
 * POST /api/finance-settings/calculate-sharing
 */
router.post('/calculate-sharing', auth, requireAdmin, FinanceSettingsController.calculateSharing);

export default router; 