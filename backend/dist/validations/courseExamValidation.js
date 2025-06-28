"use strict";
/**
 * Course Exam validation middleware with Zod
 *
 * This file contains validation schemas and middleware for course exam-related requests
 * using Zod with Persian error messages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIFFICULTIES = exports.FIELD_OF_STUDY_LABELS = exports.FIELD_OF_STUDY = exports.GRADE_LABELS = exports.GRADES = exports.COURSE_TYPE_LABELS = exports.COURSE_TYPES = exports.validateQuestionDifficultyDistribution = exports.validateCourseExamPublishing = exports.validateListQuery = exports.validateSearchQuery = exports.validateAutoSave = exports.validateRating = exports.validateCourseExamUpdate = exports.validateCourseExam = exports.ListQuerySchema = exports.SearchQuerySchema = exports.AutoSaveSchema = exports.RatingSchema = exports.CourseExamParamsSchema = exports.UpdateCourseExamSchema = exports.CreateCourseExamSchema = void 0;
const zod_1 = require("zod");
// Valid course types (انواع درس)
const COURSE_TYPES = [
    'academic', 'non-academic', 'skill-based', 'aptitude', 'general', 'specialized'
];
exports.COURSE_TYPES = COURSE_TYPES;
// Valid grades (مقاطع تحصیلی)
const GRADES = [
    'elementary', 'middle-school', 'high-school', 'associate-degree', 'bachelor-degree', 'master-degree', 'doctorate-degree'
];
exports.GRADES = GRADES;
// Valid field of study (رشته تحصیلی)
const FIELD_OF_STUDY = [
    // رشته‌های دبیرستان
    'math-physics', 'experimental-sciences', 'humanities', 'technical-vocational',
    // رشته‌های دانشگاهی - مهندسی
    'computer-engineering', 'electrical-engineering', 'mechanical-engineering',
    'civil-engineering', 'chemical-engineering', 'industrial-engineering',
    'aerospace-engineering', 'biomedical-engineering',
    // رشته‌های دانشگاهی - علوم پایه
    'pure-mathematics', 'applied-mathematics', 'physics', 'chemistry', 'biology',
    'geology', 'statistics', 'computer-science',
    // رشته‌های دانشگاهی - علوم انسانی
    'law', 'economics', 'management', 'psychology', 'sociology',
    'political-science', 'history', 'philosophy', 'literature',
    'linguistics', 'archaeology', 'geography',
    // رشته‌های دانشگاهی - پزشکی
    'medicine', 'dentistry', 'pharmacy', 'nursing', 'veterinary',
    'public-health', 'medical-laboratory', 'physiotherapy',
    // رشته‌های دانشگاهی - هنر
    'fine-arts', 'music', 'theater', 'cinema', 'graphic-design',
    'architecture', 'urban-planning',
    // رشته‌های دانشگاهی - کشاورزی
    'agriculture', 'horticulture', 'animal-science', 'forestry',
    // سایر
    'other'
];
exports.FIELD_OF_STUDY = FIELD_OF_STUDY;
// Persian labels for field of study (عناوین فارسی رشته‌های تحصیلی)
const FIELD_OF_STUDY_LABELS = {
    // رشته‌های دبیرستان
    'math-physics': 'ریاضی-فیزیک',
    'experimental-sciences': 'علوم تجربی',
    'humanities': 'علوم انسانی',
    'technical-vocational': 'فنی-حرفه‌ای',
    // رشته‌های دانشگاهی - مهندسی
    'computer-engineering': 'مهندسی کامپیوتر',
    'electrical-engineering': 'مهندسی برق',
    'mechanical-engineering': 'مهندسی مکانیک',
    'civil-engineering': 'مهندسی عمران',
    'chemical-engineering': 'مهندسی شیمی',
    'industrial-engineering': 'مهندسی صنایع',
    'aerospace-engineering': 'مهندسی هوافضا',
    'biomedical-engineering': 'مهندسی پزشکی',
    // رشته‌های دانشگاهی - علوم پایه
    'pure-mathematics': 'ریاضی محض',
    'applied-mathematics': 'ریاضی کاربردی',
    'physics': 'فیزیک',
    'chemistry': 'شیمی',
    'biology': 'زیست‌شناسی',
    'geology': 'زمین‌شناسی',
    'statistics': 'آمار',
    'computer-science': 'علوم کامپیوتر',
    // رشته‌های دانشگاهی - علوم انسانی
    'law': 'حقوق',
    'economics': 'اقتصاد',
    'management': 'مدیریت',
    'psychology': 'روان‌شناسی',
    'sociology': 'جامعه‌شناسی',
    'political-science': 'علوم سیاسی',
    'history': 'تاریخ',
    'philosophy': 'فلسفه',
    'literature': 'ادبیات',
    'linguistics': 'زبان‌شناسی',
    'archaeology': 'باستان‌شناسی',
    'geography': 'جغرافیا',
    // رشته‌های دانشگاهی - پزشکی
    'medicine': 'پزشکی',
    'dentistry': 'دندان‌پزشکی',
    'pharmacy': 'داروسازی',
    'nursing': 'پرستاری',
    'veterinary': 'دامپزشکی',
    'public-health': 'بهداشت عمومی',
    'medical-laboratory': 'آزمایشگاه پزشکی',
    'physiotherapy': 'فیزیوتراپی',
    // رشته‌های دانشگاهی - هنر
    'fine-arts': 'هنرهای تجسمی',
    'music': 'موسیقی',
    'theater': 'تئاتر',
    'cinema': 'سینما',
    'graphic-design': 'طراحی گرافیک',
    'architecture': 'معماری',
    'urban-planning': 'شهرسازی',
    // رشته‌های دانشگاهی - کشاورزی
    'agriculture': 'کشاورزی',
    'horticulture': 'باغبانی',
    'animal-science': 'علوم دامی',
    'forestry': 'جنگلداری',
    // سایر
    'other': 'سایر'
};
exports.FIELD_OF_STUDY_LABELS = FIELD_OF_STUDY_LABELS;
// Persian labels for course types (عناوین فارسی انواع درس)
const COURSE_TYPE_LABELS = {
    'academic': 'درسی',
    'non-academic': 'غیر درسی',
    'skill-based': 'مهارتی',
    'aptitude': 'استعدادی',
    'general': 'عمومی',
    'specialized': 'تخصصی'
};
exports.COURSE_TYPE_LABELS = COURSE_TYPE_LABELS;
// Persian labels for grades (عناوین فارسی مقاطع تحصیلی)
const GRADE_LABELS = {
    'elementary': 'مقطع ابتدایی',
    'middle-school': 'مقطع متوسطه اول',
    'high-school': 'مقطع متوسطه دوم',
    'associate-degree': 'کاردانی',
    'bachelor-degree': 'کارشناسی',
    'master-degree': 'کارشناسی ارشد',
    'doctorate-degree': 'دکتری'
};
exports.GRADE_LABELS = GRADE_LABELS;
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
const FieldOfStudyEnum = zod_1.z.enum(FIELD_OF_STUDY, {
    errorMap: () => ({ message: 'رشته تحصیلی معتبر نیست' })
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
    fieldOfStudy: FieldOfStudyEnum.optional(),
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
    isPublished: zod_1.z.boolean().optional(),
    isDraft: zod_1.z.boolean().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
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
    fieldOfStudy: FieldOfStudyEnum.optional(),
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
    isPublished: zod_1.z.boolean().optional(),
    isDraft: zod_1.z.boolean().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
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
        .min(1, { message: 'کلمه کلیدی جستجو نباید خالی باشد' })
        .max(100, { message: 'کلمه کلیدی جستجو نباید بیشتر از ۱۰۰ کاراکتر باشد' })
        .optional(),
    courseType: CourseTypeEnum.optional(),
    grade: GradeEnum.optional(),
    fieldOfStudy: FieldOfStudyEnum.optional(),
    difficulty: DifficultyEnum.optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    priceMin: zod_1.z.number().int().min(0).optional(),
    priceMax: zod_1.z.number().int().min(0).optional(),
    page: zod_1.z.number().int().min(1).optional(),
    limit: zod_1.z.number().int().min(1).max(100).optional(),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'title', 'price', 'averageRating']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    publishedOnly: zod_1.z.boolean().optional()
});
/**
 * Validation schema for list queries
 */
exports.ListQuerySchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).optional(),
    limit: zod_1.z.number().int().min(1).max(100).optional(),
    courseType: CourseTypeEnum.optional(),
    grade: GradeEnum.optional(),
    fieldOfStudy: FieldOfStudyEnum.optional(),
    difficulty: DifficultyEnum.optional(),
    authorId: zod_1.z.string().optional(),
    isPublished: zod_1.z.boolean().optional(),
    isDraft: zod_1.z.boolean().optional(),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'title', 'price', 'averageRating']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional()
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