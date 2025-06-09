import { Router } from 'express';
import { ExamPurchaseManagementController } from '../controllers/exam-purchase-management';
import { protectRoute } from '../middlewares/auth';

const router = Router();

/**
 * مسیرهای مدیریت خرید آزمون‌ها و کش هوشمند
 */

// دریافت آمار کش خرید آزمون‌ها
router.get('/cache-stats', protectRoute, ExamPurchaseManagementController.getCacheStats);

// دریافت آمار خرید کاربر برای درس خاص
router.get('/user-stats/:userId/:subjectId', protectRoute, ExamPurchaseManagementController.getUserPurchaseStats);

// دریافت آمار تکرار آزمون
router.get('/repetition-stats/:userId/:examId', protectRoute, ExamPurchaseManagementController.getExamRepetitionStats);

// تولید سوالات آزمون (خرید جدید یا تکرار)
router.post('/generate-questions', protectRoute, ExamPurchaseManagementController.generateExamQuestions);

// ثبت خرید جدید آزمون
router.post('/record-purchase', protectRoute, ExamPurchaseManagementController.recordExamPurchase);

// دریافت لیست آزمون‌های خریداری شده کاربر
router.get('/user-exams/:userId', protectRoute, ExamPurchaseManagementController.getUserPurchasedExams);

// پاک کردن کل کش (فقط ادمین)
router.delete('/clear-cache', protectRoute, ExamPurchaseManagementController.clearAllCaches);

// پاک کردن کش مربوط به درس خاص
router.delete('/clear-cache/:subjectId', protectRoute, ExamPurchaseManagementController.clearSubjectCache);

// پیش‌گرم کردن کش برای دروس پرطرفدار
router.post('/warmup-cache', protectRoute, ExamPurchaseManagementController.warmupCache);

// تست عملکرد کش
router.post('/test-performance', protectRoute, ExamPurchaseManagementController.testCachePerformance);

export default router; 