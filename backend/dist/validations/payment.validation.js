"use strict";
/**
 * Payment validation middleware with Zod
 *
 * This file contains validation schemas and middleware for payment-related requests
 * using Zod.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransactionFilter = exports.validateCreateDiscountCode = exports.validateDiscountCode = exports.validatePayment = exports.TransactionFilterSchema = exports.CreateDiscountCodeSchema = exports.DiscountCodeSchema = exports.PaymentSchema = void 0;
const zod_1 = require("zod");
// Payment status enum
const PaymentStatusEnum = zod_1.z.enum(['pending', 'completed', 'failed', 'refunded'], {
    errorMap: () => ({ message: 'وضعیت باید یکی از مقادیر مجاز باشد' })
});
// Payment initiation validation schema
exports.PaymentSchema = zod_1.z.object({
    amount: zod_1.z.number()
        .positive({ message: 'مبلغ پرداخت باید مثبت باشد' })
        .min(1000, { message: 'حداقل مبلغ پرداخت ۱۰۰۰ تومان است' })
        .max(10000000, { message: 'حداکثر مبلغ پرداخت ۱۰ میلیون تومان است' }),
    discountCode: zod_1.z.string()
        .trim()
        .min(3, { message: 'کد تخفیف باید حداقل ۳ کاراکتر باشد' })
        .max(20, { message: 'کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
        .optional()
});
// Discount code validation schema
exports.DiscountCodeSchema = zod_1.z.object({
    code: zod_1.z.string()
        .trim()
        .min(3, { message: 'کد تخفیف باید حداقل ۳ کاراکتر باشد' })
        .max(20, { message: 'کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد' }),
    amount: zod_1.z.number()
        .positive({ message: 'مبلغ پرداخت باید مثبت باشد' })
        .min(1000, { message: 'حداقل مبلغ پرداخت ۱۰۰۰ تومان است' })
        .max(10000000, { message: 'حداکثر مبلغ پرداخت ۱۰ میلیون تومان است' })
});
// Admin discount code creation schema
exports.CreateDiscountCodeSchema = zod_1.z.object({
    code: zod_1.z.string()
        .trim()
        .min(3, { message: 'کد تخفیف باید حداقل ۳ کاراکتر باشد' })
        .max(20, { message: 'کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد' }),
    discountPercentage: zod_1.z.number()
        .positive({ message: 'درصد تخفیف باید مثبت باشد' })
        .min(1, { message: 'حداقل درصد تخفیف ۱ درصد است' })
        .max(100, { message: 'حداکثر درصد تخفیف ۱۰۰ درصد است' }),
    expiryDate: zod_1.z.coerce.date({
        errorMap: () => ({ message: 'تاریخ انقضا باید تاریخ معتبر باشد' })
    }).refine((date) => date > new Date(), {
        message: 'تاریخ انقضا باید در آینده باشد'
    }),
    usageLimit: zod_1.z.number()
        .positive({ message: 'محدودیت استفاده باید مثبت باشد' })
        .min(1, { message: 'حداقل محدودیت استفاده ۱ بار است' })
        .optional(),
    minAmount: zod_1.z.number()
        .nonnegative({ message: 'حداقل مبلغ باید صفر یا مثبت باشد' })
        .default(0)
        .optional(),
    maxDiscount: zod_1.z.number()
        .positive({ message: 'حداکثر تخفیف باید مثبت باشد' })
        .optional(),
    description: zod_1.z.string()
        .trim()
        .max(200, { message: 'توضیحات نمی‌تواند بیش از ۲۰۰ کاراکتر باشد' })
        .optional()
});
// Transaction filter validation schema
exports.TransactionFilterSchema = zod_1.z.object({
    page: zod_1.z.coerce.number()
        .positive({ message: 'شماره صفحه باید مثبت باشد' })
        .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
        .default(1)
        .optional(),
    limit: zod_1.z.coerce.number()
        .positive({ message: 'تعداد آیتم در صفحه باید مثبت باشد' })
        .int({ message: 'تعداد آیتم در صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'تعداد آیتم در صفحه باید حداقل ۱ باشد' })
        .max(100, { message: 'تعداد آیتم در صفحه نمی‌تواند بیش از ۱۰۰ باشد' })
        .default(10)
        .optional(),
    status: PaymentStatusEnum.optional(),
    userId: zod_1.z.string()
        .trim()
        .optional(),
    startDate: zod_1.z.coerce.date({
        errorMap: () => ({ message: 'تاریخ شروع باید تاریخ معتبر باشد' })
    }).optional(),
    endDate: zod_1.z.coerce.date({
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
const validatePayment = (req, res, next) => {
    try {
        req.body = exports.PaymentSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validatePayment = validatePayment;
const validateDiscountCode = (req, res, next) => {
    try {
        req.body = exports.DiscountCodeSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateDiscountCode = validateDiscountCode;
const validateCreateDiscountCode = (req, res, next) => {
    try {
        req.body = exports.CreateDiscountCodeSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateCreateDiscountCode = validateCreateDiscountCode;
const validateTransactionFilter = (req, res, next) => {
    try {
        req.query = exports.TransactionFilterSchema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateTransactionFilter = validateTransactionFilter;
//# sourceMappingURL=payment.validation.js.map