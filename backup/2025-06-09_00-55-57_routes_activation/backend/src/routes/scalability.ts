/**
 * Scalability Routes
 * 
 * API routes for database optimization and scalability management
 */

import express from 'express';
import { 
  getScalabilityOverview,
  getIndexes,
  createIndex,
  deleteIndex,
  getOptimizationSuggestions,
  implementSuggestion,
  rejectSuggestion,
  generateSuggestions,
  getPerformanceMetrics
} from '../controllers/scalability';

const router = express.Router();

// نمای کلی مقیاس‌پذیری
router.get('/overview', getScalabilityOverview);

// مدیریت ایندکس‌ها
router.get('/indexes', getIndexes);
router.post('/indexes', createIndex);
router.delete('/indexes/:id', deleteIndex);

// پیشنهادات بهینه‌سازی
router.get('/suggestions', getOptimizationSuggestions);
router.post('/suggestions/generate', generateSuggestions);
router.post('/suggestions/:id/implement', implementSuggestion);
router.post('/suggestions/:id/reject', rejectSuggestion);

// متریک‌های عملکرد
router.get('/performance', getPerformanceMetrics);

export default router; 