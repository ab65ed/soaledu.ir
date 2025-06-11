"use strict";
/**
 * Flashcard Controllers Index
 * صادرات تمام کنترلرهای فلش‌کارت
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardController = exports.getUserStats = exports.getCategories = exports.recordStudySession = exports.getUserPurchases = exports.purchaseFlashcard = exports.generateFromQuestions = exports.deleteFlashcard = exports.updateFlashcard = exports.createFlashcard = exports.getFlashcard = exports.getFlashcards = void 0;
// Export types
__exportStar(require("./types"), exports);
// Import and re-export all original functions for backward compatibility
const flashcard_controller_1 = require("./flashcard.controller");
Object.defineProperty(exports, "getFlashcards", { enumerable: true, get: function () { return flashcard_controller_1.getFlashcards; } });
Object.defineProperty(exports, "getFlashcard", { enumerable: true, get: function () { return flashcard_controller_1.getFlashcard; } });
Object.defineProperty(exports, "createFlashcard", { enumerable: true, get: function () { return flashcard_controller_1.createFlashcard; } });
Object.defineProperty(exports, "updateFlashcard", { enumerable: true, get: function () { return flashcard_controller_1.updateFlashcard; } });
Object.defineProperty(exports, "deleteFlashcard", { enumerable: true, get: function () { return flashcard_controller_1.deleteFlashcard; } });
Object.defineProperty(exports, "generateFromQuestions", { enumerable: true, get: function () { return flashcard_controller_1.generateFromQuestions; } });
Object.defineProperty(exports, "purchaseFlashcard", { enumerable: true, get: function () { return flashcard_controller_1.purchaseFlashcard; } });
Object.defineProperty(exports, "getUserPurchases", { enumerable: true, get: function () { return flashcard_controller_1.getUserPurchases; } });
Object.defineProperty(exports, "recordStudySession", { enumerable: true, get: function () { return flashcard_controller_1.recordStudySession; } });
Object.defineProperty(exports, "getCategories", { enumerable: true, get: function () { return flashcard_controller_1.getCategories; } });
Object.defineProperty(exports, "getUserStats", { enumerable: true, get: function () { return flashcard_controller_1.getUserStats; } });
// Create a consolidated class for easier imports (optional)
class FlashcardController {
}
exports.FlashcardController = FlashcardController;
// CRUD Operations
FlashcardController.getFlashcards = flashcard_controller_1.getFlashcards;
FlashcardController.getFlashcard = flashcard_controller_1.getFlashcard;
FlashcardController.createFlashcard = flashcard_controller_1.createFlashcard;
FlashcardController.updateFlashcard = flashcard_controller_1.updateFlashcard;
FlashcardController.deleteFlashcard = flashcard_controller_1.deleteFlashcard;
// Generation
FlashcardController.generateFromQuestions = flashcard_controller_1.generateFromQuestions;
// Purchase & Access
FlashcardController.purchaseFlashcard = flashcard_controller_1.purchaseFlashcard;
FlashcardController.getUserPurchases = flashcard_controller_1.getUserPurchases;
// Study & Analytics
FlashcardController.recordStudySession = flashcard_controller_1.recordStudySession;
FlashcardController.getCategories = flashcard_controller_1.getCategories;
FlashcardController.getUserStats = flashcard_controller_1.getUserStats;
//# sourceMappingURL=index.js.map