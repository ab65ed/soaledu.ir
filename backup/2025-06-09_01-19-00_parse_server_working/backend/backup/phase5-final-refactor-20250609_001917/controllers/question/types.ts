/**
 * Question Types and Schemas
 * تایپ‌ها و اسکیماهای مربوط به سوالات
 */

import { z } from 'zod';

// ==================== Validation Schemas ====================

export const QuestionOptionSchema = z.object({
  label: z.string().min(1, 'برچسب گزینه الزامی است'),
  content: z.string().min(1, 'محتوای گزینه الزامی است'),
  isCorrect: z.boolean()
});

export const QuestionMetadataSchema = z.object({
  points: z.number().min(0).default(1),
  timeLimit: z.number().min(0).optional(),
  chapter: z.string().optional()
});

export const CreateQuestionSchema = z.object({
  courseExamId: z.string().min(1, 'شناسه درس-آزمون الزامی است'),
  title: z.string().min(5, 'عنوان باید حداقل 5 کاراکتر باشد').max(200, 'عنوان حداکثر 200 کاراکتر'),
  content: z.string().min(10, 'شرح سوال باید حداقل 10 کاراکتر باشد').max(2000, 'شرح حداکثر 2000 کاراکتر'),
  type: z.enum(['multiple-choice', 'true-false', 'descriptive'], {
    errorMap: () => ({ message: 'نوع سوال نامعتبر است' })
  }),
  options: z.array(QuestionOptionSchema).optional(),
  correctAnswer: z.string().min(1, 'پاسخ صحیح الزامی است'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'سطح سختی نامعتبر است' })
  }),
  source: z.string().optional(),
  sourcePage: z.number().min(1).max(9999).optional(),
  explanation: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: QuestionMetadataSchema.optional()
});

export const UpdateQuestionSchema = CreateQuestionSchema.partial().omit({ courseExamId: true });

export const QuestionFiltersSchema = z.object({
  courseExamId: z.string().optional(),
  type: z.enum(['multiple-choice', 'true-false', 'descriptive']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  authorId: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// ==================== Type Definitions ====================

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;
export type QuestionMetadata = z.infer<typeof QuestionMetadataSchema>;
export type CreateQuestionData = z.infer<typeof CreateQuestionSchema>;
export type UpdateQuestionData = z.infer<typeof UpdateQuestionSchema>;
export type QuestionFilters = z.infer<typeof QuestionFiltersSchema>;

export interface QuestionData {
  id: string;
  courseExamId: string;
  title: string;
  content: string;
  type: 'multiple-choice' | 'true-false' | 'descriptive';
  options: QuestionOption[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source?: string;
  sourcePage?: number;
  explanation?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  isActive: boolean;
  metadata: QuestionMetadata;
}

export interface QuestionListResponse {
  questions: QuestionData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions?: string[];
  };
} 