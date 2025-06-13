/**
 * Question Types and Schemas
 * تایپ‌ها و اسکیماهای مربوط به سوالات
 */
import { z } from 'zod';
export declare const QuestionOptionSchema: z.ZodObject<{
    label: z.ZodString;
    content: z.ZodString;
    isCorrect: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    content?: string;
    isCorrect?: boolean;
    label?: string;
}, {
    content?: string;
    isCorrect?: boolean;
    label?: string;
}>;
export declare const QuestionMetadataSchema: z.ZodObject<{
    points: z.ZodDefault<z.ZodNumber>;
    timeLimit: z.ZodOptional<z.ZodNumber>;
    chapter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    points?: number;
    timeLimit?: number;
    chapter?: string;
}, {
    points?: number;
    timeLimit?: number;
    chapter?: string;
}>;
export declare const CreateQuestionSchema: z.ZodObject<{
    courseExamId: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodEnum<["multiple-choice", "true-false", "descriptive"]>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        content: z.ZodString;
        isCorrect: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }, {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }>, "many">>;
    correctAnswer: z.ZodString;
    difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
    source: z.ZodOptional<z.ZodString>;
    sourcePage: z.ZodOptional<z.ZodNumber>;
    explanation: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodOptional<z.ZodObject<{
        points: z.ZodDefault<z.ZodNumber>;
        timeLimit: z.ZodOptional<z.ZodNumber>;
        chapter: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    }, {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    type?: "multiple-choice" | "true-false" | "descriptive";
    options?: {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }[];
    tags?: string[];
    source?: string;
    title?: string;
    content?: string;
    correctAnswer?: string;
    difficulty?: "easy" | "medium" | "hard";
    explanation?: string;
    sourcePage?: number;
    metadata?: {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    };
    courseExamId?: string;
}, {
    type?: "multiple-choice" | "true-false" | "descriptive";
    options?: {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }[];
    tags?: string[];
    source?: string;
    title?: string;
    content?: string;
    correctAnswer?: string;
    difficulty?: "easy" | "medium" | "hard";
    explanation?: string;
    sourcePage?: number;
    metadata?: {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    };
    courseExamId?: string;
}>;
export declare const UpdateQuestionSchema: z.ZodObject<Omit<{
    courseExamId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["multiple-choice", "true-false", "descriptive"]>>;
    options: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        content: z.ZodString;
        isCorrect: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }, {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }>, "many">>>;
    correctAnswer: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    source: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sourcePage: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    explanation: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        points: z.ZodDefault<z.ZodNumber>;
        timeLimit: z.ZodOptional<z.ZodNumber>;
        chapter: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    }, {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    }>>>;
}, "courseExamId">, "strip", z.ZodTypeAny, {
    type?: "multiple-choice" | "true-false" | "descriptive";
    options?: {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }[];
    tags?: string[];
    source?: string;
    title?: string;
    content?: string;
    correctAnswer?: string;
    difficulty?: "easy" | "medium" | "hard";
    explanation?: string;
    sourcePage?: number;
    metadata?: {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    };
}, {
    type?: "multiple-choice" | "true-false" | "descriptive";
    options?: {
        content?: string;
        isCorrect?: boolean;
        label?: string;
    }[];
    tags?: string[];
    source?: string;
    title?: string;
    content?: string;
    correctAnswer?: string;
    difficulty?: "easy" | "medium" | "hard";
    explanation?: string;
    sourcePage?: number;
    metadata?: {
        points?: number;
        timeLimit?: number;
        chapter?: string;
    };
}>;
export declare const QuestionFiltersSchema: z.ZodObject<{
    courseExamId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["multiple-choice", "true-false", "descriptive"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    search: z.ZodOptional<z.ZodString>;
    authorId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page?: number;
    limit?: number;
    search?: string;
    type?: "multiple-choice" | "true-false" | "descriptive";
    isActive?: boolean;
    tags?: string[];
    difficulty?: "easy" | "medium" | "hard";
    authorId?: string;
    courseExamId?: string;
}, {
    page?: number;
    limit?: number;
    search?: string;
    type?: "multiple-choice" | "true-false" | "descriptive";
    isActive?: boolean;
    tags?: string[];
    difficulty?: "easy" | "medium" | "hard";
    authorId?: string;
    courseExamId?: string;
}>;
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
