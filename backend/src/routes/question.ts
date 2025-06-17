import { Router } from "express";
import { protectRoute } from "../middlewares/auth";

const router = Router();

router.use(protectRoute);

router.get("/", async (req, res) => {
  res.json({ success: true, data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }, message: "لیست سوالات - پیاده‌سازی موقت" });
});

router.post("/", async (req, res) => {
  res.status(201).json({ success: true, data: { id: "question-id", title: req.body.title || "سوال جدید" }, message: "سوال با موفقیت ایجاد شد" });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.json({ success: true, data: { id, title: "سوال نمونه", type: "multiple_choice" }, message: "جزئیات سوال" });
});

router.put("/:id", async (req, res) => {
  res.json({ success: true, message: "سوال به‌روزرسانی شد" });
});

router.delete("/:id", async (req, res) => {
  res.json({ success: true, message: "سوال حذف شد" });
});

export default router;