"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXAM_STATUSES = exports.EXAM_TYPES = exports.validateExamTimeConstraints = exports.validateDifficultyDistribution = exports.validateExamResultQuery = exports.validateExamFilter = exports.validateExamSubmission = exports.validateExamSession = exports.validateTestExamUpdate = exports.validateTestExamCreation = exports.ExamResultQuerySchema = exports.ExamFilterSchema = exports.ExamSubmissionSchema = exports.ExamSessionSchema = exports.TestExamParamsSchema = exports.UpdateTestExamSchema = exports.CreateTestExamSchema = void 0;
const zod_1 = require("zod");
// Exam types
const EXAM_TYPES = ['practice', 'official', 'timed', 'custom'];
exports.EXAM_TYPES = EXAM_TYPES;
// Exam statuses
const EXAM_STATUSES = ['draft', 'active', 'completed', 'cancelled'];
exports.EXAM_STATUSES = EXAM_STATUSES;
// Enums for validation
const ExamTypeEnum = zod_1.z.enum(EXAM_TYPES, {
    errorMap: () => ({ message: 'نوع آزمون معتبر نیست' })
});
const ExamStatusEnum = zod_1.z.enum(EXAM_STATUSES, {
    errorMap: () => ({ message: 'وضعیت آزمون معتبر نیست' })
});
// Difficulty distribution schema
const DifficultyDistributionSchema = zod_1.z.object({
    easy: zod_1.z.number()
        .int({ message: 'تعداد سوالات آسان باید عدد صحیح باشد' })
        .min(0, { message: 'تعداد سوالات آسان باید بین ۰ تا ۵۰ باشد' })
        .max(50, { message: 'تعداد سوالات آسان باید بین ۰ تا ۵۰ باشد' })
        .optional(),
    medium: zod_1.z.number()
        .int({ message: 'تعداد سوالات متوسط باید عدد صحیح باشد' })
        .min(0, { message: 'تعداد سوالات متوسط باید بین ۰ تا ۵۰ باشد' })
        .max(50, { message: 'تعداد سوالات متوسط باید بین ۰ تا ۵۰ باشد' })
        .optional(),
    hard: zod_1.z.number()
        .int({ message: 'تعداد سوالات سخت باید عدد صحیح باشد' })
        .min(0, { message: 'تعداد سوالات سخت باید بین ۰ تا ۵۰ باشد' })
        .max(50, { message: 'تعداد سوالات سخت باید بین ۰ تا ۵۰ باشد' })
        .optional()
});
// Exam configuration schema
const ExamConfigurationSchema = zod_1.z.object({
    totalQuestions: zod_1.z.number()
        .int({ message: 'تعداد سوالات باید عدد صحیح باشد' })
        .min(5, { message: 'تعداد سوالات باید بین ۵ تا ۱۰۰ باشد' })
        .max(100, { message: 'تعداد سوالات باید بین ۵ تا ۱۰۰ باشد' })
        .optional(),
    difficultyDistribution: DifficultyDistributionSchema.optional(),
    timeLimit: zod_1.z.number()
        .int({ message: 'محدودیت زمان باید عدد صحیح باشد' })
        .min(5, { message: 'محدودیت زمان باید بین ۵ تا ۳۰۰ دقیقه باشد' })
        .max(300, { message: 'محدودیت زمان باید بین ۵ تا ۳۰۰ دقیقه باشد' })
        .optional(),
    allowReview: zod_1.z.boolean({
        errorMap: () => ({ message: 'اجازه بازبینی باید مقدار بولی باشد' })
    }).optional(),
    shuffleQuestions: zod_1.z.boolean({
        errorMap: () => ({ message: 'ترتیب تصادفی سوالات باید مقدار بولی باشد' })
    }).optional(),
    shuffleOptions: zod_1.z.boolean({
        errorMap: () => ({ message: 'ترتیب تصادفی گزینه‌ها باید مقدار بولی باشد' })
    }).optional(),
    showResults: zod_1.z.boolean({
        errorMap: () => ({ message: 'نمایش نتایج باید مقدار بولی باشد' })
    }).optional(),
    passingScore: zod_1.z.number()
        .min(0, { message: 'نمره قبولی باید بین ۰ تا ۱۰۰ باشد' })
        .max(100, { message: 'نمره قبولی باید بین ۰ تا ۱۰۰ باشد' })
        .optional(),
    categories: zod_1.z.array(zod_1.z.string()
        .trim()
        .min(1, { message: 'نام دسته‌بندی باید بین ۱ تا ۱۰۰ کاراکتر باشد' })
        .max(100, { message: 'نام دسته‌بندی باید بین ۱ تا ۱۰۰ کاراکتر باشد' })).optional(),
    tags: zod_1.z.array(zod_1.z.string()
        .trim()
        .min(1, { message: 'برچسب باید بین ۱ تا ۵۰ کاراکتر باشد' })
        .max(50, { message: 'برچسب باید بین ۱ تا ۵۰ کاراکتر باشد' })).optional()
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
exports.CreateTestExamSchema = zod_1.z.object({
    title: zod_1.z.string()
        .trim()
        .min(3, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' })
        .max(200, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' }),
    description: zod_1.z.string()
        .trim()
        .max(1000, { message: 'توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
        .optional(),
    type: ExamTypeEnum.optional(),
    status: ExamStatusEnum.optional(),
    configuration: ExamConfigurationSchema.optional(),
    startTime: zod_1.z.coerce.date({
        errorMap: () => ({ message: 'زمان شروع باید در فرمت صحیح باشد' })
    }).optional(),
    endTime: zod_1.z.coerce.date({
        errorMap: () => ({ message: 'زمان پایان باید در فرمت صحیح باشد' })
    }).optional(),
    isPublished: zod_1.z.boolean({
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
exports.UpdateTestExamSchema = zod_1.z.object({
    title: zod_1.z.string()
        .trim()
        .min(3, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' })
        .max(200, { message: 'عنوان آزمون باید بین ۳ تا ۲۰۰ کاراکتر باشد' })
        .optional(),
    description: zod_1.z.string()
        .trim()
        .max(1000, { message: 'توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
        .optional(),
    type: ExamTypeEnum.optional(),
    status: ExamStatusEnum.optional(),
    configuration: ExamConfigurationSchema.optional(),
    startTime: zod_1.z.coerce.date({
        errorMap: () => ({ message: 'زمان شروع باید در فرمت صحیح باشد' })
    }).optional(),
    endTime: zod_1.z.coerce.date({
        errorMap: () => ({ message: 'زمان پایان باید در فرمت صحیح باشد' })
    }).optional(),
    isPublished: zod_1.z.boolean({
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
exports.TestExamParamsSchema = zod_1.z.object({
    id: zod_1.z.string()
        .min(10, { message: 'شناسه آزمون نامعتبر است' })
});
/**
 * Validation schema for exam session management
 */
exports.ExamSessionSchema = zod_1.z.object({
    examId: zod_1.z.string()
        .min(1, { message: 'شناسه آزمون الزامی است' }),
    startTime: zod_1.z.coerce.date({
        errorMap: () => ({ message: 'زمان شروع باید در فرمت صحیح باشد' })
    }),
    answers: zod_1.z.record(zod_1.z.string(), zod_1.z.any())
        .optional(),
    currentQuestionIndex: zod_1.z.number()
        .int({ message: 'شاخص سوال فعلی باید عدد صحیح باشد' })
        .min(0, { message: 'شاخص سوال فعلی نمی‌تواند منفی باشد' })
        .optional(),
    timeSpent: zod_1.z.number()
        .min(0, { message: 'زمان صرف شده نمی‌تواند منفی باشد' })
        .optional()
});
/**
 * Validation schema for exam submission
 */
exports.ExamSubmissionSchema = zod_1.z.object({
    examId: zod_1.z.string()
        .min(1, { message: 'شناسه آزمون الزامی است' }),
    answers: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    totalTimeSpent: zod_1.z.number()
        .min(0, { message: 'زمان کل صرف شده نمی‌تواند منفی باشد' }),
    isCompleted: zod_1.z.boolean({
        errorMap: () => ({ message: 'وضعیت تکمیل باید مقدار بولی باشد' })
    }).default(true)
});
/**
 * Validation schema for exam filtering and listing
 */
exports.ExamFilterSchema = zod_1.z.object({
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
    type: ExamTypeEnum.optional(),
    status: ExamStatusEnum.optional(),
    isPublished: zod_1.z.coerce.boolean({
        errorMap: () => ({ message: 'وضعیت انتشار باید true یا false باشد' })
    }).optional(),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'title', 'startTime'], {
        errorMap: () => ({ message: 'مرتب‌سازی معتبر نیست' })
    }).optional(),
    order: zod_1.z.enum(['asc', 'desc'], {
        errorMap: () => ({ message: 'نحوه مرتب‌سازی معتبر نیست' })
    }).optional(),
    search: zod_1.z.string()
        .trim()
        .min(2, { message: 'جستجو باید حداقل ۲ کاراکتر باشد' })
        .max(100, { message: 'جستجو نباید بیشتر از ۱۰۰ کاراکتر باشد' })
        .optional()
});
/**
 * Validation schema for exam result queries
 */
exports.ExamResultQuerySchema = zod_1.z.object({
    examId: zod_1.z.string()
        .min(1, { message: 'شناسه آزمون الزامی است' }),
    userId: zod_1.z.string()
        .min(1, { message: 'شناسه کاربر الزامی است' })
        .optional(),
    includeAnswers: zod_1.z.coerce.boolean({
        errorMap: () => ({ message: 'شامل پاسخ‌ها باید مقدار بولی باشد' })
    }).optional(),
    includeStatistics: zod_1.z.coerce.boolean({
        errorMap: () => ({ message: 'شامل آمار باید مقدار بولی باشد' })
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
const validateTestExamCreation = (req, res, next) => {
    try {
        req.body = exports.CreateTestExamSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateTestExamCreation = validateTestExamCreation;
const validateTestExamUpdate = (req, res, next) => {
    try {
        req.params = exports.TestExamParamsSchema.parse(req.params);
        req.body = exports.UpdateTestExamSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateTestExamUpdate = validateTestExamUpdate;
const validateExamSession = (req, res, next) => {
    try {
        req.body = exports.ExamSessionSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateExamSession = validateExamSession;
const validateExamSubmission = (req, res, next) => {
    try {
        req.body = exports.ExamSubmissionSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateExamSubmission = validateExamSubmission;
const validateExamFilter = (req, res, next) => {
    try {
        req.query = exports.ExamFilterSchema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateExamFilter = validateExamFilter;
const validateExamResultQuery = (req, res, next) => {
    try {
        req.query = exports.ExamResultQuerySchema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateExamResultQuery = validateExamResultQuery;
// Validation helper functions
const validateDifficultyDistribution = (req, res, next) => {
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'خطای اعتبارسنجی توزیع سختی',
            errors: []
        });
    }
};
exports.validateDifficultyDistribution = validateDifficultyDistribution;
const validateExamTimeConstraints = (req, res, next) => {
    try {
        const { startTime, endTime, configuration } = req.body;
        const errors = [];
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'خطای اعتبارسنجی محدودیت‌های زمانی',
            errors: []
        });
    }
};
exports.validateExamTimeConstraints = validateExamTimeConstraints;
//# sourceMappingURL=testExamValidation.js.map