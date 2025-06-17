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
// Validation removed for simplicity
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
router.put('/global', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.updateGlobalSettings);
/**
 * Get exam-specific finance settings
 * GET /api/finance-settings/exam/:examId
 */
router.get('/exam/:examId', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.getExamSettings);
/**
 * Set exam-specific finance settings
 * PUT /api/finance-settings/exam/:examId
 */
router.put('/exam/:examId', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.setExamSettings);
/**
 * Reset exam settings to global defaults
 * DELETE /api/finance-settings/exam/:examId
 */
router.delete('/exam/:examId', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.resetExamSettings);
/**
 * Get all exams with custom finance settings
 * GET /api/finance-settings/custom-exams
 */
router.get('/custom-exams', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.getCustomExams);
/**
 * Calculate revenue sharing
 * POST /api/finance-settings/calculate-sharing
 */
router.post('/calculate-sharing', auth_1.protectRoute, requireAdmin, financeSettings_1.FinanceSettingsController.calculateSharing);
exports.default = router;
//# sourceMappingURL=financeSettings.js.map