"use strict";
/**
 * Question Types and Schemas
 * تایپ‌ها و اسکیماهای مربوط به سوالات
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFiltersSchema = exports.UpdateQuestionSchema = exports.CreateQuestionSchema = exports.QuestionMetadataSchema = exports.QuestionOptionSchema = void 0;
const zod_1 = require("zod");
// ==================== Validation Schemas ====================
exports.QuestionOptionSchema = zod_1.z.object({
    label: zod_1.z.string().min(1, 'برچسب گزینه الزامی است'),
    content: zod_1.z.string().min(1, 'محتوای گزینه الزامی است'),
    isCorrect: zod_1.z.boolean()
});
exports.QuestionMetadataSchema = zod_1.z.object({
    points: zod_1.z.number().min(0).default(1),
    timeLimit: zod_1.z.number().min(0).optional(),
    chapter: zod_1.z.string().optional()
});
exports.CreateQuestionSchema = zod_1.z.object({
    courseExamId: zod_1.z.string().min(1, 'شناسه درس-آزمون الزامی است'),
    title: zod_1.z.string().min(5, 'عنوان باید حداقل 5 کاراکتر باشد').max(200, 'عنوان حداکثر 200 کاراکتر'),
    content: zod_1.z.string().min(10, 'شرح سوال باید حداقل 10 کاراکتر باشد').max(2000, 'شرح حداکثر 2000 کاراکتر'),
    type: zod_1.z.enum(['multiple-choice', 'true-false', 'descriptive'], {
        errorMap: () => ({ message: 'نوع سوال نامعتبر است' })
    }),
    options: zod_1.z.array(exports.QuestionOptionSchema).optional(),
    correctAnswer: zod_1.z.string().min(1, 'پاسخ صحیح الزامی است'),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard'], {
        errorMap: () => ({ message: 'سطح سختی نامعتبر است' })
    }),
    source: zod_1.z.string().optional(),
    sourcePage: zod_1.z.number().min(1).max(9999).optional(),
    explanation: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    metadata: exports.QuestionMetadataSchema.optional()
});
exports.UpdateQuestionSchema = exports.CreateQuestionSchema.partial().omit({ courseExamId: true });
exports.QuestionFiltersSchema = zod_1.z.object({
    courseExamId: zod_1.z.string().optional(),
    type: zod_1.z.enum(['multiple-choice', 'true-false', 'descriptive']).optional(),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    search: zod_1.z.string().optional(),
    authorId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(20)
});
//# sourceMappingURL=types.js.map