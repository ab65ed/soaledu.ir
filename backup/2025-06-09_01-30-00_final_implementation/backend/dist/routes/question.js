"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_1 = require("../controllers/question");
const roles_1 = require("../middlewares/roles");
const router = (0, express_1.Router)();
// ==================== Middleware Application ====================
// All routes require authentication
router.use(roles_1.authenticate);
// ==================== Question Routes ====================
/**
 * @route GET /api/questions
 * @desc دریافت تمام سوالات با فیلتر و صفحه‌بندی
 * @access Private (Question Designer, Expert, Admin)
 * @query {
 *   courseExamId?: string,
 *   type?: 'multiple-choice' | 'true-false' | 'descriptive',
 *   difficulty?: 'easy' | 'medium' | 'hard',
 *   tags?: string[],
 *   search?: string,
 *   authorId?: string,
 *   isActive?: boolean,
 *   page?: number,
 *   limit?: number
 * }
 */
router.get('/', (0, roles_1.authorize)(roles_1.PermissionAction.READ, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('READ', 'Question'), question_1.QuestionController.getAllQuestions);
/**
 * @route GET /api/questions/:id
 * @desc دریافت سوال خاص با شناسه
 * @access Private (Question Designer, Expert, Admin)
 * @param {string} id - شناسه سوال
 */
router.get('/:id', (0, roles_1.authorize)(roles_1.PermissionAction.READ, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('READ', 'Question'), question_1.QuestionController.getQuestionById);
/**
 * @route POST /api/questions
 * @desc ایجاد سوال جدید
 * @access Private (Question Designer, Admin)
 * @body {
 *   courseExamId: string,
 *   title: string,
 *   content: string,
 *   type: 'multiple-choice' | 'true-false' | 'descriptive',
 *   options?: Array<{label: string, content: string, isCorrect: boolean}>,
 *   correctAnswer: string,
 *   difficulty: 'easy' | 'medium' | 'hard',
 *   source?: string,
 *   sourcePage?: number,
 *   explanation?: string,
 *   tags?: string[],
 *   metadata?: {points?: number, timeLimit?: number, chapter?: string}
 * }
 */
router.post('/', (0, roles_1.authorize)(roles_1.PermissionAction.CREATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('CREATE', 'Question'), question_1.QuestionController.createQuestion);
/**
 * @route PUT /api/questions/:id
 * @desc ویرایش سوال موجود
 * @access Private (Question Designer, Admin) - فقط سازنده سوال یا ادمین
 * @param {string} id - شناسه سوال
 * @body Same as POST but all fields optional except courseExamId
 */
router.put('/:id', (0, roles_1.authorize)(roles_1.PermissionAction.UPDATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('UPDATE', 'Question'), question_1.QuestionController.updateQuestion);
/**
 * @route DELETE /api/questions/:id
 * @desc حذف سوال
 * @access Private (Question Designer, Admin) - فقط سازنده سوال یا ادمین
 * @param {string} id - شناسه سوال
 */
router.delete('/:id', (0, roles_1.authorize)(roles_1.PermissionAction.DELETE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('DELETE', 'Question'), question_1.QuestionController.deleteQuestion);
/**
 * @route POST /api/questions/:id/duplicate
 * @desc کپی کردن سوال
 * @access Private (Question Designer, Admin)
 * @param {string} id - شناسه سوال اصلی
 */
router.post('/:id/duplicate', (0, roles_1.authorize)(roles_1.PermissionAction.CREATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('DUPLICATE', 'Question'), question_1.QuestionController.duplicateQuestion);
/**
 * @route PUT /api/questions/:id/auto-save
 * @desc ذخیره لحظه‌ای تغییرات سوال
 * @access Private (Question Designer, Admin) - فقط سازنده سوال یا ادمین
 * @param {string} id - شناسه سوال
 * @body Same as PUT but intended for frequent auto-save operations
 */
router.put('/:id/auto-save', (0, roles_1.authorize)(roles_1.PermissionAction.UPDATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('AUTO_SAVE', 'Question'), question_1.QuestionController.autoSaveQuestion);
// ==================== Advanced Routes ====================
/**
 * @route GET /api/questions/course-exam/:courseExamId
 * @desc دریافت سوالات مخصوص یک درس-آزمون
 * @access Private (Question Designer, Expert, Admin)
 * @param {string} courseExamId - شناسه درس-آزمون
 */
router.get('/course-exam/:courseExamId', (0, roles_1.authorize)(roles_1.PermissionAction.READ, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('READ', 'Question'), (req, res, next) => {
    // Add courseExamId to query params
    req.query.courseExamId = req.params.courseExamId;
    next();
}, question_1.QuestionController.getAllQuestions);
/**
 * @route GET /api/questions/stats/:courseExamId
 * @desc آمار سوالات یک درس-آزمون
 * @access Private (Question Designer, Expert, Admin)
 * @param {string} courseExamId - شناسه درس-آزمون
 */
router.get('/stats/:courseExamId', (0, roles_1.authorize)(roles_1.PermissionAction.READ, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('READ_STATS', 'Question'), question_1.QuestionController.getCourseExamQuestionStats);
/**
 * @route POST /api/questions/bulk
 * @desc ایجاد چندین سوال به صورت دسته‌ای
 * @access Private (Question Designer, Admin)
 * @body {
 *   questions: Array<QuestionCreateData>
 * }
 */
router.post('/bulk', (0, roles_1.authorize)(roles_1.PermissionAction.CREATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('BULK_CREATE', 'Question'), async (req, res) => {
    try {
        // TODO: Implement bulk question creation
        res.status(501).json({
            success: false,
            error: 'عملیات ایجاد گروهی هنوز پیاده‌سازی نشده است'
        });
    }
    catch (error) {
        console.error('Error bulk creating questions:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در ایجاد گروهی سوالات'
        });
    }
});
/**
 * @route PUT /api/questions/bulk
 * @desc ویرایش چندین سوال به صورت دسته‌ای
 * @access Private (Question Designer, Admin)
 * @body {
 *   questionIds: string[],
 *   updates: Partial<QuestionUpdateData>
 * }
 */
router.put('/bulk', (0, roles_1.authorize)(roles_1.PermissionAction.UPDATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('BULK_UPDATE', 'Question'), async (req, res) => {
    try {
        // TODO: Implement bulk question updates
        res.status(501).json({
            success: false,
            error: 'عملیات ویرایش گروهی هنوز پیاده‌سازی نشده است'
        });
    }
    catch (error) {
        console.error('Error bulk updating questions:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در ویرایش گروهی سوالات'
        });
    }
});
/**
 * @route DELETE /api/questions/bulk
 * @desc حذف چندین سوال به صورت دسته‌ای
 * @access Private (Question Designer, Admin)
 * @body {
 *   questionIds: string[]
 * }
 */
router.delete('/bulk', (0, roles_1.authorize)(roles_1.PermissionAction.DELETE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('BULK_DELETE', 'Question'), async (req, res) => {
    try {
        // TODO: Implement bulk question deletion
        res.status(501).json({
            success: false,
            error: 'عملیات حذف گروهی هنوز پیاده‌سازی نشده است'
        });
    }
    catch (error) {
        console.error('Error bulk deleting questions:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در حذف گروهی سوالات'
        });
    }
});
/**
 * @route GET /api/questions/search/tags
 * @desc جستجوی برچسب‌های موجود
 * @access Private (Question Designer, Expert, Admin)
 * @query {
 *   query?: string,
 *   limit?: number
 * }
 */
router.get('/search/tags', (0, roles_1.authorize)(roles_1.PermissionAction.READ, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('SEARCH_TAGS', 'Question'), async (req, res) => {
    try {
        // TODO: Implement tag search
        res.json({
            success: true,
            data: []
        });
    }
    catch (error) {
        console.error('Error searching tags:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در جستجوی برچسب‌ها'
        });
    }
});
/**
 * @route POST /api/questions/:id/toggle-active
 * @desc فعال/غیرفعال کردن سوال
 * @access Private (Question Designer, Admin) - فقط سازنده سوال یا ادمین
 * @param {string} id - شناسه سوال
 */
router.post('/:id/toggle-active', (0, roles_1.authorize)(roles_1.PermissionAction.UPDATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('TOGGLE_ACTIVE', 'Question'), async (req, res) => {
    try {
        // TODO: Implement question activation toggle
        res.status(501).json({
            success: false,
            error: 'عملیات تغییر وضعیت هنوز پیاده‌سازی نشده است'
        });
    }
    catch (error) {
        console.error('Error toggling question status:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در تغییر وضعیت سوال'
        });
    }
});
// ==================== Course-Exam Integration Routes ====================
/**
 * @route POST /api/questions/course-exam/:courseExamId/publish
 * @desc انتشار سوالات یک درس-آزمون برای آزمون تستی
 * @access Private (Question Designer, Admin)
 * @param {string} courseExamId - شناسه درس-آزمون
 * @body {
 *   questionIds?: string[], // اگر خالی باشد همه سوالات منتشر می‌شوند
 *   testExamId?: string // شناسه آزمون تستی مقصد
 * }
 */
router.post('/course-exam/:courseExamId/publish', (0, roles_1.authorize)(roles_1.PermissionAction.PUBLISH, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('PUBLISH_TO_TEST_EXAM', 'Question'), question_1.QuestionController.publishQuestionsToTestExam);
/**
 * @route GET /api/questions/course-exam/:courseExamId/published
 * @desc دریافت سوالات منتشر شده یک درس-آزمون
 * @access Private (Question Designer, Expert, Admin)
 * @param {string} courseExamId - شناسه درس-آزمون
 */
router.get('/course-exam/:courseExamId/published', (0, roles_1.authorize)(roles_1.PermissionAction.READ, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('READ_PUBLISHED', 'Question'), question_1.QuestionController.getPublishedQuestions);
/**
 * @route GET /api/questions/stats/:courseExamId
 * @desc آمار سوالات یک درس-آزمون
 * @access Private (Question Designer, Expert, Admin)
 * @param {string} courseExamId - شناسه درس-آزمون
 */
router.get('/stats/:courseExamId', (0, roles_1.authorize)(roles_1.PermissionAction.READ, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('READ_STATS', 'Question'), question_1.QuestionController.getCourseExamQuestionStats);
/**
 * @route PUT /api/questions/:questionId/link-course-exam
 * @desc اتصال سوال به درس-آزمون جدید
 * @access Private (Question Designer, Admin) - فقط سازنده سوال یا ادمین
 * @param {string} questionId - شناسه سوال
 * @body {
 *   newCourseExamId: string
 * }
 */
router.put('/:questionId/link-course-exam', (0, roles_1.authorize)(roles_1.PermissionAction.UPDATE, roles_1.PermissionResource.QUESTION), (0, roles_1.logActivity)('LINK_COURSE_EXAM', 'Question'), question_1.QuestionController.linkQuestionToCourseExam);
exports.default = router;
//# sourceMappingURL=question.js.map