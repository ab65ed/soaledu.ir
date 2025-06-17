/**
 * Finance Routes
 * مسیرهای API برای سیستم مالی
 * 
 * @author Exam-Edu Platform
 * @version 1.1.0
 */

import { Router } from 'express';
import { FinanceController } from '../controllers/finance';
import { protectRoute } from '../middlewares/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(protectRoute);

/**
 * Calculate exam pricing
 * POST /api/finance/calculate-price
 */
router.post('/calculate-price', FinanceController.calculatePrice);

/**
 * Calculate flashcard pricing
 * POST /api/finance/calculate-flashcard-price
 */
router.post('/calculate-flashcard-price', FinanceController.calculateFlashcardPrice);

/**
 * Get exam price by exam ID
 * GET /api/finance/exam-price/:examId
 */
router.get('/exam-price/:examId', FinanceController.getExamPrice);

/**
 * Get flashcard price by flashcard ID
 * GET /api/finance/flashcard-price/:flashcardId
 */
router.get('/flashcard-price/:flashcardId', FinanceController.getFlashcardPrice);

/**
 * Create payment transaction
 * POST /api/finance/create-payment
 */
router.post('/create-payment', FinanceController.createPayment);

/**
 * Verify payment
 * POST /api/finance/verify-payment
 */
router.post('/verify-payment', FinanceController.verifyPayment);

/**
 * Get user payment history
 * GET /api/finance/payment-history
 */
router.get('/payment-history', FinanceController.getPaymentHistory);

/**
 * Get financial statistics
 * GET /api/finance/statistics
 */
router.get('/statistics', FinanceController.getStatistics);

export default router; 