import { Request, Response } from "express";
import Parse from "parse/node";

export const getRoles = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: [
        { id: "admin", name: "مدیر", permissions: ["all"] },
        { id: "designer", name: "طراح", permissions: ["create_exam", "edit_exam"] },
        { id: "student", name: "دانشجو", permissions: ["take_exam"] },
        { id: "expert", name: "کارشناس", permissions: ["review_exam"] },
        { id: "support", name: "پشتیبانی", permissions: ["view_tickets"] }
      ],
      message: "لیست نقش‌ها - پیاده‌سازی موقت"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در دریافت نقش‌ها" });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: ["create_exam", "edit_exam", "delete_exam", "take_exam", "review_exam", "manage_users", "view_reports", "view_tickets"],
      message: "لیست مجوزها - پیاده‌سازی موقت"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در دریافت مجوزها" });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: { totalUsers: 0, activeExams: 0, totalQuestions: 0, recentActivities: [] },
      message: "آمار داشبورد - پیاده‌سازی موقت"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در دریافت آمار داشبورد" });
  }
};