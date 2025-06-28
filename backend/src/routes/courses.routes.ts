/**
 * Courses Routes
 * مسیرهای مدیریت دروس
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Mock data for courses - در پروژه واقعی باید از دیتابیس خوانده شود
const mockCourses = [
  {
    id: '1',
    title: 'ریاضی پایه دهم - فصل اول: حد و پیوستگی',
    description: 'مباحث کامل حد و پیوستگی برای پایه دهم',
    courseType: 'mathematics',
    grade: 'high-school',
    group: 'math-physics',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'فیزیک پایه یازدهم - مکانیک',
    description: 'مباحث کامل مکانیک کلاسیک',
    courseType: 'physics',
    grade: 'high-school',
    group: 'math-physics',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'شیمی پایه دوازدهم - شیمی آلی',
    description: 'مباحث شیمی آلی برای کنکور',
    courseType: 'chemistry',
    grade: 'high-school',
    group: 'experimental',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'زیست‌شناسی پایه یازدهم - سلول',
    description: 'ساختار و عملکرد سلول',
    courseType: 'biology',
    grade: 'high-school',
    group: 'experimental',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'ادبیات فارسی پایه نهم - شعر کلاسیک',
    description: 'تحلیل و بررسی اشعار کلاسیک فارسی',
    courseType: 'literature',
    grade: 'middle-school',
    group: 'literature-humanities',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

/**
 * GET /api/v1/courses
 * دریافت لیست دروس با امکان جستجو و فیلتر
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const {
      search,
      courseType,
      grade,
      group,
      isActive,
      limit = '50',
      skip = '0'
    } = req.query;

    let filteredCourses = [...mockCourses];

    // Filter by search query
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by course type
    if (courseType && typeof courseType === 'string') {
      filteredCourses = filteredCourses.filter(course =>
        course.courseType === courseType
      );
    }

    // Filter by grade
    if (grade && typeof grade === 'string') {
      filteredCourses = filteredCourses.filter(course =>
        course.grade === grade
      );
    }

    // Filter by group
    if (group && typeof group === 'string') {
      filteredCourses = filteredCourses.filter(course =>
        course.group === group
      );
    }

    // Filter by active status
    if (isActive !== undefined) {
      const isActiveBoolean = isActive === 'true';
      filteredCourses = filteredCourses.filter(course =>
        course.isActive === isActiveBoolean
      );
    }

    // Pagination
    const limitNum = parseInt(limit as string, 10);
    const skipNum = parseInt(skip as string, 10);
    const total = filteredCourses.length;
    const paginatedCourses = filteredCourses.slice(skipNum, skipNum + limitNum);

    res.status(200).json({
      success: true,
      message: 'لیست دروس با موفقیت دریافت شد',
      data: {
        courses: paginatedCourses,
        pagination: {
          total,
          count: paginatedCourses.length,
          limit: limitNum,
          skip: skipNum
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست دروس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

/**
 * GET /api/v1/courses/:id
 * دریافت درس با شناسه
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const course = mockCourses.find(c => c.id === id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'درس مورد نظر یافت نشد'
      });
    }

    res.status(200).json({
      success: true,
      message: 'درس با موفقیت دریافت شد',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

/**
 * POST /api/v1/courses
 * ایجاد درس جدید
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const courseSchema = z.object({
      title: z.string().min(3, 'عنوان درس باید حداقل 3 کاراکتر باشد'),
      description: z.string().optional(),
      courseType: z.string().min(1, 'نوع درس الزامی است'),
      grade: z.string().min(1, 'مقطع الزامی است'),
      group: z.string().min(1, 'گروه الزامی است'),
      isActive: z.boolean().default(true)
    });

    const validatedData = courseSchema.parse(req.body);
    
    const newCourse = {
      id: String(mockCourses.length + 1),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockCourses.push(newCourse);

    res.status(201).json({
      success: true,
      message: 'درس با موفقیت ایجاد شد',
      data: newCourse
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

/**
 * PUT /api/v1/courses/:id
 * ویرایش درس
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const courseIndex = mockCourses.findIndex(c => c.id === id);
    
    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'درس مورد نظر یافت نشد'
      });
    }

    const updateSchema = z.object({
      title: z.string().min(3).optional(),
      description: z.string().optional(),
      courseType: z.string().optional(),
      grade: z.string().optional(),
      group: z.string().optional(),
      isActive: z.boolean().optional()
    });

    const validatedData = updateSchema.parse(req.body);
    
    mockCourses[courseIndex] = {
      ...mockCourses[courseIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'درس با موفقیت به‌روزرسانی شد',
      data: mockCourses[courseIndex]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

/**
 * DELETE /api/v1/courses/:id
 * حذف درس
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const courseIndex = mockCourses.findIndex(c => c.id === id);
    
    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'درس مورد نظر یافت نشد'
      });
    }

    mockCourses.splice(courseIndex, 1);

    res.status(200).json({
      success: true,
      message: 'درس با موفقیت حذف شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در حذف درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
});

export default router; 