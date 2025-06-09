"use strict";
/**
 * Flashcard Models and Types
 * مدل‌ها و انواع فلش‌کارت
 *
 * این فایل شامل تعاریف TypeScript برای سیستم فلش‌کارت است
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStudyTime = exports.calculateStudyAccuracy = exports.calculateFlashcardSetPrice = exports.getFlashcardFormatLabel = exports.getFlashcardStatusLabel = exports.getFlashcardDifficultyLabel = exports.FLASHCARD_DEFAULTS = exports.FLASHCARD_VALIDATION = exports.FlashcardFormat = exports.AccessType = exports.FlashcardStatus = exports.FlashcardDifficulty = void 0;
var FlashcardDifficulty;
(function (FlashcardDifficulty) {
    FlashcardDifficulty["EASY"] = "easy";
    FlashcardDifficulty["MEDIUM"] = "medium";
    FlashcardDifficulty["HARD"] = "hard";
})(FlashcardDifficulty || (exports.FlashcardDifficulty = FlashcardDifficulty = {}));
var FlashcardStatus;
(function (FlashcardStatus) {
    FlashcardStatus["DRAFT"] = "draft";
    FlashcardStatus["PUBLISHED"] = "published";
    FlashcardStatus["ARCHIVED"] = "archived";
})(FlashcardStatus || (exports.FlashcardStatus = FlashcardStatus = {}));
var AccessType;
(function (AccessType) {
    AccessType["PURCHASE"] = "purchase";
    AccessType["SUBSCRIPTION"] = "subscription";
    AccessType["FREE"] = "free";
})(AccessType || (exports.AccessType = AccessType = {}));
var FlashcardFormat;
(function (FlashcardFormat) {
    FlashcardFormat["BASIC"] = "basic";
    FlashcardFormat["CLOZE"] = "cloze";
    FlashcardFormat["IMAGE"] = "image";
    FlashcardFormat["AUDIO"] = "audio";
})(FlashcardFormat || (exports.FlashcardFormat = FlashcardFormat = {}));
// Validation schemas
exports.FLASHCARD_VALIDATION = {
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
exports.FLASHCARD_DEFAULTS = {
    price: 200, // 200 تومان
    estimatedStudyTime: 2, // 2 minutes
    format: FlashcardFormat.BASIC,
    difficulty: FlashcardDifficulty.MEDIUM,
    status: FlashcardStatus.DRAFT,
    isPublic: false
};
// Utility functions
const getFlashcardDifficultyLabel = (difficulty) => {
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
exports.getFlashcardDifficultyLabel = getFlashcardDifficultyLabel;
const getFlashcardStatusLabel = (status) => {
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
exports.getFlashcardStatusLabel = getFlashcardStatusLabel;
const getFlashcardFormatLabel = (format) => {
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
exports.getFlashcardFormatLabel = getFlashcardFormatLabel;
const calculateFlashcardSetPrice = (flashcards, discountPercentage = 0) => {
    const totalPrice = flashcards.reduce((sum, flashcard) => sum + flashcard.price, 0);
    const discountAmount = (totalPrice * discountPercentage) / 100;
    return Math.max(0, totalPrice - discountAmount);
};
exports.calculateFlashcardSetPrice = calculateFlashcardSetPrice;
const calculateStudyAccuracy = (correctCount, totalCount) => {
    if (totalCount === 0)
        return 0;
    return Math.round((correctCount / totalCount) * 100);
};
exports.calculateStudyAccuracy = calculateStudyAccuracy;
const formatStudyTime = (minutes) => {
    if (minutes < 60) {
        return `${minutes} دقیقه`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ساعت و ${remainingMinutes} دقیقه`;
};
exports.formatStudyTime = formatStudyTime;
//# sourceMappingURL=flashcard.js.map