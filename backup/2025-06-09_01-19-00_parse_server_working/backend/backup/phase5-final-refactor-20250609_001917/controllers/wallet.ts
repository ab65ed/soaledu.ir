/**
 * Wallet Controller
 * کنترلر مدیریت کیف پول
 * 
 * مدیریت شارژ، کسر، تراکنش‌ها و آمار کیف پول کاربران
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Parse from 'parse/node';
import { 
  TransactionType, 
  TransactionStatus,
  WalletTransaction,
  WalletStats,
  hasPermission,
  Permission
} from '../models/wallet';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class WalletController {
  /**
   * Get wallet statistics
   * GET /api/wallet/stats
   */
  static async getWalletStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      
      // Get total charges
      const chargeQuery = new Parse.Query(WalletTransaction);
      chargeQuery.equalTo('type', TransactionType.CHARGE);
      chargeQuery.equalTo('status', TransactionStatus.COMPLETED);
      const chargeResult = await chargeQuery.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalCharges = chargeResult[0]?.total || 0;

      // Get total deductions
      const deductQuery = new Parse.Query(WalletTransaction);
      deductQuery.containedIn('type', [TransactionType.DEDUCT, TransactionType.PURCHASE, TransactionType.PENALTY]);
      deductQuery.equalTo('status', TransactionStatus.COMPLETED);
      const deductResult = await deductQuery.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalDeductions = deductResult[0]?.total || 0;

      // Get pending transactions count
      const pendingQuery = new Parse.Query(WalletTransaction);
      pendingQuery.equalTo('status', TransactionStatus.PENDING);
      const pendingTransactions = await pendingQuery.count();

      const stats: WalletStats = {
        totalCharges,
        totalDeductions,
        pendingTransactions,
        netAmount: totalCharges - totalDeductions
      };

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error getting wallet stats:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار کیف پول',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get wallet transactions
   * GET /api/wallet/transactions
   */
  static async getWalletTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: errors.array()
        });
        return;
      }

      const { 
        page = 1, 
        limit = 20, 
        userId, 
        type, 
        status, 
        startDate, 
        endDate 
      } = req.query;

      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      const query = new Parse.Query(WalletTransaction);

      // Apply filters
      if (userId) query.equalTo('userId', userId);
      if (type) query.equalTo('type', type);
      if (status) query.equalTo('status', status);
      if (startDate) query.greaterThanOrEqualTo('createdAt', new Date(startDate as string));
      if (endDate) query.lessThanOrEqualTo('createdAt', new Date(endDate as string));

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      query.skip(skip);
      query.limit(Number(limit));
      query.descending('createdAt');

      // Include user data
      query.include('user');

      const [transactions, total] = await Promise.all([
        query.find(),
        query.count()
      ]);

      const formattedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          const user = transaction.get('user');
          return {
            id: transaction.id,
            userId: transaction.get('userId'),
            userName: user?.get('name') || user?.get('username') || 'نامشخص',
            userEmail: user?.get('email') || '',
            type: transaction.get('type'),
            amount: transaction.get('amount'),
            description: transaction.get('description'),
            status: transaction.get('status'),
            metadata: transaction.get('metadata'),
            createdAt: transaction.get('createdAt'),
            updatedAt: transaction.get('updatedAt')
          };
        })
      );

      res.json({
        success: true,
        data: {
          transactions: formattedTransactions,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Error getting wallet transactions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت تراکنش‌ها',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Charge wallet
   * POST /api/wallet/charge
   */
  static async chargeWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: errors.array()
        });
        return;
      }

      const { userId, amount, description, type } = req.body;
      const adminId = req.user?.id;

      // Verify target user exists
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const targetUser = await userQuery.get(userId);

      if (!targetUser) {
        res.status(404).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
        return;
      }

      // Create transaction
      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      const transaction = new WalletTransaction();

      transaction.set('userId', userId);
      transaction.set('user', targetUser);
      transaction.set('type', type);
      transaction.set('amount', amount);
      transaction.set('description', description);
      transaction.set('status', TransactionStatus.COMPLETED);
      transaction.set('processedBy', adminId);
      transaction.set('metadata', {
        processedAt: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      await transaction.save();

      // Update user wallet balance
      const currentBalance = targetUser.get('walletBalance') || 0;
      targetUser.set('walletBalance', currentBalance + amount);
      await targetUser.save();

      // Log activity
      await WalletController.logWalletActivity(
        adminId,
        'WALLET_CHARGE',
        userId,
        `شارژ کیف پول کاربر ${targetUser.get('name') || targetUser.get('username')} به مبلغ ${amount.toLocaleString()} تومان`
      );

      res.status(201).json({
        success: true,
        message: 'کیف پول با موفقیت شارژ شد',
        data: {
          id: transaction.id,
          userId,
          type,
          amount,
          status: TransactionStatus.COMPLETED,
          newBalance: currentBalance + amount
        }
      });

    } catch (error) {
      console.error('Error charging wallet:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در شارژ کیف پول',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Deduct from wallet
   * POST /api/wallet/deduct
   */
  static async deductFromWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: errors.array()
        });
        return;
      }

      const { userId, amount, description, type } = req.body;
      const adminId = req.user?.id;

      // Verify target user exists
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const targetUser = await userQuery.get(userId);

      if (!targetUser) {
        res.status(404).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
        return;
      }

      const currentBalance = targetUser.get('walletBalance') || 0;

      // Check if user has sufficient balance
      if (currentBalance < amount) {
        res.status(400).json({
          success: false,
          message: 'موجودی کیف پول کافی نیست',
          data: {
            currentBalance,
            requestedAmount: amount,
            shortage: amount - currentBalance
          }
        });
        return;
      }

      // Create transaction
      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      const transaction = new WalletTransaction();

      transaction.set('userId', userId);
      transaction.set('user', targetUser);
      transaction.set('type', type);
      transaction.set('amount', amount);
      transaction.set('description', description);
      transaction.set('status', TransactionStatus.COMPLETED);
      transaction.set('processedBy', adminId);
      transaction.set('metadata', {
        processedAt: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        previousBalance: currentBalance
      });

      await transaction.save();

      // Update user wallet balance
      targetUser.set('walletBalance', currentBalance - amount);
      await targetUser.save();

      // Log activity
      await WalletController.logWalletActivity(
        adminId,
        'WALLET_DEDUCT',
        userId,
        `کسر از کیف پول کاربر ${targetUser.get('name') || targetUser.get('username')} به مبلغ ${amount.toLocaleString()} تومان`
      );

      res.status(201).json({
        success: true,
        message: 'مبلغ با موفقیت از کیف پول کسر شد',
        data: {
          id: transaction.id,
          userId,
          type,
          amount,
          status: TransactionStatus.COMPLETED,
          newBalance: currentBalance - amount
        }
      });

    } catch (error) {
      console.error('Error deducting from wallet:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در کسر از کیف پول',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get user wallet balance
   * GET /api/wallet/balance/:userId
   */
  static async getUserWalletBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
        return;
      }

      const balance = user.get('walletBalance') || 0;

      res.json({
        success: true,
        data: {
          userId,
          balance,
          userName: user.get('name') || user.get('username'),
          userEmail: user.get('email')
        }
      });

    } catch (error) {
      console.error('Error getting user wallet balance:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت موجودی کیف پول',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get user transactions
   * GET /api/wallet/user/:userId/transactions
   */
  static async getUserTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: errors.array()
        });
        return;
      }

      const { userId } = req.params;
      const { page = 1, limit = 20, type, status } = req.query;

      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      const query = new Parse.Query(WalletTransaction);

      query.equalTo('userId', userId);
      if (type) query.equalTo('type', type);
      if (status) query.equalTo('status', status);

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      query.skip(skip);
      query.limit(Number(limit));
      query.descending('createdAt');

      const [transactions, total] = await Promise.all([
        query.find(),
        query.count()
      ]);

      const formattedTransactions = transactions.map(transaction => ({
        id: transaction.id,
        type: transaction.get('type'),
        amount: transaction.get('amount'),
        description: transaction.get('description'),
        status: transaction.get('status'),
        metadata: transaction.get('metadata'),
        createdAt: transaction.get('createdAt'),
        updatedAt: transaction.get('updatedAt')
      }));

      res.json({
        success: true,
        data: {
          transactions: formattedTransactions,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Error getting user transactions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت تراکنش‌های کاربر',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Process refund
   * POST /api/wallet/refund
   */
  static async processRefund(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: errors.array()
        });
        return;
      }

      const { transactionId, amount, reason } = req.body;
      const adminId = req.user?.id;

      // Get original transaction
      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      const originalQuery = new Parse.Query(WalletTransaction);
      const originalTransaction = await originalQuery.get(transactionId);

      if (!originalTransaction) {
        res.status(404).json({
          success: false,
          message: 'تراکنش یافت نشد'
        });
        return;
      }

      const refundAmount = amount || originalTransaction.get('amount');
      const userId = originalTransaction.get('userId');

      // Get user
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(userId);

      // Create refund transaction
      const refundTransaction = new WalletTransaction();
      refundTransaction.set('userId', userId);
      refundTransaction.set('user', user);
      refundTransaction.set('type', TransactionType.REFUND);
      refundTransaction.set('amount', refundAmount);
      refundTransaction.set('description', `بازگشت وجه: ${reason}`);
      refundTransaction.set('status', TransactionStatus.COMPLETED);
      refundTransaction.set('processedBy', adminId);
      refundTransaction.set('metadata', {
        originalTransactionId: transactionId,
        refundReason: reason,
        processedAt: new Date()
      });

      await refundTransaction.save();

      // Update user balance
      const currentBalance = user.get('walletBalance') || 0;
      user.set('walletBalance', currentBalance + refundAmount);
      await user.save();

      // Log activity
      await WalletController.logWalletActivity(
        adminId,
        'WALLET_REFUND',
        userId,
        `بازگشت وجه به کیف پول کاربر ${user.get('name') || user.get('username')} به مبلغ ${refundAmount.toLocaleString()} تومان`
      );

      res.status(201).json({
        success: true,
        message: 'بازگشت وجه با موفقیت انجام شد',
        data: {
          refundTransactionId: refundTransaction.id,
          originalTransactionId: transactionId,
          refundAmount,
          newBalance: currentBalance + refundAmount
        }
      });

    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در پردازش بازگشت وجه',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get wallet analytics
   * GET /api/wallet/analytics
   */
  static async getWalletAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { period = 'month', startDate, endDate } = req.query;

      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      const query = new Parse.Query(WalletTransaction);

      // Set date range
      let start: Date, end: Date;
      if (startDate && endDate) {
        start = new Date(startDate as string);
        end = new Date(endDate as string);
      } else {
        end = new Date();
        switch (period) {
          case 'day':
            start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            start = new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
          default:
            start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }
      }

      query.greaterThanOrEqualTo('createdAt', start);
      query.lessThanOrEqualTo('createdAt', end);
      query.equalTo('status', TransactionStatus.COMPLETED);

      // Get analytics data
      const analytics = await query.aggregate([
        {
          $group: {
            _id: '$type',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
            avgAmount: { $avg: '$amount' }
          }
        }
      ]);

      // Format analytics data
      const formattedAnalytics = {
        period: period as string,
        startDate: start,
        endDate: end,
        summary: {
          totalTransactions: 0,
          totalAmount: 0,
          charges: { count: 0, amount: 0 },
          deductions: { count: 0, amount: 0 },
          refunds: { count: 0, amount: 0 }
        },
        byType: analytics
      };

      analytics.forEach((item: any) => {
        formattedAnalytics.summary.totalTransactions += item.count;
        formattedAnalytics.summary.totalAmount += item.totalAmount;

        switch (item._id) {
          case TransactionType.CHARGE:
          case TransactionType.BONUS:
            formattedAnalytics.summary.charges.count += item.count;
            formattedAnalytics.summary.charges.amount += item.totalAmount;
            break;
          case TransactionType.DEDUCT:
          case TransactionType.PURCHASE:
          case TransactionType.PENALTY:
            formattedAnalytics.summary.deductions.count += item.count;
            formattedAnalytics.summary.deductions.amount += item.totalAmount;
            break;
          case TransactionType.REFUND:
            formattedAnalytics.summary.refunds.count += item.count;
            formattedAnalytics.summary.refunds.amount += item.totalAmount;
            break;
        }
      });

      res.json({
        success: true,
        data: formattedAnalytics
      });

    } catch (error) {
      console.error('Error getting wallet analytics:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار کیف پول',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Export wallet transactions
   * GET /api/wallet/export
   */
  static async exportTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { format = 'csv', startDate, endDate, userId, type } = req.query;

      const WalletTransaction = Parse.Object.extend('WalletTransaction');
      const query = new Parse.Query(WalletTransaction);

      // Apply filters
      if (startDate) query.greaterThanOrEqualTo('createdAt', new Date(startDate as string));
      if (endDate) query.lessThanOrEqualTo('createdAt', new Date(endDate as string));
      if (userId) query.equalTo('userId', userId);
      if (type) query.equalTo('type', type);

      query.include('user');
      query.limit(10000); // Limit for export
      query.descending('createdAt');

      const transactions = await query.find();

      // Format data for export
      const exportData = transactions.map(transaction => {
        const user = transaction.get('user');
        return {
          'شناسه تراکنش': transaction.id,
          'شناسه کاربر': transaction.get('userId'),
          'نام کاربر': user?.get('name') || user?.get('username') || 'نامشخص',
          'ایمیل کاربر': user?.get('email') || '',
          'نوع تراکنش': transaction.get('type'),
          'مبلغ (تومان)': transaction.get('amount'),
          'توضیحات': transaction.get('description'),
          'وضعیت': transaction.get('status'),
          'تاریخ ایجاد': transaction.get('createdAt')?.toISOString(),
          'تاریخ به‌روزرسانی': transaction.get('updatedAt')?.toISOString()
        };
      });

      // Set response headers based on format
      switch (format) {
        case 'csv':
          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('Content-Disposition', 'attachment; filename=wallet-transactions.csv');
          
          // Convert to CSV
          const csvHeaders = Object.keys(exportData[0] || {}).join(',');
          const csvRows = exportData.map(row => Object.values(row).join(','));
          const csvContent = [csvHeaders, ...csvRows].join('\n');
          
          res.send('\uFEFF' + csvContent); // Add BOM for UTF-8
          break;

        case 'json':
        default:
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Content-Disposition', 'attachment; filename=wallet-transactions.json');
          res.json({
            success: true,
            data: exportData,
            exportedAt: new Date(),
            totalRecords: exportData.length
          });
          break;
      }

    } catch (error) {
      console.error('Error exporting transactions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در صادرات تراکنش‌ها',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Bulk wallet operations
   * POST /api/wallet/bulk
   */
  static async bulkWalletOperations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'داده‌های ورودی نامعتبر',
          errors: errors.array()
        });
        return;
      }

      const { operations } = req.body;
      const adminId = req.user?.id;

      const results = {
        successful: [],
        failed: [],
        totalProcessed: 0
      };

      for (const operation of operations) {
        try {
          const { userId, amount, type, description } = operation;

          // Get user
          const User = Parse.Object.extend('User');
          const userQuery = new Parse.Query(User);
          const user = await userQuery.get(userId);

          if (!user) {
            results.failed.push({
              userId,
              error: 'کاربر یافت نشد'
            });
            continue;
          }

          const currentBalance = user.get('walletBalance') || 0;

          // Check balance for deduction operations
          if ([TransactionType.DEDUCT, TransactionType.PENALTY].includes(type) && currentBalance < amount) {
            results.failed.push({
              userId,
              error: 'موجودی کافی نیست',
              currentBalance,
              requestedAmount: amount
            });
            continue;
          }

          // Create transaction
          const WalletTransaction = Parse.Object.extend('WalletTransaction');
          const transaction = new WalletTransaction();

          transaction.set('userId', userId);
          transaction.set('user', user);
          transaction.set('type', type);
          transaction.set('amount', amount);
          transaction.set('description', description);
          transaction.set('status', TransactionStatus.COMPLETED);
          transaction.set('processedBy', adminId);
          transaction.set('metadata', {
            bulkOperation: true,
            processedAt: new Date()
          });

          await transaction.save();

          // Update balance
          const newBalance = [TransactionType.CHARGE, TransactionType.BONUS].includes(type)
            ? currentBalance + amount
            : currentBalance - amount;

          user.set('walletBalance', newBalance);
          await user.save();

          results.successful.push({
            userId,
            transactionId: transaction.id,
            type,
            amount,
            newBalance
          });

        } catch (error) {
          results.failed.push({
            userId: operation.userId,
            error: error instanceof Error ? error.message : 'خطای نامشخص'
          });
        }

        results.totalProcessed++;
      }

      // Log bulk operation
      await WalletController.logWalletActivity(
        adminId,
        'WALLET_BULK_OPERATION',
        'system',
        `عملیات گروهی کیف پول: ${results.successful.length} موفق، ${results.failed.length} ناموفق`
      );

      res.json({
        success: true,
        message: 'عملیات گروهی تکمیل شد',
        data: results
      });

    } catch (error) {
      console.error('Error in bulk wallet operations:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در عملیات گروهی کیف پول',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Log wallet activity
   */
  private static async logWalletActivity(
    userId: string,
    activityType: string,
    resourceId: string,
    description: string
  ): Promise<void> {
    try {
      const ActivityLog = Parse.Object.extend('ActivityLog');
      const log = new ActivityLog();

      log.set('userId', userId);
      log.set('activityType', activityType);
      log.set('resourceType', 'wallet');
      log.set('resourceId', resourceId);
      log.set('description', description);

      await log.save();
    } catch (error) {
      console.error('Error logging wallet activity:', error);
    }
  }
}