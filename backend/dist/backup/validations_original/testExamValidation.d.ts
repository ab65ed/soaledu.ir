declare const body: any, query: any, param: any;
/**
 * Test Exam Validation Rules
 * قوانین اعتبارسنجی برای آزمون‌های تستی
 *
 * ویژگی‌های اصلی:
 * - اعتبارسنجی ایجاد و ویرایش آزمون
 * - اعتبارسنجی تنظیمات آزمون
 * - اعتبارسنجی توزیع سختی سوالات
 * - پیام‌های خطا به فارسی
 */
declare const EXAM_TYPES: string[];
declare const EXAM_STATUSES: string[];
/**
 * Validation for creating a new test exam
 */
declare const validateTestExamCreation: any[];
/**
 * Validation for updating a test exam
 */
declare const validateTestExamUpdate: any[];
/**
 * Validation for exam configuration
 */
declare const validateExamConfiguration: any[];
/**
 * Validation for exam session answer submission
 */
declare const validateAnswerSubmission: any[];
/**
 * Validation for exam listing queries
 */
declare const validateExamListQuery: any[];
/**
 * Validation for exam ID parameter
 */
declare const validateExamId: any[];
/**
 * Validation for session ID parameter
 */
declare const validateSessionId: any[];
/**
 * Custom validation middleware for difficulty distribution
 */
declare const validateDifficultyDistribution: (req: any, res: any, next: any) => any;
/**
 * Custom validation middleware for exam time constraints
 */
declare const validateExamTimeConstraints: (req: any, res: any, next: any) => any;
