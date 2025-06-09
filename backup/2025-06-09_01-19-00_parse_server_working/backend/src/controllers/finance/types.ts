/**
 * Finance Types and Constants
 * تایپ‌ها و ثوابت مشترک برای بخش مالی
 */

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
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