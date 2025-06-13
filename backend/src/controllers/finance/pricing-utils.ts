/**
 * Finance Pricing Utilities
 * توابع کمکی برای محاسبات قیمت‌گذاری
 */

import { PRICING_CONFIG, PricingCalculation, FlashcardPricingCalculation } from './types';
import mongoose from 'mongoose';
import InstitutionalDiscountGroup, { IInstitutionalDiscountGroup } from '../../models/InstitutionalDiscountGroup';

/**
 * Calculate institutional discount for a user
 * محاسبه تخفیف سازمانی برای کاربر
 */
export async function calculateInstitutionalDiscount(
  userId: string,
  basePrice: number
): Promise<{ discountAmount: number; discountPercentage: number; groupId?: string; isTimedDiscount: boolean; isTieredDiscount: boolean }> {
  try {
    // پیدا کردن تخفیف‌های فعال و معتبر برای کاربر
    const now = new Date();
    
    // جستجوی تخفیف‌های معتبر
    const discountGroups = await InstitutionalDiscountGroup.find({
      isActive: true,
      status: 'completed',
      $or: [
        // تخفیف‌های بدون محدودیت زمانی
        { startDate: { $exists: false }, endDate: { $exists: false } },
        // تخفیف‌های زمان‌دار فعال
        {
          $and: [
            { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
            { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] }
          ]
        }
      ]
    }).populate('uploadedBy');

    if (discountGroups.length === 0) {
      return { discountAmount: 0, discountPercentage: 0, isTimedDiscount: false, isTieredDiscount: false };
    }

    // بررسی عضویت کاربر در هر گروه تخفیف و محاسبه بهترین تخفیف
    let bestDiscount = { 
      discountAmount: 0, 
      discountPercentage: 0, 
      groupId: undefined as string | undefined,
      isTimedDiscount: false,
      isTieredDiscount: false
    };

    for (const group of discountGroups) {
      // TODO: بررسی عضویت کاربر در گروه
      // فعلاً فرض می‌کنیم کاربر در گروه عضو است
      const isMember = await checkUserMembershipInGroup(userId, group._id.toString());
      
      if (!isMember) {
        continue;
      }

      let currentDiscount = { discountAmount: 0, discountPercentage: 0 };
      const isTimedDiscount = !!(group.startDate || group.endDate);
      const isTieredDiscount = !!(group.tiers && group.tiers.length > 0);

      if (isTieredDiscount && group.tiers) {
        // محاسبه تخفیف پلکانی بر اساس تعداد کاربران گروه
        const userCount = group.matchedUsersCount;
        const tieredDiscount = (group as any).calculateTieredDiscount(userCount);
        
        if (tieredDiscount) {
          if (tieredDiscount.discountPercentage) {
            currentDiscount.discountPercentage = tieredDiscount.discountPercentage;
            currentDiscount.discountAmount = (basePrice * tieredDiscount.discountPercentage) / 100;
          } else if (tieredDiscount.discountAmount) {
            currentDiscount.discountAmount = tieredDiscount.discountAmount;
            currentDiscount.discountPercentage = (tieredDiscount.discountAmount / basePrice) * 100;
          }
        }
      } else {
        // تخفیف ساده
        if (group.discountPercentage) {
          currentDiscount.discountPercentage = group.discountPercentage;
          currentDiscount.discountAmount = (basePrice * group.discountPercentage) / 100;
        } else if (group.discountAmount) {
          currentDiscount.discountAmount = group.discountAmount;
          currentDiscount.discountPercentage = (group.discountAmount / basePrice) * 100;
        }
      }

      // انتخاب بهترین تخفیف (بیشترین مقدار)
      if (currentDiscount.discountAmount > bestDiscount.discountAmount) {
        bestDiscount = {
          ...currentDiscount,
          groupId: group._id.toString(),
          isTimedDiscount,
          isTieredDiscount
        };
      }
    }

    return bestDiscount;
  } catch (error) {
    console.error('Error calculating institutional discount:', error);
    return { discountAmount: 0, discountPercentage: 0, isTimedDiscount: false, isTieredDiscount: false };
  }
}

/**
 * Check if user is member of a discount group
 * بررسی عضویت کاربر در گروه تخفیف
 * TODO: پیاده‌سازی منطق بررسی عضویت بر اساس جدول UserDiscountGroupMembership
 */
async function checkUserMembershipInGroup(userId: string, groupId: string): Promise<boolean> {
  // فعلاً true برمی‌گردانیم تا سیستم کار کند
  // در آینده باید با جدول عضویت‌ها چک شود
  return true;
}

/**
 * Calculate exam pricing based on question count and user parameters
 * محاسبه قیمت آزمون بر اساس تعداد سوالات و پارامترهای کاربر
 */
export async function calculateExamPrice(
  questionCount: number,
  userType: string = 'regular',
  isFirstPurchase: boolean = false,
  bulkCount: number = 0,
  userId?: string
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

  // Institutional discount (اضافه شده جدید)
  if (userId) {
    const institutionalDiscount = await calculateInstitutionalDiscount(userId, basePrice);
    if (institutionalDiscount.discountAmount > 0) {
      discounts.push({
        type: `institutional${institutionalDiscount.isTimedDiscount ? '_timed' : ''}${institutionalDiscount.isTieredDiscount ? '_tiered' : ''}`,
        amount: institutionalDiscount.discountAmount,
        percentage: institutionalDiscount.discountPercentage
      });
    }
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
  isFirstPurchase: boolean = false,
  userId?: string
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

  // Institutional discount (اضافه شده جدید)
  if (userId) {
    const institutionalDiscount = await calculateInstitutionalDiscount(userId, basePrice);
    if (institutionalDiscount.discountAmount > 0) {
      discounts.push({
        type: `institutional${institutionalDiscount.isTimedDiscount ? '_timed' : ''}${institutionalDiscount.isTieredDiscount ? '_tiered' : ''}`,
        amount: institutionalDiscount.discountAmount,
        percentage: institutionalDiscount.discountPercentage
      });
    }
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
  isFirstPurchase: boolean = false,
  userId?: string
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

  // Institutional discount (اضافه شده جدید)
  if (userId) {
    const institutionalDiscount = await calculateInstitutionalDiscount(userId, totalBasePrice);
    if (institutionalDiscount.discountAmount > 0) {
      discounts.push({
        type: `institutional${institutionalDiscount.isTimedDiscount ? '_timed' : ''}${institutionalDiscount.isTieredDiscount ? '_tiered' : ''}`,
        amount: institutionalDiscount.discountAmount,
        percentage: institutionalDiscount.discountPercentage
      });
    }
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