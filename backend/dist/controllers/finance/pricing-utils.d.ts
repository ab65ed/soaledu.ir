/**
 * Finance Pricing Utilities
 * توابع کمکی برای محاسبات قیمت‌گذاری
 */
import { PricingCalculation, FlashcardPricingCalculation } from './types';
/**
 * Calculate exam pricing based on question count and user parameters
 * محاسبه قیمت آزمون بر اساس تعداد سوالات و پارامترهای کاربر
 */
export declare function calculateExamPrice(questionCount: number, userType?: string, isFirstPurchase?: boolean, bulkCount?: number): Promise<PricingCalculation>;
/**
 * Calculate single flashcard price
 * محاسبه قیمت تک فلش‌کارت
 */
export declare function calculateSingleFlashcardPrice(basePrice?: number, userType?: string, isFirstPurchase?: boolean): Promise<PricingCalculation>;
/**
 * Calculate bulk flashcard price
 * محاسبه قیمت عمده فلش‌کارت‌ها
 */
export declare function calculateFlashcardBulkPrice(flashcards: any[], userType?: string, isFirstPurchase?: boolean): Promise<FlashcardPricingCalculation>;
/**
 * Group transactions by field
 * گروه‌بندی تراکنش‌ها بر اساس فیلد
 */
export declare function groupBy(transactions: any[], field: string): Record<string, number>;
/**
 * Group transactions by date
 * گروه‌بندی تراکنش‌ها بر اساس تاریخ
 */
export declare function groupByDate(transactions: any[]): Record<string, number>;
/**
 * Get top selling exams
 * دریافت پرفروش‌ترین آزمون‌ها
 */
export declare function getTopExams(transactions: any[]): Array<{
    examId: string;
    count: number;
    revenue: number;
}>;
