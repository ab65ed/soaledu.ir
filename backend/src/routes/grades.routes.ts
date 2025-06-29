/**
 * Grades Routes
 * مسیرهای مقاطع تحصیلی
 */

import { Router } from 'express';
import { getGrades, getGradeCategories, getGradeByValue } from '../controllers/grade.controller';

const router = Router();

/**
 * GET /api/v1/grades
 * دریافت لیست کامل مقاطع تحصیلی
 */
router.get('/', getGrades);

/**
 * GET /api/v1/grades/categories
 * دریافت مقاطع تحصیلی به تفکیک دسته‌بندی
 */
router.get('/categories', getGradeCategories);

/**
 * GET /api/v1/grades/:value
 * دریافت اطلاعات یک مقطع تحصیلی خاص
 */
router.get('/:value', getGradeByValue);

/**
 * Helper function to get grade description
 * تابع کمکی برای دریافت توضیحات مقطع تحصیلی
 */
function getGradeDescription(grade: string): string {
  const descriptions = {
    'elementary': 'شامل کلاس‌های اول تا ششم ابتدایی که پایه‌های اولیه یادگیری را تشکیل می‌دهد.',
    'middle-school': 'شامل کلاس‌های هفتم تا نهم که دوره متوسطه اول محسوب می‌شود.',
    'high-school': 'شامل کلاس‌های دهم تا دوازدهم که دوره متوسطه دوم و آمادگی برای کنکور است.',
    'associate-degree': 'مقطع کاردانی که معادل دو سال تحصیل پس از دیپلم است.',
    'bachelor-degree': 'مقطع کارشناسی که معادل چهار سال تحصیل دانشگاهی است.',
    'master-degree': 'مقطع کارشناسی ارشد که معادل دو سال تحصیل پس از کارشناسی است.',
    'doctorate-degree': 'مقطع دکتری که بالاترین مقطع تحصیلی و معادل چهار سال تحصیل پس از کارشناسی ارشد است.'
  };
  
  return descriptions[grade as keyof typeof descriptions] || '';
}

/**
 * Helper function to get grade age range
 * تابع کمکی برای دریافت رده سنی مقطع تحصیلی
 */
function getGradeAgeRange(grade: string): string {
  const ageRanges = {
    'elementary': '۶-۱۲ سال',
    'middle-school': '۱۲-۱۵ سال',
    'high-school': '۱۵-۱۸ سال',
    'associate-degree': '۱۸-۲۰ سال',
    'bachelor-degree': '۱۸-۲۲ سال',
    'master-degree': '۲۲-۲۴ سال',
    'doctorate-degree': '۲۴+ سال'
  };
  
  return ageRanges[grade as keyof typeof ageRanges] || '';
}

/**
 * Helper function to get grade duration
 * تابع کمکی برای دریافت مدت زمان مقطع تحصیلی
 */
function getGradeDuration(grade: string): string {
  const durations = {
    'elementary': '۶ سال',
    'middle-school': '۳ سال',
    'high-school': '۳ سال',
    'associate-degree': '۲ سال',
    'bachelor-degree': '۴ سال',
    'master-degree': '۲ سال',
    'doctorate-degree': '۴ سال'
  };
  
  return durations[grade as keyof typeof durations] || '';
}

/**
 * Helper function to get next level
 * تابع کمکی برای دریافت مقطع بعدی
 */
function getNextLevel(grade: string): string {
  const nextLevels = {
    'elementary': 'مقطع متوسطه اول',
    'middle-school': 'مقطع متوسطه دوم',
    'high-school': 'کاردانی یا کارشناسی',
    'associate-degree': 'کارشناسی',
    'bachelor-degree': 'کارشناسی ارشد',
    'master-degree': 'دکتری',
    'doctorate-degree': 'پایان تحصیلات رسمی'
  };
  
  return nextLevels[grade as keyof typeof nextLevels] || '';
}

export default router; 