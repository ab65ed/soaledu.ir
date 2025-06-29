/**
 * Grade Controller
 * کنترلر مقاطع تحصیلی
 */

import { Request, Response } from 'express';
import Grade from '../models/Grade';

/**
 * GET /api/v1/grades
 * دریافت لیست کامل مقاطع تحصیلی
 */
export const getGrades = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 getGrades called with query:', req.query);
    
    const { isActive, category } = req.query;
    
    const filter: any = {};
    
    // اگر isActive مشخص نشده، فقط موارد فعال را نمایش بده
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    } else {
      filter.isActive = true; // default behavior
    }
    
    if (category) {
      filter.category = category;
    }

    console.log('🔍 Filter:', filter);

    const grades = await Grade.find(filter)
      .select('value label description ageRange duration nextLevel category isActive')
      .sort({ category: 1, createdAt: 1 });

    console.log('🔍 Found grades:', grades.length);
    console.log('🔍 First grade:', grades[0]);

    res.status(200).json({
      success: true,
      message: 'لیست مقاطع تحصیلی با موفقیت دریافت شد',
      data: {
        grades: grades.map(grade => ({
          value: grade.value,
          label: grade.label,
          description: grade.description,
          ageRange: grade.ageRange,
          duration: grade.duration,
          nextLevel: grade.nextLevel,
          category: grade.category
        })),
        total: grades.length
      }
    });
  } catch (error) {
    console.error('Error in getGrades:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست مقاطع تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/grades/categories
 * دریافت مقاطع تحصیلی به تفکیک دسته‌بندی
 */
export const getGradeCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const pipeline = [
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          grades: {
            $push: {
              value: '$value',
              label: '$label',
              description: '$description',
              ageRange: '$ageRange',
              duration: '$duration'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 as 1 } }
    ];

    const result = await Grade.aggregate(pipeline);

    const categories = {
      'school-levels': {
        name: 'مقاطع مدرسه‌ای',
        description: 'مقاطع تحصیلی آموزش‌وپرورش',
        grades: []
      },
      'university-levels': {
        name: 'مقاطع دانشگاهی',
        description: 'مقاطع تحصیلی آموزش عالی',
        grades: []
      }
    };

    result.forEach(item => {
      if (item._id === 'school-levels') {
        categories['school-levels'].grades = item.grades;
      } else if (item._id === 'university-levels') {
        categories['university-levels'].grades = item.grades;
      }
    });

    res.status(200).json({
      success: true,
      message: 'دسته‌بندی مقاطع تحصیلی با موفقیت دریافت شد',
      data: {
        categories,
        totalCategories: Object.keys(categories).length,
        totalGrades: result.reduce((sum, item) => sum + item.count, 0)
      }
    });
  } catch (error) {
    console.error('Error in getGradeCategories:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دسته‌بندی مقاطع تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/grades/by-category/:category
 * دریافت مقاطع تحصیلی بر اساس دسته‌بندی
 */
export const getGradesByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { isActive = true } = req.query;

    const filter: any = { category };
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const grades = await Grade.find(filter)
      .select('value label description ageRange duration')
      .sort({ createdAt: 1 });

    if (grades.length === 0) {
      res.status(404).json({
        success: false,
        message: 'مقطعی در این دسته‌بندی یافت نشد'
      });
      return;
    }

    const categoryInfo = {
      'school-levels': {
        label: 'مقاطع مدرسه‌ای',
        description: 'مقاطع تحصیلی آموزش‌وپرورش'
      },
      'university-levels': {
        label: 'مقاطع دانشگاهی',
        description: 'مقاطع تحصیلی آموزش عالی'
      }
    };

    res.status(200).json({
      success: true,
      message: 'مقاطع تحصیلی دسته‌بندی با موفقیت دریافت شد',
      data: {
        category: {
          value: category,
          label: categoryInfo[category as keyof typeof categoryInfo]?.label || category,
          description: categoryInfo[category as keyof typeof categoryInfo]?.description || ''
        },
        grades: grades.map(grade => ({
          value: grade.value,
          label: grade.label,
          description: grade.description,
          ageRange: grade.ageRange,
          duration: grade.duration
        })),
        total: grades.length
      }
    });
  } catch (error) {
    console.error('Error in getGradesByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت مقاطع تحصیلی دسته‌بندی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/grades/:value
 * دریافت اطلاعات یک مقطع تحصیلی خاص
 */
export const getGradeByValue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value } = req.params;

    const grade = await Grade.findOne({ value, isActive: true })
      .select('value label description ageRange duration nextLevel category');

    if (!grade) {
      res.status(404).json({
        success: false,
        message: 'مقطع تحصیلی مورد نظر یافت نشد'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'اطلاعات مقطع تحصیلی با موفقیت دریافت شد',
      data: { grade }
    });
  } catch (error) {
    console.error('Error in getGradeByValue:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات مقطع تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
}; 