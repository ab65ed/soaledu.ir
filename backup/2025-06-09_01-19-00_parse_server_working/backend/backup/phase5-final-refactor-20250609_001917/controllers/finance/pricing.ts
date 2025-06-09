/**
 * Finance Pricing Controller
 * کنترلر قیمت‌گذاری مالی
 */

import { Response } from 'express';
import { z } from 'zod';
import Parse from 'parse/node';
import { AuthenticatedRequest, PRICING_CONFIG } from './types';
import { calculateExamPrice, calculateSingleFlashcardPrice, calculateFlashcardBulkPrice } from './pricing-utils';

// Validation schemas
const calculatePriceSchema = z.object({
  examId: z.string().optional(),
  questionCount: z.number().min(10).max(50),
  userType: z.string().default('regular'),
  isFirstPurchase: z.boolean().default(false),
  bulkCount: z.number().default(0)
});

const calculateFlashcardPriceSchema = z.object({
  flashcardIds: z.array(z.string()).min(1),
  userType: z.string().default('regular'),
  isFirstPurchase: z.boolean().default(false)
});

export class PricingController {
  /**
   * Calculate exam pricing
   * POST /api/finance/calculate-price
   */
  static async calculatePrice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validatedData = calculatePriceSchema.parse(req.body);
      const { examId, questionCount, userType, isFirstPurchase, bulkCount } = validatedData;

      const pricing = await calculateExamPrice(
        questionCount,
        userType,
        isFirstPurchase,
        bulkCount
      );

      res.json({
        status: 'success',
        data: pricing
      });

    } catch (error) {
      console.error('Error calculating price:', error);
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
        message: 'خطا در محاسبه قیمت',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
      });
    }
  }

  /**
   * Calculate flashcard pricing
   * POST /api/finance/calculate-flashcard-price
   */
  static async calculateFlashcardPrice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validatedData = calculateFlashcardPriceSchema.parse(req.body);
      const { flashcardIds, userType, isFirstPurchase } = validatedData;

      // Get flashcard details
      const query = new Parse.Query('Flashcard');
      query.containedIn('objectId', flashcardIds);
      const flashcards = await query.find();

      if (flashcards.length === 0) {
        res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: 'فلش‌کارتی یافت نشد'
        });
        return;
      }

      const pricing = await calculateFlashcardBulkPrice(
        flashcards,
        userType,
        isFirstPurchase
      );

      res.json({
        status: 'success',
        data: pricing
      });

    } catch (error) {
      console.error('Error calculating flashcard price:', error);
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
        message: 'خطا در محاسبه قیمت فلش‌کارت',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
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
          status: 'error',
          statusCode: 404,
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

      const pricing = await calculateSingleFlashcardPrice(
        flashcard.get('price') || PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT,
        userType,
        isFirstPurchase
      );

      res.json({
        status: 'success',
        data: {
          flashcardId,
          flashcardTitle: flashcard.get('question'),
          pricing
        }
      });

    } catch (error) {
      console.error('Error getting flashcard price:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'خطا در دریافت قیمت فلش‌کارت',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
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
          status: 'error',
          statusCode: 404,
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

      const pricing = await calculateExamPrice(
        questionCount,
        userType,
        isFirstPurchase
      );

      res.json({
        status: 'success',
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
        status: 'error',
        statusCode: 500,
        message: 'خطا در دریافت قیمت آزمون',
        errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
      });
    }
  }
} 