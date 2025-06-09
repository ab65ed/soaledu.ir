/**
 * Wallet Controller
 * کنترلر مدیریت کیف پول
 *
 * مدیریت شارژ، کسر، تراکنش‌ها و آمار کیف پول کاربران
 */
import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: any;
}
export declare class WalletController {
    /**
     * Get wallet statistics
     * GET /api/wallet/stats
     */
    static getWalletStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get wallet transactions
     * GET /api/wallet/transactions
     */
    static getWalletTransactions(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Charge wallet
     * POST /api/wallet/charge
     */
    static chargeWallet(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Deduct from wallet
     * POST /api/wallet/deduct
     */
    static deductFromWallet(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get user wallet balance
     * GET /api/wallet/balance/:userId
     */
    static getUserWalletBalance(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get user transactions
     * GET /api/wallet/user/:userId/transactions
     */
    static getUserTransactions(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Process refund
     * POST /api/wallet/refund
     */
    static processRefund(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get wallet analytics
     * GET /api/wallet/analytics
     */
    static getWalletAnalytics(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Export wallet transactions
     * GET /api/wallet/export
     */
    static exportTransactions(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Bulk wallet operations
     * POST /api/wallet/bulk
     */
    static bulkWalletOperations(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Log wallet activity
     */
    private static logWalletActivity;
}
export {};
