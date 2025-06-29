/**
 * FieldOfStudy Controller
 * کنترلر رشته‌های تحصیلی
 */

import { Request, Response } from 'express';
import FieldOfStudy from '../models/FieldOfStudy';

/**
 * GET /api/v1/field-of-study
 * دریافت لیست کامل رشته‌های تحصیلی
 */
export const getFieldsOfStudy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive, category, search } = req.query;
    
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
    if (search) {
      filter.$text = { $search: search as string };
    }

    const fields = await FieldOfStudy.find(filter)
      .select('value label category categoryLabel categoryDescription isActive')
      .sort({ category: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      message: 'لیست رشته‌های تحصیلی با موفقیت دریافت شد',
      data: {
        fields: fields.map(field => ({
          value: field.value,
          label: field.label,
          category: field.category,
          categoryLabel: field.categoryLabel,
          categoryDescription: field.categoryDescription
        })),
        total: fields.length
      }
    });
  } catch (error) {
    console.error('Error in getFieldsOfStudy:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست رشته‌های تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/field-of-study/categories
 * دریافت رشته‌های تحصیلی به تفکیک دسته‌بندی
 */
export const getFieldOfStudyCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const pipeline = [
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          categoryLabel: { $first: '$categoryLabel' },
          categoryDescription: { $first: '$categoryDescription' },
          fields: {
            $push: {
              value: '$value',
              label: '$label'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 as 1 } }
    ];

    const result = await FieldOfStudy.aggregate(pipeline);

    const categories: any = {};
    result.forEach(item => {
      categories[item._id] = {
        label: item.categoryLabel,
        description: item.categoryDescription,
        fields: item.fields,
        count: item.count
      };
    });

    res.status(200).json({
      success: true,
      message: 'دسته‌بندی رشته‌های تحصیلی با موفقیت دریافت شد',
      data: {
        categories,
        totalCategories: Object.keys(categories).length,
        totalFields: result.reduce((sum, item) => sum + item.count, 0)
      }
    });
  } catch (error) {
    console.error('Error in getFieldOfStudyCategories:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دسته‌بندی رشته‌های تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/field-of-study/by-category/:category
 * دریافت رشته‌های تحصیلی بر اساس دسته‌بندی
 */
export const getFieldsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { isActive = true } = req.query;

    const filter: any = { category };
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const fields = await FieldOfStudy.find(filter)
      .select('value label categoryLabel categoryDescription')
      .sort({ createdAt: 1 });

    if (fields.length === 0) {
      res.status(404).json({
        success: false,
        message: 'رشته‌ای در این دسته‌بندی یافت نشد'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'رشته‌های تحصیلی دسته‌بندی با موفقیت دریافت شد',
      data: {
        category: {
          value: category,
          label: fields[0].categoryLabel,
          description: fields[0].categoryDescription
        },
        fields: fields.map(field => ({
          value: field.value,
          label: field.label
        })),
        total: fields.length
      }
    });
  } catch (error) {
    console.error('Error in getFieldsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت رشته‌های تحصیلی دسته‌بندی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/field-of-study/:value
 * دریافت اطلاعات یک رشته تحصیلی خاص
 */
export const getFieldOfStudyByValue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value } = req.params;

    const field = await FieldOfStudy.findOne({ value, isActive: true })
      .select('value label category categoryLabel categoryDescription');

    if (!field) {
      res.status(404).json({
        success: false,
        message: 'رشته تحصیلی مورد نظر یافت نشد'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'اطلاعات رشته تحصیلی با موفقیت دریافت شد',
      data: { field }
    });
  } catch (error) {
    console.error('Error in getFieldOfStudyByValue:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات رشته تحصیلی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
}; 