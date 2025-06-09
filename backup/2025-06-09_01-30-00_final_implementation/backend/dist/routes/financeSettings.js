"use strict";
/**
 * Finance Settings Routes
 * مسیرهای تنظیمات مالی
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middlewares/auth");
const financeSettings_1 = require("../controllers/financeSettings");
const router = express_1.default.Router();
// Admin middleware
const requireAdmin = (req, res, next) => {
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
router.get('/global', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.getGlobalSettings);
/**
 * Update global finance settings
 * PUT /api/finance-settings/global
 */
router.put('/global', auth_1.protectRoute, requireAdmin, [
    (0, express_validator_1.body)('revenueSharing.designerShare')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('سهم طراح باید بین 0 تا 100 باشد'),
    (0, express_validator_1.body)('revenueSharing.platformFee')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('سهم پلتفرم باید بین 0 تا 100 باشد'),
    (0, express_validator_1.body)('pricing.exam.10-20')
        .optional()
        .isInt({ min: 100 })
        .withMessage('قیمت آزمون باید حداقل 100 تومان باشد'),
    (0, express_validator_1.body)('pricing.exam.21-30')
        .optional()
        .isInt({ min: 100 })
        .withMessage('قیمت آزمون باید حداقل 100 تومان باشد'),
    (0, express_validator_1.body)('pricing.exam.31-50')
        .optional()
        .isInt({ min: 100 })
        .withMessage('قیمت آزمون باید حداقل 100 تومان باشد')
], financeSettings_1.FinanceSettingsController.updateGlobalSettings);
/**
 * Get exam-specific finance settings
 * GET /api/finance-settings/exam/:examId
 */
router.get('/exam/:examId', auth_1.protectRoute, requireAdmin, [
    (0, express_validator_1.param)('examId')
        .isLength({ min: 1 })
        .withMessage('شناسه آزمون الزامی است')
], financeSettings_1.FinanceSettingsController.getExamSettings);
/**
 * Set exam-specific finance settings
 * PUT /api/finance-settings/exam/:examId
 */
router.put('/exam/:examId', auth_1.protectRoute, requireAdmin, [
    (0, express_validator_1.param)('examId')
        .isLength({ min: 1 })
        .withMessage('شناسه آزمون الزامی است'),
    (0, express_validator_1.body)('revenueSharing.designerShare')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('سهم طراح باید بین 0 تا 100 باشد'),
    (0, express_validator_1.body)('revenueSharing.platformFee')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('سهم پلتفرم باید بین 0 تا 100 باشد')
], financeSettings_1.FinanceSettingsController.setExamSettings);
/**
 * Reset exam settings to global defaults
 * DELETE /api/finance-settings/exam/:examId
 */
router.delete('/exam/:examId', auth_1.protectRoute, requireAdmin, [
    (0, express_validator_1.param)('examId')
        .isLength({ min: 1 })
        .withMessage('شناسه آزمون الزامی است')
], financeSettings_1.FinanceSettingsController.resetExamSettings);
/**
 * Get all exams with custom finance settings
 * GET /api/finance-settings/custom-exams
 */
router.get('/custom-exams', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.getCustomExams);
/**
 * Calculate revenue sharing
 * POST /api/finance-settings/calculate-sharing
 */
router.post('/calculate-sharing', auth_1.protectRoute, requireAdmin, [
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('مبلغ باید عدد باشد')
        .custom((value) => {
        if (value <= 0) {
            throw new Error('مبلغ باید بزرگتر از صفر باشد');
        }
        return true;
    }),
    (0, express_validator_1.body)('examId')
        .optional()
        .isLength({ min: 1 })
        .withMessage('شناسه آزمون نامعتبر است')
], financeSettings_1.FinanceSettingsController.calculateSharing);
exports.default = router;
//# sourceMappingURL=financeSettings.js.map