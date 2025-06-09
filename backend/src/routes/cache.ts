import { Router } from 'express';
import { CacheManagementController } from '../controllers/cache-management';
import { protectRoute } from '../middlewares/auth';

const router = Router();

/**
 * مسیرهای مدیریت کش
 */

// دریافت آمار کش
router.get('/stats', protectRoute, CacheManagementController.getCacheStats);

// دریافت جزئیات pool های کش
router.get('/pools', protectRoute, CacheManagementController.getCachePools);

// دریافت آمار attempt کاربر خاص
router.get('/user-attempts/:userId/:examId', protectRoute, CacheManagementController.getUserAttemptStats);

// پاک کردن کل کش (فقط ادمین)
router.delete('/clear', protectRoute, CacheManagementController.clearCache);

// پاک کردن کش دسته‌بندی خاص
router.delete('/clear/:category', protectRoute, CacheManagementController.clearCacheByCategory);

// پیش‌گرم کردن کش
router.post('/warmup', protectRoute, CacheManagementController.warmupCache);

export default router; 