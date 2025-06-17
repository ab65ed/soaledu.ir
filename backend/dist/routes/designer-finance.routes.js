"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protectRoute);
router.get("/wallet", async (req, res) => {
    res.json({ success: true, data: { balance: 0, totalEarnings: 0, pendingWithdrawals: 0 }, message: "اطلاعات کیف پول طراح" });
});
router.post("/withdrawal", async (req, res) => {
    res.status(201).json({ success: true, data: { id: "withdrawal-id", amount: req.body.amount }, message: "درخواست برداشت ثبت شد" });
});
router.get("/transactions", async (req, res) => {
    res.json({ success: true, data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }, message: "تاریخچه تراکنش‌ها" });
});
router.post("/admin/withdrawal/:withdrawalId/approve", async (req, res) => {
    res.json({ success: true, message: "درخواست برداشت تایید شد" });
});
exports.default = router;
//# sourceMappingURL=designer-finance.routes.js.map