"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cache_management_1 = require("../controllers/cache-management");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * مسیرهای مدیریت کش
 */
// دریافت آمار کش
router.get('/stats', auth_1.protectRoute, cache_management_1.CacheManagementController.getCacheStats);
// دریافت جزئیات pool های کش
router.get('/pools', auth_1.protectRoute, cache_management_1.CacheManagementController.getCachePools);
// دریافت آمار attempt کاربر خاص
router.get('/user-attempts/:userId/:examId', auth_1.protectRoute, cache_management_1.CacheManagementController.getUserAttemptStats);
// پاک کردن کل کش (فقط ادمین)
router.delete('/clear', auth_1.protectRoute, cache_management_1.CacheManagementController.clearCache);
// پاک کردن کش دسته‌بندی خاص
router.delete('/clear/:category', auth_1.protectRoute, cache_management_1.CacheManagementController.clearCacheByCategory);
// پیش‌گرم کردن کش
router.post('/warmup', auth_1.protectRoute, cache_management_1.CacheManagementController.warmupCache);
exports.default = router;
//# sourceMappingURL=cache.js.map