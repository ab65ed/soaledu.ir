/**
 * Field of Study Routes
 * مسیرهای رشته‌های تحصیلی
 */

import { Router } from 'express';
import { getFieldsOfStudy, getFieldOfStudyCategories, getFieldsByCategory, getFieldOfStudyByValue } from '../controllers/fieldOfStudy.controller';

const router = Router();

/**
 * GET /api/v1/field-of-study
 * دریافت لیست کامل رشته‌های تحصیلی
 */
router.get('/', getFieldsOfStudy);

/**
 * GET /api/v1/field-of-study/categories
 * دریافت رشته‌های تحصیلی به تفکیک دسته‌بندی
 */
router.get('/categories', getFieldOfStudyCategories);

/**
 * GET /api/v1/field-of-study/by-category/:category
 * دریافت رشته‌های تحصیلی بر اساس دسته‌بندی
 * Note: This must come before /:value to avoid route conflicts
 */
router.get('/by-category/:category', getFieldsByCategory);

/**
 * GET /api/v1/field-of-study/:value
 * دریافت اطلاعات یک رشته تحصیلی خاص
 */
router.get('/:value', getFieldOfStudyByValue);

export default router; 