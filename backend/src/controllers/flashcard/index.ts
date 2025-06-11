/**
 * Flashcard Controllers Index
 * صادرات تمام کنترلرهای فلش‌کارت
 */

// Export types
export * from './types';

// Import and re-export all original functions for backward compatibility
import {
  getFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  generateFromQuestions,
  purchaseFlashcard,
  getUserPurchases,
  recordStudySession,
  getCategories,
  getUserStats
} from './flashcard.controller';

export {
  getFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  generateFromQuestions,
  purchaseFlashcard,
  getUserPurchases,
  recordStudySession,
  getCategories,
  getUserStats
};

// Create a consolidated class for easier imports (optional)
export class FlashcardController {
  // CRUD Operations
  static getFlashcards = getFlashcards;
  static getFlashcard = getFlashcard;
  static createFlashcard = createFlashcard;
  static updateFlashcard = updateFlashcard;
  static deleteFlashcard = deleteFlashcard;

  // Generation
  static generateFromQuestions = generateFromQuestions;

  // Purchase & Access
  static purchaseFlashcard = purchaseFlashcard;
  static getUserPurchases = getUserPurchases;

  // Study & Analytics
  static recordStudySession = recordStudySession;
  static getCategories = getCategories;
  static getUserStats = getUserStats;
} 