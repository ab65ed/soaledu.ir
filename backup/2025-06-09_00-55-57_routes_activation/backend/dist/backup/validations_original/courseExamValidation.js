const Joi = require('joi');
// Valid course types
const COURSE_TYPES = [
    'mathematics', 'physics', 'chemistry', 'biology',
    'history', 'geography', 'literature', 'english', 'arabic', 'other'
];
// Valid grades
const GRADES = [
    'elementary-1', 'elementary-2', 'elementary-3', 'elementary-4', 'elementary-5', 'elementary-6',
    'middle-school-1', 'middle-school-2', 'middle-school-3',
    'high-school-1', 'high-school-2', 'high-school-3', 'high-school-4',
    'high-school-10', 'high-school-11', 'high-school-12',
    'university', 'konkur'
];
// Valid groups
const GROUPS = [
    'theoretical', 'mathematical', 'experimental', 'technical', 'art', 'other'
];
// Valid difficulty levels
const DIFFICULTIES = ['easy', 'medium', 'hard'];
/**
 * Validation schema for creating a course exam
 */
const createCourseExamSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(200)
        .required()
        .messages({
        'string.empty': 'عنوان الزامی است',
        'string.min': 'عنوان باید حداقل ۵ کاراکتر باشد',
        'string.max': 'عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد',
        'any.required': 'عنوان الزامی است'
    }),
    courseType: Joi.string()
        .valid(...COURSE_TYPES)
        .required()
        .messages({
        'any.only': 'نوع درس معتبر نیست',
        'any.required': 'نوع درس الزامی است'
    }),
    grade: Joi.string()
        .valid(...GRADES)
        .required()
        .messages({
        'any.only': 'مقطع تحصیلی معتبر نیست',
        'any.required': 'مقطع تحصیلی الزامی است'
    }),
    group: Joi.string()
        .valid(...GROUPS)
        .required()
        .messages({
        'any.only': 'گروه آموزشی معتبر نیست',
        'any.required': 'گروه آموزشی الزامی است'
    }),
    description: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
        'string.empty': 'توضیحات الزامی است',
        'string.min': 'توضیحات باید حداقل ۱۰ کاراکتر باشد',
        'string.max': 'توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد',
        'any.required': 'توضیحات الزامی است'
    }),
    tags: Joi.array()
        .items(Joi.string().min(1).max(50))
        .max(20)
        .optional()
        .messages({
        'array.max': 'حداکثر ۲۰ تگ مجاز است',
        'string.min': 'هر تگ باید حداقل ۱ کاراکتر باشد',
        'string.max': 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد'
    }),
    difficulty: Joi.string()
        .valid(...DIFFICULTIES)
        .optional()
        .messages({
        'any.only': 'سطح سختی معتبر نیست'
    }),
    estimatedTime: Joi.number()
        .integer()
        .min(1)
        .max(480)
        .optional()
        .messages({
        'number.base': 'زمان تخمینی باید عدد باشد',
        'number.integer': 'زمان تخمینی باید عدد صحیح باشد',
        'number.min': 'زمان تخمینی باید حداقل ۱ دقیقه باشد',
        'number.max': 'زمان تخمینی نباید بیشتر از ۴۸۰ دقیقه (۸ ساعت) باشد'
    }),
    price: Joi.number()
        .integer()
        .min(0)
        .max(100000)
        .optional()
        .messages({
        'number.base': 'قیمت باید عدد باشد',
        'number.integer': 'قیمت باید عدد صحیح باشد',
        'number.min': 'قیمت نمی‌تواند منفی باشد',
        'number.max': 'قیمت نباید بیشتر از ۱۰۰,۰۰۰ تومان باشد'
    }),
    isPublished: Joi.boolean()
        .optional()
        .messages({
        'boolean.base': 'وضعیت انتشار باید true یا false باشد'
    }),
    chapters: Joi.array()
        .items(Joi.string().min(1).max(100))
        .max(50)
        .optional()
        .messages({
        'array.max': 'حداکثر ۵۰ فصل مجاز است',
        'string.min': 'نام فصل باید حداقل ۱ کاراکتر باشد',
        'string.max': 'نام فصل نباید بیشتر از ۱۰۰ کاراکتر باشد'
    })
});
/**
 * Validation schema for updating a course exam
 */
const updateCourseExamSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(200)
        .optional()
        .messages({
        'string.empty': 'عنوان نمی‌تواند خالی باشد',
        'string.min': 'عنوان باید حداقل ۵ کاراکتر باشد',
        'string.max': 'عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد'
    }),
    courseType: Joi.string()
        .valid(...COURSE_TYPES)
        .optional()
        .messages({
        'any.only': 'نوع درس معتبر نیست'
    }),
    grade: Joi.string()
        .valid(...GRADES)
        .optional()
        .messages({
        'any.only': 'مقطع تحصیلی معتبر نیست'
    }),
    group: Joi.string()
        .valid(...GROUPS)
        .optional()
        .messages({
        'any.only': 'گروه آموزشی معتبر نیست'
    }),
    description: Joi.string()
        .min(10)
        .max(2000)
        .optional()
        .messages({
        'string.empty': 'توضیحات نمی‌تواند خالی باشد',
        'string.min': 'توضیحات باید حداقل ۱۰ کاراکتر باشد',
        'string.max': 'توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد'
    }),
    tags: Joi.array()
        .items(Joi.string().min(1).max(50))
        .max(20)
        .optional()
        .messages({
        'array.max': 'حداکثر ۲۰ تگ مجاز است',
        'string.min': 'هر تگ باید حداقل ۱ کاراکتر باشد',
        'string.max': 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد'
    }),
    difficulty: Joi.string()
        .valid(...DIFFICULTIES)
        .optional()
        .messages({
        'any.only': 'سطح سختی معتبر نیست'
    }),
    estimatedTime: Joi.number()
        .integer()
        .min(1)
        .max(480)
        .optional()
        .messages({
        'number.base': 'زمان تخمینی باید عدد باشد',
        'number.integer': 'زمان تخمینی باید عدد صحیح باشد',
        'number.min': 'زمان تخمینی باید حداقل ۱ دقیقه باشد',
        'number.max': 'زمان تخمینی نباید بیشتر از ۴۸۰ دقیقه (۸ ساعت) باشد'
    }),
    price: Joi.number()
        .integer()
        .min(0)
        .max(100000)
        .optional()
        .messages({
        'number.base': 'قیمت باید عدد باشد',
        'number.integer': 'قیمت باید عدد صحیح باشد',
        'number.min': 'قیمت نمی‌تواند منفی باشد',
        'number.max': 'قیمت نباید بیشتر از ۱۰۰,۰۰۰ تومان باشد'
    }),
    isPublished: Joi.boolean()
        .optional()
        .messages({
        'boolean.base': 'وضعیت انتشار باید true یا false باشد'
    }),
    chapters: Joi.array()
        .items(Joi.string().min(1).max(100))
        .max(50)
        .optional()
        .messages({
        'array.max': 'حداکثر ۵۰ فصل مجاز است',
        'string.min': 'نام فصل باید حداقل ۱ کاراکتر باشد',
        'string.max': 'نام فصل نباید بیشتر از ۱۰۰ کاراکتر باشد'
    })
});
/**
 * Validation schema for rating
 */
const ratingSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
        'number.base': 'امتیاز باید عدد باشد',
        'number.integer': 'امتیاز باید عدد صحیح باشد',
        'number.min': 'امتیاز باید حداقل ۱ باشد',
        'number.max': 'امتیاز باید حداکثر ۵ باشد',
        'any.required': 'امتیاز الزامی است'
    })
});
/**
 * Validation schema for auto-save
 */
const autoSaveSchema = Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    courseType: Joi.string().valid(...COURSE_TYPES).optional(),
    grade: Joi.string().valid(...GRADES).optional(),
    group: Joi.string().valid(...GROUPS).optional(),
    description: Joi.string().min(1).max(2000).optional(),
    tags: Joi.array().items(Joi.string().min(1).max(50)).max(20).optional(),
    difficulty: Joi.string().valid(...DIFFICULTIES).optional(),
    estimatedTime: Joi.number().integer().min(1).max(480).optional(),
    price: Joi.number().integer().min(0).max(100000).optional(),
    chapters: Joi.array().items(Joi.string().min(1).max(100)).max(50).optional()
});
/**
 * Validation schema for search query parameters
 */
const searchQuerySchema = Joi.object({
    q: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
        'string.empty': 'عبارت جستجو الزامی است',
        'string.min': 'عبارت جستجو باید حداقل ۱ کاراکتر باشد',
        'string.max': 'عبارت جستجو نباید بیشتر از ۱۰۰ کاراکتر باشد',
        'any.required': 'عبارت جستجو الزامی است'
    }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .messages({
        'number.base': 'محدودیت نتایج باید عدد باشد',
        'number.integer': 'محدودیت نتایج باید عدد صحیح باشد',
        'number.min': 'محدودیت نتایج باید حداقل ۱ باشد',
        'number.max': 'محدودیت نتایج نباید بیشتر از ۱۰۰ باشد'
    }),
    publishedOnly: Joi.boolean().optional()
});
/**
 * Validation schema for list query parameters
 */
const listQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    courseType: Joi.string().valid(...COURSE_TYPES).optional(),
    grade: Joi.string().valid(...GRADES).optional(),
    group: Joi.string().valid(...GROUPS).optional(),
    difficulty: Joi.string().valid(...DIFFICULTIES).optional(),
    tags: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
    priceMin: Joi.number().integer().min(0).optional(),
    priceMax: Joi.number().integer().min(0).optional(),
    search: Joi.string().min(1).max(100).optional(),
    sortBy: Joi.string().valid('newest', 'popularity', 'revenue', 'rating', 'price_low', 'price_high').optional(),
    publishedOnly: Joi.boolean().optional(),
    authorId: Joi.string().optional()
});
/**
 * Validation for publishing course exam
 */
const publishCourseExamSchema = Joi.object({
    id: Joi.string()
        .required()
        .messages({
        'any.required': 'شناسه درس-آزمون الزامی است',
        'string.empty': 'شناسه درس-آزمون نمی‌تواند خالی باشد'
    })
});
/**
 * Custom validation function for course exam publishing
 * Requirements:
 * - Minimum 40 questions for non-flashcard courses
 * - Minimum 10 questions for flashcard-only courses
 * - Proper difficulty distribution (max 20% easy, max 40% medium, rest hard)
 */
const validateCourseExamPublishing = async (courseExamId) => {
    const Parse = require('parse/node');
    try {
        // Get course exam
        const CourseExam = Parse.Object.extend('CourseExam');
        const courseExamQuery = new Parse.Query(CourseExam);
        const courseExam = await courseExamQuery.get(courseExamId);
        if (!courseExam) {
            return {
                isValid: false,
                errors: ['درس-آزمون یافت نشد']
            };
        }
        const isFlashcardOnly = courseExam.get('isFlashcardOnly') || false;
        // Get questions for this course exam
        const Question = Parse.Object.extend('Question');
        const questionQuery = new Parse.Query(Question);
        questionQuery.equalTo('courseExamId', courseExamId);
        questionQuery.equalTo('isActive', true);
        const questions = await questionQuery.find();
        const questionCount = questions.length;
        const errors = [];
        // Check minimum question count
        const minimumQuestions = isFlashcardOnly ? 10 : 40;
        if (questionCount < minimumQuestions) {
            errors.push(`برای انتشار این درس-آزمون حداقل ${minimumQuestions} سوال لازم است. در حال حاضر ${questionCount} سوال موجود است.`);
        }
        // Check difficulty distribution for non-flashcard courses
        if (!isFlashcardOnly && questionCount >= 40) {
            const easyQuestions = questions.filter(q => q.get('difficulty') === 'easy').length;
            const mediumQuestions = questions.filter(q => q.get('difficulty') === 'medium').length;
            const hardQuestions = questions.filter(q => q.get('difficulty') === 'hard').length;
            const easyPercentage = (easyQuestions / questionCount) * 100;
            const mediumPercentage = (mediumQuestions / questionCount) * 100;
            const hardPercentage = (hardQuestions / questionCount) * 100;
            // Maximum 20% easy questions
            if (easyPercentage > 20) {
                errors.push(`تعداد سوالات آسان نمی‌تواند بیشتر از ۲۰٪ باشد. در حال حاضر ${Math.round(easyPercentage)}٪ (${easyQuestions} سوال) آسان است.`);
            }
            // Maximum 40% medium questions
            if (mediumPercentage > 40) {
                errors.push(`تعداد سوالات متوسط نمی‌تواند بیشتر از ۴۰٪ باشد. در حال حاضر ${Math.round(mediumPercentage)}٪ (${mediumQuestions} سوال) متوسط است.`);
            }
            // Minimum 40% hard questions (rest should be hard)
            if (hardPercentage < 40) {
                const requiredHard = Math.ceil(questionCount * 0.4);
                const neededHard = requiredHard - hardQuestions;
                errors.push(`حداقل ۴۰٪ سوالات باید سخت باشند. ${neededHard} سوال سخت دیگر نیاز است.`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            questionStats: {
                total: questionCount,
                easy: questions.filter(q => q.get('difficulty') === 'easy').length,
                medium: questions.filter(q => q.get('difficulty') === 'medium').length,
                hard: questions.filter(q => q.get('difficulty') === 'hard').length,
                isFlashcardOnly
            }
        };
    }
    catch (error) {
        return {
            isValid: false,
            errors: ['خطا در اعتبارسنجی درس-آزمون: ' + error.message]
        };
    }
};
/**
 * Validation for question difficulty distribution
 */
const validateQuestionDifficultyDistribution = (questions) => {
    const totalQuestions = questions.length;
    if (totalQuestions === 0) {
        return {
            isValid: true,
            errors: [],
            warnings: []
        };
    }
    const easyQuestions = questions.filter(q => q.difficulty === 'easy').length;
    const mediumQuestions = questions.filter(q => q.difficulty === 'medium').length;
    const hardQuestions = questions.filter(q => q.difficulty === 'hard').length;
    const easyPercentage = (easyQuestions / totalQuestions) * 100;
    const mediumPercentage = (mediumQuestions / totalQuestions) * 100;
    const hardPercentage = (hardQuestions / totalQuestions) * 100;
    const errors = [];
    const warnings = [];
    // Check percentages
    if (easyPercentage > 20) {
        errors.push(`تعداد سوالات آسان (${Math.round(easyPercentage)}٪) نمی‌تواند بیشتر از ۲۰٪ باشد`);
    }
    if (mediumPercentage > 40) {
        errors.push(`تعداد سوالات متوسط (${Math.round(mediumPercentage)}٪) نمی‌تواند بیشتر از ۴۰٪ باشد`);
    }
    if (hardPercentage < 40) {
        warnings.push(`توصیه می‌شود حداقل ۴۰٪ سوالات سخت باشند (در حال حاضر ${Math.round(hardPercentage)}٪)`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {
            total: totalQuestions,
            easy: { count: easyQuestions, percentage: Math.round(easyPercentage) },
            medium: { count: mediumQuestions, percentage: Math.round(mediumPercentage) },
            hard: { count: hardQuestions, percentage: Math.round(hardPercentage) }
        }
    };
};
/**
 * Middleware functions for validation
 */
const validateCourseExam = (req, res, next) => {
    const { error } = createCourseExamSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            error: 'اطلاعات وارد شده معتبر نیست',
            details: errors
        });
    }
    next();
};
const validateCourseExamUpdate = (req, res, next) => {
    const { error } = updateCourseExamSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            error: 'اطلاعات به‌روزرسانی معتبر نیست',
            details: errors
        });
    }
    next();
};
const validateRating = (req, res, next) => {
    const { error } = ratingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            error: 'امتیاز وارد شده معتبر نیست',
            details: errors
        });
    }
    next();
};
const validateAutoSave = (req, res, next) => {
    const { error } = autoSaveSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            error: 'اطلاعات ذخیره خودکار معتبر نیست',
            details: errors
        });
    }
    next();
};
const validateSearchQuery = (req, res, next) => {
    const { error } = searchQuerySchema.validate(req.query, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            error: 'پارامترهای جستجو معتبر نیست',
            details: errors
        });
    }
    next();
};
const validateListQuery = (req, res, next) => {
    const { error } = listQuerySchema.validate(req.query, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            error: 'پارامترهای فهرست‌بندی معتبر نیست',
            details: errors
        });
    }
    next();
};
module.exports = {
    validateCourseExam,
    validateCourseExamUpdate,
    validateRating,
    validateAutoSave,
    validateSearchQuery,
    validateListQuery,
    COURSE_TYPES,
    GRADES,
    GROUPS,
    DIFFICULTIES,
    publishCourseExamSchema,
    validateCourseExamPublishing,
    validateQuestionDifficultyDistribution
};
//# sourceMappingURL=courseExamValidation.js.map