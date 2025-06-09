/**
 * Finance Pricing Controller
 * کنترلر قیمت‌گذاری مالی
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
export declare class PricingController {
    /**
     * Calculate exam pricing
     * POST /api/finance/calculate-price
     */
    static calculatePrice(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Calculate flashcard pricing
     * POST /api/finance/calculate-flashcard-price
     */
    static calculateFlashcardPrice(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get flashcard price by ID
     * GET /api/finance/flashcard-price/:flashcardId
     */
    static getFlashcardPrice(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get exam price by exam ID
     * GET /api/finance/exam-price/:examId
     */
    static getExamPrice(req: AuthenticatedRequest, res: Response): Promise<void>;
}
