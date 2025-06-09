/**
 * Flashcard Models and Types
 * مدل‌ها و انواع فلش‌کارت
 * 
 * این فایل شامل تعاریف TypeScript برای سیستم فلش‌کارت است
 */

export enum FlashcardDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum FlashcardStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum AccessType {
  PURCHASE = 'purchase',
  SUBSCRIPTION = 'subscription',
  FREE = 'free'
}

export enum FlashcardFormat {
  BASIC = 'basic',
  CLOZE = 'cloze',
  IMAGE = 'image',
  AUDIO = 'audio'
}

export interface FlashcardBase {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  category: string;
  subcategory?: string;
  difficulty: FlashcardDifficulty;
  tags: string[];
  format: FlashcardFormat;
  status: FlashcardStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Flashcard extends FlashcardBase {
  sourceQuestionId?: string;
  isPublic: boolean;
  price: number;
  downloadCount: number;
  viewCount: number;
  likeCount: number;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
  estimatedStudyTime: number; // in minutes
  lastStudied?: Date;
  studyCount: number;
  correctCount: number;
  incorrectCount: number;
  averageResponseTime: number; // in seconds
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  flashcards: string[]; // Array of flashcard IDs
  category: string;
  subcategory?: string;
  totalPrice: number;
  discountPercentage?: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  downloadCount: number;
  tags: string[];
  estimatedStudyTime: number;
  difficulty: FlashcardDifficulty;
  status: FlashcardStatus;
}

export interface UserFlashcardAccess {
  id: string;
  userId: string;
  flashcardId?: string;
  flashcardSetId?: string;
  accessType: AccessType;
  purchaseDate: Date;
  expiryDate?: Date;
  transactionId?: string;
  price: number;
  isActive: boolean;
}

export interface FlashcardStudySession {
  id: string;
  userId: string;
  flashcardId: string;
  startTime: Date;
  endTime?: Date;
  responseTime: number; // in seconds
  isCorrect: boolean;
  difficulty: number; // 1-5 scale
  notes?: string;
}

export interface FlashcardStats {
  totalFlashcards: number;
  totalSets: number;
  totalStudySessions: number;
  averageAccuracy: number;
  totalStudyTime: number;
  streakDays: number;
  lastStudyDate?: Date;
  categoryStats: CategoryStats[];
  difficultyStats: DifficultyStats[];
  weeklyProgress: WeeklyProgress[];
}

export interface CategoryStats {
  category: string;
  totalFlashcards: number;
  accuracy: number;
  averageResponseTime: number;
  studyTime: number;
}

export interface DifficultyStats {
  difficulty: FlashcardDifficulty;
  totalFlashcards: number;
  accuracy: number;
  averageResponseTime: number;
}

export interface WeeklyProgress {
  week: string;
  studySessions: number;
  accuracy: number;
  studyTime: number;
}

export interface FlashcardCreateData {
  question: string;
  answer: string;
  explanation?: string;
  category: string;
  subcategory?: string;
  difficulty: FlashcardDifficulty;
  tags: string[];
  format: FlashcardFormat;
  isPublic: boolean;
  price?: number;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
  estimatedStudyTime?: number;
  sourceQuestionId?: string;
}

export interface FlashcardUpdateData {
  question?: string;
  answer?: string;
  explanation?: string;
  category?: string;
  subcategory?: string;
  difficulty?: FlashcardDifficulty;
  tags?: string[];
  format?: FlashcardFormat;
  isPublic?: boolean;
  price?: number;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
  estimatedStudyTime?: number;
  status?: FlashcardStatus;
}

export interface FlashcardSetCreateData {
  title: string;
  description: string;
  flashcards: string[];
  category: string;
  subcategory?: string;
  isPublic: boolean;
  tags: string[];
  discountPercentage?: number;
}

export interface FlashcardFilters {
  category?: string;
  subcategory?: string;
  difficulty?: FlashcardDifficulty;
  format?: FlashcardFormat;
  status?: FlashcardStatus;
  tags?: string[];
  search?: string;
  isPublic?: boolean;
  createdBy?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'price' | 'downloadCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

export interface FlashcardResponse {
  flashcards: Flashcard[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FlashcardGenerationOptions {
  sourceQuestionIds: string[];
  category?: string;
  subcategory?: string;
  difficulty?: FlashcardDifficulty;
  includeExplanation: boolean;
  autoPublish: boolean;
  price?: number;
  tags?: string[];
}

// Validation schemas
export const FLASHCARD_VALIDATION = {
  question: {
    minLength: 10,
    maxLength: 500
  },
  answer: {
    minLength: 1,
    maxLength: 300
  },
  explanation: {
    maxLength: 1000
  },
  category: {
    minLength: 2,
    maxLength: 50
  },
  tags: {
    maxCount: 10,
    maxLength: 30
  },
  price: {
    min: 0,
    max: 10000
  },
  estimatedStudyTime: {
    min: 1,
    max: 60
  }
};

// Default values
export const FLASHCARD_DEFAULTS = {
  price: 200, // 200 تومان
  estimatedStudyTime: 2, // 2 minutes
  format: FlashcardFormat.BASIC,
  difficulty: FlashcardDifficulty.MEDIUM,
  status: FlashcardStatus.DRAFT,
  isPublic: false
};

// Utility functions
export const getFlashcardDifficultyLabel = (difficulty: FlashcardDifficulty): string => {
  switch (difficulty) {
    case FlashcardDifficulty.EASY:
      return 'آسان';
    case FlashcardDifficulty.MEDIUM:
      return 'متوسط';
    case FlashcardDifficulty.HARD:
      return 'سخت';
    default:
      return 'نامشخص';
  }
};

export const getFlashcardStatusLabel = (status: FlashcardStatus): string => {
  switch (status) {
    case FlashcardStatus.DRAFT:
      return 'پیش‌نویس';
    case FlashcardStatus.PUBLISHED:
      return 'منتشر شده';
    case FlashcardStatus.ARCHIVED:
      return 'آرشیو شده';
    default:
      return 'نامشخص';
  }
};

export const getFlashcardFormatLabel = (format: FlashcardFormat): string => {
  switch (format) {
    case FlashcardFormat.BASIC:
      return 'پایه';
    case FlashcardFormat.CLOZE:
      return 'جای خالی';
    case FlashcardFormat.IMAGE:
      return 'تصویری';
    case FlashcardFormat.AUDIO:
      return 'صوتی';
    default:
      return 'نامشخص';
  }
};

export const calculateFlashcardSetPrice = (flashcards: Flashcard[], discountPercentage = 0): number => {
  const totalPrice = flashcards.reduce((sum, flashcard) => sum + flashcard.price, 0);
  const discountAmount = (totalPrice * discountPercentage) / 100;
  return Math.max(0, totalPrice - discountAmount);
};

export const calculateStudyAccuracy = (correctCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
};

export const formatStudyTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} دقیقه`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
}; 