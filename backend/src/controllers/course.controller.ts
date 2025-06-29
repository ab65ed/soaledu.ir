import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import { z } from 'zod';

/**
 * GET /api/v1/courses
 * دریافت لیست دروس با امکان جستجو و فیلتر
 */
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      grade,
      courseType,
      group,
      isActive,
      limit = '50',
      skip = '0',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // ساخت فیلتر
    const filter: any = {};

    // جستجوی متنی
    if (search && typeof search === 'string') {
      // استفاده از regex search برای پشتیبانی بهتر از زبان فارسی
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // فیلتر بر اساس دسته‌بندی
    if (category && typeof category === 'string') {
      filter.category = category;
    }

    // فیلتر بر اساس مقطع
    if (grade && typeof grade === 'string') {
      filter.grade = grade;
    }

    // فیلتر بر اساس نوع درس
    if (courseType && typeof courseType === 'string') {
      filter.courseType = courseType;
    }

    // فیلتر بر اساس گروه
    if (group && typeof group === 'string') {
      filter.group = group;
    }

    // فیلتر بر اساس وضعیت فعال/غیرفعال
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // پارامترهای صفحه‌بندی
    const limitNum = Math.min(parseInt(limit as string, 10), 100); // حداکثر 100
    const skipNum = parseInt(skip as string, 10);

    // مرتب‌سازی
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // اجرای کوئری
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sortOptions)
        .limit(limitNum)
        .skip(skipNum)
        .lean(),
      Course.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      message: 'لیست دروس با موفقیت دریافت شد',
      data: {
        courses,
        pagination: {
          total,
          count: courses.length,
          limit: limitNum,
          skip: skipNum,
          hasNext: skipNum + limitNum < total,
          hasPrev: skipNum > 0
        }
      }
    });
  } catch (error) {
    console.error('Error in getCourses:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست دروس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/courses/:id
 * دریافت درس با شناسه
 */
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).lean();

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'درس مورد نظر یافت نشد'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'درس با موفقیت دریافت شد',
      data: course
    });
  } catch (error) {
    console.error('Error in getCourseById:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * POST /api/v1/courses
 * ایجاد درس جدید
 */
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseSchema = z.object({
      title: z.string().min(3, 'عنوان درس باید حداقل 3 کاراکتر باشد'),
      description: z.string().optional(),
      category: z.enum([
        'دروس عمومی',
        'دروس پایه',
        'دروس پایه کامپیوتر',
        'دروس اختصاصی',
        'دروس فنی',
        'علوم پایه',
        'علوم انسانی',
        'علوم زیستی'
      ]),
      grade: z.enum([
        'عمومی',
        'کارشناسی',
        'فنی',
        'دهم',
        'یازدهم',
        'دوازدهم',
        'middle-school',
        'high-school'
      ]),
      courseType: z.enum([
        'mathematics',
        'physics',
        'chemistry',
        'biology',
        'literature',
        'computer-science',
        'general',
        'technical'
      ]).optional(),
      group: z.enum([
        'math-physics',
        'experimental',
        'literature-humanities',
        'computer',
        'technical',
        'general'
      ]).optional(),
      isActive: z.boolean().default(true)
    });

    const validatedData = courseSchema.parse(req.body);

    // بررسی تکراری نبودن عنوان درس
    const existingCourse = await Course.findOne({ title: validatedData.title });
    if (existingCourse) {
      res.status(400).json({
        success: false,
        message: 'درسی با این عنوان قبلاً ثبت شده است'
      });
      return;
    }

    const newCourse = new Course(validatedData);
    await newCourse.save();

    res.status(201).json({
      success: true,
      message: 'درس با موفقیت ایجاد شد',
      data: newCourse
    });
  } catch (error) {
    console.error('Error in createCourse:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * PUT /api/v1/courses/:id
 * ویرایش درس
 */
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updateSchema = z.object({
      title: z.string().min(3).optional(),
      description: z.string().optional(),
      category: z.enum([
        'دروس عمومی',
        'دروس پایه',
        'دروس پایه کامپیوتر',
        'دروس اختصاصی',
        'دروس فنی',
        'علوم پایه',
        'علوم انسانی',
        'علوم زیستی'
      ]).optional(),
      grade: z.enum([
        'عمومی',
        'کارشناسی',
        'فنی',
        'دهم',
        'یازدهم',
        'دوازدهم',
        'middle-school',
        'high-school'
      ]).optional(),
      courseType: z.enum([
        'mathematics',
        'physics',
        'chemistry',
        'biology',
        'literature',
        'computer-science',
        'general',
        'technical'
      ]).optional(),
      group: z.enum([
        'math-physics',
        'experimental',
        'literature-humanities',
        'computer',
        'technical',
        'general'
      ]).optional(),
      isActive: z.boolean().optional()
    });

    const validatedData = updateSchema.parse(req.body);

    // بررسی تکراری نبودن عنوان درس (در صورت تغییر عنوان)
    if (validatedData.title) {
      const existingCourse = await Course.findOne({ 
        title: validatedData.title,
        _id: { $ne: id }
      });
      if (existingCourse) {
        res.status(400).json({
          success: false,
          message: 'درسی با این عنوان قبلاً ثبت شده است'
        });
        return;
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      res.status(404).json({
        success: false,
        message: 'درس مورد نظر یافت نشد'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'درس با موفقیت به‌روزرسانی شد',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error in updateCourse:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * DELETE /api/v1/courses/:id
 * حذف درس
 */
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      res.status(404).json({
        success: false,
        message: 'درس مورد نظر یافت نشد'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'درس با موفقیت حذف شد',
      data: deletedCourse
    });
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/courses/categories
 * دریافت لیست دسته‌بندی‌ها
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Course.distinct('category');
    
    res.status(200).json({
      success: true,
      message: 'لیست دسته‌بندی‌ها با موفقیت دریافت شد',
      data: categories
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دسته‌بندی‌ها',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * POST /api/v1/courses/bulk-create
 * ایجاد چندین درس به صورت یکجا
 */
export const bulkCreateCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const coursesSchema = z.array(z.object({
      title: z.string().min(3),
      description: z.string().optional(),
      category: z.string(),
      grade: z.string(),
      courseType: z.string().optional(),
      group: z.string().optional(),
      isActive: z.boolean().default(true)
    }));

    const validatedData = coursesSchema.parse(req.body);

    // بررسی تکراری نبودن عناوین
    const titles = validatedData.map(course => course.title);
    const existingCourses = await Course.find({ title: { $in: titles } });
    
    if (existingCourses.length > 0) {
      const existingTitles = existingCourses.map(course => course.title);
      res.status(400).json({
        success: false,
        message: 'برخی از دروس قبلاً ثبت شده‌اند',
        data: { existingTitles }
      });
      return;
    }

    const newCourses = await Course.insertMany(validatedData);

    res.status(201).json({
      success: true,
      message: `${newCourses.length} درس با موفقیت ایجاد شد`,
      data: newCourses
    });
  } catch (error) {
    console.error('Error in bulkCreateCourses:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد دروس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
}; 