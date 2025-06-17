"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const designer_finance_1 = require("../controllers/designer-finance");
const router = express_1.default.Router();
// Middleware برای تمام مسیرها - احراز هویت
router.use(auth_1.authenticateUser);
// دریافت اطلاعات کیف پول
router.get('/wallet', designer_finance_1.getWallet);
// ثبت درآمد طراح (55% سود)
router.post('/earnings', designer_finance_1.recordDesignerEarning);
// درخواست برداشت وجه با شبا/کارت
router.post('/withdrawal', designer_finance_1.requestWithdrawal);
// دریافت لیست درخواست‌های برداشت
router.get('/withdrawals', designer_finance_1.getWithdrawals);
// دریافت تاریخچه تراکنش‌ها
router.get('/transactions', designer_finance_1.getTransactions);
// دریافت گزارش مالی
router.get('/report', designer_finance_1.getFinancialReport);
// تنظیمات نوتیفیکیشن 6 ساعته
router.get('/notifications', designer_finance_1.getNotificationSettings);
router.put('/notifications', designer_finance_1.updateNotificationSettings);
// آمار داشبورد
router.get('/dashboard', designer_finance_1.getDashboardStats);
// Admin Routes - simplified
router.post('/admin/withdrawal/:withdrawalId/approve', designer_finance_1.approveWithdrawal);
exports.default = router;
//# sourceMappingURL=designer-finance.js.map