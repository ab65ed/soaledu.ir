/**
 * Cron Jobs Service
 * سرویس وظایف زمان‌بندی شده
 */
/**
 * Initialize all cron jobs
 * راه‌اندازی تمام وظایف زمان‌بندی شده
 */
export declare function initializeCronJobs(): void;
/**
 * Expire timed discounts that have passed their end date
 * غیرفعال کردن تخفیف‌های زمان‌داری که به پایان رسیده‌اند
 */
export declare function expireTimedDiscounts(): Promise<void>;
/**
 * Generate daily statistics for discount groups
 * تولید آمار روزانه برای گروه‌های تخفیف
 */
export declare function generateDailyDiscountStats(): Promise<void>;
/**
 * Manual function to clean up invalid discount groups
 * تابع دستی برای پاک‌سازی گروه‌های تخفیف نامعتبر
 */
export declare function cleanupInvalidDiscountGroups(): Promise<void>;
