"use strict";
/**
 * Validation Middleware with Zod
 * میدل‌ویر اعتبارسنجی با پشتیبانی از ورودی‌های فارسی
 *
 * این فایل شامل تمام schema های اعتبارسنجی و middleware های مربوطه می‌باشد
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = exports.normalizePhoneNumber = exports.sanitizeInput = exports.searchSchema = exports.paginationSchema = exports.validateFileUpload = exports.validateQuery = exports.validateSchema = exports.fileUploadSchema = exports.paymentSchema = exports.contactSchema = exports.examSchema = exports.questionSchema = exports.userUpdateSchema = exports.userLoginSchema = exports.userRegistrationSchema = exports.strongPasswordSchema = exports.emailSchema = exports.persianTextSchema = exports.persianNameSchema = exports.iranianMobileSchema = exports.iranianNationalCodeSchema = void 0;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
/**
 * Persian/Farsi Input Validation Schemas
 * Schema های اعتبارسنجی برای ورودی‌های فارسی
 */
// کد ملی ایرانی - Iranian National Code
exports.iranianNationalCodeSchema = zod_1.z.string()
    .regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد')
    .refine((code) => {
    // الگوریتم اعتبارسنجی کد ملی ایرانی
    if (code.length !== 10)
        return false;
    // کدهای نامعتبر
    const invalidCodes = [
        '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
        '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'
    ];
    if (invalidCodes.includes(code))
        return false;
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
exports.iranianMobileSchema = zod_1.z.string()
    .regex(/^(\+98|0)?9\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد')
    .transform((mobile) => {
    // تبدیل به فرمت استاندارد
    return mobile.replace(/^\+98/, '0').replace(/^98/, '0');
});
// نام فارسی - Persian Name
exports.persianNameSchema = zod_1.z.string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام نمی‌تواند بیش از ۵۰ کاراکتر باشد')
    .regex(/^[\u0600-\u06FF\s]+$/, 'نام باید فقط شامل حروف فارسی باشد');
// متن فارسی - Persian Text
exports.persianTextSchema = zod_1.z.string()
    .min(1, 'متن نمی‌تواند خالی باشد')
    .regex(/^[\u0600-\u06FF\u0020-\u007E\s\d۰-۹]+$/, 'متن شامل کاراکترهای غیرمجاز است');
// ایمیل - Email
exports.emailSchema = zod_1.z.string()
    .email('فرمت ایمیل صحیح نیست')
    .min(5, 'ایمیل باید حداقل ۵ کاراکتر باشد')
    .max(100, 'ایمیل نمی‌تواند بیش از ۱۰۰ کاراکتر باشد');
// رمز عبور قوی - Strong Password
exports.strongPasswordSchema = zod_1.z.string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(128, 'رمز عبور نمی‌تواند بیش از ۱۲۸ کاراکتر باشد')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'رمز عبور باید شامل حروف کوچک، بزرگ، عدد و کاراکتر خاص باشد');
/**
 * User Validation Schemas
 * Schema های اعتبارسنجی کاربر
 */
exports.userRegistrationSchema = zod_1.z.object({
    firstName: exports.persianNameSchema,
    lastName: exports.persianNameSchema,
    email: exports.emailSchema,
    password: exports.strongPasswordSchema,
    nationalCode: exports.iranianNationalCodeSchema.optional(),
    phoneNumber: exports.iranianMobileSchema.optional(),
    role: zod_1.z.enum(['student', 'instructor', 'admin', 'designer'], {
        errorMap: () => ({ message: 'نقش کاربری معتبر نیست' })
    }).default('student'),
    gradeLevel: zod_1.z.number().min(1).max(12).optional(),
    institutionId: zod_1.z.string().optional()
});
exports.userLoginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1, 'رمز عبور الزامی است')
});
exports.userUpdateSchema = zod_1.z.object({
    firstName: exports.persianNameSchema.optional(),
    lastName: exports.persianNameSchema.optional(),
    phoneNumber: exports.iranianMobileSchema.optional(),
    gradeLevel: zod_1.z.number().min(1).max(12).optional(),
    bio: exports.persianTextSchema.optional()
});
/**
 * Question Validation Schemas
 * Schema های اعتبارسنجی سوال
 */
exports.questionSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'عنوان سوال باید حداقل ۵ کاراکتر باشد').max(200, 'عنوان سوال نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'),
    content: zod_1.z.string().min(10, 'محتوای سوال باید حداقل ۱۰ کاراکتر باشد'),
    type: zod_1.z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay'], {
        errorMap: () => ({ message: 'نوع سوال معتبر نیست' })
    }),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard'], {
        errorMap: () => ({ message: 'سطح دشواری معتبر نیست' })
    }),
    category: zod_1.z.string().min(1, 'دسته‌بندی الزامی است'),
    lesson: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    options: zod_1.z.array(zod_1.z.object({
        text: zod_1.z.string().min(1, 'متن گزینه نمی‌تواند خالی باشد'),
        isCorrect: zod_1.z.boolean()
    })).optional(),
    correctAnswer: zod_1.z.string().optional(),
    explanation: zod_1.z.string().optional(),
    points: zod_1.z.number().min(1, 'امتیاز سوال باید حداقل ۱ باشد').max(100, 'امتیاز سوال نمی‌تواند بیش از ۱۰۰ باشد').default(1)
});
/**
 * Exam Validation Schemas
 * Schema های اعتبارسنجی آزمون
 */
exports.examSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'عنوان آزمون باید حداقل ۵ کاراکتر باشد').max(200, 'عنوان آزمون نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'),
    description: zod_1.z.string().optional(),
    duration: zod_1.z.number().min(1, 'مدت زمان آزمون باید حداقل ۱ دقیقه باشد').max(480, 'مدت زمان آزمون نمی‌تواند بیش از ۸ ساعت باشد'),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard'], {
        errorMap: () => ({ message: 'سطح دشواری معتبر نیست' })
    }),
    category: zod_1.z.string().min(1, 'دسته‌بندی الزامی است'),
    lesson: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().default(false),
    maxAttempts: zod_1.z.number().min(1, 'حداکثر تعداد تلاش باید حداقل ۱ باشد').max(10, 'حداکثر تعداد تلاش نمی‌تواند بیش از ۱۰ باشد').default(1),
    passingScore: zod_1.z.number().min(0, 'نمره قبولی نمی‌تواند منفی باشد').max(100, 'نمره قبولی نمی‌تواند بیش از ۱۰۰ باشد').default(60),
    scheduledAt: zod_1.z.string().datetime().optional(),
    questions: zod_1.z.array(zod_1.z.string()).optional(),
    institutionId: zod_1.z.string().optional()
});
/**
 * Contact Validation Schema
 * Schema اعتبارسنجی تماس
 */
exports.contactSchema = zod_1.z.object({
    name: exports.persianNameSchema,
    email: exports.emailSchema,
    phone: exports.iranianMobileSchema.optional(),
    subject: zod_1.z.string().min(5, 'موضوع باید حداقل ۵ کاراکتر باشد').max(100, 'موضوع نمی‌تواند بیش از ۱۰۰ کاراکتر باشد'),
    message: zod_1.z.string().min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد').max(1000, 'پیام نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد'),
    type: zod_1.z.enum(['support', 'complaint', 'suggestion', 'other'], {
        errorMap: () => ({ message: 'نوع پیام معتبر نیست' })
    }).default('other'),
    priority: zod_1.z.enum(['low', 'medium', 'high'], {
        errorMap: () => ({ message: 'اولویت معتبر نیست' })
    }).default('medium')
});
/**
 * Payment Validation Schema
 * Schema اعتبارسنجی پرداخت
 */
exports.paymentSchema = zod_1.z.object({
    amount: zod_1.z.number().min(1000, 'مبلغ پرداخت باید حداقل ۱۰۰۰ تومان باشد').max(100000000, 'مبلغ پرداخت نمی‌تواند بیش از ۱۰۰ میلیون تومان باشد'),
    gateway: zod_1.z.enum(['zarinpal', 'mellat', 'parsian', 'pasargad'], {
        errorMap: () => ({ message: 'درگاه پرداخت معتبر نیست' })
    }),
    description: zod_1.z.string().optional(),
    callbackUrl: zod_1.z.string().url('آدرس بازگشت معتبر نیست').optional()
});
/**
 * File Upload Validation Schema
 * Schema اعتبارسنجی آپلود فایل
 */
exports.fileUploadSchema = zod_1.z.object({
    filename: zod_1.z.string().min(1, 'نام فایل الزامی است'),
    mimetype: zod_1.z.enum(['image/jpeg', 'image/jpg', 'image/png'], {
        errorMap: () => ({ message: 'فرمت فایل باید JPG یا PNG باشد' })
    }),
    size: zod_1.z.number().max(5 * 1024 * 1024, 'حجم فایل نمی‌تواند بیش از ۵ مگابایت باشد')
});
/**
 * Generic Validation Middleware
 * میدل‌ویر عمومی اعتبارسنجی
 */
const validateSchema = (schema) => {
    return (req, res, next) => {
        try {
            // اعتبارسنجی body درخواست
            const validatedData = schema.parse(req.body);
            // جایگزینی body با داده‌های اعتبارسنجی شده
            req.body = validatedData;
            logger_1.logger.info('Validation successful', {
                endpoint: req.path,
                method: req.method,
                ip: req.ip
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));
                logger_1.logger.warn('Validation failed', {
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
            logger_1.logger.error('Unexpected validation error', {
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
exports.validateSchema = validateSchema;
/**
 * Query Parameters Validation Middleware
 * میدل‌ویر اعتبارسنجی پارامترهای کوئری
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validatedQuery = schema.parse(req.query);
            req.query = validatedQuery;
            logger_1.logger.debug('Query validation successful', {
                endpoint: req.path,
                query: req.query
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));
                logger_1.logger.warn('Query validation failed', {
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
exports.validateQuery = validateQuery;
/**
 * File Upload Validation Middleware
 * میدل‌ویر اعتبارسنجی آپلود فایل
 */
const validateFileUpload = (req, res, next) => {
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
        exports.fileUploadSchema.parse(fileData);
        // بررسی ابعاد تصویر (اختیاری)
        if (req.file.mimetype.startsWith('image/')) {
            // می‌توان از sharp یا jimp برای بررسی ابعاد استفاده کرد
            // در اینجا فقط لاگ می‌کنیم
            logger_1.logger.info('Image file uploaded', {
                filename: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            });
        }
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
exports.validateFileUpload = validateFileUpload;
/**
 * Common Query Schemas
 * Schema های رایج برای کوئری
 */
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().transform(val => parseInt(val) || 1).pipe(zod_1.z.number().min(1, 'شماره صفحه باید حداقل ۱ باشد')),
    limit: zod_1.z.string().transform(val => parseInt(val) || 10).pipe(zod_1.z.number().min(1, 'تعداد آیتم در صفحه باید حداقل ۱ باشد').max(100, 'تعداد آیتم در صفحه نمی‌تواند بیش از ۱۰۰ باشد')),
    sort: zod_1.z.string().optional(),
    order: zod_1.z.enum(['asc', 'desc']).default('desc')
});
exports.searchSchema = zod_1.z.object({
    q: zod_1.z.string().min(1, 'کلمه جستجو نمی‌تواند خالی باشد').max(100, 'کلمه جستجو نمی‌تواند بیش از ۱۰۰ کاراکتر باشد').optional(),
    category: zod_1.z.string().optional(),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
    status: zod_1.z.string().optional()
});
/**
 * Validation Helper Functions
 * توابع کمکی اعتبارسنجی
 */
const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
};
exports.sanitizeInput = sanitizeInput;
const normalizePhoneNumber = (phone) => {
    return phone.replace(/^\+98/, '0').replace(/^98/, '0');
};
exports.normalizePhoneNumber = normalizePhoneNumber;
const validateObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
exports.validateObjectId = validateObjectId;
exports.default = {
    validateSchema: exports.validateSchema,
    validateQuery: exports.validateQuery,
    validateFileUpload: exports.validateFileUpload,
    userRegistrationSchema: exports.userRegistrationSchema,
    userLoginSchema: exports.userLoginSchema,
    userUpdateSchema: exports.userUpdateSchema,
    questionSchema: exports.questionSchema,
    examSchema: exports.examSchema,
    contactSchema: exports.contactSchema,
    paymentSchema: exports.paymentSchema,
    paginationSchema: exports.paginationSchema,
    searchSchema: exports.searchSchema,
    iranianNationalCodeSchema: exports.iranianNationalCodeSchema,
    iranianMobileSchema: exports.iranianMobileSchema,
    persianNameSchema: exports.persianNameSchema,
    persianTextSchema: exports.persianTextSchema,
    emailSchema: exports.emailSchema,
    strongPasswordSchema: exports.strongPasswordSchema
};
//# sourceMappingURL=validation.middleware.js.map