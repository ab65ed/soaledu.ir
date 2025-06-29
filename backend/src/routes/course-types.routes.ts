/**
 * Course Types Routes
 * مسیرهای انواع درس
 */

import { Router } from 'express';
import { getCourseTypes, getCourseTypeByValue, testDatabase } from '../controllers/courseType.controller';

const router = Router();

// ⚠️ مهم: Route های specific باید قبل از route های parameter باشند

/**
 * GET /api/v1/course-types/debug-test
 * تست debug کاملاً جدید
 */
router.get('/debug-test', (req, res) => {
  console.log('🔥 DEBUG TEST CALLED!');
  res.json({ 
    message: 'DEBUG TEST WORKING!', 
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method 
  });
});

/**
 * GET /api/v1/course-types/simple-test
 * تست ساده route
 */
router.get('/simple-test', (req, res) => {
  res.json({ test: 'working', timestamp: new Date().toISOString() });
});

/**
 * GET /api/v1/course-types/test/database
 * تست اتصال پایگاه داده
 */
router.get('/test/database', testDatabase);

/**
 * GET /api/v1/course-types
 * دریافت لیست کامل انواع درس
 */
router.get('/', getCourseTypes);

/**
 * GET /api/v1/course-types/:value
 * دریافت اطلاعات یک نوع درس خاص
 * ⚠️ این route باید آخرین route باشد چون هر چیزی را match می‌کند
 */
router.get('/:value', getCourseTypeByValue);

export default router; 