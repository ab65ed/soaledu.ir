"use strict";
/**
 * Finance Routes
 * مسیرهای API برای سیستم مالی
 *
 * @author Exam-Edu Platform
 * @version 1.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const finance_1 = require("../controllers/finance");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.protectRoute);
/**
 * Calculate exam pricing
 * POST /api/finance/calculate-price
 */
router.post('/calculate-price', finance_1.FinanceController.calculatePrice);
/**
 * Calculate flashcard pricing
 * POST /api/finance/calculate-flashcard-price
 */
router.post('/calculate-flashcard-price', finance_1.FinanceController.calculateFlashcardPrice);
/**
 * Get exam price by exam ID
 * GET /api/finance/exam-price/:examId
 */
router.get('/exam-price/:examId', finance_1.FinanceController.getExamPrice);
/**
 * Get flashcard price by flashcard ID
 * GET /api/finance/flashcard-price/:flashcardId
 */
router.get('/flashcard-price/:flashcardId', finance_1.FinanceController.getFlashcardPrice);
/**
 * Create payment transaction
 * POST /api/finance/create-payment
 */
router.post('/create-payment', finance_1.FinanceController.createPayment);
/**
 * Verify payment
 * POST /api/finance/verify-payment
 */
router.post('/verify-payment', finance_1.FinanceController.verifyPayment);
/**
 * Get user payment history
 * GET /api/finance/payment-history
 */
router.get('/payment-history', finance_1.FinanceController.getPaymentHistory);
/**
 * Get financial statistics
 * GET /api/finance/statistics
 */
router.get('/statistics', finance_1.FinanceController.getStatistics);
exports.default = router;
//# sourceMappingURL=finance.js.map