"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestExamResults = exports.finishTestExam = exports.submitAnswer = exports.startTestExam = exports.getTestExamById = exports.createTestExam = exports.getTestExams = void 0;
const getTestExams = async (req, res) => {
    try {
        res.json({
            success: true,
            data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
            message: "لیست آزمون‌های تستی - پیاده‌سازی موقت"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در دریافت آزمون‌های تستی" });
    }
};
exports.getTestExams = getTestExams;
const createTestExam = async (req, res) => {
    try {
        res.status(201).json({
            success: true,
            data: { id: "test-exam-id", title: req.body.title || "آزمون تستی جدید" },
            message: "آزمون تستی با موفقیت ایجاد شد"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در ایجاد آزمون تستی" });
    }
};
exports.createTestExam = createTestExam;
const getTestExamById = async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            data: { id, title: "آزمون تستی نمونه", questions: [] },
            message: "جزئیات آزمون تستی - پیاده‌سازی موقت"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در دریافت آزمون تستی" });
    }
};
exports.getTestExamById = getTestExamById;
const startTestExam = async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            data: { sessionId: "session-id", examId: id, startTime: new Date() },
            message: "آزمون تستی شروع شد"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در شروع آزمون تستی" });
    }
};
exports.startTestExam = startTestExam;
const submitAnswer = async (req, res) => {
    try {
        res.json({
            success: true,
            data: { submitted: true },
            message: "پاسخ ثبت شد"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در ثبت پاسخ" });
    }
};
exports.submitAnswer = submitAnswer;
const finishTestExam = async (req, res) => {
    try {
        res.json({
            success: true,
            data: { score: 0, percentage: 0, status: "completed" },
            message: "آزمون تستی به پایان رسید"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در پایان آزمون تستی" });
    }
};
exports.finishTestExam = finishTestExam;
const getTestExamResults = async (req, res) => {
    try {
        res.json({
            success: true,
            data: { score: 0, percentage: 0, answers: [] },
            message: "نتایج آزمون تستی - پیاده‌سازی موقت"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "خطا در دریافت نتایج" });
    }
};
exports.getTestExamResults = getTestExamResults;
//# sourceMappingURL=testExamController.js.map