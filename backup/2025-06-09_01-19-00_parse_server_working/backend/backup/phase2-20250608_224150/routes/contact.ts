/**
 * مسیرهای API تماس با ما - Contact Routes
 * @description تعریف مسیرهای API برای مدیریت پیام‌های تماس
 */

import { Router } from 'express';
import { 
  createContact, 
  getContactStats 
} from '../controllers/contact';
import { generalRateLimit } from '../middlewares/security.middleware';

const router = Router();

// Apply rate limiting to all routes
router.use(generalRateLimit);

/**
 * Public Routes
 */

// ایجاد پیام تماس جدید (عمومی)
router.post('/', createContact);

// دریافت آمار پیام‌ها (عمومی برای نمایش در داشبورد)
router.get('/stats', getContactStats);

/**
 * TODO: Protected Routes (نیازمند احراز هویت)
 * این routes بعداً با middleware مناسب اضافه خواهند شد
 */

export default router; 