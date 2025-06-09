"use strict";
/**
 * Finance Pricing Utilities
 * توابع کمکی برای محاسبات قیمت‌گذاری
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExamPrice = calculateExamPrice;
exports.calculateSingleFlashcardPrice = calculateSingleFlashcardPrice;
exports.calculateFlashcardBulkPrice = calculateFlashcardBulkPrice;
exports.groupBy = groupBy;
exports.groupByDate = groupByDate;
exports.getTopExams = getTopExams;
const types_1 = require("./types");
/**
 * Calculate exam pricing based on question count and user parameters
 * محاسبه قیمت آزمون بر اساس تعداد سوالات و پارامترهای کاربر
 */
async function calculateExamPrice(questionCount, userType = 'regular', isFirstPurchase = false, bulkCount = 0) {
    // Determine price category
    let priceCategory;
    let basePrice;
    if (questionCount <= 20) {
        priceCategory = '10-20';
        basePrice = types_1.PRICING_CONFIG.BASE_PRICES['10-20'];
    }
    else if (questionCount <= 30) {
        priceCategory = '21-30';
        basePrice = types_1.PRICING_CONFIG.BASE_PRICES['21-30'];
    }
    else {
        priceCategory = '31-50';
        basePrice = types_1.PRICING_CONFIG.BASE_PRICES['31-50'];
    }
    // Calculate discounts
    const discounts = [];
    // First time purchase discount
    if (isFirstPurchase) {
        const discountAmount = basePrice * types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME;
        discounts.push({
            type: 'first_time',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME * 100
        });
    }
    // Student discount
    if (userType === 'student') {
        const discountAmount = basePrice * types_1.PRICING_CONFIG.DISCOUNTS.STUDENT;
        discounts.push({
            type: 'student',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.STUDENT * 100
        });
    }
    // Bulk purchase discount
    if (bulkCount >= 5) {
        const discountAmount = basePrice * types_1.PRICING_CONFIG.DISCOUNTS.BULK_PURCHASE;
        discounts.push({
            type: 'bulk_purchase',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.BULK_PURCHASE * 100
        });
    }
    // Calculate total discount
    const totalDiscount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    let finalPrice = basePrice - totalDiscount;
    // Apply min/max limits
    finalPrice = Math.max(types_1.PRICING_CONFIG.MIN_PRICE, Math.min(types_1.PRICING_CONFIG.MAX_PRICE, finalPrice));
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
async function calculateSingleFlashcardPrice(basePrice = types_1.PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT, userType = 'regular', isFirstPurchase = false) {
    // Calculate discounts
    const discounts = [];
    // First time purchase discount
    if (isFirstPurchase) {
        const discountAmount = basePrice * types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME;
        discounts.push({
            type: 'first_time',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME * 100
        });
    }
    // Student discount
    if (userType === 'student') {
        const discountAmount = basePrice * types_1.PRICING_CONFIG.DISCOUNTS.STUDENT;
        discounts.push({
            type: 'student',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.STUDENT * 100
        });
    }
    // Calculate total discount
    const totalDiscount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    let finalPrice = basePrice - totalDiscount;
    // Apply min/max limits for flashcards
    finalPrice = Math.max(types_1.PRICING_CONFIG.FLASHCARD_PRICES.MIN, Math.min(types_1.PRICING_CONFIG.FLASHCARD_PRICES.MAX, finalPrice));
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
async function calculateFlashcardBulkPrice(flashcards, userType = 'regular', isFirstPurchase = false) {
    const flashcardCount = flashcards.length;
    let totalBasePrice = 0;
    // Sum up individual prices
    flashcards.forEach(flashcard => {
        const price = flashcard.get('price') || types_1.PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT;
        totalBasePrice += price;
    });
    // Calculate discounts
    const discounts = [];
    // First time purchase discount
    if (isFirstPurchase) {
        const discountAmount = totalBasePrice * types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME;
        discounts.push({
            type: 'first_time',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME * 100
        });
    }
    // Student discount
    if (userType === 'student') {
        const discountAmount = totalBasePrice * types_1.PRICING_CONFIG.DISCOUNTS.STUDENT;
        discounts.push({
            type: 'student',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.STUDENT * 100
        });
    }
    // Bulk flashcard discount (10+ flashcards)
    if (flashcardCount >= 10) {
        const discountAmount = totalBasePrice * types_1.PRICING_CONFIG.DISCOUNTS.FLASHCARD_BULK;
        discounts.push({
            type: 'flashcard_bulk',
            amount: discountAmount,
            percentage: types_1.PRICING_CONFIG.DISCOUNTS.FLASHCARD_BULK * 100
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
function groupBy(transactions, field) {
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
function groupByDate(transactions) {
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
function getTopExams(transactions) {
    const examStats = transactions.reduce((acc, transaction) => {
        const examId = transaction.get('examId');
        if (!acc[examId]) {
            acc[examId] = { examId, count: 0, revenue: 0 };
        }
        acc[examId].count++;
        acc[examId].revenue += transaction.get('amount');
        return acc;
    }, {});
    return Object.values(examStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
}
//# sourceMappingURL=pricing-utils.js.map