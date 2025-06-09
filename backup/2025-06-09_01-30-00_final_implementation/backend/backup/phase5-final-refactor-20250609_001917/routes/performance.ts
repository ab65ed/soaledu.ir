/**
 * Performance Monitoring Routes
 * 
 * API routes برای مانیتورینگ عملکرد سیستم
 */

import express from 'express';
import {
  getSystemPerformance,
  getABTestPerformance,
  getOptimizationSuggestions,
  applyOptimization,
  getIndexUsageStats
} from '../controllers/performance-monitoring';

const router = express.Router();

// مسیرهای مانیتورینگ عملکرد کلی
router.get('/system', getSystemPerformance);
router.get('/indexes', getIndexUsageStats);

// مسیرهای A/B test performance
router.get('/ab-tests/:testId', getABTestPerformance);

// مسیرهای بهینه‌سازی
router.get('/optimizations', getOptimizationSuggestions);
router.post('/optimizations/:suggestionId/apply', applyOptimization);

export default router; 