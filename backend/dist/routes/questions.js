"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protectRoute);
router.get("/", async (req, res) => {
    res.json({ success: true, data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }, message: "لیست سوالات - پیاده‌سازی موقت" });
});
router.post("/", async (req, res) => {
    res.status(201).json({ success: true, data: { id: "question-id", title: req.body.title || "سوال جدید" }, message: "سوال با موفقیت ایجاد شد" });
});
router.get("/search", async (req, res) => {
    res.json({ success: true, data: [], message: "نتایج جستجو - پیاده‌سازی موقت" });
});
router.get("/stats", async (req, res) => {
    res.json({ success: true, data: { total: 0, published: 0, draft: 0 }, message: "آمار سوالات - پیاده‌سازی موقت" });
});
exports.default = router;
//# sourceMappingURL=questions.js.map