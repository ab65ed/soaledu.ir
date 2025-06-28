import { z } from 'zod';
/**
 * Schema for creating a new question
 */
export declare const QuestionCreateSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    text: z.ZodString;
    category: z.ZodString;
    difficulty: z.ZodOptional<z.ZodEnum<["Easy", "Medium", "Hard"]>>;
    points: z.ZodOptional<z.ZodNumber>;
    explanation: z.ZodOptional<z.ZodString>;
    lesson: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    timeLimit: z.ZodOptional<z.ZodNumber>;
    sourcePage: z.ZodOptional<z.ZodNumber>;
    sourceBook: z.ZodOptional<z.ZodString>;
    sourceChapter: z.ZodOptional<z.ZodString>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"multiple-choice">;
    options: z.ZodArray<z.ZodString, "many">;
    correctOptions: z.ZodArray<z.ZodNumber, "many">;
    allowMultipleCorrect: z.ZodOptional<z.ZodBoolean>;
    correctAnswer: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    options?: string[];
    type?: "multiple-choice";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: boolean;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    options?: string[];
    type?: "multiple-choice";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: boolean;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}>, z.ZodObject<{
    text: z.ZodString;
    category: z.ZodString;
    difficulty: z.ZodOptional<z.ZodEnum<["Easy", "Medium", "Hard"]>>;
    points: z.ZodOptional<z.ZodNumber>;
    explanation: z.ZodOptional<z.ZodString>;
    lesson: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    timeLimit: z.ZodOptional<z.ZodNumber>;
    sourcePage: z.ZodOptional<z.ZodNumber>;
    sourceBook: z.ZodOptional<z.ZodString>;
    sourceChapter: z.ZodOptional<z.ZodString>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"true-false">;
    options: z.ZodArray<z.ZodString, "many">;
    correctOptions: z.ZodArray<z.ZodNumber, "many">;
    allowMultipleCorrect: z.ZodOptional<z.ZodLiteral<false>>;
    correctAnswer: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    options?: string[];
    type?: "true-false";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: false;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    options?: string[];
    type?: "true-false";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: false;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}>, z.ZodObject<{
    text: z.ZodString;
    category: z.ZodString;
    difficulty: z.ZodOptional<z.ZodEnum<["Easy", "Medium", "Hard"]>>;
    points: z.ZodOptional<z.ZodNumber>;
    explanation: z.ZodOptional<z.ZodString>;
    lesson: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    timeLimit: z.ZodOptional<z.ZodNumber>;
    sourcePage: z.ZodOptional<z.ZodNumber>;
    sourceBook: z.ZodOptional<z.ZodString>;
    sourceChapter: z.ZodOptional<z.ZodString>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodUnion<[z.ZodLiteral<"short-answer">, z.ZodLiteral<"essay">]>;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    correctOptions: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    correctAnswer: z.ZodString;
    allowMultipleCorrect: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    options?: string[];
    type?: "short-answer" | "essay";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: boolean;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    options?: string[];
    type?: "short-answer" | "essay";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: boolean;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}>]>;
/**
 * Schema for updating a question (all fields optional except id)
 */
export declare const QuestionUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["multiple-choice", "true-false", "short-answer", "essay"]>>;
    text: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodEnum<["Easy", "Medium", "Hard"]>>;
    points: z.ZodOptional<z.ZodNumber>;
    explanation: z.ZodOptional<z.ZodString>;
    lesson: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    timeLimit: z.ZodOptional<z.ZodNumber>;
    sourcePage: z.ZodOptional<z.ZodNumber>;
    sourceBook: z.ZodOptional<z.ZodString>;
    sourceChapter: z.ZodOptional<z.ZodString>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    correctOptions: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    allowMultipleCorrect: z.ZodOptional<z.ZodBoolean>;
    correctAnswer: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    id?: string;
    options?: string[];
    type?: "multiple-choice" | "true-false" | "short-answer" | "essay";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: boolean;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}, {
    tags?: string[];
    isPublished?: boolean;
    isDraft?: boolean;
    difficulty?: "Medium" | "Easy" | "Hard";
    id?: string;
    options?: string[];
    type?: "multiple-choice" | "true-false" | "short-answer" | "essay";
    text?: string;
    correctOptions?: number[];
    correctAnswer?: string;
    allowMultipleCorrect?: boolean;
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    timeLimit?: number;
    sourcePage?: number;
    sourceBook?: string;
    sourceChapter?: string;
}>;
/**
 * Schema for auto-save (more lenient)
 */
export declare const QuestionAutoSaveSchema: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, string, string>;
    text: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    points: z.ZodOptional<z.ZodNumber>;
    sourcePage: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    tags?: string[];
    id?: string;
    text?: string;
    points?: number;
    category?: string;
    sourcePage?: number;
}, {
    tags?: string[];
    id?: string;
    text?: string;
    points?: number;
    category?: string;
    sourcePage?: number;
}>;
/**
 * Schema for search parameters
 */
export declare const QuestionSearchSchema: z.ZodObject<{
    q: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    publishedOnly: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    q?: string;
    limit?: number;
    publishedOnly?: boolean;
}, {
    q?: string;
    limit?: number;
    publishedOnly?: boolean;
}>;
/**
 * Schema for listing questions
 */
export declare const QuestionListSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<["multiple-choice", "true-false", "short-answer", "essay"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["Easy", "Medium", "Hard"]>>;
    sortBy: z.ZodOptional<z.ZodEnum<["newest", "oldest", "difficulty", "points", "category"]>>;
    publishedOnly: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    difficulty?: "Medium" | "Easy" | "Hard";
    type?: "multiple-choice" | "true-false" | "short-answer" | "essay";
    page?: number;
    limit?: number;
    sortBy?: "difficulty" | "newest" | "points" | "category" | "oldest";
    publishedOnly?: boolean;
}, {
    difficulty?: "Medium" | "Easy" | "Hard";
    type?: "multiple-choice" | "true-false" | "short-answer" | "essay";
    page?: number;
    limit?: number;
    sortBy?: "difficulty" | "newest" | "points" | "category" | "oldest";
    publishedOnly?: boolean;
}>;
/**
 * Schema for rating a question
 */
export declare const QuestionRatingSchema: z.ZodObject<{
    id: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rating?: number;
    id?: string;
    comment?: string;
}, {
    rating?: number;
    id?: string;
    comment?: string;
}>;
export type QuestionCreateType = z.infer<typeof QuestionCreateSchema>;
export type QuestionUpdateType = z.infer<typeof QuestionUpdateSchema>;
export type QuestionAutoSaveType = z.infer<typeof QuestionAutoSaveSchema>;
export type QuestionSearchType = z.infer<typeof QuestionSearchSchema>;
export type QuestionListType = z.infer<typeof QuestionListSchema>;
export type QuestionRatingType = z.infer<typeof QuestionRatingSchema>;
import { Request, Response, NextFunction } from 'express';
/**
 * Middleware برای اعتبارسنجی ایجاد سوال جدید
 */
export declare const validateQuestionCreate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware برای اعتبارسنجی به‌روزرسانی سوال
 */
export declare const validateQuestionUpdate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware برای اعتبارسنجی ذخیره خودکار سوال
 */
export declare const validateQuestionAutoSave: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware برای اعتبارسنجی جستجوی سوال
 */
export declare const validateQuestionSearch: (req: Request, res: Response, next: NextFunction) => void;
