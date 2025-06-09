/**
 * Finance Types and Constants
 * تایپ‌ها و ثوابت مشترک برای بخش مالی
 */
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: any;
}
export declare const PRICING_CONFIG: {
    BASE_PRICES: {
        '10-20': number;
        '21-30': number;
        '31-50': number;
    };
    FLASHCARD_PRICES: {
        DEFAULT: number;
        MIN: number;
        MAX: number;
    };
    DISCOUNTS: {
        FIRST_TIME: number;
        BULK_PURCHASE: number;
        STUDENT: number;
        SEASONAL: number;
        FLASHCARD_BULK: number;
    };
    MIN_PRICE: number;
    MAX_PRICE: number;
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
