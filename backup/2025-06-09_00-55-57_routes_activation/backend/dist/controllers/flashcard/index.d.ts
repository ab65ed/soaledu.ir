/**
 * Flashcard Controllers Index
 * صادرات تمام کنترلرهای فلش‌کارت
 */
export * from './types';
import { getFlashcards, getFlashcard, createFlashcard, updateFlashcard, deleteFlashcard, generateFromQuestions, purchaseFlashcard, getUserPurchases, recordStudySession, getCategories, getUserStats } from '../flashcard';
export { getFlashcards, getFlashcard, createFlashcard, updateFlashcard, deleteFlashcard, generateFromQuestions, purchaseFlashcard, getUserPurchases, recordStudySession, getCategories, getUserStats };
export declare class FlashcardController {
    static getFlashcards: any;
    static getFlashcard: any;
    static createFlashcard: any;
    static updateFlashcard: any;
    static deleteFlashcard: any;
    static generateFromQuestions: any;
    static purchaseFlashcard: any;
    static getUserPurchases: any;
    static recordStudySession: any;
    static getCategories: any;
    static getUserStats: any;
}
