/**
 * Flashcard Types and Interfaces
 * تایپ‌ها و رابط‌های مشترک برای فلش‌کارت‌ها
 */
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
        permissions?: string[];
    };
}
export type { Flashcard, FlashcardSet, UserFlashcardAccess, FlashcardStudySession, FlashcardCreateData, FlashcardUpdateData, FlashcardSetCreateData, FlashcardFilters, FlashcardGenerationOptions, FlashcardDifficulty, FlashcardStatus, FlashcardFormat, AccessType } from '../../models/flashcard';
export { FLASHCARD_DEFAULTS, FLASHCARD_VALIDATION, calculateFlashcardSetPrice, calculateStudyAccuracy } from '../../models/flashcard';
