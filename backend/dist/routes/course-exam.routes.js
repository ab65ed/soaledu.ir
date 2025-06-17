"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protectRoute);
router.get("/", async (req, res) => {
    res.json({ success: true, data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }, message: "لیست آزمون‌های درسی - پیاده‌سازی موقت" });
});
router.post("/", async (req, res) => {
    res.status(201).json({ success: true, data: { id: "course-exam-id", title: req.body.title || "آزمون درسی جدید" }, message: "آزمون درسی با موفقیت ایجاد شد" });
});
exports.default = router;
//# sourceMappingURL=course-exam.routes.js.map