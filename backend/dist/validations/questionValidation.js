"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuestionSearch = exports.validateQuestionAutoSave = exports.validateQuestionUpdate = exports.validateQuestionCreate = exports.QuestionRatingSchema = exports.QuestionListSchema = exports.QuestionSearchSchema = exports.QuestionAutoSaveSchema = exports.QuestionUpdateSchema = exports.QuestionCreateSchema = void 0;
const zod_1 = require("zod");
/**
 * Question Validation Schemas with Zod
 * اعتبارسنجی سوالات با پیام‌های خطای فارسی
 *
 * ویژگی‌های اصلی:
 * - اعتبارسنجی 4 گزینه برای سوالات چند گزینه‌ای
 * - اعتبارسنجی صفحه منبع اختیاری
 * - پیام‌های خطای فارسی
 * - اعتبارسنجی انواع مختلف سوال
 */
// Enum for question types
const QuestionTypeEnum = zod_1.z.enum(['multiple-choice', 'true-false', 'short-answer', 'essay'], {
    errorMap: () => ({ message: 'نوع سوال نامعتبر است' })
});
// Enum for difficulty levels
const DifficultyEnum = zod_1.z.enum(['Easy', 'Medium', 'Hard'], {
    errorMap: () => ({ message: 'سطح سختی باید یکی از مقادیر Easy، Medium یا Hard باشد' })
});
// Enum for sort options
const SortByEnum = zod_1.z.enum(['newest', 'oldest', 'difficulty', 'points', 'category'], {
    errorMap: () => ({ message: 'نوع مرتب‌سازی نامعتبر است' })
});
// Base question schema
const BaseQuestionSchema = zod_1.z.object({
    type: QuestionTypeEnum,
    text: zod_1.z.string()
        .trim()
        .min(10, { message: 'متن سوال باید حداقل ۱۰ کاراکتر باشد' })
        .max(2000, { message: 'متن سوال نباید بیشتر از ۲۰۰۰ کاراکتر باشد' }),
    category: zod_1.z.string()
        .trim()
        .min(1, { message: 'دسته‌بندی الزامی است' })
        .max(100, { message: 'دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد' }),
    difficulty: DifficultyEnum.optional(),
    points: zod_1.z.number()
        .min(0.5, { message: 'امتیاز باید حداقل ۰.۵ باشد' })
        .max(10, { message: 'امتیاز نباید بیشتر از ۱۰ باشد' })
        .optional(),
    explanation: zod_1.z.string()
        .trim()
        .max(1000, { message: 'توضیح نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
        .optional(),
    lesson: zod_1.z.string()
        .trim()
        .max(200, { message: 'نام درس نباید بیشتر از ۲۰۰ کاراکتر باشد' })
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()
        .trim()
        .min(1, { message: 'تگ نمی‌تواند خالی باشد' })
        .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })).optional(),
    timeLimit: zod_1.z.number()
        .int({ message: 'زمان باید عدد صحیح باشد' })
        .min(1, { message: 'زمان باید حداقل ۱ ثانیه باشد' })
        .max(7200, { message: 'زمان نباید بیشتر از ۷۲۰۰ ثانیه باشد' })
        .optional(),
    sourcePage: zod_1.z.number()
        .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
        .max(9999, { message: 'شماره صفحه نباید بیشتر از ۹۹۹۹ باشد' })
        .optional(),
    sourceBook: zod_1.z.string()
        .trim()
        .max(200, { message: 'نام کتاب نباید بیشتر از ۲۰۰ کاراکتر باشد' })
        .optional(),
    sourceChapter: zod_1.z.string()
        .trim()
        .max(200, { message: 'نام فصل نباید بیشتر از ۲۰۰ کاراکتر باشد' })
        .optional(),
    isDraft: zod_1.z.boolean().optional(),
    isPublished: zod_1.z.boolean().optional()
});
// Schema for multiple choice questions
const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
    type: zod_1.z.literal('multiple-choice'),
    options: zod_1.z.array(zod_1.z.string().trim().min(2, { message: 'هر گزینه باید حداقل ۲ کاراکتر داشته باشد' }))
        .length(4, { message: 'سوال چند گزینه‌ای باید دقیقاً ۴ گزینه داشته باشد' }),
    correctOptions: zod_1.z.array(zod_1.z.number().int().min(0).max(3))
        .min(1, { message: 'حداقل یک گزینه صحیح انتخاب کنید' }),
    allowMultipleCorrect: zod_1.z.boolean().optional(),
    correctAnswer: zod_1.z.string().optional()
});
// Schema for true/false questions
const TrueFalseQuestionSchema = BaseQuestionSchema.extend({
    type: zod_1.z.literal('true-false'),
    options: zod_1.z.array(zod_1.z.string().trim().min(1))
        .length(2, { message: 'سوال درست/غلط باید دقیقاً ۲ گزینه داشته باشد' }),
    correctOptions: zod_1.z.array(zod_1.z.number().int().min(0).max(1))
        .length(1, { message: 'سوال درست/غلط فقط یک گزینه صحیح می‌تواند داشته باشد' }),
    allowMultipleCorrect: zod_1.z.literal(false).optional(),
    correctAnswer: zod_1.z.string().optional()
});
// Schema for text-based questions
const TextQuestionSchema = BaseQuestionSchema.extend({
    type: zod_1.z.union([zod_1.z.literal('short-answer'), zod_1.z.literal('essay')]),
    options: zod_1.z.array(zod_1.z.string()).max(0, { message: 'سوالات تشریحی نیاز به گزینه ندارند' }).optional(),
    correctOptions: zod_1.z.array(zod_1.z.number()).max(0).optional(),
    correctAnswer: zod_1.z.string()
        .trim()
        .min(1, { message: 'پاسخ صحیح برای سوالات تشریحی الزامی است' }),
    allowMultipleCorrect: zod_1.z.boolean().optional()
});
// Union schema for all question types
const QuestionSchema = zod_1.z.discriminatedUnion('type', [
    MultipleChoiceQuestionSchema,
    TrueFalseQuestionSchema,
    TextQuestionSchema
]);
/**
 * Schema for creating a new question
 */
exports.QuestionCreateSchema = QuestionSchema;
/**
 * Schema for updating a question (all fields optional except id)
 */
exports.QuestionUpdateSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: 'شناسه سوال الزامی است' }),
    type: QuestionTypeEnum.optional(),
    text: zod_1.z.string()
        .trim()
        .min(10, { message: 'متن سوال باید حداقل ۱۰ کاراکتر باشد' })
        .max(2000, { message: 'متن سوال نباید بیشتر از ۲۰۰۰ کاراکتر باشد' })
        .optional(),
    category: zod_1.z.string()
        .trim()
        .min(1, { message: 'دسته‌بندی الزامی است' })
        .max(100, { message: 'دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد' })
        .optional(),
    difficulty: DifficultyEnum.optional(),
    points: zod_1.z.number()
        .min(0.5, { message: 'امتیاز باید حداقل ۰.۵ باشد' })
        .max(10, { message: 'امتیاز نباید بیشتر از ۱۰ باشد' })
        .optional(),
    explanation: zod_1.z.string()
        .trim()
        .max(1000, { message: 'توضیح نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
        .optional(),
    lesson: zod_1.z.string()
        .trim()
        .max(200, { message: 'نام درس نباید بیشتر از ۲۰۰ کاراکتر باشد' })
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()
        .trim()
        .min(1, { message: 'تگ نمی‌تواند خالی باشد' })
        .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })).optional(),
    timeLimit: zod_1.z.number()
        .int({ message: 'زمان باید عدد صحیح باشد' })
        .min(1, { message: 'زمان باید حداقل ۱ ثانیه باشد' })
        .max(7200, { message: 'زمان نباید بیشتر از ۷۲۰۰ ثانیه باشد' })
        .optional(),
    sourcePage: zod_1.z.number()
        .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
        .max(9999, { message: 'شماره صفحه نباید بیشتر از ۹۹۹۹ باشد' })
        .optional(),
    sourceBook: zod_1.z.string()
        .trim()
        .max(200, { message: 'نام کتاب نباید بیشتر از ۲۰۰ کاراکتر باشد' })
        .optional(),
    sourceChapter: zod_1.z.string()
        .trim()
        .max(200, { message: 'نام فصل نباید بیشتر از ۲۰۰ کاراکتر باشد' })
        .optional(),
    isDraft: zod_1.z.boolean().optional(),
    isPublished: zod_1.z.boolean().optional(),
    options: zod_1.z.array(zod_1.z.string().trim()).optional(),
    correctOptions: zod_1.z.array(zod_1.z.number().int()).optional(),
    allowMultipleCorrect: zod_1.z.boolean().optional(),
    correctAnswer: zod_1.z.string().optional()
});
/**
 * Schema for auto-save (more lenient)
 */
exports.QuestionAutoSaveSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => val === 'new' || val.trim().length > 0, {
        message: 'شناسه سوال الزامی است'
    }),
    text: zod_1.z.string()
        .trim()
        .max(2000, { message: 'متن سوال نباید بیشتر از ۲۰۰۰ کاراکتر باشد' })
        .optional(),
    category: zod_1.z.string()
        .trim()
        .max(100, { message: 'دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد' })
        .optional(),
    points: zod_1.z.number()
        .min(0.5, { message: 'امتیاز باید حداقل ۰.۵ باشد' })
        .max(10, { message: 'امتیاز نباید بیشتر از ۱۰ باشد' })
        .optional(),
    sourcePage: zod_1.z.number()
        .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
        .max(9999, { message: 'شماره صفحه نباید بیشتر از ۹۹۹۹ باشد' })
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()
        .trim()
        .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })).optional()
});
/**
 * Schema for search parameters
 */
exports.QuestionSearchSchema = zod_1.z.object({
    q: zod_1.z.string()
        .trim()
        .min(2, { message: 'متن جستجو باید حداقل ۲ کاراکتر باشد' })
        .max(200, { message: 'متن جستجو نباید بیشتر از ۲۰۰ کاراکتر باشد' }),
    limit: zod_1.z.number()
        .int({ message: 'محدودیت نتایج باید عدد صحیح باشد' })
        .min(1, { message: 'محدودیت نتایج باید حداقل ۱ باشد' })
        .max(100, { message: 'محدودیت نتایج نباید بیشتر از ۱۰۰ باشد' })
        .optional(),
    publishedOnly: zod_1.z.boolean().optional()
});
/**
 * Schema for listing questions
 */
exports.QuestionListSchema = zod_1.z.object({
    page: zod_1.z.number()
        .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
        .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
        .optional(),
    limit: zod_1.z.number()
        .int({ message: 'محدودیت نتایج باید عدد صحیح باشد' })
        .min(1, { message: 'محدودیت نتایج باید حداقل ۱ باشد' })
        .max(100, { message: 'محدودیت نتایج نباید بیشتر از ۱۰۰ باشد' })
        .optional(),
    type: QuestionTypeEnum.optional(),
    difficulty: DifficultyEnum.optional(),
    sortBy: SortByEnum.optional(),
    publishedOnly: zod_1.z.boolean().optional()
});
/**
 * Schema for rating a question
 */
exports.QuestionRatingSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: 'شناسه سوال الزامی است' }),
    rating: zod_1.z.number()
        .min(1, { message: 'امتیاز باید حداقل ۱ باشد' })
        .max(5, { message: 'امتیاز نباید بیشتر از ۵ باشد' }),
    comment: zod_1.z.string()
        .trim()
        .max(500, { message: 'نظر نباید بیشتر از ۵۰۰ کاراکتر باشد' })
        .optional()
});
/**
 * Middleware برای اعتبارسنجی ایجاد سوال جدید
 */
const validateQuestionCreate = (req, res, next) => {
    try {
        exports.QuestionCreateSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'خطا در اعتبارسنجی داده‌ها',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        next(error);
    }
};
exports.validateQuestionCreate = validateQuestionCreate;
/**
 * Middleware برای اعتبارسنجی به‌روزرسانی سوال
 */
const validateQuestionUpdate = (req, res, next) => {
    try {
        exports.QuestionUpdateSchema.parse({ ...req.body, id: req.params.id });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'خطا در اعتبارسنجی داده‌ها',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        next(error);
    }
};
exports.validateQuestionUpdate = validateQuestionUpdate;
/**
 * Middleware برای اعتبارسنجی ذخیره خودکار سوال
 */
const validateQuestionAutoSave = (req, res, next) => {
    try {
        exports.QuestionAutoSaveSchema.parse({ ...req.body, id: req.params.id });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'خطا در اعتبارسنجی داده‌ها',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        next(error);
    }
};
exports.validateQuestionAutoSave = validateQuestionAutoSave;
/**
 * Middleware برای اعتبارسنجی جستجوی سوال
 */
const validateQuestionSearch = (req, res, next) => {
    try {
        exports.QuestionSearchSchema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'خطا در اعتبارسنجی پارامترهای جستجو',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        next(error);
    }
};
exports.validateQuestionSearch = validateQuestionSearch;
//# sourceMappingURL=questionValidation.js.map