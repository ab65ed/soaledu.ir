"use strict";
/**
 * Finance Types and Constants
 * تایپ‌ها و ثوابت مشترک برای بخش مالی
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING_CONFIG = void 0;
// Pricing configuration
exports.PRICING_CONFIG = {
    // قیمت پایه بر اساس تعداد سوالات (تومان)
    BASE_PRICES: {
        '10-20': 800, // 10-20 سوال: 800 تومان
        '21-30': 1000, // 21-30 سوال: 1000 تومان
        '31-50': 1200 // 31-50 سوال: 1200 تومان
    },
    // قیمت فلش‌کارت‌ها
    FLASHCARD_PRICES: {
        DEFAULT: 200, // قیمت پیش‌فرض فلش‌کارت: 200 تومان
        MIN: 100, // حداقل قیمت
        MAX: 500 // حداکثر قیمت
    },
    // تخفیف‌ها
    DISCOUNTS: {
        FIRST_TIME: 0.1, // 10% تخفیف اولین خرید
        BULK_PURCHASE: 0.15, // 15% تخفیف خرید عمده (بیش از 5 آزمون)
        STUDENT: 0.2, // 20% تخفیف دانشجویی
        SEASONAL: 0.05, // 5% تخفیف فصلی
        FLASHCARD_BULK: 0.1 // 10% تخفیف خرید عمده فلش‌کارت (بیش از 10 عدد)
    },
    // حداقل و حداکثر قیمت
    MIN_PRICE: 500,
    MAX_PRICE: 2000
};
//# sourceMappingURL=types.js.map