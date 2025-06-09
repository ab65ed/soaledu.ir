/**
 * Finance Payment Controller
 * کنترلر پرداخت مالی
 */

import { Response } from 'express';
import { z } from 'zod';
import Parse from 'parse/node';
import { AuthenticatedRequest } from './types';
import { calculateExamPrice } from './pricing-utils';
import { verifyWithGateway, grantExamAccess, updateUserPurchaseHistory } from './payment-utils';

// Validation schemas
const createPaymentSchema = z.object({
  examId: z.string(),
  paymentMethod: z.string(),
  returnUrl: z.string().url()
});

const verifyPaymentSchema = z.object({
  transactionId: z.string(),
  paymentReference: z.string()
});

export class PaymentController {
  /**
   * Create payment transaction
   * POST /api/finance/create-payment
   */
  static async createPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validatedData = createPaymentSchema.parse(req.body);
      const { examId, paymentMethod, returnUrl } = validatedData;

      // Get exam details
      const TestExam = Parse.Object.extend('TestExam');
      const examQuery = new Parse.Query(TestExam);
      const exam = await examQuery.get(examId);

      if (!exam) {
        res.status(404).json({
          status: 'error',
          statusCode: 404,
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

      const pricing = await calculateExamPrice(
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
        status: 'success',
        data: {
          transactionId: savedTransaction.id,
          paymentUrl,
          amount: pricing.finalPrice,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
      });

    } catch (error) {
      console.error('Error creating payment:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'داده‌های ورودی نامعتبر',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
        return;
      }
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'خطا در ایجاد تراکنش',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
      });
    }
  }

  /**
   * Verify payment
   * POST /api/finance/verify-payment
   */
  static async verifyPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validatedData = verifyPaymentSchema.parse(req.body);
      const { transactionId, paymentReference } = validatedData;

      const Transaction = Parse.Object.extend('PaymentTransaction');
      const query = new Parse.Query(Transaction);
      const transaction = await query.get(transactionId);

      if (!transaction) {
        res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: 'تراکنش یافت نشد'
        });
        return;
      }

      // Verify with payment gateway (simulated)
      const isPaymentValid = await verifyWithGateway(paymentReference);

      if (isPaymentValid) {
        // Update transaction status
        transaction.set('status', 'completed');
        transaction.set('transactionId', paymentReference);
        transaction.set('completedAt', new Date());
        await transaction.save();

        // Grant access to exam
        await grantExamAccess(
          transaction.get('userId'),
          transaction.get('examId')
        );

        // Update user purchase history
        await updateUserPurchaseHistory(
          transaction.get('userId'),
          transaction.toJSON()
        );

        res.json({
          status: 'success',
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
          status: 'error',
          statusCode: 400,
          message: 'پرداخت تایید نشد'
        });
      }

    } catch (error) {
      console.error('Error verifying payment:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'داده‌های ورودی نامعتبر',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
        return;
      }
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'خطا در تایید پرداخت',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
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
        status: 'success',
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
        status: 'error',
        statusCode: 500,
        message: 'خطا در دریافت تاریخچه پرداخت',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
      });
    }
  }
} 