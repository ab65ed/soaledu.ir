/**
 * Finance Payment Controller
 * کنترلر پرداخت مالی
 */
import { Response } from 'express';
import { AuthenticatedRequest } from './types';
export declare class PaymentController {
    /**
     * Create payment transaction
     * POST /api/finance/create-payment
     */
    static createPayment(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Verify payment
     * POST /api/finance/verify-payment
     */
    static verifyPayment(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get user payment history
     * GET /api/finance/payment-history
     */
    static getPaymentHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
}
