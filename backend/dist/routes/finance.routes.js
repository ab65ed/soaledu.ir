"use strict";
/**
 * Finance Routes
 * روت‌های مدیریت مالی با کنترل دسترسی ادمین
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Apply authentication to all routes
router.use(auth_1.protectRoute);
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
exports.default = router;
//# sourceMappingURL=finance.routes.js.map