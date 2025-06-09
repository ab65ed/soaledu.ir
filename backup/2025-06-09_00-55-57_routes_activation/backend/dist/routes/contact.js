"use strict";
/**
 * مسیرهای API تماس با ما - Contact Routes
 * @description تعریف مسیرهای API برای مدیریت پیام‌های تماس
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_1 = require("../controllers/contact");
const security_middleware_1 = require("../middlewares/security.middleware");
const router = (0, express_1.Router)();
// Apply rate limiting to all routes
router.use(security_middleware_1.generalRateLimit);
/**
 * Public Routes
 */
// ایجاد پیام تماس جدید (عمومی)
router.post('/', contact_1.createContact);
// دریافت آمار پیام‌ها (عمومی برای نمایش در داشبورد)
router.get('/stats', contact_1.getContactStats);
/**
 * TODO: Protected Routes (نیازمند احراز هویت)
 * این routes بعداً با middleware مناسب اضافه خواهند شد
 */
exports.default = router;
//# sourceMappingURL=contact.js.map