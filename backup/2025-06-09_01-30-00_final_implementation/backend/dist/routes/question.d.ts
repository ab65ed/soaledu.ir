/**
 * Question Routes
 * مسیرهای API برای مدیریت سوالات
 *
 * مسیرهای پشتیبانی شده:
 * - GET /api/questions - دریافت سوالات با فیلتر
 * - GET /api/questions/:id - دریافت سوال خاص
 * - POST /api/questions - ایجاد سوال جدید
 * - PUT /api/questions/:id - ویرایش سوال
 * - DELETE /api/questions/:id - حذف سوال
 * - POST /api/questions/:id/duplicate - کپی سوال
 * - PUT /api/questions/:id/auto-save - ذخیره لحظه‌ای
 *
 * @author Exam-Edu Platform
 * @version 1.0.0
 */
declare const router: import("express-serve-static-core").Router;
export default router;
