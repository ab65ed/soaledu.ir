/**
 * Finance Pricing Utilities
 * توابع کمکی برای محاسبات قیمت‌گذاری
 */

import { PRICING_CONFIG, PricingCalculation, FlashcardPricingCalculation } from './types';

/**
 * Calculate exam pricing based on question count and user parameters
 * محاسبه قیمت آزمون بر اساس تعداد سوالات و پارامترهای کاربر
 */
export async function calculateExamPrice(
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
 * Calculate single flashcard price
 * محاسبه قیمت تک فلش‌کارت
 */
export async function calculateSingleFlashcardPrice(
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
export async function calculateFlashcardBulkPrice(
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

/**
 * Group transactions by field
 * گروه‌بندی تراکنش‌ها بر اساس فیلد
 */
export function groupBy(transactions: any[], field: string): Record<string, number> {
  return transactions.reduce((acc, transaction) => {
    const key = transaction.get(field) || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Group transactions by date
 * گروه‌بندی تراکنش‌ها بر اساس تاریخ
 */
export function groupByDate(transactions: any[]): Record<string, number> {
  return transactions.reduce((acc, transaction) => {
    const date = transaction.get('completedAt')?.toISOString().split('T')[0] || 'unknown';
    acc[date] = (acc[date] || 0) + transaction.get('amount');
    return acc;
  }, {});
}

/**
 * Get top selling exams
 * دریافت پرفروش‌ترین آزمون‌ها
 */
export function getTopExams(transactions: any[]): Array<{ examId: string; count: number; revenue: number }> {
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