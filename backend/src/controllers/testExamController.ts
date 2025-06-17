import { Request, Response } from "express";

export const getTestExams = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
      message: "لیست آزمون‌های تستی - پیاده‌سازی موقت"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در دریافت آزمون‌های تستی" });
  }
};

export const createTestExam = async (req: Request, res: Response) => {
  try {
    res.status(201).json({
      success: true,
      data: { id: "test-exam-id", title: req.body.title || "آزمون تستی جدید" },
      message: "آزمون تستی با موفقیت ایجاد شد"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در ایجاد آزمون تستی" });
  }
};

export const getTestExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      data: { id, title: "آزمون تستی نمونه", questions: [] },
      message: "جزئیات آزمون تستی - پیاده‌سازی موقت"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در دریافت آزمون تستی" });
  }
};

export const startTestExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      data: { sessionId: "session-id", examId: id, startTime: new Date() },
      message: "آزمون تستی شروع شد"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در شروع آزمون تستی" });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: { submitted: true },
      message: "پاسخ ثبت شد"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در ثبت پاسخ" });
  }
};

export const finishTestExam = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: { score: 0, percentage: 0, status: "completed" },
      message: "آزمون تستی به پایان رسید"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در پایان آزمون تستی" });
  }
};

export const getTestExamResults = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: { score: 0, percentage: 0, answers: [] },
      message: "نتایج آزمون تستی - پیاده‌سازی موقت"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در دریافت نتایج" });
  }
};