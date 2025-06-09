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

import Parse from 'parse/node';

// Enums
export enum TestExamStatus {
  DRAFT = 'draft',
  ACTIVE = 'active', 
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TestExamType {
  PRACTICE = 'practice',
  OFFICIAL = 'official',
  TIMED = 'timed',
  CUSTOM = 'custom'
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium', 
  HARD = 'hard'
}

export enum SessionStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum ResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending'
}

// Core Interfaces
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
  timeLimit?: number; // در دقیقه
  categories: string[];
  tags: string[];
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  showHints: boolean;
  passingScore: number; // درصد
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
    }
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
  question: any; // Question object
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
  timeDistribution: number[]; // زمان صرف شده برای هر سوال
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
    }
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
    efficiency: number; // نسبت سرعت به دقت
  };
  performanceMetrics: {
    accuracy: number;
    speed: number; // سوال در دقیقه
    consistency: number; // واریانس در عملکرد
    improvement: number; // نسبت به آزمون‌های قبلی
    ranking?: number;
    percentile?: number;
  };
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

// Default configurations
export const DEFAULT_DIFFICULTY_DISTRIBUTION: DifficultyDistribution = {
  easy: 10,
  medium: 15,
  hard: 15
};

export const DEFAULT_EXAM_CONFIG: TestExamConfiguration = {
  totalQuestions: 40,
  difficultyDistribution: DEFAULT_DIFFICULTY_DISTRIBUTION,
  timeLimit: 60, // 60 دقیقه
  categories: [],
  tags: [],
  allowReview: true,
  shuffleQuestions: true,
  shuffleOptions: true,
  showResults: true,
  showHints: false,
  passingScore: 70
};

// Validation functions
export const validateDifficultyDistribution = (distribution: DifficultyDistribution): boolean => {
  const total = distribution.easy + distribution.medium + distribution.hard;
  return total === 40 && 
         distribution.easy >= 0 && 
         distribution.medium >= 0 && 
         distribution.hard >= 0;
};

export const validatePersonalizationConfig = (config: PersonalizationConfig): boolean => {
  if (config.totalQuestions && (config.totalQuestions < 10 || config.totalQuestions > 50)) {
    return false;
  }
  
  if (config.difficultyDistribution) {
    const total = (config.difficultyDistribution.easy || 0) + 
                  (config.difficultyDistribution.medium || 0) + 
                  (config.difficultyDistribution.hard || 0);
    if (total > 0 && total !== (config.totalQuestions || 40)) {
      return false;
    }
  }
  
  if (config.timeLimit && (config.timeLimit < 5 || config.timeLimit > 180)) {
    return false;
  }
  
  return true;
};

// Utility functions
export const calculateExamScore = (answers: ExamAnswer[], questions: QuestionItem[]): number => {
  let totalScore = 0;
  let maxScore = 0;
  
  questions.forEach(question => {
    const answer = answers.find(a => a.questionId === question.questionId);
    const questionPoints = getQuestionPoints(question.difficulty);
    maxScore += questionPoints;
    
    if (answer && answer.isCorrect) {
      totalScore += answer.points || questionPoints;
    }
  });
  
  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
};

export const getQuestionPoints = (difficulty: QuestionDifficulty): number => {
  switch (difficulty) {
    case QuestionDifficulty.EASY:
      return 1;
    case QuestionDifficulty.MEDIUM:
      return 2;
    case QuestionDifficulty.HARD:
      return 3;
    default:
      return 1;
  }
};

export const generateLearningPath = (result: TestExamResultData): LearningPathData => {
  const analytics = result.analytics;
  const weakAreas: string[] = [];
  const strengthAreas: string[] = [];
  const recommendedTopics: string[] = [];
  
  // تحلیل نقاط ضعف و قوت
  Object.entries(analytics.categoryBreakdown).forEach(([category, stats]) => {
    if (stats.percentage < 60) {
      weakAreas.push(category);
      recommendedTopics.push(`مرور مجدد ${category}`);
    } else if (stats.percentage > 80) {
      strengthAreas.push(category);
    }
  });
  
  // تحلیل سختی سوالات
  Object.entries(analytics.difficultyBreakdown).forEach(([difficulty, stats]) => {
    if (stats.percentage < 50) {
      recommendedTopics.push(`تمرین بیشتر سوالات ${difficulty === 'easy' ? 'آسان' : difficulty === 'medium' ? 'متوسط' : 'سخت'}`);
    }
  });
  
  const nextSteps = [
    'مرور مجدد موضوعات ضعیف',
    'حل تمرین‌های بیشتر',
    'مطالعه منابع اضافی',
    'شرکت در آزمون‌های مشابه'
  ];
  
  const progressPercentage = Math.min(100, result.percentage + 10);
  
  const milestones = [
    {
      id: '1',
      title: 'تکمیل اولین آزمون',
      description: 'شرکت در اولین آزمون تستی',
      completed: true,
      completedAt: new Date()
    },
    {
      id: '2', 
      title: 'کسب حداقل 70% نمره',
      description: 'رسیدن به حد قبولی',
      completed: result.percentage >= 70,
      completedAt: result.percentage >= 70 ? new Date() : undefined
    },
    {
      id: '3',
      title: 'کسب 90% نمره',
      description: 'رسیدن به سطح عالی',
      completed: result.percentage >= 90,
      completedAt: result.percentage >= 90 ? new Date() : undefined
    }
  ];
  
  return {
    recommendedTopics,
    weakAreas,
    strengthAreas,
    nextSteps,
    progressPercentage,
    milestones
  };
};

export const formatExamDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours} ساعت و ${minutes} دقیقه`;
  }
  if (minutes > 0) {
    return `${minutes} دقیقه و ${remainingSeconds} ثانیه`;
  }
  return `${remainingSeconds} ثانیه`;
};

export const getStatusLabel = (status: TestExamStatus): string => {
  switch (status) {
    case TestExamStatus.DRAFT:
      return 'پیش‌نویس';
    case TestExamStatus.ACTIVE:
      return 'فعال';
    case TestExamStatus.COMPLETED:
      return 'تکمیل شده';
    case TestExamStatus.CANCELLED:
      return 'لغو شده';
    default:
      return 'نامشخص';
  }
};

export const getTypeLabel = (type: TestExamType): string => {
  switch (type) {
    case TestExamType.PRACTICE:
      return 'تمرینی';
    case TestExamType.OFFICIAL:
      return 'رسمی';
    case TestExamType.TIMED:
      return 'زمان‌دار';
    case TestExamType.CUSTOM:
      return 'سفارشی';
    default:
      return 'نامشخص';
  }
};

export const getDifficultyLabel = (difficulty: QuestionDifficulty): string => {
  switch (difficulty) {
    case QuestionDifficulty.EASY:
      return 'آسان';
    case QuestionDifficulty.MEDIUM:
      return 'متوسط';
    case QuestionDifficulty.HARD:
      return 'سخت';
    default:
      return 'نامشخص';
  }
}; 