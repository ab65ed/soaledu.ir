"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        res.status(201).json({
            success: true,
            data: { id: "contact-id", message: "پیام شما دریافت شد" },
            message: "پیام تماس با موفقیت ارسال شد"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در ارسال پیام" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            data: { id, subject: "موضوع نمونه", message: "پیام نمونه", status: "pending" },
            message: "جزئیات پیام تماس"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در دریافت پیام" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "پیام تماس به‌روزرسانی شد"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در به‌روزرسانی پیام" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "پیام تماس حذف شد"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در حذف پیام" });
    }
});
router.post("/:id/reply", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "پاسخ ارسال شد"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در ارسال پاسخ" });
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map