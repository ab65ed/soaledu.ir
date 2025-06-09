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
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
declare const EXAM_TYPES: readonly ["practice", "official", "timed", "custom"];
declare const EXAM_STATUSES: readonly ["draft", "active", "completed", "cancelled"];
declare const DifficultyDistributionSchema: z.ZodObject<{
    easy: z.ZodOptional<z.ZodNumber>;
    medium: z.ZodOptional<z.ZodNumber>;
    hard: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    medium?: number;
    easy?: number;
    hard?: number;
}, {
    medium?: number;
    easy?: number;
    hard?: number;
}>;
declare const ExamConfigurationSchema: z.ZodEffects<z.ZodObject<{
    totalQuestions: z.ZodOptional<z.ZodNumber>;
    difficultyDistribution: z.ZodOptional<z.ZodObject<{
        easy: z.ZodOptional<z.ZodNumber>;
        medium: z.ZodOptional<z.ZodNumber>;
        hard: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        medium?: number;
        easy?: number;
        hard?: number;
    }, {
        medium?: number;
        easy?: number;
        hard?: number;
    }>>;
    timeLimit: z.ZodOptional<z.ZodNumber>;
    allowReview: z.ZodOptional<z.ZodBoolean>;
    shuffleQuestions: z.ZodOptional<z.ZodBoolean>;
    shuffleOptions: z.ZodOptional<z.ZodBoolean>;
    showResults: z.ZodOptional<z.ZodBoolean>;
    passingScore: z.ZodOptional<z.ZodNumber>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    tags?: string[];
    categories?: string[];
    timeLimit?: number;
    passingScore?: number;
    allowReview?: boolean;
    showResults?: boolean;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    totalQuestions?: number;
    difficultyDistribution?: {
        medium?: number;
        easy?: number;
        hard?: number;
    };
}, {
    tags?: string[];
    categories?: string[];
    timeLimit?: number;
    passingScore?: number;
    allowReview?: boolean;
    showResults?: boolean;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    totalQuestions?: number;
    difficultyDistribution?: {
        medium?: number;
        easy?: number;
        hard?: number;
    };
}>, {
    tags?: string[];
    categories?: string[];
    timeLimit?: number;
    passingScore?: number;
    allowReview?: boolean;
    showResults?: boolean;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    totalQuestions?: number;
    difficultyDistribution?: {
        medium?: number;
        easy?: number;
        hard?: number;
    };
}, {
    tags?: string[];
    categories?: string[];
    timeLimit?: number;
    passingScore?: number;
    allowReview?: boolean;
    showResults?: boolean;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    totalQuestions?: number;
    difficultyDistribution?: {
        medium?: number;
        easy?: number;
        hard?: number;
    };
}>;
/**
 * Validation schema for creating a new test exam
 */
export declare const CreateTestExamSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["practice", "official", "timed", "custom"]>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "active", "completed", "cancelled"]>>;
    configuration: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        totalQuestions: z.ZodOptional<z.ZodNumber>;
        difficultyDistribution: z.ZodOptional<z.ZodObject<{
            easy: z.ZodOptional<z.ZodNumber>;
            medium: z.ZodOptional<z.ZodNumber>;
            hard: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            medium?: number;
            easy?: number;
            hard?: number;
        }, {
            medium?: number;
            easy?: number;
            hard?: number;
        }>>;
        timeLimit: z.ZodOptional<z.ZodNumber>;
        allowReview: z.ZodOptional<z.ZodBoolean>;
        shuffleQuestions: z.ZodOptional<z.ZodBoolean>;
        shuffleOptions: z.ZodOptional<z.ZodBoolean>;
        showResults: z.ZodOptional<z.ZodBoolean>;
        passingScore: z.ZodOptional<z.ZodNumber>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }>, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }>>;
    startTime: z.ZodOptional<z.ZodDate>;
    endTime: z.ZodOptional<z.ZodDate>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}>, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}>;
/**
 * Validation schema for updating a test exam
 */
export declare const UpdateTestExamSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["practice", "official", "timed", "custom"]>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "active", "completed", "cancelled"]>>;
    configuration: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        totalQuestions: z.ZodOptional<z.ZodNumber>;
        difficultyDistribution: z.ZodOptional<z.ZodObject<{
            easy: z.ZodOptional<z.ZodNumber>;
            medium: z.ZodOptional<z.ZodNumber>;
            hard: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            medium?: number;
            easy?: number;
            hard?: number;
        }, {
            medium?: number;
            easy?: number;
            hard?: number;
        }>>;
        timeLimit: z.ZodOptional<z.ZodNumber>;
        allowReview: z.ZodOptional<z.ZodBoolean>;
        shuffleQuestions: z.ZodOptional<z.ZodBoolean>;
        shuffleOptions: z.ZodOptional<z.ZodBoolean>;
        showResults: z.ZodOptional<z.ZodBoolean>;
        passingScore: z.ZodOptional<z.ZodNumber>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }>, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }, {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    }>>;
    startTime: z.ZodOptional<z.ZodDate>;
    endTime: z.ZodOptional<z.ZodDate>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}>, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    isPublished?: boolean;
    description?: string;
    title?: string;
    configuration?: {
        tags?: string[];
        categories?: string[];
        timeLimit?: number;
        passingScore?: number;
        allowReview?: boolean;
        showResults?: boolean;
        shuffleQuestions?: boolean;
        shuffleOptions?: boolean;
        totalQuestions?: number;
        difficultyDistribution?: {
            medium?: number;
            easy?: number;
            hard?: number;
        };
    };
    startTime?: Date;
    endTime?: Date;
}>;
/**
 * Validation schema for test exam parameters (ID validation)
 */
export declare const TestExamParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: string;
}, {
    id?: string;
}>;
/**
 * Validation schema for exam session management
 */
export declare const ExamSessionSchema: z.ZodObject<{
    examId: z.ZodString;
    startTime: z.ZodDate;
    answers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    currentQuestionIndex: z.ZodOptional<z.ZodNumber>;
    timeSpent: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    examId?: string;
    startTime?: Date;
    timeSpent?: number;
    answers?: Record<string, any>;
    currentQuestionIndex?: number;
}, {
    examId?: string;
    startTime?: Date;
    timeSpent?: number;
    answers?: Record<string, any>;
    currentQuestionIndex?: number;
}>;
/**
 * Validation schema for exam submission
 */
export declare const ExamSubmissionSchema: z.ZodObject<{
    examId: z.ZodString;
    answers: z.ZodRecord<z.ZodString, z.ZodAny>;
    totalTimeSpent: z.ZodNumber;
    isCompleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    examId?: string;
    answers?: Record<string, any>;
    isCompleted?: boolean;
    totalTimeSpent?: number;
}, {
    examId?: string;
    answers?: Record<string, any>;
    isCompleted?: boolean;
    totalTimeSpent?: number;
}>;
/**
 * Validation schema for exam filtering and listing
 */
export declare const ExamFilterSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    type: z.ZodOptional<z.ZodEnum<["practice", "official", "timed", "custom"]>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "active", "completed", "cancelled"]>>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    sortBy: z.ZodOptional<z.ZodEnum<["createdAt", "updatedAt", "title", "startTime"]>>;
    order: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    limit?: number;
    search?: string;
    isPublished?: boolean;
    sortBy?: "createdAt" | "updatedAt" | "title" | "startTime";
    page?: number;
    order?: "asc" | "desc";
}, {
    type?: "custom" | "practice" | "official" | "timed";
    status?: "completed" | "draft" | "active" | "cancelled";
    limit?: number;
    search?: string;
    isPublished?: boolean;
    sortBy?: "createdAt" | "updatedAt" | "title" | "startTime";
    page?: number;
    order?: "asc" | "desc";
}>;
/**
 * Validation schema for exam result queries
 */
export declare const ExamResultQuerySchema: z.ZodObject<{
    examId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    includeAnswers: z.ZodOptional<z.ZodBoolean>;
    includeStatistics: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId?: string;
    examId?: string;
    includeAnswers?: boolean;
    includeStatistics?: boolean;
}, {
    userId?: string;
    examId?: string;
    includeAnswers?: boolean;
    includeStatistics?: boolean;
}>;
export declare const validateTestExamCreation: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTestExamUpdate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateExamSession: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateExamSubmission: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateExamFilter: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateExamResultQuery: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateDifficultyDistribution: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateExamTimeConstraints: (req: Request, res: Response, next: NextFunction) => void;
export type CreateTestExamType = z.infer<typeof CreateTestExamSchema>;
export type UpdateTestExamType = z.infer<typeof UpdateTestExamSchema>;
export type TestExamParamsType = z.infer<typeof TestExamParamsSchema>;
export type ExamSessionType = z.infer<typeof ExamSessionSchema>;
export type ExamSubmissionType = z.infer<typeof ExamSubmissionSchema>;
export type ExamFilterType = z.infer<typeof ExamFilterSchema>;
export type ExamResultQueryType = z.infer<typeof ExamResultQuerySchema>;
export type ExamConfigurationType = z.infer<typeof ExamConfigurationSchema>;
export type DifficultyDistributionType = z.infer<typeof DifficultyDistributionSchema>;
export { EXAM_TYPES, EXAM_STATUSES };
