"use strict";
/**
 * Performance Monitoring Routes
 *
 * API routes برای مانیتورینگ عملکرد سیستم
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const performance_monitoring_1 = require("../controllers/performance-monitoring");
const router = express_1.default.Router();
// مسیرهای مانیتورینگ عملکرد کلی
router.get('/system', performance_monitoring_1.getSystemPerformance);
router.get('/indexes', performance_monitoring_1.getIndexUsageStats);
// مسیرهای A/B test performance
router.get('/ab-tests/:testId', performance_monitoring_1.getABTestPerformance);
// مسیرهای بهینه‌سازی
router.get('/optimizations', performance_monitoring_1.getOptimizationSuggestions);
router.post('/optimizations/:suggestionId/apply', performance_monitoring_1.applyOptimization);
exports.default = router;
//# sourceMappingURL=performance.js.map