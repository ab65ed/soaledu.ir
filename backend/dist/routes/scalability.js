"use strict";
/**
 * Scalability Routes
 *
 * API routes for database optimization and scalability management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scalability_1 = require("../controllers/scalability");
const router = express_1.default.Router();
// نمای کلی مقیاس‌پذیری
router.get('/overview', scalability_1.getScalabilityOverview);
// مدیریت ایندکس‌ها
router.get('/indexes', scalability_1.getIndexes);
router.post('/indexes', scalability_1.createIndex);
router.delete('/indexes/:id', scalability_1.deleteIndex);
// پیشنهادات بهینه‌سازی
router.get('/suggestions', scalability_1.getOptimizationSuggestions);
router.post('/suggestions/generate', scalability_1.generateSuggestions);
router.post('/suggestions/:id/implement', scalability_1.implementSuggestion);
router.post('/suggestions/:id/reject', scalability_1.rejectSuggestion);
// متریک‌های عملکرد
router.get('/performance', scalability_1.getPerformanceMetrics);
exports.default = router;
//# sourceMappingURL=scalability.js.map