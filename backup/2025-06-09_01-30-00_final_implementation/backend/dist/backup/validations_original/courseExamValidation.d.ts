declare const Joi: any;
declare const COURSE_TYPES: string[];
declare const GRADES: string[];
declare const GROUPS: string[];
declare const DIFFICULTIES: string[];
/**
 * Validation schema for creating a course exam
 */
declare const createCourseExamSchema: any;
/**
 * Validation schema for updating a course exam
 */
declare const updateCourseExamSchema: any;
/**
 * Validation schema for rating
 */
declare const ratingSchema: any;
/**
 * Validation schema for auto-save
 */
declare const autoSaveSchema: any;
/**
 * Validation schema for search query parameters
 */
declare const searchQuerySchema: any;
/**
 * Validation schema for list query parameters
 */
declare const listQuerySchema: any;
/**
 * Validation for publishing course exam
 */
declare const publishCourseExamSchema: any;
/**
 * Custom validation function for course exam publishing
 * Requirements:
 * - Minimum 40 questions for non-flashcard courses
 * - Minimum 10 questions for flashcard-only courses
 * - Proper difficulty distribution (max 20% easy, max 40% medium, rest hard)
 */
declare const validateCourseExamPublishing: (courseExamId: string) => Promise<{
    isValid: boolean;
    errors: string[];
    questionStats?: undefined;
} | {
    isValid: boolean;
    errors: any[];
    questionStats: {
        total: any;
        easy: any;
        medium: any;
        hard: any;
        isFlashcardOnly: any;
    };
}>;
/**
 * Validation for question difficulty distribution
 */
declare const validateQuestionDifficultyDistribution: (questions: any[]) => {
    isValid: boolean;
    errors: any[];
    warnings: any[];
    stats?: undefined;
} | {
    isValid: boolean;
    errors: any[];
    warnings: any[];
    stats: {
        total: number;
        easy: {
            count: number;
            percentage: number;
        };
        medium: {
            count: number;
            percentage: number;
        };
        hard: {
            count: number;
            percentage: number;
        };
    };
};
/**
 * Middleware functions for validation
 */
declare const validateCourseExam: (req: any, res: any, next: any) => any;
declare const validateCourseExamUpdate: (req: any, res: any, next: any) => any;
declare const validateRating: (req: any, res: any, next: any) => any;
declare const validateAutoSave: (req: any, res: any, next: any) => any;
declare const validateSearchQuery: (req: any, res: any, next: any) => any;
declare const validateListQuery: (req: any, res: any, next: any) => any;
