/**
 * Test Exam TypeScript Model
 * مدل TypeScript آزمون تستی
 *
 * ویژگی‌های اصلی:
 * - 40 سوال با توزیع سختی (10 آسان، 15 متوسط، 15 سخت)
 * - شخصی‌سازی تعداد/سطح
 * - مدیریت جلسات آزمون
 * - محاسبه نتایج و تحلیل گرافیکی
 * - مسیر یادگیری
 *
 * @author Exam-Edu Platform
 * @version 1.0.0
 */
export declare enum TestExamStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum TestExamType {
    PRACTICE = "practice",
    OFFICIAL = "official",
    TIMED = "timed",
    CUSTOM = "custom"
}
export declare enum QuestionDifficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export declare enum SessionStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
export declare enum ResultStatus {
    PASSED = "passed",
    FAILED = "failed",
    PENDING = "pending"
}
export interface DifficultyDistribution {
    easy: number;
    medium: number;
    hard: number;
}
export interface PersonalizationConfig {
    totalQuestions?: number;
    difficultyDistribution?: Partial<DifficultyDistribution>;
    categories?: string[];
    tags?: string[];
    timeLimit?: number;
    showHints?: boolean;
    allowReview?: boolean;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
}
export interface TestExamConfiguration {
    totalQuestions: number;
    difficultyDistribution: DifficultyDistribution;
    timeLimit?: number;
    categories: string[];
    tags: string[];
    allowReview: boolean;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResults: boolean;
    showHints: boolean;
    passingScore: number;
    personalization?: PersonalizationConfig;
}
export interface TestExamMetadata {
    version: number;
    lastModified: Date;
    participantCount: number;
    averageScore: number;
    passRate: number;
    difficultyStats: {
        [key in QuestionDifficulty]: {
            averageScore: number;
            attemptCount: number;
        };
    };
    categoryStats: Record<string, {
        averageScore: number;
        attemptCount: number;
    }>;
    learningPath?: LearningPathData;
}
export interface LearningPathData {
    recommendedTopics: string[];
    weakAreas: string[];
    strengthAreas: string[];
    nextSteps: string[];
    progressPercentage: number;
    milestones: {
        id: string;
        title: string;
        description: string;
        completed: boolean;
        completedAt?: Date;
    }[];
}
export interface QuestionItem {
    questionId: string;
    question: any;
    difficulty: QuestionDifficulty;
    category: string;
    tags: string[];
    order: number;
}
export interface TestExamData {
    id?: string;
    title: string;
    description?: string;
    type: TestExamType;
    status: TestExamStatus;
    configuration: TestExamConfiguration;
    questions: QuestionItem[];
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;
    startTime?: Date;
    endTime?: Date;
    isPublished: boolean;
    metadata: TestExamMetadata;
}
export interface TestExamSessionData {
    id?: string;
    examId: string;
    participantId: string;
    status: SessionStatus;
    startTime: Date;
    endTime?: Date;
    timeRemaining?: number;
    currentQuestionIndex: number;
    answers: Record<string, ExamAnswer>;
    score?: number;
    percentage?: number;
    resultStatus?: ResultStatus;
    metadata: SessionMetadata;
}
export interface ExamAnswer {
    questionId: string;
    selectedOptions?: number[];
    textAnswer?: string;
    timeSpent: number;
    isCorrect?: boolean;
    points?: number;
    answeredAt: Date;
    reviewMarked?: boolean;
}
export interface SessionMetadata {
    timeSpent: number;
    questionsVisited: number;
    questionsAnswered: number;
    questionsMarkedForReview: number;
    timeDistribution: number[];
    deviceInfo?: string;
    ipAddress?: string;
    pauseCount?: number;
    pauseDuration?: number;
}
export interface TestExamResultData {
    id?: string;
    sessionId: string;
    examId: string;
    participantId: string;
    score: number;
    percentage: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    timeSpent: number;
    resultStatus: ResultStatus;
    detailedResults: QuestionResultData[];
    analytics: ExamAnalyticsData;
    learningPath: LearningPathData;
    createdAt: Date;
}
export interface QuestionResultData {
    questionId: string;
    userAnswer: ExamAnswer;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
    timeSpent: number;
    difficulty: QuestionDifficulty;
    category: string;
    tags: string[];
    explanation?: string;
}
export interface ExamAnalyticsData {
    difficultyBreakdown: {
        [key in QuestionDifficulty]: {
            total: number;
            correct: number;
            percentage: number;
            averageTime: number;
        };
    };
    categoryBreakdown: Record<string, {
        total: number;
        correct: number;
        percentage: number;
        averageTime: number;
    }>;
    typeBreakdown: Record<string, {
        total: number;
        correct: number;
        percentage: number;
    }>;
    timeAnalysis: {
        totalTime: number;
        averageTimePerQuestion: number;
        fastestQuestion: number;
        slowestQuestion: number;
        timeDistribution: number[];
        efficiency: number;
    };
    performanceMetrics: {
        accuracy: number;
        speed: number;
        consistency: number;
        improvement: number;
        ranking?: number;
        percentile?: number;
    };
    strengthsAndWeaknesses: {
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
    };
}
export declare const DEFAULT_DIFFICULTY_DISTRIBUTION: DifficultyDistribution;
export declare const DEFAULT_EXAM_CONFIG: TestExamConfiguration;
export declare const validateDifficultyDistribution: (distribution: DifficultyDistribution) => boolean;
export declare const validatePersonalizationConfig: (config: PersonalizationConfig) => boolean;
export declare const calculateExamScore: (answers: ExamAnswer[], questions: QuestionItem[]) => number;
export declare const getQuestionPoints: (difficulty: QuestionDifficulty) => number;
export declare const generateLearningPath: (result: TestExamResultData) => LearningPathData;
export declare const formatExamDuration: (seconds: number) => string;
export declare const getStatusLabel: (status: TestExamStatus) => string;
export declare const getTypeLabel: (type: TestExamType) => string;
export declare const getDifficultyLabel: (difficulty: QuestionDifficulty) => string;
