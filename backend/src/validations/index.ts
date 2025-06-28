/**
 * Validation utilities with Zod
 * 
 * This file exports validation middleware factory and common validation schemas using Zod.
 */

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler';

/**
 * Create validation middleware for Zod schemas
 * @param schema - Zod validation schema
 * @param source - Source of data to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
const validate = <T>(schema: z.ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = source === 'body' ? req.body : 
                            source === 'query' ? req.query : 
                            req.params;
      
      // Parse and validate data
      const validatedData = schema.parse(dataToValidate);
      
      // Replace the original data with validated data
      if (source === 'body') {
        req.body = validatedData;
      } else if (source === 'query') {
        req.query = validatedData as any;
      } else {
        req.params = validatedData as any;
      }
      
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new ApiError(`خطای اعتبارسنجی: ${errors}`, 400));
      }
      return next(new ApiError('خطای اعتبارسنجی نامشخص', 400));
    }
  };
};

// Common validation schemas using Zod
const schemas = {
  // Auth schemas
  register: z.object({
    name: z.string()
      .min(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' })
      .max(50, { message: 'نام نباید بیشتر از ۵۰ کاراکتر باشد' }),
    email: z.string()
      .email({ message: 'ایمیل نامعتبر است' }),
    password: z.string()
      .min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  }),
  
  login: z.object({
    email: z.string()
      .email({ message: 'ایمیل نامعتبر است' }),
    password: z.string()
      .min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  }),
  
  // User schemas
  updateProfile: z.object({
    name: z.string()
      .min(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' })
      .max(50, { message: 'نام نباید بیشتر از ۵۰ کاراکتر باشد' })
      .optional(),
  
  }),
  
  // ExamConfig schemas
  createExamConfig: z.object({
    category: z.string({ message: 'دسته‌بندی الزامی است' }),
    lesson: z.string().optional(),
    hasNegativeMarking: z.boolean().optional(),
    timerOption: z.enum(['50s', '70s', 'none'], {
      errorMap: () => ({ message: 'گزینه تایمر باید یکی از مقادیر 50s، 70s یا none باشد' })
    }).optional()
  }),
  
  // Answer schemas
  submitAnswer: z.object({
    questionId: z.string({ message: 'شناسه سوال الزامی است' }),
    selectedOption: z.number()
      .int({ message: 'گزینه انتخابی باید عدد صحیح باشد' })
      .min(0, { message: 'گزینه انتخابی نامعتبر است' })
  }),
  
  // Ticket schemas
  createTicket: z.object({
    subject: z.string()
      .min(3, { message: 'موضوع باید حداقل ۳ کاراکتر باشد' })
      .max(100, { message: 'موضوع نباید بیشتر از ۱۰۰ کاراکتر باشد' }),
    message: z.string()
      .min(10, { message: 'پیام باید حداقل ۱۰ کاراکتر باشد' }),
    priority: z.enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'اولویت باید یکی از مقادیر low، medium یا high باشد' })
    }).optional()
  }),
  
  addTicketResponse: z.object({
    message: z.string()
      .min(1, { message: 'پیام نمی‌تواند خالی باشد' })
  }),
  
  // Payment schemas
  createPayment: z.object({
    amount: z.number()
      .positive({ message: 'مبلغ باید مثبت باشد' }),
    paymentMethod: z.enum(['credit-card', 'paypal', 'bank-transfer', 'other'], {
      errorMap: () => ({ message: 'روش پرداخت نامعتبر است' })
    }),
    packageName: z.string().optional()
  }),
  
  // BlogPost schemas
  createBlogPost: z.object({
    title: z.string()
      .min(3, { message: 'عنوان باید حداقل ۳ کاراکتر باشد' })
      .max(200, { message: 'عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد' }),
    content: z.string()
      .min(10, { message: 'محتوا باید حداقل ۱۰ کاراکتر باشد' }),
    category: z.string().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    metaTitle: z.string()
      .max(100, { message: 'عنوان متا نباید بیشتر از ۱۰۰ کاراکتر باشد' })
      .optional(),
    metaDescription: z.string()
      .max(200, { message: 'توضیح متا نباید بیشتر از ۲۰۰ کاراکتر باشد' })
      .optional(),
    status: z.enum(['draft', 'published', 'archived'], {
      errorMap: () => ({ message: 'وضعیت باید یکی از مقادیر draft، published یا archived باشد' })
    }).optional()
  })
} as const;

/**
 * Alternative name for validate function for backward compatibility
 */
export const validateRequest = validate;

export {
  validate,
  schemas,
}; 