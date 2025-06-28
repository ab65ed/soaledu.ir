/**
 * Course Exam Types & Interfaces
 * انواع و رابط‌های مربوط به درس-آزمون
 */

import { z } from 'zod';

// ===============================
// Basic Types & Enums
// ===============================

export const COURSE_TYPES = [
  'mathematics', 'physics', 'chemistry', 'biology',
  'history', 'geography', 'literature', 'english', 'arabic', 'other'
] as const;

export const GRADES = [
  'elementary-1', 'elementary-2', 'elementary-3', 'elementary-4', 'elementary-5', 'elementary-6',
  'middle-school-1', 'middle-school-2', 'middle-school-3',
  'high-school-1', 'high-school-2', 'high-school-3', 'high-school-4',
  'high-school-10', 'high-school-11', 'high-school-12',
  'university', 'konkur'
] as const;

export const GROUPS = [
  'theoretical', 'mathematical', 'experimental', 'technical', 'art', 'other'
] as const;

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export type CourseType = typeof COURSE_TYPES[number];
export type Grade = typeof GRADES[number];
export type Group = typeof GROUPS[number];
export type Difficulty = typeof DIFFICULTIES[number];

export const QUESTION_TYPES = ['multiple-choice', 'true-false', 'short-answer', 'essay'] as const;
export type QuestionType = typeof QUESTION_TYPES[number];

// ===============================
// Validation Schemas
// ===============================

export const CourseExamStepSchema = z.object({
  // Step 1: Course Type
  courseType: z.enum(COURSE_TYPES, {
    errorMap: () => ({ message: 'نوع درس الزامی است' })
  }),
  
  // Step 2: Grade
  grade: z.enum(GRADES, {
    errorMap: () => ({ message: 'مقطع الزامی است' })
  }),
  
  // Step 3: Group
  group: z.enum(GROUPS, {
    errorMap: () => ({ message: 'گروه الزامی است' })
  }),
  
  // Step 4: Details
  title: z.string()
    .min(3, 'عنوان باید حداقل 3 کاراکتر باشد')
    .max(200, 'عنوان حداکثر 200 کاراکتر'),
  
  description: z.string()
    .min(10, 'توضیحات باید حداقل 10 کاراکتر باشد')
    .max(2000, 'توضیحات حداکثر 2000 کاراکتر'),
  
  tags: z.array(z.string()).optional(),
  
  difficulty: z.enum(DIFFICULTIES).optional(),
  
  estimatedTime: z.number()
    .min(1, 'زمان تخمینی باید حداقل 1 دقیقه باشد')
    .max(480, 'زمان تخمینی حداکثر 480 دقیقه')
    .optional(),
  
  price: z.number()
    .min(0, 'قیمت نمی‌تواند منفی باشد')
    .max(1000000, 'قیمت حداکثر 1,000,000 تومان')
    .optional(),
  
  // Step 5: Questions
  selectedQuestions: z.array(z.string()).min(1, 'حداقل یک سوال باید انتخاب شود'),
});

export type CourseExamFormData = z.infer<typeof CourseExamStepSchema>;

// ===============================
// Interfaces
// ===============================

export interface CourseExamStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  tags: string[];
  courseType: CourseType;
  grade: Grade;
  group: Group;
  points: number;
  estimatedTime: number;
  isSelected?: boolean;
  options?: string[];
}

export interface CourseExam {
  id: string;
  title: string;
  courseType: CourseType;
  grade: Grade;
  group: Group;
  description: string;
  tags: string[];
  difficulty?: Difficulty;
  estimatedTime?: number;
  price: number;
  questionCount: number;
  isPublished: boolean;
  isDraft: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFilters {
  courseType?: CourseType;
  grade?: Grade;
  group?: Group;
  difficulty?: Difficulty;
  questionType?: QuestionType;
  search?: string;
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
  maxTime?: number;
  limit?: number;
  skip?: number;
}

// ===============================
// Form State Management
// ===============================

export interface CourseExamFormState {
  currentStep: number;
  formData: Partial<CourseExamFormData>;
  isSubmitting: boolean;
  errors: Record<string, string>;
  progress: number;
}

// ===============================
// API Response Types
// ===============================

export interface CourseExamResponse {
  success: boolean;
  data?: CourseExam;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface QuestionsResponse {
  success: boolean;
  data?: {
    questions: Question[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  };
  message: string;
}

// ===============================
// A/B Testing Types
// ===============================

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trafficPercentage: number;
}

export interface QuestionSelectorConfig {
  variant: 'full' | 'summary';
  showDifficulty: boolean;
  showTags: boolean;
  showPreview: boolean;
  enableVirtualization: boolean;
}

// ===============================
// Performance & Analytics
// ===============================

export interface PerformanceMetrics {
  formLoadTime: number;
  stepTransitionTime: number;
  questionLoadTime: number;
  submitTime: number;
  errorCount: number;
  userInteractions: number;
}

export interface CourseExamAnalytics {
  formStarted: number;
  formCompleted: number;
  conversionRate: number;
  averageCompletionTime: number;
  dropOffByStep: Record<number, number>;
  popularCombinations: Array<{
    courseType: CourseType;
    grade: Grade;
    group: Group;
    count: number;
  }>;
}

// ===============================
// Constants & Labels
// ===============================

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  mathematics: 'ریاضی',
  physics: 'فیزیک',
  chemistry: 'شیمی',
  biology: 'زیست‌شناسی',
  history: 'تاریخ',
  geography: 'جغرافیا',
  literature: 'ادبیات',
  english: 'انگلیسی',
  arabic: 'عربی',
  other: 'سایر',
  'essay': 'تشریحی'
};

export const GRADE_LABELS: Record<Grade, string> = {
  'elementary-1': 'اول ابتدایی',
  'elementary-2': 'دوم ابتدایی',
  'elementary-3': 'سوم ابتدایی',
  'elementary-4': 'چهارم ابتدایی',
  'elementary-5': 'پنجم ابتدایی',
  'elementary-6': 'ششم ابتدایی',
  'middle-school-1': 'هفتم',
  'middle-school-2': 'هشتم',
  'middle-school-3': 'نهم',
  'high-school-1': 'دهم',
  'high-school-2': 'یازدهم',
  'high-school-3': 'دوازدهم',
  'high-school-4': 'چهاردهم',
  'high-school-10': 'دهم',
  'high-school-11': 'یازدهم',
  'high-school-12': 'دوازدهم',
  university: 'دانشگاه',
  konkur: 'کنکور'
};

export const GROUP_LABELS: Record<Group, string> = {
  theoretical: 'نظری',
  mathematical: 'ریاضی',
  experimental: 'تجربی',
  technical: 'فنی',
  art: 'هنر',
  other: 'سایر'
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت'
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'multiple-choice': 'چند گزینه‌ای',
  'true-false': 'صحیح/غلط',
  'short-answer': 'پاسخ کوتاه',
  'essay': 'تشریحی'
};

// Academic Redesign Types

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  phone?: string;
  avatar?: string;
}

export interface BasicInfo {
  title: string;
  description: string;
  duration: string;
  category: string;
}

export interface ExamSettings {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allowRetake: boolean;
  showResults: boolean;
  randomizeQuestions: boolean;
  requirePassword: boolean;
  examPassword?: string;
  maxAttempts: number;
}

export interface CourseExam {
  id?: string;
  basicInfo: BasicInfo;
  participants: Participant[];
  settings: ExamSettings;
  createdAt?: Date;
  updatedAt?: Date;
  status: 'draft' | 'published' | 'archived';
}

export interface ExamStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  isCompleted: boolean;
  isActive: boolean;
}

export type ExamFormData = {
  basicInfo: BasicInfo;
  participants: string[];
  settings: ExamSettings;
}; 