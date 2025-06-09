/**
 * Course Exam validation middleware with Zod
 *
 * This file contains validation schemas and middleware for course exam-related requests
 * using Zod with Persian error messages.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Valid course types
const COURSE_TYPES = [
  'mathematics', 'physics', 'chemistry', 'biology',
  'history', 'geography', 'literature', 'english', 'arabic', 'other'
] as const;

// Valid grades
const GRADES = [
  'elementary-1', 'elementary-2', 'elementary-3', 'elementary-4', 'elementary-5', 'elementary-6',
  'middle-school-1', 'middle-school-2', 'middle-school-3',
  'high-school-1', 'high-school-2', 'high-school-3', 'high-school-4',
  'high-school-10', 'high-school-11', 'high-school-12',
  'university', 'konkur'
] as const;

// Valid groups
const GROUPS = [
  'theoretical', 'mathematical', 'experimental', 'technical', 'art', 'other'
] as const;

// Valid difficulty levels
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

// Enums for validation
const CourseTypeEnum = z.enum(COURSE_TYPES, {
  errorMap: () => ({ message: 'نوع درس معتبر نیست' })
});

const GradeEnum = z.enum(GRADES, {
  errorMap: () => ({ message: 'مقطع تحصیلی معتبر نیست' })
});

const GroupEnum = z.enum(GROUPS, {
  errorMap: () => ({ message: 'گروه آموزشی معتبر نیست' })
});

const DifficultyEnum = z.enum(DIFFICULTIES, {
  errorMap: () => ({ message: 'سطح سختی معتبر نیست' })
});

/**
 * Validation schema for creating a course exam
 */
export const CreateCourseExamSchema = z.object({
  title: z.string()
    .trim()
    .min(5, { message: 'عنوان باید حداقل ۵ کاراکتر باشد' })
    .max(200, { message: 'عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد' }),

  courseType: CourseTypeEnum,

  grade: GradeEnum,

  group: GroupEnum,

  description: z.string()
    .trim()
    .min(10, { message: 'توضیحات باید حداقل ۱۰ کاراکتر باشد' })
    .max(2000, { message: 'توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد' }),

  tags: z.array(
    z.string()
      .min(1, { message: 'هر تگ باید حداقل ۱ کاراکتر باشد' })
      .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })
  )
    .max(20, { message: 'حداکثر ۲۰ تگ مجاز است' })
    .optional(),

  difficulty: DifficultyEnum.optional(),

  estimatedTime: z.number()
    .int({ message: 'زمان تخمینی باید عدد صحیح باشد' })
    .min(1, { message: 'زمان تخمینی باید حداقل ۱ دقیقه باشد' })
    .max(480, { message: 'زمان تخمینی نباید بیشتر از ۴۸۰ دقیقه (۸ ساعت) باشد' })
    .optional(),

  price: z.number()
    .int({ message: 'قیمت باید عدد صحیح باشد' })
    .min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
    .max(100000, { message: 'قیمت نباید بیشتر از ۱۰۰,۰۰۰ تومان باشد' })
    .optional(),

  isPublished: z.boolean({
    errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
  }).optional(),

  chapters: z.array(
    z.string()
      .min(1, { message: 'نام فصل باید حداقل ۱ کاراکتر باشد' })
      .max(100, { message: 'نام فصل نباید بیشتر از ۱۰۰ کاراکتر باشد' })
  )
    .max(50, { message: 'حداکثر ۵۰ فصل مجاز است' })
    .optional()
});

/**
 * Validation schema for updating a course exam
 */
export const UpdateCourseExamSchema = z.object({
  title: z.string()
    .trim()
    .min(5, { message: 'عنوان باید حداقل ۵ کاراکتر باشد' })
    .max(200, { message: 'عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),

  courseType: CourseTypeEnum.optional(),

  grade: GradeEnum.optional(),

  group: GroupEnum.optional(),

  description: z.string()
    .trim()
    .min(10, { message: 'توضیحات باید حداقل ۱۰ کاراکتر باشد' })
    .max(2000, { message: 'توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد' })
    .optional(),

  tags: z.array(
    z.string()
      .min(1, { message: 'هر تگ باید حداقل ۱ کاراکتر باشد' })
      .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })
  )
    .max(20, { message: 'حداکثر ۲۰ تگ مجاز است' })
    .optional(),

  difficulty: DifficultyEnum.optional(),

  estimatedTime: z.number()
    .int({ message: 'زمان تخمینی باید عدد صحیح باشد' })
    .min(1, { message: 'زمان تخمینی باید حداقل ۱ دقیقه باشد' })
    .max(480, { message: 'زمان تخمینی نباید بیشتر از ۴۸۰ دقیقه (۸ ساعت) باشد' })
    .optional(),

  price: z.number()
    .int({ message: 'قیمت باید عدد صحیح باشد' })
    .min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
    .max(100000, { message: 'قیمت نباید بیشتر از ۱۰۰,۰۰۰ تومان باشد' })
    .optional(),

  isPublished: z.boolean({
    errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
  }).optional(),

  chapters: z.array(
    z.string()
      .min(1, { message: 'نام فصل باید حداقل ۱ کاراکتر باشد' })
      .max(100, { message: 'نام فصل نباید بیشتر از ۱۰۰ کاراکتر باشد' })
  )
    .max(50, { message: 'حداکثر ۵۰ فصل مجاز است' })
    .optional()
});

/**
 * Validation schema for course exam parameters (ID validation)
 */
export const CourseExamParamsSchema = z.object({
  id: z.string()
    .min(1, { message: 'شناسه آزمون الزامی است' })
});

/**
 * Validation schema for rating a course exam
 */
export const RatingSchema = z.object({
  rating: z.number()
    .int({ message: 'امتیاز باید عدد صحیح باشد' })
    .min(1, { message: 'امتیاز باید حداقل ۱ باشد' })
    .max(5, { message: 'امتیاز نباید بیشتر از ۵ باشد' }),

  comment: z.string()
    .trim()
    .min(10, { message: 'نظر باید حداقل ۱۰ کاراکتر باشد' })
    .max(500, { message: 'نظر نباید بیشتر از ۵۰۰ کاراکتر باشد' })
    .optional()
});

/**
 * Validation schema for auto-save progress
 */
export const AutoSaveSchema = z.object({
  progress: z.number()
    .min(0, { message: 'پیشرفت نمی‌تواند منفی باشد' })
    .max(100, { message: 'پیشرفت نمی‌تواند بیشتر از ۱۰۰ درصد باشد' }),

  lastQuestionIndex: z.number()
    .int({ message: 'شاخص سوال باید عدد صحیح باشد' })
    .min(0, { message: 'شاخص سوال نمی‌تواند منفی باشد' })
    .optional(),

  answers: z.record(z.string(), z.any())
    .optional(),

  timeSpent: z.number()
    .min(0, { message: 'زمان صرف شده نمی‌تواند منفی باشد' })
    .optional()
});

/**
 * Validation schema for search queries
 */
export const SearchQuerySchema = z.object({
  q: z.string()
    .trim()
    .min(2, { message: 'جستجو باید حداقل ۲ کاراکتر باشد' })
    .max(100, { message: 'جستجو نباید بیشتر از ۱۰۰ کاراکتر باشد' }),

  courseType: CourseTypeEnum.optional(),
  grade: GradeEnum.optional(),
  group: GroupEnum.optional(),
  difficulty: DifficultyEnum.optional(),

  minPrice: z.coerce.number()
    .min(0, { message: 'حداقل قیمت نمی‌تواند منفی باشد' })
    .optional(),

  maxPrice: z.coerce.number()
    .min(0, { message: 'حداکثر قیمت نمی‌تواند منفی باشد' })
    .optional(),

  tags: z.string()
    .transform((str) => str.split(',').map(tag => tag.trim()))
    .optional()
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: 'حداقل قیمت باید کمتر یا مساوی حداکثر قیمت باشد',
  path: ['priceRange']
});

/**
 * Validation schema for listing queries
 */
export const ListQuerySchema = z.object({
  page: z.coerce.number()
    .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
    .default(1)
    .optional(),

  limit: z.coerce.number()
    .int({ message: 'تعداد آیتم در صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'تعداد آیتم در صفحه باید حداقل ۱ باشد' })
    .max(50, { message: 'تعداد آیتم در صفحه نمی‌تواند بیش از ۵۰ باشد' })
    .default(10)
    .optional(),

  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'price', 'rating'], {
    errorMap: () => ({ message: 'مرتب‌سازی معتبر نیست' })
  }).optional(),

  order: z.enum(['asc', 'desc'], {
    errorMap: () => ({ message: 'نحوه مرتب‌سازی معتبر نیست' })
  }).optional(),

  courseType: CourseTypeEnum.optional(),
  grade: GradeEnum.optional(),
  group: GroupEnum.optional(),
  difficulty: DifficultyEnum.optional(),

  isPublished: z.coerce.boolean({
    errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
  }).optional()
});

// Helper function to format errors
const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
};

// Middleware functions
export const validateCourseExam = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = CreateCourseExamSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: formatZodError(error)
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی نامشخص',
      errors: []
    });
  }
};

export const validateCourseExamUpdate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.params = CourseExamParamsSchema.parse(req.params);
    req.body = UpdateCourseExamSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: formatZodError(error)
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی نامشخص',
      errors: []
    });
  }
};

export const validateRating = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.params = CourseExamParamsSchema.parse(req.params);
    req.body = RatingSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های امتیازدهی نامعتبر است',
        errors: formatZodError(error)
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی نامشخص',
      errors: []
    });
  }
};

export const validateAutoSave = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.params = CourseExamParamsSchema.parse(req.params);
    req.body = AutoSaveSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ذخیره خودکار نامعتبر است',
        errors: formatZodError(error)
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی نامشخص',
      errors: []
    });
  }
};

export const validateSearchQuery = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.query = SearchQuerySchema.parse(req.query) as any;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'پارامترهای جستجو نامعتبر است',
        errors: formatZodError(error)
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی نامشخص',
      errors: []
    });
  }
};

export const validateListQuery = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.query = ListQuerySchema.parse(req.query) as any;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'پارامترهای فهرست‌بندی نامعتبر است',
        errors: formatZodError(error)
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی نامشخص',
      errors: []
    });
  }
};

// Validation helper functions
export const validateCourseExamPublishing = async (courseExamId: string): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!courseExamId || courseExamId.trim().length === 0) {
    errors.push('شناسه آزمون الزامی است');
  }

  // Additional business logic validation can be added here
  // For example, checking if exam has minimum required questions, etc.

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateQuestionDifficultyDistribution = (questions: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!Array.isArray(questions)) {
    errors.push('سوالات باید آرایه‌ای از اشیاء باشد');
    return { isValid: false, errors };
  }

  if (questions.length === 0) {
    errors.push('آزمون باید حداقل یک سوال داشته باشد');
    return { isValid: false, errors };
  }

  // Check difficulty distribution
  const difficultyCount = {
    easy: 0,
    medium: 0,
    hard: 0
  };

  questions.forEach((question, index) => {
    if (!question.difficulty || !DIFFICULTIES.includes(question.difficulty)) {
      errors.push(`سوال ${index + 1}: سطح سختی معتبر نیست`);
    } else {
      difficultyCount[question.difficulty as keyof typeof difficultyCount]++;
    }
  });

  // Ensure balanced distribution (this is a business rule example)
  const total = questions.length;
  if (total > 10) {
    const easyPercentage = (difficultyCount.easy / total) * 100;
    const hardPercentage = (difficultyCount.hard / total) * 100;

    if (easyPercentage < 20) {
      errors.push('آزمون باید حداقل ۲۰٪ سوال آسان داشته باشد');
    }

    if (hardPercentage > 50) {
      errors.push('آزمون نباید بیش از ۵۰٪ سوال سخت داشته باشد');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Type exports for TypeScript
export type CreateCourseExamType = z.infer<typeof CreateCourseExamSchema>;
export type UpdateCourseExamType = z.infer<typeof UpdateCourseExamSchema>;
export type CourseExamParamsType = z.infer<typeof CourseExamParamsSchema>;
export type RatingType = z.infer<typeof RatingSchema>;
export type AutoSaveType = z.infer<typeof AutoSaveSchema>;
export type SearchQueryType = z.infer<typeof SearchQuerySchema>;
export type ListQueryType = z.infer<typeof ListQuerySchema>;

// Export constants for use in other modules
export { COURSE_TYPES, GRADES, GROUPS, DIFFICULTIES }; 