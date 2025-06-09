/**
 * Test Exam Validation Rules with Zod
 * قوانین اعتبارسنجی برای آزمون‌های تستی با Zod
 * 
 * ویژگی‌های اصلی:
 * - اعتبارسنجی ایجاد و ویرایش آزمون
 * - اعتبارسنجی تنظیمات آزمون
 * - اعتبارسنجی توزیع سختی سوالات
 * - پیام‌های خطا به فارسی
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Exam types
const EXAM_TYPES = ['practice', 'official', 'timed', 'custom'] as const;

// Exam statuses
const EXAM_STATUSES = ['draft', 'active', 'completed', 'cancelled'] as const;

// Enums for validation
const ExamTypeEnum = z.enum(EXAM_TYPES, {
  errorMap: () => ({ message: 'نوع آزمون معتبر نیست' })
});

const ExamStatusEnum = z.enum(EXAM_STATUSES, {
  errorMap: () => ({ message: 'وضعیت آزمون معتبر نیست' })
});

// Difficulty distribution schema
const DifficultyDistributionSchema = z.object({
  easy: z.number()
    .int({ message: 'تعداد سوالات آسان باید عدد صحیح باشد' })
    .min(0, { message: 'تعداد سوالات آسان باید بین ۰ تا ۵۰ باشد' })
    .max(50, { message: 'تعداد سوالات آسان باید بین ۰ تا ۵۰ باشد' })
    .optional(),

  medium: z.number()
    .int({ message: 'تعداد سوالات متوسط باید عدد صحیح باشد' })
    .min(0, { message: 'تعداد سوالات متوسط باید بین ۰ تا ۵۰ باشد' })
    .max(50, { message: 'تعداد سوالات متوسط باید بین ۰ تا ۵۰ باشد' })
    .optional(),

  hard: z.number()
    .int({ message: 'تعداد سوالات سخت باید عدد صحیح باشد' })
    .min(0, { message: 'تعداد سوالات سخت باید بین ۰ تا ۵۰ باشد' })
    .max(50, { message: 'تعداد سوالات سخت باید بین ۰ تا ۵۰ باشد' })
    .optional()
});

// Exam configuration schema
const ExamConfigurationSchema = z.object({
  totalQuestions: z.number()
    .int({ message: 'تعداد سوالات باید عدد صحیح باشد' })
    .min(5, { message: 'تعداد سوالات باید بین ۵ تا ۱۰۰ باشد' })
    .max(100, { message: 'تعداد سوالات باید بین ۵ تا ۱۰۰ باشد' })
    .optional(),

  difficultyDistribution: DifficultyDistributionSchema.optional(),

  timeLimit: z.number()
    .int({ message: 'محدودیت زمان باید عدد صحیح باشد' })
    .min(5, { message: 'محدودیت زمان باید بین ۵ تا ۳۰۰ دقیقه باشد' })
    .max(300, { message: 'محدودیت زمان باید بین ۵ تا ۳۰۰ دقیقه باشد' })
    .optional(),

  allowReview: z.boolean({
    errorMap: () => ({ message: 'اجازه بازبینی باید مقدار بولی باشد' })
  }).optional(),

  shuffleQuestions: z.boolean({
    errorMap: () => ({ message: 'ترتیب تصادفی سوالات باید مقدار بولی باشد' })
  }).optional(),

  shuffleOptions: z.boolean({
    errorMap: () => ({ message: 'ترتیب تصادفی گزینه‌ها باید مقدار بولی باشد' })
  }).optional(),

  showResults: z.boolean({
    errorMap: () => ({ message: 'نمایش نتایج باید مقدار بولی باشد' })
  }).optional(),

  passingScore: z.number()
    .min(0, { message: 'نمره قبولی باید بین ۰ تا ۱۰۰ باشد' })
    .max(100, { message: 'نمره قبولی باید بین ۰ تا ۱۰۰ باشد' })
    .optional(),

  categories: z.array(
    z.string()
      .trim()
      .min(1, { message: 'نام دسته‌بندی باید بین ۱ تا ۱۰۰ کاراکتر باشد' })
      .max(100, { message: 'نام دسته‌بندی باید بین ۱ تا ۱۰۰ کاراکتر باشد' })
  ).optional(),

  tags: z.array(
    z.string()
      .trim()
      .min(1, { message: 'برچسب باید بین ۱ تا ۵۰ کاراکتر باشد' })
      .max(50, { message: 'برچسب باید بین ۱ تا ۵۰ کاراکتر باشد' })
  ).optional()
}).refine((config) => {
  // Custom validation for difficulty distribution sum
  if (config.difficultyDistribution && config.totalQuestions) {
    const { easy = 0, medium = 0, hard = 0 } = config.difficultyDistribution;
    const total = easy + medium + hard;
    return total === config.totalQuestions;
  }
  return true;
}, {
  message: 'مجموع توزیع سختی باید برابر تعداد کل سوالات باشد',
  path: ['difficultyDistribution']
});

/**
 * Validation schema for creating a new test exam
 */
export const CreateTestExamSchema = z.object({
  title: z.string()
    .trim()
    .min(3, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' })
    .max(200, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' }),

  description: z.string()
    .trim()
    .max(1000, { message: 'توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
    .optional(),

  type: ExamTypeEnum.optional(),

  status: ExamStatusEnum.optional(),

  configuration: ExamConfigurationSchema.optional(),

  startTime: z.coerce.date({
    errorMap: () => ({ message: 'زمان شروع باید در فرمت صحیح باشد' })
  }).optional(),

  endTime: z.coerce.date({
    errorMap: () => ({ message: 'زمان پایان باید در فرمت صحیح باشد' })
  }).optional(),

  isPublished: z.boolean({
    errorMap: () => ({ message: 'وضعیت انتشار باید مقدار بولی باشد' })
  }).optional()
}).refine((data) => {
  // Validate start and end times
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: 'زمان شروع باید قبل از زمان پایان باشد',
  path: ['timeRange']
});

/**
 * Validation schema for updating a test exam
 */
export const UpdateTestExamSchema = z.object({
  title: z.string()
    .trim()
    .min(3, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' })
    .max(200, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' })
    .optional(),

  description: z.string()
    .trim()
    .max(1000, { message: 'توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
    .optional(),

  type: ExamTypeEnum.optional(),

  status: ExamStatusEnum.optional(),

  configuration: ExamConfigurationSchema.optional(),

  startTime: z.coerce.date({
    errorMap: () => ({ message: 'زمان شروع باید در فرمت صحیح باشد' })
  }).optional(),

  endTime: z.coerce.date({
    errorMap: () => ({ message: 'زمان پایان باید در فرمت صحیح باشد' })
  }).optional(),

  isPublished: z.boolean({
    errorMap: () => ({ message: 'وضعیت انتشار باید مقدار بولی باشد' })
  }).optional()
}).refine((data) => {
  // Validate start and end times
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: 'زمان شروع باید قبل از زمان پایان باشد',
  path: ['timeRange']
});

/**
 * Validation schema for test exam parameters (ID validation)
 */
export const TestExamParamsSchema = z.object({
  id: z.string()
    .min(10, { message: 'شناسه آزمون نامعتبر است' })
});

/**
 * Validation schema for exam session management
 */
export const ExamSessionSchema = z.object({
  examId: z.string()
    .min(1, { message: 'شناسه آزمون الزامی است' }),

  startTime: z.coerce.date({
    errorMap: () => ({ message: 'زمان شروع باید در فرمت صحیح باشد' })
  }),

  answers: z.record(z.string(), z.any())
    .optional(),

  currentQuestionIndex: z.number()
    .int({ message: 'شاخص سوال فعلی باید عدد صحیح باشد' })
    .min(0, { message: 'شاخص سوال فعلی نمی‌تواند منفی باشد' })
    .optional(),

  timeSpent: z.number()
    .min(0, { message: 'زمان صرف شده نمی‌تواند منفی باشد' })
    .optional()
});

/**
 * Validation schema for exam submission
 */
export const ExamSubmissionSchema = z.object({
  examId: z.string()
    .min(1, { message: 'شناسه آزمون الزامی است' }),

  answers: z.record(z.string(), z.any()),

  totalTimeSpent: z.number()
    .min(0, { message: 'زمان کل صرف شده نمی‌تواند منفی باشد' }),

  isCompleted: z.boolean({
    errorMap: () => ({ message: 'وضعیت تکمیل باید مقدار بولی باشد' })
  }).default(true)
});

/**
 * Validation schema for exam filtering and listing
 */
export const ExamFilterSchema = z.object({
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

  type: ExamTypeEnum.optional(),
  status: ExamStatusEnum.optional(),

  isPublished: z.coerce.boolean({
    errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
  }).optional(),

  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'startTime'], {
    errorMap: () => ({ message: 'مرتب‌سازی معتبر نیست' })
  }).optional(),

  order: z.enum(['asc', 'desc'], {
    errorMap: () => ({ message: 'نحوه مرتب‌سازی معتبر نیست' })
  }).optional(),

  search: z.string()
    .trim()
    .min(2, { message: 'جستجو باید حداقل ۲ کاراکتر باشد' })
    .max(100, { message: 'جستجو نباید بیشتر از ۱۰۰ کاراکتر باشد' })
    .optional()
});

/**
 * Validation schema for exam result queries
 */
export const ExamResultQuerySchema = z.object({
  examId: z.string()
    .min(1, { message: 'شناسه آزمون الزامی است' }),

  userId: z.string()
    .min(1, { message: 'شناسه کاربر الزامی است' })
    .optional(),

  includeAnswers: z.coerce.boolean({
    errorMap: () => ({ message: 'شامل پاسخ‌ها باید مقدار بولی باشد' })
  }).optional(),

  includeStatistics: z.coerce.boolean({
    errorMap: () => ({ message: 'شامل آمار باید مقدار بولی باشد' })
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
export const validateTestExamCreation = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = CreateTestExamSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ایجاد آزمون نامعتبر است',
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

export const validateTestExamUpdate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.params = TestExamParamsSchema.parse(req.params);
    req.body = UpdateTestExamSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های به‌روزرسانی آزمون نامعتبر است',
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

export const validateExamSession = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = ExamSessionSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های جلسه آزمون نامعتبر است',
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

export const validateExamSubmission = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = ExamSubmissionSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ارسال آزمون نامعتبر است',
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

export const validateExamFilter = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.query = ExamFilterSchema.parse(req.query) as any;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'پارامترهای فیلتر آزمون نامعتبر است',
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

export const validateExamResultQuery = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.query = ExamResultQuerySchema.parse(req.query) as any;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'پارامترهای نتایج آزمون نامعتبر است',
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
export const validateDifficultyDistribution = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    const { configuration } = req.body;
    
    if (configuration && configuration.difficultyDistribution && configuration.totalQuestions) {
      const { easy = 0, medium = 0, hard = 0 } = configuration.difficultyDistribution;
      const total = easy + medium + hard;
      
      if (total !== configuration.totalQuestions) {
        res.status(400).json({
          success: false,
          message: 'مجموع توزیع سختی باید برابر تعداد کل سوالات باشد',
          errors: [{
            field: 'configuration.difficultyDistribution',
            message: `مجموع: ${total}، تعداد کل سوالات: ${configuration.totalQuestions}`
          }]
        });
        return;
      }
    }
    
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی توزیع سختی',
      errors: []
    });
  }
};

export const validateExamTimeConstraints = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    const { startTime, endTime, configuration } = req.body;
    const errors: Array<{ field: string; message: string }> = [];
    
    // Check if start time is in the future for new exams
    if (startTime && req.method === 'POST') {
      const now = new Date();
      const examStart = new Date(startTime);
      
      if (examStart <= now) {
        errors.push({
          field: 'startTime',
          message: 'زمان شروع آزمون باید در آینده باشد'
        });
      }
    }
    
    // Check time limit constraints
    if (startTime && endTime && configuration && configuration.timeLimit) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const timeDifference = (end.getTime() - start.getTime()) / (1000 * 60); // in minutes
      
      if (timeDifference < configuration.timeLimit) {
        errors.push({
          field: 'configuration.timeLimit',
          message: 'محدودیت زمان آزمون نمی‌تواند بیشتر از مدت زمان مجاز آزمون باشد'
        });
      }
    }
    
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'محدودیت‌های زمانی آزمون نامعتبر است',
        errors
      });
      return;
    }
    
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی محدودیت‌های زمانی',
      errors: []
    });
  }
};

// Type exports for TypeScript
export type CreateTestExamType = z.infer<typeof CreateTestExamSchema>;
export type UpdateTestExamType = z.infer<typeof UpdateTestExamSchema>;
export type TestExamParamsType = z.infer<typeof TestExamParamsSchema>;
export type ExamSessionType = z.infer<typeof ExamSessionSchema>;
export type ExamSubmissionType = z.infer<typeof ExamSubmissionSchema>;
export type ExamFilterType = z.infer<typeof ExamFilterSchema>;
export type ExamResultQueryType = z.infer<typeof ExamResultQuerySchema>;
export type ExamConfigurationType = z.infer<typeof ExamConfigurationSchema>;
export type DifficultyDistributionType = z.infer<typeof DifficultyDistributionSchema>;

// Export constants for use in other modules
export { EXAM_TYPES, EXAM_STATUSES }; 