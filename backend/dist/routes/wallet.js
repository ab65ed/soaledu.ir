"use strict";
/**
 * Wallet Routes
 * مسیرهای API برای مدیریت کیف پول
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_1 = require("../controllers/wallet");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
/**
 * Get wallet statistics
 * GET /api/wallet/stats
 */
router.get('/stats', wallet_1.WalletController.getWalletStats);
/**
 * Get wallet transactions
 * GET /api/wallet/transactions
 */
router.get('/transactions', wallet_1.WalletController.getWalletTransactions);
/**
 * Charge wallet
 * POST /api/wallet/charge
 */
router.post('/charge', wallet_1.WalletController.chargeWallet);
/**
 * Deduct from wallet
 * POST /api/wallet/deduct
 */
router.post('/deduct', wallet_1.WalletController.deductFromWallet);
/**
 * Get user wallet balance
 * GET /api/wallet/balance/:userId
 */
router.get('/balance/:userId', wallet_1.WalletController.getUserWalletBalance);
/**
 * Get user transaction history
 * GET /api/wallet/user/:userId/transactions
 */
router.get('/user/:userId/transactions', wallet_1.WalletController.getUserTransactions);
/**
 * Process refund
 * POST /api/wallet/refund
 */
router.post('/refund', wallet_1.WalletController.processRefund);
/**
 * Get wallet analytics
 * GET /api/wallet/analytics
 */
router.get('/analytics', wallet_1.WalletController.getWalletAnalytics);
/**
 * Export wallet transactions
 * GET /api/wallet/export
 */
router.get('/export', wallet_1.WalletController.exportTransactions);
/**
 * Bulk wallet operations
 * POST /api/wallet/bulk
 */
router.post('/bulk', wallet_1.WalletController.bulkWalletOperations);
exports.default = router;
//# sourceMappingURL=wallet.js.map