import { Router } from "express";
import { protectRoute } from "../middlewares/auth";

const router = Router();

router.use(protectRoute);

router.get("/", async (req, res) => {
  res.json({ success: true, data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }, message: "لیست آزمون‌های درسی - پیاده‌سازی موقت" });
});

router.post("/", async (req, res) => {
  res.status(201).json({ success: true, data: { id: "course-exam-id", title: req.body.title || "آزمون درسی جدید" }, message: "آزمون درسی با موفقیت ایجاد شد" });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.json({ success: true, data: { id, title: "آزمون درسی نمونه", questions: [] }, message: "جزئیات آزمون درسی" });
});

router.post("/:id/publish", async (req, res) => {
  res.json({ success: true, message: "آزمون درسی منتشر شد" });
});

router.get("/:id/validation", async (req, res) => {
  res.json({ success: true, data: { isValid: true, errors: [] }, message: "اعتبارسنجی آزمون درسی" });
});

export default router;