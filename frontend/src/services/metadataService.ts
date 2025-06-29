/**
 * Metadata Service
 * سرویس متادیتای دروس
 */

import { apiRequest } from './api';
import type { CourseType, Grade, FieldOfStudy } from '../types/metadata';

/**
 * دریافت لیست انواع درس
 */
export const getCourseTypes = async (): Promise<CourseType[]> => {
  try {
    console.log('🔍 Fetching course types...');
    const response = await apiRequest<{ courseTypes: CourseType[] }>('/course-types');
    console.log('✅ Course types response:', response);
    return response.courseTypes;
  } catch (error) {
    console.error('❌ Error fetching course types:', error);
    // Return hardcoded data as fallback
    return [
      { value: 'academic', label: 'درسی', description: 'درس‌های آکادمیک', examples: 'ریاضی، فیزیک', usage: 'دانشگاه', isActive: true },
      { value: 'non-academic', label: 'غیر درسی', description: 'درس‌های غیر آکادمیک', examples: 'ورزش', usage: 'عمومی', isActive: true },
      { value: 'skill-based', label: 'مهارتی', description: 'درس‌های مهارتی', examples: 'برنامه‌نویسی', usage: 'فنی', isActive: true },
      { value: 'aptitude', label: 'استعدادی', description: 'درس‌های استعدادی', examples: 'هنر', usage: 'تخصصی', isActive: true },
      { value: 'general', label: 'عمومی', description: 'درس‌های عمومی', examples: 'تاریخ', usage: 'عمومی', isActive: true },
      { value: 'specialized', label: 'تخصصی', description: 'درس‌های تخصصی', examples: 'پزشکی', usage: 'تخصصی', isActive: true }
    ];
  }
};

/**
 * دریافت لیست مقاطع تحصیلی
 */
export const getGrades = async (category?: string): Promise<Grade[]> => {
  try {
    console.log('🔍 Fetching grades with category:', category);
    const endpoint = category ? `/grades?category=${category}` : '/grades';
    const response = await apiRequest<{ grades: Grade[] }>(endpoint);
    console.log('✅ Grades response:', response);
    return response.grades;
  } catch (error) {
    console.error('❌ Error fetching grades:', error);
    // Return hardcoded data as fallback
    return [
      { value: 'elementary', label: 'مقطع ابتدایی', description: 'دوره ابتدایی', ageRange: '6-12', duration: '6 سال', nextLevel: 'متوسطه', category: 'school-levels' as const, isActive: true },
      { value: 'middle-school', label: 'مقطع متوسطه اول', description: 'دوره متوسطه اول', ageRange: '12-15', duration: '3 سال', nextLevel: 'متوسطه دوم', category: 'school-levels' as const, isActive: true },
      { value: 'high-school', label: 'مقطع متوسطه دوم', description: 'دوره متوسطه دوم', ageRange: '15-18', duration: '3 سال', nextLevel: 'دانشگاه', category: 'school-levels' as const, isActive: true },
      { value: 'associate-degree', label: 'کاردانی', description: 'مقطع کاردانی', ageRange: '18-20', duration: '2 سال', nextLevel: 'کارشناسی', category: 'university-levels' as const, isActive: true },
      { value: 'bachelor-degree', label: 'کارشناسی', description: 'مقطع کارشناسی', ageRange: '18-22', duration: '4 سال', nextLevel: 'ارشد', category: 'university-levels' as const, isActive: true },
      { value: 'master-degree', label: 'کارشناسی ارشد', description: 'مقطع ارشد', ageRange: '22-24', duration: '2 سال', nextLevel: 'دکتری', category: 'university-levels' as const, isActive: true },
      { value: 'doctorate-degree', label: 'دکتری', description: 'مقطع دکتری', ageRange: '24+', duration: '4 سال', nextLevel: 'پایان', category: 'university-levels' as const, isActive: true }
    ];
  }
};

/**
 * دریافت لیست رشته‌های تحصیلی
 */
export const getFieldsOfStudy = async (category?: string): Promise<FieldOfStudy[]> => {
  try {
    console.log('🔍 Fetching fields of study with category:', category);
    const endpoint = category ? `/field-of-study?category=${category}` : '/field-of-study';
    const response = await apiRequest<{ fields: FieldOfStudy[] }>(endpoint);
    console.log('✅ Fields of study response:', response);
    return response.fields;
  } catch (error) {
    console.error('❌ Error fetching fields of study:', error);
    // Return hardcoded data as fallback
    return [
      { value: 'math-physics', label: 'ریاضی فیزیک', category: 'high-school' as const, categoryLabel: 'دبیرستان', categoryDescription: 'رشته‌های دبیرستان', isActive: true },
      { value: 'experimental-sciences', label: 'علوم تجربی', category: 'high-school' as const, categoryLabel: 'دبیرستان', categoryDescription: 'رشته‌های دبیرستان', isActive: true },
      { value: 'humanities', label: 'علوم انسانی', category: 'humanities' as const, categoryLabel: 'علوم انسانی', categoryDescription: 'رشته‌های انسانی', isActive: true },
      { value: 'technical-vocational', label: 'فنی حرفه‌ای', category: 'high-school' as const, categoryLabel: 'دبیرستان', categoryDescription: 'رشته‌های دبیرستان', isActive: true },
      { value: 'computer-engineering', label: 'مهندسی کامپیوتر', category: 'engineering' as const, categoryLabel: 'مهندسی', categoryDescription: 'رشته‌های مهندسی', isActive: true },
      { value: 'electrical-engineering', label: 'مهندسی برق', category: 'engineering' as const, categoryLabel: 'مهندسی', categoryDescription: 'رشته‌های مهندسی', isActive: true },
      { value: 'mechanical-engineering', label: 'مهندسی مکانیک', category: 'engineering' as const, categoryLabel: 'مهندسی', categoryDescription: 'رشته‌های مهندسی', isActive: true }
    ];
  }
};

/**
 * دریافت دسته‌بندی‌های درس (اختصاصی، تخصصی، عمومی)
 */
export const getCourseCategories = () => {
  return [
    { value: 'specialized', label: 'اختصاصی' },
    { value: 'technical', label: 'تخصصی' },
    { value: 'general', label: 'عمومی' }
  ];
}; 