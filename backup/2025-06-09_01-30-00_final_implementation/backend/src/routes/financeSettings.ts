/**
 * Finance Settings Routes
 * مسیرهای تنظیمات مالی
 */

import express from 'express';
import { body, param } from 'express-validator';
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
router.put('/global',
  auth,
  requireAdmin,
  [
    body('revenueSharing.designerShare')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('سهم طراح باید بین 0 تا 100 باشد'),
    body('revenueSharing.platformFee')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('سهم پلتفرم باید بین 0 تا 100 باشد'),
    body('pricing.exam.10-20')
      .optional()
      .isInt({ min: 100 })
      .withMessage('قیمت آزمون باید حداقل 100 تومان باشد'),
    body('pricing.exam.21-30')
      .optional()
      .isInt({ min: 100 })
      .withMessage('قیمت آزمون باید حداقل 100 تومان باشد'),
    body('pricing.exam.31-50')
      .optional()
      .isInt({ min: 100 })
      .withMessage('قیمت آزمون باید حداقل 100 تومان باشد')
  ],
  FinanceSettingsController.updateGlobalSettings
);

/**
 * Get exam-specific finance settings
 * GET /api/finance-settings/exam/:examId
 */
router.get('/exam/:examId',
  auth,
  requireAdmin,
  [
    param('examId')
      .isLength({ min: 1 })
      .withMessage('شناسه آزمون الزامی است')
  ],
  FinanceSettingsController.getExamSettings
);

/**
 * Set exam-specific finance settings
 * PUT /api/finance-settings/exam/:examId
 */
router.put('/exam/:examId',
  auth,
  requireAdmin,
  [
    param('examId')
      .isLength({ min: 1 })
      .withMessage('شناسه آزمون الزامی است'),
    body('revenueSharing.designerShare')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('سهم طراح باید بین 0 تا 100 باشد'),
    body('revenueSharing.platformFee')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('سهم پلتفرم باید بین 0 تا 100 باشد')
  ],
  FinanceSettingsController.setExamSettings
);

/**
 * Reset exam settings to global defaults
 * DELETE /api/finance-settings/exam/:examId
 */
router.delete('/exam/:examId',
  auth,
  requireAdmin,
  [
    param('examId')
      .isLength({ min: 1 })
      .withMessage('شناسه آزمون الزامی است')
  ],
  FinanceSettingsController.resetExamSettings
);

/**
 * Get all exams with custom finance settings
 * GET /api/finance-settings/custom-exams
 */
router.get('/custom-exams', auth, requireAdmin, FinanceSettingsController.getCustomExams);

/**
 * Calculate revenue sharing
 * POST /api/finance-settings/calculate-sharing
 */
router.post('/calculate-sharing',
  auth,
  requireAdmin,
  [
    body('amount')
      .isNumeric()
      .withMessage('مبلغ باید عدد باشد')
      .custom((value) => {
        if (value <= 0) {
          throw new Error('مبلغ باید بزرگتر از صفر باشد');
        }
        return true;
      }),
    body('examId')
      .optional()
      .isLength({ min: 1 })
      .withMessage('شناسه آزمون نامعتبر است')
  ],
  FinanceSettingsController.calculateSharing
);

export default router; 