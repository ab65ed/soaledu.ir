const { body, query, param } = require('express-validator');
/**
 * Test Exam Validation Rules
 * قوانین اعتبارسنجی برای آزمون‌های تستی
 *
 * ویژگی‌های اصلی:
 * - اعتبارسنجی ایجاد و ویرایش آزمون
 * - اعتبارسنجی تنظیمات آزمون
 * - اعتبارسنجی توزیع سختی سوالات
 * - پیام‌های خطا به فارسی
 */
// Exam types
const EXAM_TYPES = ['practice', 'official', 'timed', 'custom'];
// Exam statuses
const EXAM_STATUSES = ['draft', 'active', 'completed', 'cancelled'];
/**
 * Validation for creating a new test exam
 */
const validateTestExamCreation = [
    body('title')
        .notEmpty()
        .withMessage('عنوان آزمون الزامی است')
        .isLength({ min: 3, max: 200 })
        .withMessage('عنوان آزمون باید بین 3 تا 200 کاراکتر باشد')
        .trim(),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('توضیحات نباید بیشتر از 1000 کاراکتر باشد')
        .trim(),
    body('type')
        .optional()
        .isIn(EXAM_TYPES)
        .withMessage(`نوع آزمون باید یکی از موارد زیر باشد: ${EXAM_TYPES.join(', ')}`),
    body('status')
        .optional()
        .isIn(EXAM_STATUSES)
        .withMessage(`وضعیت آزمون باید یکی از موارد زیر باشد: ${EXAM_STATUSES.join(', ')}`),
    // Configuration validation
    body('configuration')
        .optional()
        .isObject()
        .withMessage('تنظیمات آزمون باید یک شیء معتبر باشد'),
    body('configuration.totalQuestions')
        .optional()
        .isInt({ min: 5, max: 100 })
        .withMessage('تعداد سوالات باید بین 5 تا 100 باشد'),
    body('configuration.difficultyDistribution')
        .optional()
        .isObject()
        .withMessage('توزیع سختی باید یک شیء معتبر باشد'),
    body('configuration.difficultyDistribution.easy')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات آسان باید بین 0 تا 50 باشد'),
    body('configuration.difficultyDistribution.medium')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات متوسط باید بین 0 تا 50 باشد'),
    body('configuration.difficultyDistribution.hard')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات سخت باید بین 0 تا 50 باشد'),
    body('configuration.timeLimit')
        .optional()
        .isInt({ min: 5, max: 300 })
        .withMessage('محدودیت زمان باید بین 5 تا 300 دقیقه باشد'),
    body('configuration.allowReview')
        .optional()
        .isBoolean()
        .withMessage('اجازه بازبینی باید مقدار بولی باشد'),
    body('configuration.shuffleQuestions')
        .optional()
        .isBoolean()
        .withMessage('ترتیب تصادفی سوالات باید مقدار بولی باشد'),
    body('configuration.shuffleOptions')
        .optional()
        .isBoolean()
        .withMessage('ترتیب تصادفی گزینه‌ها باید مقدار بولی باشد'),
    body('configuration.showResults')
        .optional()
        .isBoolean()
        .withMessage('نمایش نتایج باید مقدار بولی باشد'),
    body('configuration.passingScore')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('نمره قبولی باید بین 0 تا 100 باشد'),
    body('configuration.categories')
        .optional()
        .isArray()
        .withMessage('دسته‌بندی‌ها باید آرایه‌ای از رشته‌ها باشد'),
    body('configuration.categories.*')
        .optional()
        .isString()
        .withMessage('هر دسته‌بندی باید رشته باشد')
        .isLength({ min: 1, max: 100 })
        .withMessage('نام دسته‌بندی باید بین 1 تا 100 کاراکتر باشد'),
    body('configuration.tags')
        .optional()
        .isArray()
        .withMessage('برچسب‌ها باید آرایه‌ای از رشته‌ها باشد'),
    body('configuration.tags.*')
        .optional()
        .isString()
        .withMessage('هر برچسب باید رشته باشد')
        .isLength({ min: 1, max: 50 })
        .withMessage('برچسب باید بین 1 تا 50 کاراکتر باشد'),
    // Custom validation for difficulty distribution sum
    body('configuration').custom((configuration) => {
        if (configuration && configuration.difficultyDistribution && configuration.totalQuestions) {
            const { easy = 0, medium = 0, hard = 0 } = configuration.difficultyDistribution;
            const total = easy + medium + hard;
            if (total !== configuration.totalQuestions) {
                throw new Error('مجموع توزیع سختی باید برابر تعداد کل سوالات باشد');
            }
        }
        return true;
    }),
    body('startTime')
        .optional()
        .isISO8601()
        .withMessage('زمان شروع باید در فرمت ISO8601 باشد'),
    body('endTime')
        .optional()
        .isISO8601()
        .withMessage('زمان پایان باید در فرمت ISO8601 باشد'),
    body('isPublished')
        .optional()
        .isBoolean()
        .withMessage('وضعیت انتشار باید مقدار بولی باشد')
];
/**
 * Validation for updating a test exam
 */
const validateTestExamUpdate = [
    param('id')
        .notEmpty()
        .withMessage('شناسه آزمون الزامی است')
        .isLength({ min: 10 })
        .withMessage('شناسه آزمون نامعتبر است'),
    body('title')
        .optional()
        .isLength({ min: 3, max: 200 })
        .withMessage('عنوان آزمون باید بین 3 تا 200 کاراکتر باشد')
        .trim(),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('توضیحات نباید بیشتر از 1000 کاراکتر باشد')
        .trim(),
    body('type')
        .optional()
        .isIn(EXAM_TYPES)
        .withMessage(`نوع آزمون باید یکی از موارد زیر باشد: ${EXAM_TYPES.join(', ')}`),
    body('status')
        .optional()
        .isIn(EXAM_STATUSES)
        .withMessage(`وضعیت آزمون باید یکی از موارد زیر باشد: ${EXAM_STATUSES.join(', ')}`),
    // Configuration validation (same as creation)
    body('configuration')
        .optional()
        .isObject()
        .withMessage('تنظیمات آزمون باید یک شیء معتبر باشد'),
    body('configuration.totalQuestions')
        .optional()
        .isInt({ min: 5, max: 100 })
        .withMessage('تعداد سوالات باید بین 5 تا 100 باشد'),
    body('configuration.difficultyDistribution')
        .optional()
        .isObject()
        .withMessage('توزیع سختی باید یک شیء معتبر باشد'),
    body('configuration.difficultyDistribution.easy')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات آسان باید بین 0 تا 50 باشد'),
    body('configuration.difficultyDistribution.medium')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات متوسط باید بین 0 تا 50 باشد'),
    body('configuration.difficultyDistribution.hard')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات سخت باید بین 0 تا 50 باشد'),
    body('configuration.timeLimit')
        .optional()
        .isInt({ min: 5, max: 300 })
        .withMessage('محدودیت زمان باید بین 5 تا 300 دقیقه باشد'),
    body('configuration.allowReview')
        .optional()
        .isBoolean()
        .withMessage('اجازه بازبینی باید مقدار بولی باشد'),
    body('configuration.shuffleQuestions')
        .optional()
        .isBoolean()
        .withMessage('ترتیب تصادفی سوالات باید مقدار بولی باشد'),
    body('configuration.shuffleOptions')
        .optional()
        .isBoolean()
        .withMessage('ترتیب تصادفی گزینه‌ها باید مقدار بولی باشد'),
    body('configuration.showResults')
        .optional()
        .isBoolean()
        .withMessage('نمایش نتایج باید مقدار بولی باشد'),
    body('configuration.passingScore')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('نمره قبولی باید بین 0 تا 100 باشد'),
    body('configuration.categories')
        .optional()
        .isArray()
        .withMessage('دسته‌بندی‌ها باید آرایه‌ای از رشته‌ها باشد'),
    body('configuration.tags')
        .optional()
        .isArray()
        .withMessage('برچسب‌ها باید آرایه‌ای از رشته‌ها باشد'),
    // Custom validation for difficulty distribution sum
    body('configuration').custom((configuration) => {
        if (configuration && configuration.difficultyDistribution && configuration.totalQuestions) {
            const { easy = 0, medium = 0, hard = 0 } = configuration.difficultyDistribution;
            const total = easy + medium + hard;
            if (total !== configuration.totalQuestions) {
                throw new Error('مجموع توزیع سختی باید برابر تعداد کل سوالات باشد');
            }
        }
        return true;
    }),
    body('startTime')
        .optional()
        .isISO8601()
        .withMessage('زمان شروع باید در فرمت ISO8601 باشد'),
    body('endTime')
        .optional()
        .isISO8601()
        .withMessage('زمان پایان باید در فرمت ISO8601 باشد'),
    body('isPublished')
        .optional()
        .isBoolean()
        .withMessage('وضعیت انتشار باید مقدار بولی باشد')
];
/**
 * Validation for exam configuration
 */
const validateExamConfiguration = [
    param('id')
        .notEmpty()
        .withMessage('شناسه آزمون الزامی است')
        .isLength({ min: 10 })
        .withMessage('شناسه آزمون نامعتبر است'),
    body('configuration')
        .optional()
        .isObject()
        .withMessage('تنظیمات آزمون باید یک شیء معتبر باشد'),
    body('configuration.totalQuestions')
        .optional()
        .isInt({ min: 5, max: 100 })
        .withMessage('تعداد سوالات باید بین 5 تا 100 باشد'),
    body('configuration.difficultyDistribution')
        .optional()
        .isObject()
        .withMessage('توزیع سختی باید یک شیء معتبر باشد'),
    body('configuration.difficultyDistribution.easy')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات آسان باید بین 0 تا 50 باشد'),
    body('configuration.difficultyDistribution.medium')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات متوسط باید بین 0 تا 50 باشد'),
    body('configuration.difficultyDistribution.hard')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('تعداد سوالات سخت باید بین 0 تا 50 باشد'),
    body('configuration.categories')
        .optional()
        .isArray()
        .withMessage('دسته‌بندی‌ها باید آرایه‌ای از رشته‌ها باشد'),
    body('configuration.tags')
        .optional()
        .isArray()
        .withMessage('برچسب‌ها باید آرایه‌ای از رشته‌ها باشد'),
    // Custom validation for difficulty distribution sum
    body('configuration').custom((configuration) => {
        if (configuration && configuration.difficultyDistribution && configuration.totalQuestions) {
            const { easy = 0, medium = 0, hard = 0 } = configuration.difficultyDistribution;
            const total = easy + medium + hard;
            if (total !== configuration.totalQuestions) {
                throw new Error('مجموع توزیع سختی باید برابر تعداد کل سوالات باشد');
            }
        }
        return true;
    })
];
/**
 * Validation for exam session answer submission
 */
const validateAnswerSubmission = [
    param('sessionId')
        .notEmpty()
        .withMessage('شناسه جلسه آزمون الزامی است')
        .isLength({ min: 10 })
        .withMessage('شناسه جلسه آزمون نامعتبر است'),
    body('questionId')
        .notEmpty()
        .withMessage('شناسه سوال الزامی است')
        .isLength({ min: 10 })
        .withMessage('شناسه سوال نامعتبر است'),
    body('answer')
        .isObject()
        .withMessage('پاسخ باید یک شیء معتبر باشد'),
    body('answer.selectedOptions')
        .optional()
        .isArray()
        .withMessage('گزینه‌های انتخابی باید آرایه باشد'),
    body('answer.selectedOptions.*')
        .optional()
        .isInt({ min: 0, max: 10 })
        .withMessage('شماره گزینه باید عدد صحیح بین 0 تا 10 باشد'),
    body('answer.textAnswer')
        .optional()
        .isString()
        .withMessage('پاسخ متنی باید رشته باشد')
        .isLength({ max: 1000 })
        .withMessage('پاسخ متنی نباید بیشتر از 1000 کاراکتر باشد'),
    body('answer.timeSpent')
        .optional()
        .isInt({ min: 0, max: 3600 })
        .withMessage('زمان صرف شده باید بین 0 تا 3600 ثانیه باشد'),
    // Custom validation to ensure at least one answer type is provided
    body('answer').custom((answer) => {
        if (!answer.selectedOptions && !answer.textAnswer) {
            throw new Error('حداقل یکی از گزینه‌های انتخابی یا پاسخ متنی باید ارائه شود');
        }
        return true;
    })
];
/**
 * Validation for exam listing queries
 */
const validateExamListQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شماره صفحه باید عدد صحیح مثبت باشد'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('تعداد آیتم در صفحه باید بین 1 تا 100 باشد'),
    query('type')
        .optional()
        .isIn(EXAM_TYPES)
        .withMessage(`نوع آزمون باید یکی از موارد زیر باشد: ${EXAM_TYPES.join(', ')}`),
    query('status')
        .optional()
        .isIn(EXAM_STATUSES)
        .withMessage(`وضعیت آزمون باید یکی از موارد زیر باشد: ${EXAM_STATUSES.join(', ')}`),
    query('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('عبارت جستجو باید بین 1 تا 100 کاراکتر باشد')
        .trim(),
    query('publishedOnly')
        .optional()
        .isBoolean()
        .withMessage('فیلتر انتشار باید مقدار بولی باشد'),
    query('authorId')
        .optional()
        .isLength({ min: 10 })
        .withMessage('شناسه نویسنده نامعتبر است')
];
/**
 * Validation for exam ID parameter
 */
const validateExamId = [
    param('id')
        .notEmpty()
        .withMessage('شناسه آزمون الزامی است')
        .isLength({ min: 10 })
        .withMessage('شناسه آزمون نامعتبر است')
];
/**
 * Validation for session ID parameter
 */
const validateSessionId = [
    param('sessionId')
        .notEmpty()
        .withMessage('شناسه جلسه آزمون الزامی است')
        .isLength({ min: 10 })
        .withMessage('شناسه جلسه آزمون نامعتبر است')
];
/**
 * Custom validation middleware for difficulty distribution
 */
const validateDifficultyDistribution = (req, res, next) => {
    const { configuration } = req.body;
    if (configuration && configuration.difficultyDistribution && configuration.totalQuestions) {
        const { easy = 0, medium = 0, hard = 0 } = configuration.difficultyDistribution;
        const total = easy + medium + hard;
        // Check if sum equals total questions
        if (total !== configuration.totalQuestions) {
            return res.status(400).json({
                success: false,
                message: 'خطای اعتبارسنجی',
                errors: [{
                        field: 'configuration.difficultyDistribution',
                        message: 'مجموع توزیع سختی باید برابر تعداد کل سوالات باشد'
                    }]
            });
        }
        // Check if all values are non-negative
        if (easy < 0 || medium < 0 || hard < 0) {
            return res.status(400).json({
                success: false,
                message: 'خطای اعتبارسنجی',
                errors: [{
                        field: 'configuration.difficultyDistribution',
                        message: 'تعداد سوالات در هر سطح سختی نمی‌تواند منفی باشد'
                    }]
            });
        }
    }
    next();
};
/**
 * Custom validation middleware for exam time constraints
 */
const validateExamTimeConstraints = (req, res, next) => {
    const { startTime, endTime } = req.body;
    if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            return res.status(400).json({
                success: false,
                message: 'خطای اعتبارسنجی',
                errors: [{
                        field: 'endTime',
                        message: 'زمان پایان باید بعد از زمان شروع باشد'
                    }]
            });
        }
        // Check if start time is not in the past (for new exams)
        if (req.method === 'POST' && start < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'خطای اعتبارسنجی',
                errors: [{
                        field: 'startTime',
                        message: 'زمان شروع نمی‌تواند در گذشته باشد'
                    }]
            });
        }
    }
    next();
};
module.exports = {
    validateTestExamCreation,
    validateTestExamUpdate,
    validateExamConfiguration,
    validateAnswerSubmission,
    validateExamListQuery,
    validateExamId,
    validateSessionId,
    validateDifficultyDistribution,
    validateExamTimeConstraints,
    EXAM_TYPES,
    EXAM_STATUSES
};
//# sourceMappingURL=testExamValidation.js.map