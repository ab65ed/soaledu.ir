/**
 * Flashcard Models and Types
 * مدل‌ها و انواع فلش‌کارت
 *
 * این فایل شامل تعاریف TypeScript برای سیستم فلش‌کارت است
 */
export declare enum FlashcardDifficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export declare enum FlashcardStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum AccessType {
    PURCHASE = "purchase",
    SUBSCRIPTION = "subscription",
    FREE = "free"
}
export declare enum FlashcardFormat {
    BASIC = "basic",
    CLOZE = "cloze",
    IMAGE = "image",
    AUDIO = "audio"
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
    estimatedStudyTime: number;
    lastStudied?: Date;
    studyCount: number;
    correctCount: number;
    incorrectCount: number;
    averageResponseTime: number;
}
export interface FlashcardSet {
    id: string;
    title: string;
    description: string;
    flashcards: string[];
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
    responseTime: number;
    isCorrect: boolean;
    difficulty: number;
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
export declare const FLASHCARD_VALIDATION: {
    question: {
        minLength: number;
        maxLength: number;
    };
    answer: {
        minLength: number;
        maxLength: number;
    };
    explanation: {
        maxLength: number;
    };
    category: {
        minLength: number;
        maxLength: number;
    };
    tags: {
        maxCount: number;
        maxLength: number;
    };
    price: {
        min: number;
        max: number;
    };
    estimatedStudyTime: {
        min: number;
        max: number;
    };
};
export declare const FLASHCARD_DEFAULTS: {
    price: number;
    estimatedStudyTime: number;
    format: FlashcardFormat;
    difficulty: FlashcardDifficulty;
    status: FlashcardStatus;
    isPublic: boolean;
};
export declare const getFlashcardDifficultyLabel: (difficulty: FlashcardDifficulty) => string;
export declare const getFlashcardStatusLabel: (status: FlashcardStatus) => string;
export declare const getFlashcardFormatLabel: (format: FlashcardFormat) => string;
export declare const calculateFlashcardSetPrice: (flashcards: Flashcard[], discountPercentage?: number) => number;
export declare const calculateStudyAccuracy: (correctCount: number, totalCount: number) => number;
export declare const formatStudyTime: (minutes: number) => string;
