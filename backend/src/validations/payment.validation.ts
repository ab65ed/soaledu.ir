/**
 * Payment validation middleware with Zod
 *
 * This file contains validation schemas and middleware for payment-related requests
 * using Zod.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Payment status enum
const PaymentStatusEnum = z.enum(['pending', 'completed', 'failed', 'refunded'], {
  errorMap: () => ({ message: 'وضعیت باید یکی از مقادیر مجاز باشد' })
});

// Payment initiation validation schema
export const PaymentSchema = z.object({
  amount: z.number()
    .positive({ message: 'مبلغ پرداخت باید مثبت باشد' })
    .min(1000, { message: 'حداقل مبلغ پرداخت ۱۰۰۰ تومان است' })
    .max(10000000, { message: 'حداکثر مبلغ پرداخت ۱۰ میلیون تومان است' }),
  discountCode: z.string()
    .trim()
    .min(3, { message: 'کد تخفیف باید حداقل ۳ کاراکتر باشد' })
    .max(20, { message: 'کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
    .optional()
});

// Discount code validation schema
export const DiscountCodeSchema = z.object({
  code: z.string()
    .trim()
    .min(3, { message: 'کد تخفیف باید حداقل ۳ کاراکتر باشد' })
    .max(20, { message: 'کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد' }),
  amount: z.number()
    .positive({ message: 'مبلغ پرداخت باید مثبت باشد' })
    .min(1000, { message: 'حداقل مبلغ پرداخت ۱۰۰۰ تومان است' })
    .max(10000000, { message: 'حداکثر مبلغ پرداخت ۱۰ میلیون تومان است' })
});

// Admin discount code creation schema
export const CreateDiscountCodeSchema = z.object({
  code: z.string()
    .trim()
    .min(3, { message: 'کد تخفیف باید حداقل ۳ کاراکتر باشد' })
    .max(20, { message: 'کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد' }),
  discountPercentage: z.number()
    .positive({ message: 'درصد تخفیف باید مثبت باشد' })
    .min(1, { message: 'حداقل درصد تخفیف ۱ درصد است' })
    .max(100, { message: 'حداکثر درصد تخفیف ۱۰۰ درصد است' }),
  expiryDate: z.coerce.date({
    errorMap: () => ({ message: 'تاریخ انقضا باید تاریخ معتبر باشد' })
  }).refine((date) => date > new Date(), {
    message: 'تاریخ انقضا باید در آینده باشد'
  }),
  usageLimit: z.number()
    .positive({ message: 'محدودیت استفاده باید مثبت باشد' })
    .min(1, { message: 'حداقل محدودیت استفاده ۱ بار است' })
    .optional(),
  minAmount: z.number()
    .nonnegative({ message: 'حداقل مبلغ باید صفر یا مثبت باشد' })
    .default(0)
    .optional(),
  maxDiscount: z.number()
    .positive({ message: 'حداکثر تخفیف باید مثبت باشد' })
    .optional(),
  description: z.string()
    .trim()
    .max(200, { message: 'توضیحات نمی‌تواند بیش از ۲۰۰ کاراکتر باشد' })
    .optional()
});

// Transaction filter validation schema
export const TransactionFilterSchema = z.object({
  page: z.coerce.number()
    .positive({ message: 'شماره صفحه باید مثبت باشد' })
    .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
    .default(1)
    .optional(),
  limit: z.coerce.number()
    .positive({ message: 'تعداد آیتم در صفحه باید مثبت باشد' })
    .int({ message: 'تعداد آیتم در صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'تعداد آیتم در صفحه باید حداقل ۱ باشد' })
    .max(100, { message: 'تعداد آیتم در صفحه نمی‌تواند بیش از ۱۰۰ باشد' })
    .default(10)
    .optional(),
  status: PaymentStatusEnum.optional(),
  userId: z.string()
    .trim()
    .optional(),
  startDate: z.coerce.date({
    errorMap: () => ({ message: 'تاریخ شروع باید تاریخ معتبر باشد' })
  }).optional(),
  endDate: z.coerce.date({
    errorMap: () => ({ message: 'تاریخ پایان باید تاریخ معتبر باشد' })
  }).optional()
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.startDate < data.endDate;
  }
  return true;
}, {
  message: 'تاریخ شروع باید قبل از تاریخ پایان باشد',
  path: ['dateRange']
});

// Middleware functions using Zod
export const validatePayment = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = PaymentSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors
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

export const validateDiscountCode = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = DiscountCodeSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors
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

export const validateCreateDiscountCode = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = CreateDiscountCodeSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors
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

export const validateTransactionFilter = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.query = TransactionFilterSchema.parse(req.query) as any;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      res.status(400).json({
        success: false,
        message: 'پارامترهای فیلتر نامعتبر است',
        errors: errors
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

// Type exports for TypeScript
export type PaymentType = z.infer<typeof PaymentSchema>;
export type DiscountCodeType = z.infer<typeof DiscountCodeSchema>;
export type CreateDiscountCodeType = z.infer<typeof CreateDiscountCodeSchema>;
export type TransactionFilterType = z.infer<typeof TransactionFilterSchema>; 