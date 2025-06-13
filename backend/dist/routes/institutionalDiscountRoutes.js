"use strict";
/**
 * Institutional Discount Routes
 *
 * مسیرهای API برای مدیریت تخفیف‌های سازمانی
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const institutionalDiscountController_1 = require("../controllers/institutionalDiscountController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/**
 * بارگذاری فایل اکسل تخفیف‌های سازمانی
 * POST /api/admin/institutional-discounts/upload
 */
router.post('/upload', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.upload.single('file'), institutionalDiscountController_1.uploadInstitutionalDiscountList);
/**
 * دریافت لیست گروه‌های تخفیف سازمانی
 * GET /api/admin/institutional-discounts/groups
 */
router.get('/groups', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.getInstitutionalDiscountGroups);
/**
 * دریافت جزئیات یک گروه تخفیف
 * GET /api/admin/institutional-discounts/groups/:id
 */
router.get('/groups/:id', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.getInstitutionalDiscountGroupById);
/**
 * حذف گروه تخفیف (غیرفعال کردن)
 * DELETE /api/admin/institutional-discounts/groups/:id
 */
router.delete('/groups/:id', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.deleteInstitutionalDiscountGroup);
/**
 * گزارش استفاده از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/usage
 */
router.get('/reports/usage', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.getUsageReport);
/**
 * گزارش درآمد از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/revenue
 */
router.get('/reports/revenue', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.getRevenueReport);
/**
 * گزارش نرخ تبدیل (Conversion Rate)
 * GET /api/admin/institutional-discounts/reports/conversion
 */
router.get('/reports/conversion', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.getConversionReport);
/**
 * گزارش مقایسه‌ای گروه‌های تخفیف
 * GET /api/admin/institutional-discounts/reports/comparison
 */
router.get('/reports/comparison', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), institutionalDiscountController_1.getComparisonReport);
exports.default = router;
//# sourceMappingURL=institutionalDiscountRoutes.js.map