import { z } from 'zod';

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
const QuestionTypeEnum = z.enum(['multiple-choice', 'true-false', 'short-answer', 'essay'], {
  errorMap: () => ({ message: 'نوع سوال نامعتبر است' })
});

// Enum for difficulty levels
const DifficultyEnum = z.enum(['Easy', 'Medium', 'Hard'], {
  errorMap: () => ({ message: 'سطح سختی باید یکی از مقادیر Easy، Medium یا Hard باشد' })
});

// Enum for sort options
const SortByEnum = z.enum(['newest', 'oldest', 'difficulty', 'points', 'category'], {
  errorMap: () => ({ message: 'نوع مرتب‌سازی نامعتبر است' })
});

// Base question schema
const BaseQuestionSchema = z.object({
  type: QuestionTypeEnum,
  text: z.string()
    .trim()
    .min(10, { message: 'متن سوال باید حداقل ۱۰ کاراکتر باشد' })
    .max(2000, { message: 'متن سوال نباید بیشتر از ۲۰۰۰ کاراکتر باشد' }),
  category: z.string()
    .trim()
    .min(1, { message: 'دسته‌بندی الزامی است' })
    .max(100, { message: 'دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد' }),
  difficulty: DifficultyEnum.optional(),
  points: z.number()
    .min(0.5, { message: 'امتیاز باید حداقل ۰.۵ باشد' })
    .max(10, { message: 'امتیاز نباید بیشتر از ۱۰ باشد' })
    .optional(),
  explanation: z.string()
    .trim()
    .max(1000, { message: 'توضیح نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
    .optional(),
  lesson: z.string()
    .trim()
    .max(200, { message: 'نام درس نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),
  tags: z.array(
    z.string()
      .trim()
      .min(1, { message: 'تگ نمی‌تواند خالی باشد' })
      .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })
  ).optional(),
  timeLimit: z.number()
    .int({ message: 'زمان باید عدد صحیح باشد' })
    .min(1, { message: 'زمان باید حداقل ۱ ثانیه باشد' })
    .max(7200, { message: 'زمان نباید بیشتر از ۷۲۰۰ ثانیه باشد' })
    .optional(),
  sourcePage: z.number()
    .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
    .max(9999, { message: 'شماره صفحه نباید بیشتر از ۹۹۹۹ باشد' })
    .optional(),
  sourceBook: z.string()
    .trim()
    .max(200, { message: 'نام کتاب نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),
  sourceChapter: z.string()
    .trim()
    .max(200, { message: 'نام فصل نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),
  isDraft: z.boolean().optional(),
  isPublished: z.boolean().optional()
});

// Schema for multiple choice questions
const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('multiple-choice'),
  options: z.array(z.string().trim().min(2, { message: 'هر گزینه باید حداقل ۲ کاراکتر داشته باشد' }))
    .length(4, { message: 'سوال چند گزینه‌ای باید دقیقاً ۴ گزینه داشته باشد' }),
  correctOptions: z.array(z.number().int().min(0).max(3))
    .min(1, { message: 'حداقل یک گزینه صحیح انتخاب کنید' }),
  allowMultipleCorrect: z.boolean().optional(),
  correctAnswer: z.string().optional()
});

// Schema for true/false questions
const TrueFalseQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('true-false'),
  options: z.array(z.string().trim().min(1))
    .length(2, { message: 'سوال درست/غلط باید دقیقاً ۲ گزینه داشته باشد' }),
  correctOptions: z.array(z.number().int().min(0).max(1))
    .length(1, { message: 'سوال درست/غلط فقط یک گزینه صحیح می‌تواند داشته باشد' }),
  allowMultipleCorrect: z.literal(false).optional(),
  correctAnswer: z.string().optional()
});

// Schema for text-based questions
const TextQuestionSchema = BaseQuestionSchema.extend({
  type: z.union([z.literal('short-answer'), z.literal('essay')]),
  options: z.array(z.string()).max(0, { message: 'سوالات تشریحی نیاز به گزینه ندارند' }).optional(),
  correctOptions: z.array(z.number()).max(0).optional(),
  correctAnswer: z.string()
    .trim()
    .min(1, { message: 'پاسخ صحیح برای سوالات تشریحی الزامی است' }),
  allowMultipleCorrect: z.boolean().optional()
});

// Union schema for all question types
const QuestionSchema = z.discriminatedUnion('type', [
  MultipleChoiceQuestionSchema,
  TrueFalseQuestionSchema,
  TextQuestionSchema
]);

/**
 * Schema for creating a new question
 */
export const QuestionCreateSchema = QuestionSchema;

/**
 * Schema for updating a question (all fields optional except id)
 */
export const QuestionUpdateSchema = z.object({
  id: z.string().min(1, { message: 'شناسه سوال الزامی است' }),
  type: QuestionTypeEnum.optional(),
  text: z.string()
    .trim()
    .min(10, { message: 'متن سوال باید حداقل ۱۰ کاراکتر باشد' })
    .max(2000, { message: 'متن سوال نباید بیشتر از ۲۰۰۰ کاراکتر باشد' })
    .optional(),
  category: z.string()
    .trim()
    .min(1, { message: 'دسته‌بندی الزامی است' })
    .max(100, { message: 'دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد' })
    .optional(),
  difficulty: DifficultyEnum.optional(),
  points: z.number()
    .min(0.5, { message: 'امتیاز باید حداقل ۰.۵ باشد' })
    .max(10, { message: 'امتیاز نباید بیشتر از ۱۰ باشد' })
    .optional(),
  explanation: z.string()
    .trim()
    .max(1000, { message: 'توضیح نباید بیشتر از ۱۰۰۰ کاراکتر باشد' })
    .optional(),
  lesson: z.string()
    .trim()
    .max(200, { message: 'نام درس نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),
  tags: z.array(
    z.string()
      .trim()
      .min(1, { message: 'تگ نمی‌تواند خالی باشد' })
      .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })
  ).optional(),
  timeLimit: z.number()
    .int({ message: 'زمان باید عدد صحیح باشد' })
    .min(1, { message: 'زمان باید حداقل ۱ ثانیه باشد' })
    .max(7200, { message: 'زمان نباید بیشتر از ۷۲۰۰ ثانیه باشد' })
    .optional(),
  sourcePage: z.number()
    .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
    .max(9999, { message: 'شماره صفحه نباید بیشتر از ۹۹۹۹ باشد' })
    .optional(),
  sourceBook: z.string()
    .trim()
    .max(200, { message: 'نام کتاب نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),
  sourceChapter: z.string()
    .trim()
    .max(200, { message: 'نام فصل نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),
  isDraft: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  options: z.array(z.string().trim()).optional(),
  correctOptions: z.array(z.number().int()).optional(),
  allowMultipleCorrect: z.boolean().optional(),
  correctAnswer: z.string().optional()
});

/**
 * Schema for auto-save (more lenient)
 */
export const QuestionAutoSaveSchema = z.object({
  id: z.string().refine((val) => val === 'new' || val.trim().length > 0, {
    message: 'شناسه سوال الزامی است'
  }),
  text: z.string()
    .trim()
    .max(2000, { message: 'متن سوال نباید بیشتر از ۲۰۰۰ کاراکتر باشد' })
    .optional(),
  category: z.string()
    .trim()
    .max(100, { message: 'دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد' })
    .optional(),
  points: z.number()
    .min(0.5, { message: 'امتیاز باید حداقل ۰.۵ باشد' })
    .max(10, { message: 'امتیاز نباید بیشتر از ۱۰ باشد' })
    .optional(),
  sourcePage: z.number()
    .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
    .max(9999, { message: 'شماره صفحه نباید بیشتر از ۹۹۹۹ باشد' })
    .optional(),
  tags: z.array(
    z.string()
      .trim()
      .max(50, { message: 'هر تگ نباید بیشتر از ۵۰ کاراکتر باشد' })
  ).optional()
});

/**
 * Schema for search parameters
 */
export const QuestionSearchSchema = z.object({
  q: z.string()
    .trim()
    .min(2, { message: 'متن جستجو باید حداقل ۲ کاراکتر باشد' })
    .max(200, { message: 'متن جستجو نباید بیشتر از ۲۰۰ کاراکتر باشد' }),
  limit: z.number()
    .int({ message: 'محدودیت نتایج باید عدد صحیح باشد' })
    .min(1, { message: 'محدودیت نتایج باید حداقل ۱ باشد' })
    .max(100, { message: 'محدودیت نتایج نباید بیشتر از ۱۰۰ باشد' })
    .optional(),
  publishedOnly: z.boolean().optional()
});

/**
 * Schema for listing questions
 */
export const QuestionListSchema = z.object({
  page: z.number()
    .int({ message: 'شماره صفحه باید عدد صحیح باشد' })
    .min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
    .optional(),
  limit: z.number()
    .int({ message: 'محدودیت نتایج باید عدد صحیح باشد' })
    .min(1, { message: 'محدودیت نتایج باید حداقل ۱ باشد' })
    .max(100, { message: 'محدودیت نتایج نباید بیشتر از ۱۰۰ باشد' })
    .optional(),
  type: QuestionTypeEnum.optional(),
  difficulty: DifficultyEnum.optional(),
  sortBy: SortByEnum.optional(),
  publishedOnly: z.boolean().optional()
});

/**
 * Schema for rating a question
 */
export const QuestionRatingSchema = z.object({
  id: z.string().min(1, { message: 'شناسه سوال الزامی است' }),
  rating: z.number()
    .min(1, { message: 'امتیاز باید حداقل ۱ باشد' })
    .max(5, { message: 'امتیاز نباید بیشتر از ۵ باشد' }),
  comment: z.string()
    .trim()
    .max(500, { message: 'نظر نباید بیشتر از ۵۰۰ کاراکتر باشد' })
    .optional()
});

// Type exports for TypeScript
export type QuestionCreateType = z.infer<typeof QuestionCreateSchema>;
export type QuestionUpdateType = z.infer<typeof QuestionUpdateSchema>;
export type QuestionAutoSaveType = z.infer<typeof QuestionAutoSaveSchema>;
export type QuestionSearchType = z.infer<typeof QuestionSearchSchema>;
export type QuestionListType = z.infer<typeof QuestionListSchema>;
export type QuestionRatingType = z.infer<typeof QuestionRatingSchema>;