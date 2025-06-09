"use strict";
/**
 * Course Exam validation middleware with Zod
 *
 * This file contains validation schemas and middleware for course exam-related requests
 * using Zod with Persian error messages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIFFICULTIES = exports.GROUPS = exports.GRADES = exports.COURSE_TYPES = exports.validateQuestionDifficultyDistribution = exports.validateCourseExamPublishing = exports.validateListQuery = exports.validateSearchQuery = exports.validateAutoSave = exports.validateRating = exports.validateCourseExamUpdate = exports.validateCourseExam = exports.ListQuerySchema = exports.SearchQuerySchema = exports.AutoSaveSchema = exports.RatingSchema = exports.CourseExamParamsSchema = exports.UpdateCourseExamSchema = exports.CreateCourseExamSchema = void 0;
const zod_1 = require("zod");
// Valid course types
const COURSE_TYPES = [
    'mathematics', 'physics', 'chemistry', 'biology',
    'history', 'geography', 'literature', 'english', 'arabic', 'other'
];
exports.COURSE_TYPES = COURSE_TYPES;
// Valid grades
const GRADES = [
    'elementary-1', 'elementary-2', 'elementary-3', 'elementary-4', 'elementary-5', 'elementary-6',
    'middle-school-1', 'middle-school-2', 'middle-school-3',
    'high-school-1', 'high-school-2', 'high-school-3', 'high-school-4',
    'high-school-10', 'high-school-11', 'high-school-12',
    'university', 'konkur'
];
exports.GRADES = GRADES;
// Valid groups
const GROUPS = [
    'theoretical', 'mathematical', 'experimental', 'technical', 'art', 'other'
];
exports.GROUPS = GROUPS;
// Valid difficulty levels
const DIFFICULTIES = ['easy', 'medium', 'hard'];
exports.DIFFICULTIES = DIFFICULTIES;
// Enums for validation
const CourseTypeEnum = zod_1.z.enum(COURSE_TYPES, {
    errorMap: () => ({ message: 'نوع درس معتبر نیست' })
});
const GradeEnum = zod_1.z.enum(GRADES, {
    errorMap: () => ({ message: 'مقطع تحصیلی معتبر نیست' })
});
const GroupEnum = zod_1.z.enum(GROUPS, {
    errorMap: () => ({ message: 'گروه آموزشی معتبر نیست' })
});
const DifficultyEnum = zod_1.z.enum(DIFFICULTIES, {
    errorMap: () => ({ message: 'سطح سختی معتبر نیست' })
});
/**
 * Validation schema for creating a course exam
 */
exports.CreateCourseExamSchema = zod_1.z.object({
    title: zod_1.z.string()
        .trim()
        .min(5, { message: 'عنوان باید حداقل ۵ کاراکتر باشد' })
        .max(200, { message: 'عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد' }),
    courseType: CourseTypeEnum,
    grade: GradeEnum,
    group: GroupEnum,
    description: zod_1.z.string()
        .trim()
        .min(10, { message: 'توضیحات باید حداقل ۱۰ کاراکتر باشد' })
        .max(2000, { message: 'توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد' }),
    tags: zod_1.z.array(zod_1.z.string()
        .min(1, { message: 'هر تگ باید حداقل ۱ کاراکتر باشد' })
        .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' }))
        .max(20, { message: 'حداکثر ۲۰ تگ مجاز است' })
        .optional(),
    difficulty: DifficultyEnum.optional(),
    estimatedTime: zod_1.z.number()
        .int({ message: 'زمان تخمینی باید عدد صحیح باشد' })
        .min(1, { message: 'زمان تخمینی باید حداقل ۱ دقیقه باشد' })
        .max(480, { message: 'زمان تخمینی نباید بیشتر از ۴۸۰ دقیقه (۸ ساعت) باشد' })
        .optional(),
    price: zod_1.z.number()
        .int({ message: 'قیمت باید عدد صحیح باشد' })
        .min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
        .max(100000, { message: 'قیمت نباید بیشتر از ۱۰۰,۰۰۰ تومان باشد' })
        .optional(),
    isPublished: zod_1.z.boolean({
        errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
    }).optional(),
    chapters: zod_1.z.array(zod_1.z.string()
        .min(1, { message: 'نام فصل باید حداقل ۱ کاراکتر باشد' })
        .max(100, { message: 'نام فصل نباید بیشتر از ۱۰۰ کاراکتر باشد' }))
        .max(50, { message: 'حداکثر ۵۰ فصل مجاز است' })
        .optional()
});
/**
 * Validation schema for updating a course exam
 */
exports.UpdateCourseExamSchema = zod_1.z.object({
    title: zod_1.z.string()
        .trim()
        .min(5, { message: 'عنوان باید حداقل ۵ کاراکتر باشد' })
        .max(200, { message: 'عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد' })
        .optional(),
    courseType: CourseTypeEnum.optional(),
    grade: GradeEnum.optional(),
    group: GroupEnum.optional(),
    description: zod_1.z.string()
        .trim()
        .min(10, { message: 'توضیحات باید حداقل ۱۰ کاراکتر باشد' })
        .max(2000, { message: 'توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد' })
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()
        .min(1, { message: 'هر تگ باید حداقل ۱ کاراکتر باشد' })
        .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' }))
        .max(20, { message: 'حداکثر ۲۰ تگ مجاز است' })
        .optional(),
    difficulty: DifficultyEnum.optional(),
    estimatedTime: zod_1.z.number()
        .int({ message: 'زمان تخمینی باید عدد صحیح باشد' })
        .min(1, { message: 'زمان تخمینی باید حداقل ۱ دقیقه باشد' })
        .max(480, { message: 'زمان تخمینی نباید بیشتر از ۴۸۰ دقیقه (۸ ساعت) باشد' })
        .optional(),
    price: zod_1.z.number()
        .int({ message: 'قیمت باید عدد صحیح باشد' })
        .min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
        .max(100000, { message: 'قیمت نباید بیشتر از ۱۰۰,۰۰۰ تومان باشد' })
        .optional(),
    isPublished: zod_1.z.boolean({
        errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
    }).optional(),
    chapters: zod_1.z.array(zod_1.z.string()
        .min(1, { message: 'نام فصل باید حداقل ۱ کاراکتر باشد' })
        .max(100, { message: 'نام فصل نباید بیشتر از ۱۰۰ کاراکتر باشد' }))
        .max(50, { message: 'حداکثر ۵۰ فصل مجاز است' })
        .optional()
});
/**
 * Validation schema for course exam parameters (ID validation)
 */
exports.CourseExamParamsSchema = zod_1.z.object({
    id: zod_1.z.string()
        .min(1, { message: 'شناسه آزمون الزامی است' })
});
/**
 * Validation schema for rating a course exam
 */
exports.RatingSchema = zod_1.z.object({
    rating: zod_1.z.number()
        .int({ message: 'امتیاز باید عدد صحیح باشد' })
        .min(1, { message: 'امتیاز باید حداقل ۱ باشد' })
        .max(5, { message: 'امتیاز نباید بیشتر از ۵ باشد' }),
    comment: zod_1.z.string()
        .trim()
        .min(10, { message: 'نظر باید حداقل ۱۰ کاراکتر باشد' })
        .max(500, { message: 'نظر نباید بیشتر از ۵۰۰ کاراکتر باشد' })
        .optional()
});
/**
 * Validation schema for auto-save progress
 */
exports.AutoSaveSchema = zod_1.z.object({
    progress: zod_1.z.number()
        .min(0, { message: 'پیشرفت نمی‌تواند منفی باشد' })
        .max(100, { message: 'پیشرفت نمی‌تواند بیشتر از ۱۰۰ درصد باشد' }),
    lastQuestionIndex: zod_1.z.number()
        .int({ message: 'شاخص سوال باید عدد صحیح باشد' })
        .min(0, { message: 'شاخص سوال نمی‌تواند منفی باشد' })
        .optional(),
    answers: zod_1.z.record(zod_1.z.string(), zod_1.z.any())
        .optional(),
    timeSpent: zod_1.z.number()
        .min(0, { message: 'زمان صرف شده نمی‌تواند منفی باشد' })
        .optional()
});
/**
 * Validation schema for search queries
 */
exports.SearchQuerySchema = zod_1.z.object({
    q: zod_1.z.string()
        .trim()
        .min(2, { message: 'جستجو باید حداقل ۲ کاراکتر باشد' })
        .max(100, { message: 'جستجو نباید بیشتر از ۱۰۰ کاراکتر باشد' }),
    courseType: CourseTypeEnum.optional(),
    grade: GradeEnum.optional(),
    group: GroupEnum.optional(),
    difficulty: DifficultyEnum.optional(),
    minPrice: zod_1.z.coerce.number()
        .min(0, { message: 'حداقل قیمت نمی‌تواند منفی باشد' })
        .optional(),
    maxPrice: zod_1.z.coerce.number()
        .min(0, { message: 'حداکثر قیمت نمی‌تواند منفی باشد' })
        .optional(),
    tags: zod_1.z.string()
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
exports.ListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number()
        .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
        .default(1)
        .optional(),
    limit: zod_1.z.coerce.number()
        .int({ message: 'تعداد آیتم در صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'تعداد آیتم در صفحه باید حداقل ۱ باشد' })
        .max(50, { message: 'تعداد آیتم در صفحه نمی‌تواند بیش از ۵۰ باشد' })
        .default(10)
        .optional(),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'title', 'price', 'rating'], {
        errorMap: () => ({ message: 'مرتب‌سازی معتبر نیست' })
    }).optional(),
    order: zod_1.z.enum(['asc', 'desc'], {
        errorMap: () => ({ message: 'نحوه مرتب‌سازی معتبر نیست' })
    }).optional(),
    courseType: CourseTypeEnum.optional(),
    grade: GradeEnum.optional(),
    group: GroupEnum.optional(),
    difficulty: DifficultyEnum.optional(),
    isPublished: zod_1.z.coerce.boolean({
        errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
    }).optional()
});
// Helper function to format errors
const formatZodError = (error) => {
    return error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
    }));
};
// Middleware functions
const validateCourseExam = (req, res, next) => {
    try {
        req.body = exports.CreateCourseExamSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateCourseExam = validateCourseExam;
const validateCourseExamUpdate = (req, res, next) => {
    try {
        req.params = exports.CourseExamParamsSchema.parse(req.params);
        req.body = exports.UpdateCourseExamSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateCourseExamUpdate = validateCourseExamUpdate;
const validateRating = (req, res, next) => {
    try {
        req.params = exports.CourseExamParamsSchema.parse(req.params);
        req.body = exports.RatingSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateRating = validateRating;
const validateAutoSave = (req, res, next) => {
    try {
        req.params = exports.CourseExamParamsSchema.parse(req.params);
        req.body = exports.AutoSaveSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateAutoSave = validateAutoSave;
const validateSearchQuery = (req, res, next) => {
    try {
        req.query = exports.SearchQuerySchema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateSearchQuery = validateSearchQuery;
const validateListQuery = (req, res, next) => {
    try {
        req.query = exports.ListQuerySchema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateListQuery = validateListQuery;
// Validation helper functions
const validateCourseExamPublishing = async (courseExamId) => {
    const errors = [];
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
exports.validateCourseExamPublishing = validateCourseExamPublishing;
const validateQuestionDifficultyDistribution = (questions) => {
    const errors = [];
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
        }
        else {
            difficultyCount[question.difficulty]++;
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
exports.validateQuestionDifficultyDistribution = validateQuestionDifficultyDistribution;
//# sourceMappingURL=courseExamValidation.js.map