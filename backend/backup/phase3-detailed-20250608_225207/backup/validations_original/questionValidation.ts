import { body, query, param } from 'express-validator';

/**
 * Question Validation Schemas
 * اعتبارسنجی سوالات با پیام‌های خطای فارسی
 * 
 * ویژگی‌های اصلی:
 * - اعتبارسنجی 4 گزینه برای سوالات چند گزینه‌ای
 * - اعتبارسنجی صفحه منبع اختیاری
 * - پیام‌های خطای فارسی
 * - اعتبارسنجی انواع مختلف سوال
 */

// Helper function to validate question options based on type
const validateQuestionOptions = (value, { req }) => {
  const type = req.body.type;
  
  if (type === 'multiple-choice') {
    if (!Array.isArray(value) || value.length !== 4) {
      throw new Error('سوال چند گزینه‌ای باید دقیقاً ۴ گزینه داشته باشد');
    }
    
    // Check each option has at least 2 characters
    const invalidOptions = value.filter(opt => !opt || opt.trim().length < 2);
    if (invalidOptions.length > 0) {
      throw new Error('هر گزینه باید حداقل ۲ کاراکتر داشته باشد');
    }
  } else if (type === 'true-false') {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error('سوال درست/غلط باید دقیقاً ۲ گزینه داشته باشد');
    }
  } else if (type === 'short-answer' || type === 'essay') {
    // Text-based questions don't need options
    if (value && value.length > 0) {
      throw new Error('سوالات تشریحی نیاز به گزینه ندارند');
    }
  }
  
  return true;
};

// Helper function to validate correct options
const validateCorrectOptions = (value, { req }) => {
  const type = req.body.type;
  const options = req.body.options;
  
  if (type === 'multiple-choice' || type === 'true-false') {
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error('حداقل یک گزینه صحیح انتخاب کنید');
    }
    
    // Check if correct options are valid indices
    const maxIndex = options ? options.length - 1 : 0;
    const invalidIndices = value.filter(index => index < 0 || index > maxIndex);
    if (invalidIndices.length > 0) {
      throw new Error('شاخص گزینه‌های صحیح نامعتبر است');
    }
    
    // For true-false, only one correct option allowed
    if (type === 'true-false' && value.length > 1) {
      throw new Error('سوال درست/غلط فقط یک گزینه صحیح می‌تواند داشته باشد');
    }
  }
  
  return true;
};

// Helper function to validate correct answer for text-based questions
const validateCorrectAnswer = (value, { req }) => {
  const type = req.body.type;
  
  if (type === 'short-answer' || type === 'essay') {
    if (!value || value.trim().length === 0) {
      throw new Error('پاسخ صحیح برای سوالات تشریحی الزامی است');
    }
  }
  
  return true;
};

/**
 * Validation for creating a new question
 */
const validateQuestionCreate = [
  body('type')
    .isIn(['multiple-choice', 'true-false', 'short-answer', 'essay'])
    .withMessage('نوع سوال نامعتبر است'),

  body('text')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('متن سوال باید بین ۱۰ تا ۲۰۰۰ کاراکتر باشد'),

  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('دسته‌بندی الزامی است و باید کمتر از ۱۰۰ کاراکتر باشد'),

  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('سطح سختی باید یکی از مقادیر Easy، Medium یا Hard باشد'),

  body('points')
    .optional()
    .isFloat({ min: 0.5, max: 10 })
    .withMessage('امتیاز باید بین ۰.۵ تا ۱۰ باشد'),

  body('options')
    .custom(validateQuestionOptions),

  body('correctOptions')
    .custom(validateCorrectOptions),

  body('correctAnswer')
    .optional()
    .custom(validateCorrectAnswer),

  body('allowMultipleCorrect')
    .optional()
    .isBoolean()
    .withMessage('مقدار allowMultipleCorrect باید boolean باشد'),

  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('توضیح نباید بیشتر از ۱۰۰۰ کاراکتر باشد'),

  body('lesson')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('نام درس نباید بیشتر از ۲۰۰ کاراکتر باشد'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('تگ‌ها باید آرایه باشند'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('هر تگ باید بین ۱ تا ۵۰ کاراکتر باشد'),

  body('timeLimit')
    .optional()
    .isInt({ min: 1, max: 7200 })
    .withMessage('زمان باید بین ۱ تا ۷۲۰۰ ثانیه باشد'),

  body('sourcePage')
    .optional()
    .isInt({ min: 1, max: 9999 })
    .withMessage('شماره صفحه باید بین ۱ تا ۹۹۹۹ باشد'),

  body('sourceBook')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('نام کتاب نباید بیشتر از ۲۰۰ کاراکتر باشد'),

  body('sourceChapter')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('نام فصل نباید بیشتر از ۲۰۰ کاراکتر باشد'),

  body('isDraft')
    .optional()
    .isBoolean()
    .withMessage('مقدار isDraft باید boolean باشد'),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('مقدار isPublished باید boolean باشد')
];

/**
 * Validation for updating a question
 */
const validateQuestionUpdate = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('شناسه سوال الزامی است'),

  body('type')
    .optional()
    .isIn(['multiple-choice', 'true-false', 'short-answer', 'essay'])
    .withMessage('نوع سوال نامعتبر است'),

  body('text')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('متن سوال باید بین ۱۰ تا ۲۰۰۰ کاراکتر باشد'),

  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('دسته‌بندی باید کمتر از ۱۰۰ کاراکتر باشد'),

  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('سطح سختی باید یکی از مقادیر Easy، Medium یا Hard باشد'),

  body('points')
    .optional()
    .isFloat({ min: 0.5, max: 10 })
    .withMessage('امتیاز باید بین ۰.۵ تا ۱۰ باشد'),

  body('options')
    .optional()
    .custom(validateQuestionOptions),

  body('correctOptions')
    .optional()
    .custom(validateCorrectOptions),

  body('correctAnswer')
    .optional()
    .custom(validateCorrectAnswer),

  body('allowMultipleCorrect')
    .optional()
    .isBoolean()
    .withMessage('مقدار allowMultipleCorrect باید boolean باشد'),

  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('توضیح نباید بیشتر از ۱۰۰۰ کاراکتر باشد'),

  body('lesson')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('نام درس نباید بیشتر از ۲۰۰ کاراکتر باشد'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('تگ‌ها باید آرایه باشند'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('هر تگ باید بین ۱ تا ۵۰ کاراکتر باشد'),

  body('timeLimit')
    .optional()
    .isInt({ min: 1, max: 7200 })
    .withMessage('زمان باید بین ۱ تا ۷۲۰۰ ثانیه باشد'),

  body('sourcePage')
    .optional()
    .isInt({ min: 1, max: 9999 })
    .withMessage('شماره صفحه باید بین ۱ تا ۹۹۹۹ باشد'),

  body('sourceBook')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('نام کتاب نباید بیشتر از ۲۰۰ کاراکتر باشد'),

  body('sourceChapter')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('نام فصل نباید بیشتر از ۲۰۰ کاراکتر باشد'),

  body('isDraft')
    .optional()
    .isBoolean()
    .withMessage('مقدار isDraft باید boolean باشد'),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('مقدار isPublished باید boolean باشد')
];

/**
 * Validation for auto-save (more lenient)
 */
const validateQuestionAutoSave = [
  param('id')
    .custom((value) => {
      if (value !== 'new' && (!value || value.trim().length === 0)) {
        throw new Error('شناسه سوال الزامی است');
      }
      return true;
    }),

  body('text')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('متن سوال نباید بیشتر از ۲۰۰۰ کاراکتر باشد'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد'),

  body('points')
    .optional()
    .isFloat({ min: 0.5, max: 10 })
    .withMessage('امتیاز باید بین ۰.۵ تا ۱۰ باشد'),

  body('sourcePage')
    .optional()
    .isInt({ min: 1, max: 9999 })
    .withMessage('شماره صفحه باید بین ۱ تا ۹۹۹۹ باشد'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('تگ‌ها باید آرایه باشند'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('هر تگ نباید بیشتر از ۵۰ کاراکتر باشد')
];

/**
 * Validation for search
 */
const validateQuestionSearch = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('متن جستجو باید بین ۲ تا ۲۰۰ کاراکتر باشد'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('محدودیت نتایج باید بین ۱ تا ۱۰۰ باشد'),

  query('publishedOnly')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('مقدار publishedOnly باید true یا false باشد')
];

/**
 * Validation for listing questions
 */
const validateQuestionList = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('شماره صفحه باید عدد مثبت باشد'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('محدودیت نتایج باید بین ۱ تا ۱۰۰ باشد'),

  query('type')
    .optional()
    .isIn(['multiple-choice', 'true-false', 'short-answer', 'essay'])
    .withMessage('نوع سوال نامعتبر است'),

  query('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('سطح سختی نامعتبر است'),

  query('sortBy')
    .optional()
    .isIn(['newest', 'oldest', 'difficulty', 'points', 'category'])
    .withMessage('نوع مرتب‌سازی نامعتبر است'),

  query('publishedOnly')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('مقدار publishedOnly باید true یا false باشد')
];

/**
 * Validation for rating a question
 */
const validateQuestionRating = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('شناسه سوال الزامی است'),

  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('امتیاز باید بین ۱ تا ۵ باشد'),

  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('نظر نباید بیشتر از ۵۰۰ کاراکتر باشد')
];

export {
  validateQuestionCreate,
  validateQuestionUpdate,
  validateQuestionAutoSave,
  validateQuestionSearch,
  validateQuestionList,
  validateQuestionRating
}; 