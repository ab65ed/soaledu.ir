"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exam_purchase_management_1 = require("../controllers/exam-purchase-management");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * مسیرهای مدیریت خرید آزمون‌ها و کش هوشمند
 */
// دریافت آمار کش خرید آزمون‌ها
router.get('/cache-stats', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.getCacheStats);
// دریافت آمار خرید کاربر برای درس خاص
router.get('/user-stats/:userId/:subjectId', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.getUserPurchaseStats);
// دریافت آمار تکرار آزمون
router.get('/repetition-stats/:userId/:examId', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.getExamRepetitionStats);
// تولید سوالات آزمون (خرید جدید یا تکرار)
router.post('/generate-questions', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.generateExamQuestions);
// ثبت خرید جدید آزمون
router.post('/record-purchase', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.recordExamPurchase);
// دریافت لیست آزمون‌های خریداری شده کاربر
router.get('/user-exams/:userId', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.getUserPurchasedExams);
// پاک کردن کل کش (فقط ادمین)
router.delete('/clear-cache', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.clearAllCaches);
// پاک کردن کش مربوط به درس خاص
router.delete('/clear-cache/:subjectId', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.clearSubjectCache);
// پیش‌گرم کردن کش برای دروس پرطرفدار
router.post('/warmup-cache', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.warmupCache);
// تست عملکرد کش
router.post('/test-performance', auth_1.protectRoute, exam_purchase_management_1.ExamPurchaseManagementController.testCachePerformance);
exports.default = router;
//# sourceMappingURL=exam-purchase.js.map