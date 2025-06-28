/**
 * Course Types Routes
 * مسیرهای انواع درس
 */

import { Router, Request, Response } from 'express';
import { COURSE_TYPES, COURSE_TYPE_LABELS } from '../validations/courseExamValidation';

const router = Router();

/**
 * GET /api/v1/course-types
 * دریافت لیست کامل انواع درس با عناوین و توضیحات فارسی
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const courseTypesList = COURSE_TYPES.map(type => ({
      value: type,
      label: COURSE_TYPE_LABELS[type],
      description: getCourseTypeDescription(type),
      examples: getCourseTypeExamples(type),
      usage: getCourseTypeUsage(type)
    }));

    res.status(200).json({
      success: true,
      message: 'لیست انواع درس با موفقیت دریافت شد',
      data: {
        courseTypes: courseTypesList,
        total: courseTypesList.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست انواع درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

/**
 * Helper function to get course type description
 * تابع کمکی برای دریافت توضیحات نوع درس
 */
function getCourseTypeDescription(type: string): string {
  const descriptions = {
    'academic': 'شامل محتواییه که مستقیم به برنامه درسی رسمی (مثل کتاب‌های درسی آموزش‌وپرورش یا دانشگاه) مربوط می‌شه.',
    'non-academic': 'شامل محتواییه که در برنامه درسی رسمی نیست، اما برای یادگیری عمومی یا مهارت‌های جانبی مناسبه.',
    'skill-based': 'محتوایی که روی یادگیری مهارت‌های خاص (فنی یا غیرفنی) تمرکز داره.',
    'aptitude': 'شامل محتواییه که برای سنجش استعداد یا هوش طراحی شده.',
    'general': 'محتوایی که به درس خاصی وابسته نیست و برای دانش عمومی یا فرهنگ‌سازی مناسبه.',
    'specialized': 'محتوایی که برای رشته‌ها یا حوزه‌های خیلی خاص طراحی شده.'
  };
  
  return descriptions[type as keyof typeof descriptions] || '';
}

/**
 * Helper function to get course type examples
 * تابع کمکی برای دریافت مثال‌های نوع درس
 */
function getCourseTypeExamples(type: string): string {
  const examples = {
    'academic': 'سوالات ریاضی، ادبیات، فیزیک که برای امتحانات کلاسی یا کنکور طراحی می‌شن.',
    'non-academic': 'سوالات آموزش مهارت‌های زندگی، تفکر خلاق، یا موضوعات عمومی مثل فرهنگ و هنر.',
    'skill-based': 'سوالات برنامه‌نویسی، مهارت‌های نرم‌افزاری، یا مهارت‌های حرفه‌ای مثل مدیریت زمان.',
    'aptitude': 'سوالات هوش و استعداد تحلیلی، تست‌های روان‌شناختی یا المپیادها.',
    'general': 'سوالات اطلاعات عمومی، تاریخ جهان، یا موضوعات محیط‌زیستی.',
    'specialized': 'سوالات پزشکی تخصصی، مهندسی پیشرفته، یا حقوق.'
  };
  
  return examples[type as keyof typeof examples] || '';
}

/**
 * Helper function to get course type usage
 * تابع کمکی برای دریافت کاربرد نوع درس
 */
function getCourseTypeUsage(type: string): string {
  const usages = {
    'academic': 'برای آزمون‌های استاندارد مدارس یا کنکور.',
    'non-academic': 'برای دوره‌های آموزشی آزاد یا فلش‌کارت‌های یادگیری عمومی.',
    'skill-based': 'برای آزمون‌های حرفه‌ای یا دوره‌های تخصصی.',
    'aptitude': 'برای آزمون‌های ورودی تیزهوشان یا المپیادهای علمی.',
    'general': 'برای فلش‌کارت‌ها یا آزمون‌های سرگرمی و آموزشی.',
    'specialized': 'برای آزمون‌های دانشگاهی یا حرفه‌ای پیشرفته.'
  };
  
  return usages[type as keyof typeof usages] || '';
}

export default router; 