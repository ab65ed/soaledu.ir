/**
 * Test Exam Types and Interfaces
 * تایپ‌ها و رابط‌های مشترک برای آزمون‌های تستی
 */
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: any;
}
export interface ValidationErrorItem {
    type: string;
    value: any;
    msg: string;
    path: string;
    location: string;
}
export type { TestExamData, TestExamSessionData, TestExamResultData, PersonalizationConfig, ExamAnalyticsData, QuestionDifficulty, ExamAnswer } from '../../models/test-exam';
export { DEFAULT_EXAM_CONFIG, validateDifficultyDistribution, validatePersonalizationConfig, calculateExamScore, generateLearningPath, getQuestionPoints, TestExamStatus, SessionStatus, ResultStatus } from '../../models/test-exam';
