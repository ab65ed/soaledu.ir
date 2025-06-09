/**
 * Optimized Database Indexes
 *
 * تعریف ایندکس‌های بهینه‌سازی شده برای بهبود عملکرد کوئری‌ها
 */
import { DatabaseIndex, OptimizationSuggestion } from './scalability';
export declare const COURSE_EXAM_INDEXES: DatabaseIndex[];
export declare const QUESTION_INDEXES: DatabaseIndex[];
export declare const TEST_EXAM_INDEXES: DatabaseIndex[];
export declare const AB_TEST_INDEXES: DatabaseIndex[];
export declare const OPTIMIZATION_SUGGESTIONS: OptimizationSuggestion[];
export declare const applyOptimizedIndexes: () => Promise<void>;
export declare const monitorIndexPerformance: () => Promise<void>;
