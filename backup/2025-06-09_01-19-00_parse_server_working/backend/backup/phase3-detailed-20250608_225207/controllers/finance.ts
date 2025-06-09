/**
 * Finance Controller
 * کنترلر مالی برای مدیریت قیمت‌گذاری آزمون‌های تستی و فلش‌کارت‌ها
 * 
 * ویژگی‌های اصلی:
 * - قیمت‌گذاری بر اساس تعداد سوالات
 * - محاسبه تخفیف
 * - مدیریت تراکنش‌ها
 * - آمار مالی
 * - قیمت‌گذاری فلش‌کارت‌ها
 * 
 * @author Exam-Edu Platform
 * @version 1.1.0
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Parse from 'parse/node';

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Pricing configuration
export const PRICING_CONFIG = {
  // قیمت پایه بر اساس تعداد سوالات (تومان)
  BASE_PRICES: {
    '10-20': 800,   // 10-20 سوال: 800 تومان
    '21-30': 1000,  // 21-30 سوال: 1000 تومان
    '31-50': 1200   // 31-50 سوال: 1200 تومان
  },
  
  // قیمت فلش‌کارت‌ها
  FLASHCARD_PRICES: {
    DEFAULT: 200,     // قیمت پیش‌فرض فلش‌کارت: 200 تومان
    MIN: 100,         // حداقل قیمت
    MAX: 500          // حداکثر قیمت
  },
  
  // تخفیف‌ها
  DISCOUNTS: {
    FIRST_TIME: 0.1,      // 10% تخفیف اولین خرید
    BULK_PURCHASE: 0.15,  // 15% تخفیف خرید عمده (بیش از 5 آزمون)
    STUDENT: 0.2,         // 20% تخفیف دانشجویی
    SEASONAL: 0.05,       // 5% تخفیف فصلی
    FLASHCARD_BULK: 0.1   // 10% تخفیف خرید عمده فلش‌کارت (بیش از 10 عدد)
  },
  
  // حداقل و حداکثر قیمت
  MIN_PRICE: 500,
  MAX_PRICE: 2000
};

export interface PricingCalculation {
  basePrice: number;
  discounts: {
    type: string;
    amount: number;
    percentage: number;
  }[];
  totalDiscount: number;
  finalPrice: number;
  questionCount?: number;
  priceCategory?: string;
  itemType: 'exam' | 'flashcard';
}

export interface FlashcardPricingCalculation extends PricingCalculation {
  flashcardCount: number;
  itemType: 'flashcard';
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  examId?: string;
  flashcardId?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
  metadata?: any;
}

export class FinanceController {
  /**
   * Calculate exam pricing
   * POST /api/finance/calculate-price
   */
  static async calculatePrice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'خطاهای اعتبارسنجی',
          errors: errors.array()
        });
        return;
      }

      const { examId, questionCount, userType, isFirstPurchase, bulkCount } = req.body;

      if (!questionCount || questionCount < 10 || questionCount > 50) {
        res.status(400).json({
          success: false,
          message: 'تعداد سوالات باید بین 10 تا 50 باشد'
        });
        return;
      }

      const pricing = await FinanceController.calculateExamPrice(
        questionCount,
        userType,
        isFirstPurchase,
        bulkCount
      );

      res.json({
        success: true,
        message: 'قیمت محاسبه شد',
        data: pricing
      });

    } catch (error) {
      console.error('Error calculating price:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در محاسبه قیمت',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Calculate flashcard pricing
   * POST /api/finance/calculate-flashcard-price
   */
  static async calculateFlashcardPrice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'خطاهای اعتبارسنجی',
          errors: errors.array()
        });
        return;
      }

      const { flashcardIds, userType, isFirstPurchase } = req.body;

      if (!flashcardIds || !Array.isArray(flashcardIds) || flashcardIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'شناسه فلش‌کارت‌ها الزامی است'
        });
        return;
      }

      // Get flashcard details
      const query = new Parse.Query('Flashcard');
      query.containedIn('objectId', flashcardIds);
      const flashcards = await query.find();

      if (flashcards.length === 0) {
        res.status(404).json({
          success: false,
          message: 'فلش‌کارتی یافت نشد'
        });
        return;
      }

      const pricing = await FinanceController.calculateFlashcardBulkPrice(
        flashcards,
        userType,
        isFirstPurchase
      );

      res.json({
        success: true,
        message: 'قیمت محاسبه شد',
        data: pricing
      });

    } catch (error) {
      console.error('Error calculating flashcard price:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در محاسبه قیمت فلش‌کارت',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get flashcard price by ID
   * GET /api/finance/flashcard-price/:flashcardId
   */
  static async getFlashcardPrice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { flashcardId } = req.params;

      const query = new Parse.Query('Flashcard');
      const flashcard = await query.get(flashcardId);

      if (!flashcard) {
        res.status(404).json({
          success: false,
          message: 'فلش‌کارت یافت نشد'
        });
        return;
      }

      // Check user purchase history for discounts
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(req.user?.id);

      const userType = user?.get('userType') || 'regular';
      const purchaseHistory = user?.get('purchaseHistory') || [];
      const isFirstPurchase = purchaseHistory.length === 0;

      const pricing = await FinanceController.calculateSingleFlashcardPrice(
        flashcard.get('price') || PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT,
        userType,
        isFirstPurchase
      );

      res.json({
        success: true,
        data: {
          flashcardId,
          flashcardTitle: flashcard.get('question'),
          pricing
        }
      });

    } catch (error) {
      console.error('Error getting flashcard price:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت قیمت فلش‌کارت',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get exam price by exam ID
   * GET /api/finance/exam-price/:examId
   */
  static async getExamPrice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { examId } = req.params;

      const TestExam = Parse.Object.extend('TestExam');
      const query = new Parse.Query(TestExam);
      const exam = await query.get(examId);

      if (!exam) {
        res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      const configuration = exam.get('configuration');
      const questionCount = configuration?.totalQuestions || 40;

      // Check user purchase history for discounts
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(req.user?.id);

      const userType = user?.get('userType') || 'regular';
      const purchaseHistory = user?.get('purchaseHistory') || [];
      const isFirstPurchase = purchaseHistory.length === 0;

      const pricing = await FinanceController.calculateExamPrice(
        questionCount,
        userType,
        isFirstPurchase,
        0
      );

      res.json({
        success: true,
        data: {
          examId,
          examTitle: exam.get('title'),
          questionCount,
          pricing
        }
      });

    } catch (error) {
      console.error('Error getting exam price:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت قیمت آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Create payment transaction
   * POST /api/finance/create-payment
   */
  static async createPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'خطاهای اعتبارسنجی',
          errors: errors.array()
        });
        return;
      }

      const { examId, paymentMethod, returnUrl } = req.body;

      // Get exam details
      const TestExam = Parse.Object.extend('TestExam');
      const examQuery = new Parse.Query(TestExam);
      const exam = await examQuery.get(examId);

      if (!exam) {
        res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
        return;
      }

      const configuration = exam.get('configuration');
      const questionCount = configuration?.totalQuestions || 40;

      // Calculate price
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(req.user?.id);

      const userType = user?.get('userType') || 'regular';
      const purchaseHistory = user?.get('purchaseHistory') || [];
      const isFirstPurchase = purchaseHistory.length === 0;

      const pricing = await FinanceController.calculateExamPrice(
        questionCount,
        userType,
        isFirstPurchase,
        0
      );

      // Create transaction record
      const Transaction = Parse.Object.extend('PaymentTransaction');
      const transaction = new Transaction();

      transaction.set('userId', req.user?.id);
      transaction.set('examId', examId);
      transaction.set('amount', pricing.finalPrice);
      transaction.set('status', 'pending');
      transaction.set('paymentMethod', paymentMethod);
      transaction.set('metadata', {
        questionCount,
        pricing,
        examTitle: exam.get('title')
      });

      // Set ACL
      const acl = new Parse.ACL();
      if (req.user?.id) {
        acl.setReadAccess(req.user.id, true);
        acl.setWriteAccess(req.user.id, true);
      }
      transaction.setACL(acl);

      const savedTransaction = await transaction.save();

      // Here you would integrate with payment gateway
      // For now, we'll simulate payment URL generation
      const paymentUrl = `https://payment-gateway.example.com/pay?transaction=${savedTransaction.id}&amount=${pricing.finalPrice}&return=${encodeURIComponent(returnUrl)}`;

      res.status(201).json({
        success: true,
        message: 'تراکنش ایجاد شد',
        data: {
          transactionId: savedTransaction.id,
          paymentUrl,
          amount: pricing.finalPrice,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
      });

    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ایجاد تراکنش',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Verify payment
   * POST /api/finance/verify-payment
   */
  static async verifyPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { transactionId, paymentReference } = req.body;

      const Transaction = Parse.Object.extend('PaymentTransaction');
      const query = new Parse.Query(Transaction);
      const transaction = await query.get(transactionId);

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'تراکنش یافت نشد'
        });
        return;
      }

      // Verify with payment gateway (simulated)
      const isPaymentValid = await FinanceController.verifyWithGateway(paymentReference);

      if (isPaymentValid) {
        // Update transaction status
        transaction.set('status', 'completed');
        transaction.set('transactionId', paymentReference);
        transaction.set('completedAt', new Date());
        await transaction.save();

        // Grant access to exam
        await FinanceController.grantExamAccess(
          transaction.get('userId'),
          transaction.get('examId')
        );

        // Update user purchase history
        await FinanceController.updateUserPurchaseHistory(
          transaction.get('userId'),
          transaction.toJSON()
        );

        res.json({
          success: true,
          message: 'پرداخت با موفقیت تایید شد',
          data: {
            transactionId,
            examId: transaction.get('examId'),
            amount: transaction.get('amount')
          }
        });
      } else {
        transaction.set('status', 'failed');
        await transaction.save();

        res.status(400).json({
          success: false,
          message: 'پرداخت تایید نشد'
        });
      }

    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در تایید پرداخت',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get user payment history
   * GET /api/finance/payment-history
   */
  static async getPaymentHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const Transaction = Parse.Object.extend('PaymentTransaction');
      const query = new Parse.Query(Transaction);
      
      query.equalTo('userId', req.user?.id);
      
      if (status) {
        query.equalTo('status', status);
      }

      query.descending('createdAt');
      query.limit(Number(limit));
      query.skip((Number(page) - 1) * Number(limit));

      const transactions = await query.find();
      const total = await query.count();

      res.json({
        success: true,
        data: {
          transactions: transactions.map(t => t.toJSON()),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });

    } catch (error) {
      console.error('Error getting payment history:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت تاریخچه پرداخت',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get financial statistics
   * GET /api/finance/statistics
   */
  static async getStatistics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const Transaction = Parse.Object.extend('PaymentTransaction');
      const query = new Parse.Query(Transaction);
      
      query.equalTo('status', 'completed');

      if (startDate) {
        query.greaterThanOrEqualTo('completedAt', new Date(startDate as string));
      }

      if (endDate) {
        query.lessThanOrEqualTo('completedAt', new Date(endDate as string));
      }

      const transactions = await query.find();

      const statistics = {
        totalRevenue: transactions.reduce((sum, t) => sum + t.get('amount'), 0),
        totalTransactions: transactions.length,
        averageTransactionValue: transactions.length > 0 
          ? transactions.reduce((sum, t) => sum + t.get('amount'), 0) / transactions.length 
          : 0,
        paymentMethods: FinanceController.groupBy(transactions, 'paymentMethod'),
        dailyRevenue: FinanceController.groupByDate(transactions),
        topExams: FinanceController.getTopExams(transactions)
      };

      res.json({
        success: true,
        data: statistics
      });

    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار مالی',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Admin Financial Overview
   * GET /api/finance/admin/overview
   */
  static async getAdminFinancialOverview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Get platform financial statistics
      const walletQuery = new Parse.Query('Wallet');
      const wallets = await walletQuery.find({ useMasterKey: true });
      
      const transactionQuery = new Parse.Query('Transaction');
      transactionQuery.descending('createdAt');
      transactionQuery.limit(1000);
      const transactions = await transactionQuery.find({ useMasterKey: true });
      
      const withdrawalQuery = new Parse.Query('WithdrawalRequest');
      const withdrawals = await withdrawalQuery.find({ useMasterKey: true });
      
      // Calculate statistics
      const totalPlatformBalance = wallets.reduce((sum, wallet) => sum + (wallet.get('balance') || 0), 0);
      const totalDesignerEarnings = wallets.reduce((sum, wallet) => sum + (wallet.get('totalEarnings') || 0), 0);
      const totalWithdrawals = wallets.reduce((sum, wallet) => sum + (wallet.get('totalWithdrawals') || 0), 0);
      const pendingWithdrawals = withdrawals.filter(w => w.get('status') === 'PENDING').length;
      const pendingAmount = withdrawals
        .filter(w => w.get('status') === 'PENDING')
        .reduce((sum, w) => sum + (w.get('amount') || 0), 0);
      
      // Monthly statistics
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const monthlyTransactions = transactions.filter(t => 
        new Date(t.get('createdAt')) >= currentMonth
      );
      const monthlyRevenue = monthlyTransactions
        .filter(t => t.get('type') === 'PURCHASE')
        .reduce((sum, t) => sum + (t.get('amount') || 0), 0);
      const monthlyDesignerEarnings = monthlyTransactions
        .filter(t => t.get('type') === 'EARNING')
        .reduce((sum, t) => sum + (t.get('amount') || 0), 0);
      
      // Top designers by earnings
      const designerEarnings = new Map();
      transactions
        .filter(t => t.get('type') === 'EARNING' && t.get('designerId'))
        .forEach(t => {
          const designerId = t.get('designerId');
          const amount = t.get('amount') || 0;
          designerEarnings.set(designerId, (designerEarnings.get(designerId) || 0) + amount);
        });
      
      const topDesigners = Array.from(designerEarnings.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([designerId, earnings]) => ({ designerId, earnings }));
      
      res.json({
        success: true,
        data: {
          overview: {
            totalPlatformBalance,
            totalDesignerEarnings,
            totalWithdrawals,
            pendingWithdrawals,
            pendingAmount,
            activeDesigners: wallets.length,
            monthlyRevenue,
            monthlyDesignerEarnings,
            platformFeeEarned: monthlyRevenue - monthlyDesignerEarnings
          },
          topDesigners,
          recentTransactions: transactions.slice(0, 10).map(t => ({
            id: t.id,
            type: t.get('type'),
            amount: t.get('amount'),
            userId: t.get('userId'),
            designerId: t.get('designerId'),
            description: t.get('description'),
            date: t.get('createdAt'),
            status: t.get('status')
          }))
        }
      });
    } catch (error) {
      console.error('Error getting admin financial overview:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار مالی',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get All Designer Wallets (Admin)
   * GET /api/finance/admin/designer-wallets
   */
  static async getAllDesignerWallets(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, search, sortBy = 'totalEarnings', sortOrder = 'desc' } = req.query;
      
      const walletQuery = new Parse.Query('Wallet');
      
      // Search functionality
      if (search) {
        // You might want to join with User table for name search
        // For now, searching by userId
        walletQuery.contains('userId', search as string);
      }
      
      // Sorting
      if (sortOrder === 'desc') {
        walletQuery.descending(sortBy as string);
      } else {
        walletQuery.ascending(sortBy as string);
      }
      
      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      walletQuery.skip(skip);
      walletQuery.limit(Number(limit));
      
      const wallets = await walletQuery.find({ useMasterKey: true });
      const totalCount = await walletQuery.count({ useMasterKey: true });
      
      // Get user details for each wallet
      const walletsWithUserInfo = await Promise.all(
        wallets.map(async (wallet) => {
          const userId = wallet.get('userId');
          let userInfo = null;
          
          try {
            const userQuery = new Parse.Query(Parse.User);
            userQuery.equalTo('objectId', userId);
            const user = await userQuery.first({ useMasterKey: true });
            if (user) {
              userInfo = {
                id: user.id,
                username: user.get('username'),
                email: user.get('email'),
                displayName: user.get('displayName') || user.get('username')
              };
            }
          } catch (error) {
            console.error('Error getting user info:', error);
          }
          
          return {
            id: wallet.id,
            userId: wallet.get('userId'),
            balance: wallet.get('balance') || 0,
            totalEarnings: wallet.get('totalEarnings') || 0,
            totalWithdrawals: wallet.get('totalWithdrawals') || 0,
            pendingWithdrawals: wallet.get('pendingWithdrawals') || 0,
            freezeAmount: wallet.get('freezeAmount') || 0,
            lastUpdated: wallet.get('lastUpdated'),
            availableBalance: (wallet.get('balance') || 0) - (wallet.get('freezeAmount') || 0) - (wallet.get('pendingWithdrawals') || 0),
            userInfo
          };
        })
      );
      
      res.json({
        success: true,
        data: {
          wallets: walletsWithUserInfo,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: totalCount,
            totalPages: Math.ceil(totalCount / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error getting designer wallets:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت کیف پول‌های طراحان',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get Withdrawal Requests (Admin)
   * GET /api/finance/admin/withdrawal-requests
   */
  static async getWithdrawalRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status = 'PENDING', page = 1, limit = 20 } = req.query;
      
      const withdrawalQuery = new Parse.Query('WithdrawalRequest');
      
      if (status !== 'ALL') {
        withdrawalQuery.equalTo('status', status);
      }
      
      withdrawalQuery.descending('createdAt');
      
      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      withdrawalQuery.skip(skip);
      withdrawalQuery.limit(Number(limit));
      
      const withdrawals = await withdrawalQuery.find({ useMasterKey: true });
      const totalCount = await withdrawalQuery.count({ useMasterKey: true });
      
      // Get user info for each withdrawal
      const withdrawalsWithUserInfo = await Promise.all(
        withdrawals.map(async (withdrawal) => {
          const userId = withdrawal.get('userId');
          let userInfo = null;
          
          try {
            const userQuery = new Parse.Query(Parse.User);
            userQuery.equalTo('objectId', userId);
            const user = await userQuery.first({ useMasterKey: true });
            if (user) {
              userInfo = {
                id: user.id,
                username: user.get('username'),
                email: user.get('email'),
                displayName: user.get('displayName') || user.get('username')
              };
            }
          } catch (error) {
            console.error('Error getting user info:', error);
          }
          
          return {
            id: withdrawal.id,
            userId: withdrawal.get('userId'),
            amount: withdrawal.get('amount'),
            method: withdrawal.get('method'),
            bankDetails: withdrawal.get('bankDetails'),
            status: withdrawal.get('status'),
            requestDate: withdrawal.get('createdAt'),
            processedDate: withdrawal.get('processedDate'),
            adminNotes: withdrawal.get('adminNotes'),
            trackingNumber: withdrawal.get('trackingNumber'),
            userInfo
          };
        })
      );
      
      res.json({
        success: true,
        data: {
          withdrawals: withdrawalsWithUserInfo,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: totalCount,
            totalPages: Math.ceil(totalCount / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error getting withdrawal requests:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت درخواست‌های برداشت',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Approve/Reject Withdrawal Request (Admin)
   * PUT /api/finance/admin/withdrawal-requests/:id
   */
  static async processWithdrawalRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, adminNotes } = req.body; // action: 'APPROVE' | 'REJECT'
      
      if (!['APPROVE', 'REJECT'].includes(action)) {
        res.status(400).json({
          success: false,
          message: 'عمل نامعتبر است'
        });
        return;
      }
      
      const withdrawalQuery = new Parse.Query('WithdrawalRequest');
      const withdrawal = await withdrawalQuery.get(id, { useMasterKey: true });
      
      if (!withdrawal) {
        res.status(404).json({
          success: false,
          message: 'درخواست برداشت یافت نشد'
        });
        return;
      }
      
      if (withdrawal.get('status') !== 'PENDING') {
        res.status(400).json({
          success: false,
          message: 'این درخواست قبلاً پردازش شده است'
        });
        return;
      }
      
      const userId = withdrawal.get('userId');
      const amount = withdrawal.get('amount');
      
      if (action === 'APPROVE') {
        // Update wallet - subtract from pending withdrawals and balance
        const walletQuery = new Parse.Query('Wallet');
        walletQuery.equalTo('userId', userId);
        const wallet = await walletQuery.first({ useMasterKey: true });
        
        if (wallet) {
          const currentBalance = wallet.get('balance') || 0;
          const currentPending = wallet.get('pendingWithdrawals') || 0;
          const currentTotalWithdrawals = wallet.get('totalWithdrawals') || 0;
          
          wallet.set('balance', currentBalance - amount);
          wallet.set('pendingWithdrawals', currentPending - amount);
          wallet.set('totalWithdrawals', currentTotalWithdrawals + amount);
          wallet.set('lastUpdated', new Date());
          
          await wallet.save(null, { useMasterKey: true });
        }
        
        // Create transaction record
        const transactionClass = Parse.Object.extend('Transaction');
        const transaction = new transactionClass();
        transaction.set('userId', userId);
        transaction.set('type', 'WITHDRAWAL');
        transaction.set('amount', amount);
        transaction.set('description', `برداشت وجه تایید شده - ${withdrawal.get('trackingNumber')}`);
        transaction.set('status', 'COMPLETED');
        transaction.set('referenceId', withdrawal.id);
        transaction.set('date', new Date());
        
        await transaction.save(null, { useMasterKey: true });
        
        withdrawal.set('status', 'APPROVED');
      } else {
        // Reject - return amount to available balance
        const walletQuery = new Parse.Query('Wallet');
        walletQuery.equalTo('userId', userId);
        const wallet = await walletQuery.first({ useMasterKey: true });
        
        if (wallet) {
          const currentPending = wallet.get('pendingWithdrawals') || 0;
          wallet.set('pendingWithdrawals', currentPending - amount);
          wallet.set('lastUpdated', new Date());
          
          await wallet.save(null, { useMasterKey: true });
        }
        
        withdrawal.set('status', 'REJECTED');
      }
      
      withdrawal.set('processedDate', new Date());
      withdrawal.set('adminNotes', adminNotes || '');
      
      await withdrawal.save(null, { useMasterKey: true });
      
      res.json({
        success: true,
        message: action === 'APPROVE' ? 'درخواست برداشت تایید شد' : 'درخواست برداشت رد شد',
        data: {
          id: withdrawal.id,
          status: withdrawal.get('status'),
          processedDate: withdrawal.get('processedDate')
        }
      });
    } catch (error) {
      console.error('Error processing withdrawal request:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در پردازش درخواست برداشت',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get Financial Analytics (Admin)
   * GET /api/finance/admin/analytics
   */
  static async getFinancialAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y
      
      let startDate = new Date();
      switch (period) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }
      
      const transactionQuery = new Parse.Query('Transaction');
      transactionQuery.greaterThanOrEqualTo('createdAt', startDate);
      transactionQuery.descending('createdAt');
      const transactions = await transactionQuery.find({ useMasterKey: true });
      
      // Revenue analytics
      const revenueByDay = new Map();
      const designerEarningsByDay = new Map();
      const platformFeeByDay = new Map();
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.get('createdAt')).toISOString().split('T')[0];
        const amount = transaction.get('amount') || 0;
        const type = transaction.get('type');
        
        if (type === 'PURCHASE') {
          revenueByDay.set(date, (revenueByDay.get(date) || 0) + amount);
          const designerShare = amount * 0.50; // 50% to designer
          const platformFee = amount * 0.50; // 50% platform fee
          designerEarningsByDay.set(date, (designerEarningsByDay.get(date) || 0) + designerShare);
          platformFeeByDay.set(date, (platformFeeByDay.get(date) || 0) + platformFee);
        }
      });
      
      // Convert maps to arrays for charts
      const revenueChart = Array.from(revenueByDay.entries()).map(([date, amount]) => ({ date, amount }));
      const designerEarningsChart = Array.from(designerEarningsByDay.entries()).map(([date, amount]) => ({ date, amount }));
      const platformFeeChart = Array.from(platformFeeByDay.entries()).map(([date, amount]) => ({ date, amount }));
      
      // Transaction type distribution
      const transactionTypes = new Map();
      transactions.forEach(t => {
        const type = t.get('type');
        transactionTypes.set(type, (transactionTypes.get(type) || 0) + 1);
      });
      
      // Top selling items
      const itemSales = new Map();
      transactions
        .filter(t => t.get('type') === 'PURCHASE' && t.get('referenceId'))
        .forEach(t => {
          const itemId = t.get('referenceId');
          const amount = t.get('amount') || 0;
          const current = itemSales.get(itemId) || { count: 0, revenue: 0 };
          itemSales.set(itemId, { count: current.count + 1, revenue: current.revenue + amount });
        });
      
      const topItems = Array.from(itemSales.entries())
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 10)
        .map(([itemId, data]) => ({ itemId, ...data }));
      
      res.json({
        success: true,
        data: {
          period,
          summary: {
            totalRevenue: Array.from(revenueByDay.values()).reduce((sum, amount) => sum + amount, 0),
            totalDesignerEarnings: Array.from(designerEarningsByDay.values()).reduce((sum, amount) => sum + amount, 0),
            totalPlatformFee: Array.from(platformFeeByDay.values()).reduce((sum, amount) => sum + amount, 0),
            totalTransactions: transactions.length
          },
          charts: {
            revenue: revenueChart,
            designerEarnings: designerEarningsChart,
            platformFee: platformFeeChart
          },
          transactionTypes: Array.from(transactionTypes.entries()).map(([type, count]) => ({ type, count })),
          topItems
        }
      });
    } catch (error) {
      console.error('Error getting financial analytics:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت تحلیل‌های مالی',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * Get All Transactions (Admin)
   * GET /api/finance/admin/transactions
   */
  static async getAllTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 50, 
        type, 
        userId, 
        startDate, 
        endDate,
        search 
      } = req.query;
      
      const transactionQuery = new Parse.Query('Transaction');
      
      // Filters
      if (type && type !== 'ALL') {
        transactionQuery.equalTo('type', type);
      }
      
      if (userId) {
        transactionQuery.equalTo('userId', userId);
      }
      
      if (startDate) {
        transactionQuery.greaterThanOrEqualTo('createdAt', new Date(startDate as string));
      }
      
      if (endDate) {
        transactionQuery.lessThanOrEqualTo('createdAt', new Date(endDate as string));
      }
      
      if (search) {
        transactionQuery.contains('description', search as string);
      }
      
      transactionQuery.descending('createdAt');
      
      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      transactionQuery.skip(skip);
      transactionQuery.limit(Number(limit));
      
      const transactions = await transactionQuery.find({ useMasterKey: true });
      const totalCount = await transactionQuery.count({ useMasterKey: true });
      
      // Get user info for each transaction
      const transactionsWithUserInfo = await Promise.all(
        transactions.map(async (transaction) => {
          const userId = transaction.get('userId');
          let userInfo = null;
          
          try {
            const userQuery = new Parse.Query(Parse.User);
            userQuery.equalTo('objectId', userId);
            const user = await userQuery.first({ useMasterKey: true });
            if (user) {
              userInfo = {
                id: user.id,
                username: user.get('username'),
                email: user.get('email'),
                displayName: user.get('displayName') || user.get('username')
              };
            }
          } catch (error) {
            console.error('Error getting user info:', error);
          }
          
          return {
            id: transaction.id,
            userId: transaction.get('userId'),
            type: transaction.get('type'),
            amount: transaction.get('amount'),
            description: transaction.get('description'),
            status: transaction.get('status'),
            date: transaction.get('createdAt'),
            referenceId: transaction.get('referenceId'),
            designerId: transaction.get('designerId'),
            designerShare: transaction.get('designerShare'),
            platformFee: transaction.get('platformFee'),
            metadata: transaction.get('metadata'),
            userInfo
          };
        })
      );
      
      res.json({
        success: true,
        data: {
          transactions: transactionsWithUserInfo,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: totalCount,
            totalPages: Math.ceil(totalCount / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error getting all transactions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت تراکنش‌ها',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  // Helper methods

  /**
   * Calculate exam price based on question count and user type
   */
  private static async calculateExamPrice(
    questionCount: number,
    userType: string = 'regular',
    isFirstPurchase: boolean = false,
    bulkCount: number = 0
  ): Promise<PricingCalculation> {
    // Determine price category
    let priceCategory: string;
    let basePrice: number;

    if (questionCount <= 20) {
      priceCategory = '10-20';
      basePrice = PRICING_CONFIG.BASE_PRICES['10-20'];
    } else if (questionCount <= 30) {
      priceCategory = '21-30';
      basePrice = PRICING_CONFIG.BASE_PRICES['21-30'];
    } else {
      priceCategory = '31-50';
      basePrice = PRICING_CONFIG.BASE_PRICES['31-50'];
    }

    // Calculate discounts
    const discounts: { type: string; amount: number; percentage: number }[] = [];

    // First time purchase discount
    if (isFirstPurchase) {
      const discountAmount = basePrice * PRICING_CONFIG.DISCOUNTS.FIRST_TIME;
      discounts.push({
        type: 'first_time',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.FIRST_TIME * 100
      });
    }

    // Student discount
    if (userType === 'student') {
      const discountAmount = basePrice * PRICING_CONFIG.DISCOUNTS.STUDENT;
      discounts.push({
        type: 'student',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.STUDENT * 100
      });
    }

    // Bulk purchase discount
    if (bulkCount >= 5) {
      const discountAmount = basePrice * PRICING_CONFIG.DISCOUNTS.BULK_PURCHASE;
      discounts.push({
        type: 'bulk_purchase',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.BULK_PURCHASE * 100
      });
    }

    // Calculate total discount
    const totalDiscount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    let finalPrice = basePrice - totalDiscount;

    // Apply min/max limits
    finalPrice = Math.max(PRICING_CONFIG.MIN_PRICE, Math.min(PRICING_CONFIG.MAX_PRICE, finalPrice));

    return {
      basePrice,
      discounts,
      totalDiscount,
      finalPrice: Math.round(finalPrice),
      questionCount,
      priceCategory,
      itemType: 'exam'
    };
  }

  /**
   * Verify payment with gateway (simulated)
   */
  private static async verifyWithGateway(paymentReference: string): Promise<boolean> {
    // This would integrate with actual payment gateway
    // For now, simulate verification
    return paymentReference && paymentReference.length > 10;
  }

  /**
   * Grant exam access to user
   */
  private static async grantExamAccess(userId: string, examId: string): Promise<void> {
    const UserExamAccess = Parse.Object.extend('UserExamAccess');
    const access = new UserExamAccess();

    access.set('userId', userId);
    access.set('examId', examId);
    access.set('grantedAt', new Date());
    access.set('isActive', true);

    const acl = new Parse.ACL();
    acl.setReadAccess(userId, true);
    access.setACL(acl);

    await access.save();
  }

  /**
   * Update user purchase history
   */
  private static async updateUserPurchaseHistory(userId: string, transaction: any): Promise<void> {
    const User = Parse.Object.extend('User');
    const query = new Parse.Query(User);
    const user = await query.get(userId);

    const purchaseHistory = user.get('purchaseHistory') || [];
    purchaseHistory.push({
      transactionId: transaction.objectId,
      examId: transaction.examId,
      amount: transaction.amount,
      purchasedAt: new Date()
    });

    user.set('purchaseHistory', purchaseHistory);
    await user.save();
  }

  /**
   * Group transactions by field
   */
  private static groupBy(transactions: any[], field: string): Record<string, number> {
    return transactions.reduce((acc, transaction) => {
      const key = transaction.get(field) || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Group transactions by date
   */
  private static groupByDate(transactions: any[]): Record<string, number> {
    return transactions.reduce((acc, transaction) => {
      const date = transaction.get('completedAt')?.toISOString().split('T')[0] || 'unknown';
      acc[date] = (acc[date] || 0) + transaction.get('amount');
      return acc;
    }, {});
  }

  /**
   * Get top selling exams
   */
  private static getTopExams(transactions: any[]): Array<{ examId: string; count: number; revenue: number }> {
    const examStats: Record<string, { examId: string; count: number; revenue: number }> = transactions.reduce((acc, transaction) => {
      const examId = transaction.get('examId');
      if (!acc[examId]) {
        acc[examId] = { examId, count: 0, revenue: 0 };
      }
      acc[examId].count++;
      acc[examId].revenue += transaction.get('amount');
      return acc;
    }, {} as Record<string, { examId: string; count: number; revenue: number }>);

    return Object.values(examStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  /**
   * Calculate single flashcard price
   * محاسبه قیمت تک فلش‌کارت
   */
  private static async calculateSingleFlashcardPrice(
    basePrice: number = PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT,
    userType: string = 'regular',
    isFirstPurchase: boolean = false
  ): Promise<PricingCalculation> {
    // Calculate discounts
    const discounts: { type: string; amount: number; percentage: number }[] = [];

    // First time purchase discount
    if (isFirstPurchase) {
      const discountAmount = basePrice * PRICING_CONFIG.DISCOUNTS.FIRST_TIME;
      discounts.push({
        type: 'first_time',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.FIRST_TIME * 100
      });
    }

    // Student discount
    if (userType === 'student') {
      const discountAmount = basePrice * PRICING_CONFIG.DISCOUNTS.STUDENT;
      discounts.push({
        type: 'student',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.STUDENT * 100
      });
    }

    // Calculate total discount
    const totalDiscount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    let finalPrice = basePrice - totalDiscount;

    // Apply min/max limits for flashcards
    finalPrice = Math.max(
      PRICING_CONFIG.FLASHCARD_PRICES.MIN, 
      Math.min(PRICING_CONFIG.FLASHCARD_PRICES.MAX, finalPrice)
    );

    return {
      basePrice,
      discounts,
      totalDiscount,
      finalPrice: Math.round(finalPrice),
      itemType: 'flashcard'
    };
  }

  /**
   * Calculate bulk flashcard price
   * محاسبه قیمت عمده فلش‌کارت‌ها
   */
  private static async calculateFlashcardBulkPrice(
    flashcards: any[],
    userType: string = 'regular',
    isFirstPurchase: boolean = false
  ): Promise<FlashcardPricingCalculation> {
    const flashcardCount = flashcards.length;
    let totalBasePrice = 0;

    // Sum up individual prices
    flashcards.forEach(flashcard => {
      const price = flashcard.get('price') || PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT;
      totalBasePrice += price;
    });

    // Calculate discounts
    const discounts: { type: string; amount: number; percentage: number }[] = [];

    // First time purchase discount
    if (isFirstPurchase) {
      const discountAmount = totalBasePrice * PRICING_CONFIG.DISCOUNTS.FIRST_TIME;
      discounts.push({
        type: 'first_time',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.FIRST_TIME * 100
      });
    }

    // Student discount
    if (userType === 'student') {
      const discountAmount = totalBasePrice * PRICING_CONFIG.DISCOUNTS.STUDENT;
      discounts.push({
        type: 'student',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.STUDENT * 100
      });
    }

    // Bulk flashcard discount (10+ flashcards)
    if (flashcardCount >= 10) {
      const discountAmount = totalBasePrice * PRICING_CONFIG.DISCOUNTS.FLASHCARD_BULK;
      discounts.push({
        type: 'flashcard_bulk',
        amount: discountAmount,
        percentage: PRICING_CONFIG.DISCOUNTS.FLASHCARD_BULK * 100
      });
    }

    // Calculate total discount
    const totalDiscount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    const finalPrice = Math.max(0, totalBasePrice - totalDiscount);

    return {
      basePrice: totalBasePrice,
      discounts,
      totalDiscount,
      finalPrice: Math.round(finalPrice),
      flashcardCount,
      itemType: 'flashcard'
    };
  }
} 