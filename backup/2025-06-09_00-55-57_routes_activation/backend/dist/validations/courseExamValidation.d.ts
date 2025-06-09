/**
 * Course Exam validation middleware with Zod
 *
 * This file contains validation schemas and middleware for course exam-related requests
 * using Zod with Persian error messages.
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
declare const COURSE_TYPES: readonly ["mathematics", "physics", "chemistry", "biology", "history", "geography", "literature", "english", "arabic", "other"];
declare const GRADES: readonly ["elementary-1", "elementary-2", "elementary-3", "elementary-4", "elementary-5", "elementary-6", "middle-school-1", "middle-school-2", "middle-school-3", "high-school-1", "high-school-2", "high-school-3", "high-school-4", "high-school-10", "high-school-11", "high-school-12", "university", "konkur"];
declare const GROUPS: readonly ["theoretical", "mathematical", "experimental", "technical", "art", "other"];
declare const DIFFICULTIES: readonly ["easy", "medium", "hard"];
/**
 * Validation schema for creating a course exam
 */
export declare const CreateCourseExamSchema: z.ZodObject<{
    title: z.ZodString;
    courseType: z.ZodEnum<["mathematics", "physics", "chemistry", "biology", "history", "geography", "literature", "english", "arabic", "other"]>;
    grade: z.ZodEnum<["elementary-1", "elementary-2", "elementary-3", "elementary-4", "elementary-5", "elementary-6", "middle-school-1", "middle-school-2", "middle-school-3", "high-school-1", "high-school-2", "high-school-3", "high-school-4", "high-school-10", "high-school-11", "high-school-12", "university", "konkur"]>;
    group: z.ZodEnum<["theoretical", "mathematical", "experimental", "technical", "art", "other"]>;
    description: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    estimatedTime: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    chapters: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string;
    tags?: string[];
    difficulty?: "medium" | "easy" | "hard";
    isPublished?: boolean;
    description?: string;
    price?: number;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
    estimatedTime?: number;
    chapters?: string[];
}, {
    title?: string;
    tags?: string[];
    difficulty?: "medium" | "easy" | "hard";
    isPublished?: boolean;
    description?: string;
    price?: number;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
    estimatedTime?: number;
    chapters?: string[];
}>;
/**
 * Validation schema for updating a course exam
 */
export declare const UpdateCourseExamSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    courseType: z.ZodOptional<z.ZodEnum<["mathematics", "physics", "chemistry", "biology", "history", "geography", "literature", "english", "arabic", "other"]>>;
    grade: z.ZodOptional<z.ZodEnum<["elementary-1", "elementary-2", "elementary-3", "elementary-4", "elementary-5", "elementary-6", "middle-school-1", "middle-school-2", "middle-school-3", "high-school-1", "high-school-2", "high-school-3", "high-school-4", "high-school-10", "high-school-11", "high-school-12", "university", "konkur"]>>;
    group: z.ZodOptional<z.ZodEnum<["theoretical", "mathematical", "experimental", "technical", "art", "other"]>>;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    estimatedTime: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    chapters: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string;
    tags?: string[];
    difficulty?: "medium" | "easy" | "hard";
    isPublished?: boolean;
    description?: string;
    price?: number;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
    estimatedTime?: number;
    chapters?: string[];
}, {
    title?: string;
    tags?: string[];
    difficulty?: "medium" | "easy" | "hard";
    isPublished?: boolean;
    description?: string;
    price?: number;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
    estimatedTime?: number;
    chapters?: string[];
}>;
/**
 * Validation schema for course exam parameters (ID validation)
 */
export declare const CourseExamParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: string;
}, {
    id?: string;
}>;
/**
 * Validation schema for rating a course exam
 */
export declare const RatingSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rating?: number;
    comment?: string;
}, {
    rating?: number;
    comment?: string;
}>;
/**
 * Validation schema for auto-save progress
 */
export declare const AutoSaveSchema: z.ZodObject<{
    progress: z.ZodNumber;
    lastQuestionIndex: z.ZodOptional<z.ZodNumber>;
    answers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timeSpent: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    answers?: Record<string, any>;
    timeSpent?: number;
    progress?: number;
    lastQuestionIndex?: number;
}, {
    answers?: Record<string, any>;
    timeSpent?: number;
    progress?: number;
    lastQuestionIndex?: number;
}>;
/**
 * Validation schema for search queries
 */
export declare const SearchQuerySchema: z.ZodEffects<z.ZodObject<{
    q: z.ZodString;
    courseType: z.ZodOptional<z.ZodEnum<["mathematics", "physics", "chemistry", "biology", "history", "geography", "literature", "english", "arabic", "other"]>>;
    grade: z.ZodOptional<z.ZodEnum<["elementary-1", "elementary-2", "elementary-3", "elementary-4", "elementary-5", "elementary-6", "middle-school-1", "middle-school-2", "middle-school-3", "high-school-1", "high-school-2", "high-school-3", "high-school-4", "high-school-10", "high-school-11", "high-school-12", "university", "konkur"]>>;
    group: z.ZodOptional<z.ZodEnum<["theoretical", "mathematical", "experimental", "technical", "art", "other"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodEffects<z.ZodString, string[], string>>;
}, "strip", z.ZodTypeAny, {
    tags?: string[];
    difficulty?: "medium" | "easy" | "hard";
    q?: string;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    minPrice?: number;
    maxPrice?: number;
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
}, {
    tags?: string;
    difficulty?: "medium" | "easy" | "hard";
    q?: string;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    minPrice?: number;
    maxPrice?: number;
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
}>, {
    tags?: string[];
    difficulty?: "medium" | "easy" | "hard";
    q?: string;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    minPrice?: number;
    maxPrice?: number;
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
}, {
    tags?: string;
    difficulty?: "medium" | "easy" | "hard";
    q?: string;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    minPrice?: number;
    maxPrice?: number;
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
}>;
/**
 * Validation schema for listing queries
 */
export declare const ListQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    sortBy: z.ZodOptional<z.ZodEnum<["createdAt", "updatedAt", "title", "price", "rating"]>>;
    order: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    courseType: z.ZodOptional<z.ZodEnum<["mathematics", "physics", "chemistry", "biology", "history", "geography", "literature", "english", "arabic", "other"]>>;
    grade: z.ZodOptional<z.ZodEnum<["elementary-1", "elementary-2", "elementary-3", "elementary-4", "elementary-5", "elementary-6", "middle-school-1", "middle-school-2", "middle-school-3", "high-school-1", "high-school-2", "high-school-3", "high-school-4", "high-school-10", "high-school-11", "high-school-12", "university", "konkur"]>>;
    group: z.ZodOptional<z.ZodEnum<["theoretical", "mathematical", "experimental", "technical", "art", "other"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    page?: number;
    limit?: number;
    difficulty?: "medium" | "easy" | "hard";
    sortBy?: "title" | "createdAt" | "rating" | "price" | "updatedAt";
    isPublished?: boolean;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    order?: "asc" | "desc";
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
}, {
    page?: number;
    limit?: number;
    difficulty?: "medium" | "easy" | "hard";
    sortBy?: "title" | "createdAt" | "rating" | "price" | "updatedAt";
    isPublished?: boolean;
    grade?: "elementary-1" | "elementary-2" | "elementary-3" | "elementary-4" | "elementary-5" | "elementary-6" | "middle-school-1" | "middle-school-2" | "middle-school-3" | "high-school-1" | "high-school-2" | "high-school-3" | "high-school-4" | "high-school-10" | "high-school-11" | "high-school-12" | "university" | "konkur";
    order?: "asc" | "desc";
    courseType?: "other" | "history" | "mathematics" | "physics" | "chemistry" | "biology" | "geography" | "literature" | "english" | "arabic";
    group?: "other" | "technical" | "theoretical" | "mathematical" | "experimental" | "art";
}>;
export declare const validateCourseExam: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCourseExamUpdate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRating: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateAutoSave: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateSearchQuery: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateListQuery: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCourseExamPublishing: (courseExamId: string) => Promise<{
    isValid: boolean;
    errors: string[];
}>;
export declare const validateQuestionDifficultyDistribution: (questions: any[]) => {
    isValid: boolean;
    errors: string[];
};
export type CreateCourseExamType = z.infer<typeof CreateCourseExamSchema>;
export type UpdateCourseExamType = z.infer<typeof UpdateCourseExamSchema>;
export type CourseExamParamsType = z.infer<typeof CourseExamParamsSchema>;
export type RatingType = z.infer<typeof RatingSchema>;
export type AutoSaveType = z.infer<typeof AutoSaveSchema>;
export type SearchQueryType = z.infer<typeof SearchQuerySchema>;
export type ListQueryType = z.infer<typeof ListQuerySchema>;
export { COURSE_TYPES, GRADES, GROUPS, DIFFICULTIES };
