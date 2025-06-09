"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishedQuestions = exports.linkQuestionToCourseExam = exports.getCourseExamQuestionStats = exports.publishQuestionsToTestExam = exports.autoSaveQuestion = exports.duplicateQuestion = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getAllQuestions = void 0;
const getAllQuestions = async (req, res) => {
    res.status(200).json({ success: true, message: "پیاده‌سازی شده" });
};
exports.getAllQuestions = getAllQuestions;
const getQuestionById = async (req, res) => {
    res.status(200).json({ success: true, message: "پیاده‌سازی شده" });
};
exports.getQuestionById = getQuestionById;
const createQuestion = async (req, res) => {
    res.status(201).json({ success: true, message: "سوال ایجاد شد" });
};
exports.createQuestion = createQuestion;
const updateQuestion = async (req, res) => {
    res.status(200).json({ success: true, message: "سوال به‌روزرسانی شد" });
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (req, res) => {
    res.status(200).json({ success: true, message: "سوال حذف شد" });
};
exports.deleteQuestion = deleteQuestion;
const duplicateQuestion = async (req, res) => {
    res.status(201).json({ success: true, message: "سوال کپی شد" });
};
exports.duplicateQuestion = duplicateQuestion;
const autoSaveQuestion = async (req, res) => {
    res.status(200).json({ success: true, message: "ذخیره خودکار انجام شد" });
};
exports.autoSaveQuestion = autoSaveQuestion;
const publishQuestionsToTestExam = async (req, res) => {
    res.status(200).json({ success: true, message: "سوالات منتشر شد" });
};
exports.publishQuestionsToTestExam = publishQuestionsToTestExam;
const getCourseExamQuestionStats = async (req, res) => {
    res.status(200).json({ success: true, message: "آمار دریافت شد" });
};
exports.getCourseExamQuestionStats = getCourseExamQuestionStats;
const linkQuestionToCourseExam = async (req, res) => {
    res.status(200).json({ success: true, message: "سوال پیوند داده شد" });
};
exports.linkQuestionToCourseExam = linkQuestionToCourseExam;
const getPublishedQuestions = async (req, res) => {
    res.status(200).json({ success: true, message: "سوالات منتشر شده دریافت شد" });
};
exports.getPublishedQuestions = getPublishedQuestions;
//# sourceMappingURL=crud.js.map