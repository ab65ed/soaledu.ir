/**
 * Validation Middleware with Zod
 * میدل‌ویر اعتبارسنجی با پشتیبانی از ورودی‌های فارسی
 * 
 * این فایل شامل تمام schema های اعتبارسنجی و middleware های مربوطه می‌باشد
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { logger } from '../utils/logger';

/**
 * Persian/Farsi Input Validation Schemas
 * Schema های اعتبارسنجی برای ورودی‌های فارسی
 */

// کد ملی ایرانی - Iranian National Code
export const iranianNationalCodeSchema = z.string()
  .regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد')
  .refine((code) => {
    // الگوریتم اعتبارسنجی کد ملی ایرانی
    if (code.length !== 10) return false;
    
    // کدهای نامعتبر
    const invalidCodes = [
      '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
      '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'
    ];
    
    if (invalidCodes.includes(code)) return false;
    
    // محاسبه رقم کنترل
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(code[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const checkDigit = parseInt(code[9]);
    
    return (remainder < 2 && checkDigit === remainder) || 
           (remainder >= 2 && checkDigit === 11 - remainder);
  }, 'کد ملی وارد شده معتبر نیست');

// شماره موبایل ایرانی - Iranian Mobile Number
export const iranianMobileSchema = z.string()
  .regex(/^(\+98|0)?9\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد')
  .transform((mobile) => {
    // تبدیل به فرمت استاندارد
    return mobile.replace(/^\+98/, '0').replace(/^98/, '0');
  });

// نام فارسی - Persian Name
export const persianNameSchema = z.string()
  .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
  .max(50, 'نام نمی‌تواند بیش از ۵۰ کاراکتر باشد')
  .regex(/^[\u0600-\u06FF\s]+$/, 'نام باید فقط شامل حروف فارسی باشد');

// متن فارسی - Persian Text
export const persianTextSchema = z.string()
  .min(1, 'متن نمی‌تواند خالی باشد')
  .regex(/^[\u0600-\u06FF\u0020-\u007E\s\d۰-۹]+$/, 'متن شامل کاراکترهای غیرمجاز است');

// ایمیل - Email
export const emailSchema = z.string()
  .email('فرمت ایمیل صحیح نیست')
  .min(5, 'ایمیل باید حداقل ۵ کاراکتر باشد')
  .max(100, 'ایمیل نمی‌تواند بیش از ۱۰۰ کاراکتر باشد');

// رمز عبور قوی - Strong Password
export const strongPasswordSchema = z.string()
  .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
  .max(128, 'رمز عبور نمی‌تواند بیش از ۱۲۸ کاراکتر باشد')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'رمز عبور باید شامل حروف کوچک، بزرگ، عدد و کاراکتر خاص باشد');

/**
 * User Validation Schemas
 * Schema های اعتبارسنجی کاربر
 */
export const userRegistrationSchema = z.object({
  firstName: persianNameSchema,
  lastName: persianNameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
  nationalCode: iranianNationalCodeSchema.optional(),
  phoneNumber: iranianMobileSchema.optional(),
  role: z.enum(['student', 'instructor', 'admin', 'designer'], {
    errorMap: () => ({ message: 'نقش کاربری معتبر نیست' })
  }).default('student'),
  gradeLevel: z.number().min(1).max(12).optional(),
  institutionId: z.string().optional()
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'رمز عبور الزامی است')
});

export const userUpdateSchema = z.object({
  firstName: persianNameSchema.optional(),
  lastName: persianNameSchema.optional(),
  phoneNumber: iranianMobileSchema.optional(),
  gradeLevel: z.number().min(1).max(12).optional(),
  bio: persianTextSchema.optional()
});

/**
 * Question Validation Schemas
 * Schema های اعتبارسنجی سوال
 */
export const questionSchema = z.object({
  title: z.string().min(5, 'عنوان سوال باید حداقل ۵ کاراکتر باشد').max(200, 'عنوان سوال نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'),
  content: z.string().min(10, 'محتوای سوال باید حداقل ۱۰ کاراکتر باشد'),
  type: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay'], {
    errorMap: () => ({ message: 'نوع سوال معتبر نیست' })
  }),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'سطح دشواری معتبر نیست' })
  }),
  category: z.string().min(1, 'دسته‌بندی الزامی است'),
  lesson: z.string().optional(),
  tags: z.array(z.string()).optional(),
  options: z.array(z.object({
    text: z.string().min(1, 'متن گزینه نمی‌تواند خالی باشد'),
    isCorrect: z.boolean()
  })).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().min(1, 'امتیاز سوال باید حداقل ۱ باشد').max(100, 'امتیاز سوال نمی‌تواند بیش از ۱۰۰ باشد').default(1)
});

/**
 * Exam Validation Schemas
 * Schema های اعتبارسنجی آزمون
 */
export const examSchema = z.object({
  title: z.string().min(5, 'عنوان آزمون باید حداقل ۵ کاراکتر باشد').max(200, 'عنوان آزمون نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'),
  description: z.string().optional(),
  duration: z.number().min(1, 'مدت زمان آزمون باید حداقل ۱ دقیقه باشد').max(480, 'مدت زمان آزمون نمی‌تواند بیش از ۸ ساعت باشد'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'سطح دشواری معتبر نیست' })
  }),
  category: z.string().min(1, 'دسته‌بندی الزامی است'),
  lesson: z.string().optional(),
  isPublic: z.boolean().default(false),
  maxAttempts: z.number().min(1, 'حداکثر تعداد تلاش باید حداقل ۱ باشد').max(10, 'حداکثر تعداد تلاش نمی‌تواند بیش از ۱۰ باشد').default(1),
  passingScore: z.number().min(0, 'نمره قبولی نمی‌تواند منفی باشد').max(100, 'نمره قبولی نمی‌تواند بیش از ۱۰۰ باشد').default(60),
  scheduledAt: z.string().datetime().optional(),
  questions: z.array(z.string()).optional(),
  institutionId: z.string().optional()
});

/**
 * Contact Validation Schema
 * Schema اعتبارسنجی تماس
 */
export const contactSchema = z.object({
  name: persianNameSchema,
  email: emailSchema,
  phone: iranianMobileSchema.optional(),
  subject: z.string().min(5, 'موضوع باید حداقل ۵ کاراکتر باشد').max(100, 'موضوع نمی‌تواند بیش از ۱۰۰ کاراکتر باشد'),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد').max(1000, 'پیام نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد'),
  type: z.enum(['support', 'complaint', 'suggestion', 'other'], {
    errorMap: () => ({ message: 'نوع پیام معتبر نیست' })
  }).default('other'),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'اولویت معتبر نیست' })
  }).default('medium')
});

/**
 * Payment Validation Schema
 * Schema اعتبارسنجی پرداخت
 */
export const paymentSchema = z.object({
  amount: z.number().min(1000, 'مبلغ پرداخت باید حداقل ۱۰۰۰ تومان باشد').max(100000000, 'مبلغ پرداخت نمی‌تواند بیش از ۱۰۰ میلیون تومان باشد'),
  gateway: z.enum(['zarinpal', 'mellat', 'parsian', 'pasargad'], {
    errorMap: () => ({ message: 'درگاه پرداخت معتبر نیست' })
  }),
  description: z.string().optional(),
  callbackUrl: z.string().url('آدرس بازگشت معتبر نیست').optional()
});

/**
 * File Upload Validation Schema
 * Schema اعتبارسنجی آپلود فایل
 */
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'نام فایل الزامی است'),
  mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png'], {
    errorMap: () => ({ message: 'فرمت فایل باید JPG یا PNG باشد' })
  }),
  size: z.number().max(5 * 1024 * 1024, 'حجم فایل نمی‌تواند بیش از ۵ مگابایت باشد')
});

/**
 * Generic Validation Middleware
 * میدل‌ویر عمومی اعتبارسنجی
 */
export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // اعتبارسنجی body درخواست
      const validatedData = schema.parse(req.body);
      
      // جایگزینی body با داده‌های اعتبارسنجی شده
      req.body = validatedData;
      
      logger.info('Validation successful', {
        endpoint: req.path,
        method: req.method,
        ip: req.ip
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        logger.warn('Validation failed', {
          endpoint: req.path,
          method: req.method,
          ip: req.ip,
          errors: errorMessages
        });
        
        return res.status(400).json({
          success: false,
          message: 'خطا در اعتبارسنجی داده‌ها',
          errors: errorMessages
        });
      }
      
      logger.error('Unexpected validation error', {
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return res.status(500).json({
        success: false,
        message: 'خطای داخلی سرور در اعتبارسنجی'
      });
    }
  };
};

/**
 * Query Parameters Validation Middleware
 * میدل‌ویر اعتبارسنجی پارامترهای کوئری
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery;
      
      logger.debug('Query validation successful', {
        endpoint: req.path,
        query: req.query
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        logger.warn('Query validation failed', {
          endpoint: req.path,
          errors: errorMessages
        });
        
        return res.status(400).json({
          success: false,
          message: 'خطا در پارامترهای درخواست',
          errors: errorMessages
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'خطای داخلی سرور'
      });
    }
  };
};

/**
 * File Upload Validation Middleware
 * میدل‌ویر اعتبارسنجی آپلود فایل
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'فایل الزامی است'
      });
    }
    
    const fileData = {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    };
    
    fileUploadSchema.parse(fileData);
    
    // بررسی ابعاد تصویر (اختیاری)
    if (req.file.mimetype.startsWith('image/')) {
      // می‌توان از sharp یا jimp برای بررسی ابعاد استفاده کرد
      // در اینجا فقط لاگ می‌کنیم
      logger.info('Image file uploaded', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    }
    
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'فایل آپلود شده معتبر نیست',
        errors: errorMessages
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'خطا در پردازش فایل'
    });
  }
};

/**
 * Common Query Schemas
 * Schema های رایج برای کوئری
 */
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).pipe(z.number().min(1, 'شماره صفحه باید حداقل ۱ باشد')),
  limit: z.string().transform(val => parseInt(val) || 10).pipe(z.number().min(1, 'تعداد آیتم در صفحه باید حداقل ۱ باشد').max(100, 'تعداد آیتم در صفحه نمی‌تواند بیش از ۱۰۰ باشد')),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

export const searchSchema = z.object({
  q: z.string().min(1, 'کلمه جستجو نمی‌تواند خالی باشد').max(100, 'کلمه جستجو نمی‌تواند بیش از ۱۰۰ کاراکتر باشد').optional(),
  category: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  status: z.string().optional()
});

/**
 * Validation Helper Functions
 * توابع کمکی اعتبارسنجی
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const normalizePhoneNumber = (phone: string): string => {
  return phone.replace(/^\+98/, '0').replace(/^98/, '0');
};

export const validateObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export default {
  validateSchema,
  validateQuery,
  validateFileUpload,
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  questionSchema,
  examSchema,
  contactSchema,
  paymentSchema,
  paginationSchema,
  searchSchema,
  iranianNationalCodeSchema,
  iranianMobileSchema,
  persianNameSchema,
  persianTextSchema,
  emailSchema,
  strongPasswordSchema
}; 