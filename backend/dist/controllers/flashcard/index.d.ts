/**
 * Flashcard Controllers Index
 * صادرات تمام کنترلرهای فلش‌کارت
 */
export * from './types';
import { getFlashcards, getFlashcard, createFlashcard, updateFlashcard, deleteFlashcard, generateFromQuestions, purchaseFlashcard, getUserPurchases, recordStudySession, getCategories, getUserStats } from './flashcard.controller';
export { getFlashcards, getFlashcard, createFlashcard, updateFlashcard, deleteFlashcard, generateFromQuestions, purchaseFlashcard, getUserPurchases, recordStudySession, getCategories, getUserStats };
export declare class FlashcardController {
    static getFlashcards: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static getFlashcard: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static createFlashcard: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static updateFlashcard: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static deleteFlashcard: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static generateFromQuestions: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static purchaseFlashcard: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static getUserPurchases: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static recordStudySession: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static getCategories: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static getUserStats: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
}
