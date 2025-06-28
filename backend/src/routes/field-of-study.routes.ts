/**
 * Field of Study Routes
 * مسیرهای رشته‌های تحصیلی
 */

import { Router, Request, Response } from 'express';
import { FIELD_OF_STUDY, FIELD_OF_STUDY_LABELS } from '../validations/courseExamValidation';

const router = Router();

/**
 * GET /api/v1/field-of-study
 * دریافت لیست کامل رشته‌های تحصیلی با عناوین فارسی
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const fieldOfStudyList = FIELD_OF_STUDY.map(field => ({
      value: field,
      label: FIELD_OF_STUDY_LABELS[field],
      category: getCategoryByField(field)
    }));

    res.status(200).json({
      success: true,
      message: 'لیست رشته‌های تحصیلی با موفقیت دریافت شد',
      data: {
        fields: fieldOfStudyList,
        total: fieldOfStudyList.length,
        categories: getFieldCategories()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست رشته‌های تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

/**
 * GET /api/v1/field-of-study/categories
 * دریافت دسته‌بندی رشته‌های تحصیلی
 */
router.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = getFieldCategories();

    res.status(200).json({
      success: true,
      message: 'دسته‌بندی رشته‌های تحصیلی با موفقیت دریافت شد',
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دسته‌بندی رشته‌های تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

/**
 * Helper function to get category by field
 * تابع کمکی برای تشخیص دسته‌بندی رشته
 */
function getCategoryByField(field: string): string {
  const highSchoolFields = ['math-physics', 'experimental-sciences', 'humanities', 'technical-vocational'];
  const engineeringFields = [
    'computer-engineering', 'electrical-engineering', 'mechanical-engineering', 
    'civil-engineering', 'chemical-engineering', 'industrial-engineering',
    'aerospace-engineering', 'biomedical-engineering'
  ];
  const basicScienceFields = [
    'pure-mathematics', 'applied-mathematics', 'physics', 'chemistry', 'biology',
    'geology', 'statistics', 'computer-science'
  ];
  const humanitiesFields = [
    'law', 'economics', 'management', 'psychology', 'sociology',
    'political-science', 'history', 'philosophy', 'literature',
    'linguistics', 'archaeology', 'geography'
  ];
  const medicalFields = [
    'medicine', 'dentistry', 'pharmacy', 'nursing', 'veterinary',
    'public-health', 'medical-laboratory', 'physiotherapy'
  ];
  const artFields = [
    'fine-arts', 'music', 'theater', 'cinema', 'graphic-design',
    'architecture', 'urban-planning'
  ];
  const agricultureFields = [
    'agriculture', 'horticulture', 'animal-science', 'forestry'
  ];

  if (highSchoolFields.includes(field)) return 'high-school';
  if (engineeringFields.includes(field)) return 'engineering';
  if (basicScienceFields.includes(field)) return 'basic-science';
  if (humanitiesFields.includes(field)) return 'humanities';
  if (medicalFields.includes(field)) return 'medical';
  if (artFields.includes(field)) return 'art';
  if (agricultureFields.includes(field)) return 'agriculture';
  return 'other';
}

/**
 * Helper function to get field categories with Persian labels
 * تابع کمکی برای دریافت دسته‌بندی‌ها با عناوین فارسی
 */
function getFieldCategories() {
  return {
    'high-school': {
      label: 'رشته‌های دبیرستان',
      description: 'رشته‌های تحصیلی دوره متوسطه',
      fields: ['math-physics', 'experimental-sciences', 'humanities', 'technical-vocational']
        .map(field => ({
          value: field,
          label: FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS]
        }))
    },
    'engineering': {
      label: 'رشته‌های مهندسی',
      description: 'رشته‌های مهندسی و فناوری',
      fields: [
        'computer-engineering', 'electrical-engineering', 'mechanical-engineering', 
        'civil-engineering', 'chemical-engineering', 'industrial-engineering',
        'aerospace-engineering', 'biomedical-engineering'
      ].map(field => ({
        value: field,
        label: FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS]
      }))
    },
    'basic-science': {
      label: 'علوم پایه',
      description: 'رشته‌های علوم پایه و ریاضی',
      fields: [
        'pure-mathematics', 'applied-mathematics', 'physics', 'chemistry', 'biology',
        'geology', 'statistics', 'computer-science'
      ].map(field => ({
        value: field,
        label: FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS]
      }))
    },
    'humanities': {
      label: 'علوم انسانی',
      description: 'رشته‌های علوم انسانی و اجتماعی',
      fields: [
        'law', 'economics', 'management', 'psychology', 'sociology',
        'political-science', 'history', 'philosophy', 'literature',
        'linguistics', 'archaeology', 'geography'
      ].map(field => ({
        value: field,
        label: FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS]
      }))
    },
    'medical': {
      label: 'علوم پزشکی',
      description: 'رشته‌های پزشکی و بهداشت',
      fields: [
        'medicine', 'dentistry', 'pharmacy', 'nursing', 'veterinary',
        'public-health', 'medical-laboratory', 'physiotherapy'
      ].map(field => ({
        value: field,
        label: FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS]
      }))
    },
    'art': {
      label: 'هنر',
      description: 'رشته‌های هنری و طراحی',
      fields: [
        'fine-arts', 'music', 'theater', 'cinema', 'graphic-design',
        'architecture', 'urban-planning'
      ].map(field => ({
        value: field,
        label: FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS]
      }))
    },
    'agriculture': {
      label: 'کشاورزی',
      description: 'رشته‌های کشاورزی و منابع طبیعی',
      fields: [
        'agriculture', 'horticulture', 'animal-science', 'forestry'
      ].map(field => ({
        value: field,
        label: FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS]
      }))
    },
    'other': {
      label: 'سایر',
      description: 'سایر رشته‌های تحصیلی',
      fields: [
        { value: 'other', label: FIELD_OF_STUDY_LABELS.other }
      ]
    }
  };
}

export default router; 