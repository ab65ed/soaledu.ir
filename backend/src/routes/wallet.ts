/**
 * Wallet Routes
 * مسیرهای API برای مدیریت کیف پول
 */

import express from 'express';
import { WalletController } from '../controllers/wallet';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * Get wallet statistics
 * GET /api/wallet/stats
 */
router.get('/stats', WalletController.getWalletStats);

/**
 * Get wallet transactions
 * GET /api/wallet/transactions
 */
router.get('/transactions', WalletController.getWalletTransactions);

/**
 * Charge wallet
 * POST /api/wallet/charge
 */
router.post('/charge', WalletController.chargeWallet);

/**
 * Deduct from wallet
 * POST /api/wallet/deduct
 */
router.post('/deduct', WalletController.deductFromWallet);

/**
 * Get user wallet balance
 * GET /api/wallet/balance/:userId
 */
router.get('/balance/:userId', WalletController.getUserWalletBalance);

/**
 * Get user transaction history
 * GET /api/wallet/user/:userId/transactions
 */
router.get('/user/:userId/transactions', WalletController.getUserTransactions);

/**
 * Process refund
 * POST /api/wallet/refund
 */
router.post('/refund', WalletController.processRefund);

/**
 * Get wallet analytics
 * GET /api/wallet/analytics
 */
router.get('/analytics', WalletController.getWalletAnalytics);

/**
 * Export wallet transactions
 * GET /api/wallet/export
 */
router.get('/export', WalletController.exportTransactions);

/**
 * Bulk wallet operations
 * POST /api/wallet/bulk
 */
router.post('/bulk', WalletController.bulkWalletOperations);

export default router; 