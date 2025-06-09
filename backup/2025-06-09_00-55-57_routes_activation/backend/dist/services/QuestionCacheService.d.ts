interface QuestionPoolConfig {
    categories: string[];
    difficulty: string;
    tags: string[];
    totalQuestions: number;
    attemptNumber?: number;
    userId?: string;
}
interface UserAttemptHistory {
    userId: string;
    examId: string;
    attemptCount: number;
    usedPoolVersions: number[];
    lastAttemptAt: Date;
}
/**
 * سرویس کش هوشمند سوالات با پشتیبانی از Multiple Attempts
 * حل مشکل تکرار سوالات در attempt های مختلف
 */
export declare class QuestionCacheService {
    private static instance;
    private questionPools;
    private userAttemptHistory;
    private readonly CACHE_TTL;
    private readonly MAX_POOLS;
    private readonly POOL_SIZE_MULTIPLIER;
    private readonly MAX_ATTEMPTS;
    private readonly MIN_POOL_OVERLAP;
    private constructor();
    static getInstance(): QuestionCacheService;
    /**
     * تولید کلید یکتا برای پول سوالات با در نظر گیری attempt
     */
    private generatePoolKey;
    /**
     * تولید کلید تاریخچه کاربر
     */
    private generateUserHistoryKey;
    /**
     * دریافت پول سوالات با در نظر گیری attempt number
     */
    getQuestionPoolForAttempt(config: QuestionPoolConfig, userId: string, examId: string): Promise<any[]>;
    /**
     * ایجاد پول یکتای سوالات که با attempt های قبلی تداخل کمی داشته باشد
     */
    private createUniqueQuestionPool;
    /**
     * دریافت ID های سوالات استفاده شده در attempt های قبلی
     */
    private getUsedQuestionIds;
    /**
     * دریافت تاریخچه attempt های کاربر
     */
    private getUserAttemptHistory;
    /**
     * به‌روزرسانی تاریخچه attempt کاربر
     */
    private updateUserAttemptHistory;
    /**
     * انتخاب تصادفی زیرمجموعه از پول
     */
    private getRandomSubset;
    /**
     * تولید عدد تصادفی با seed
     */
    private seededRandom;
    /**
     * shuffle کردن آرایه
     */
    private shuffleArray;
    /**
     * ذخیره پول در کش
     */
    private cacheQuestionPool;
    /**
     * یافتن قدیمی‌ترین کش
     */
    private findOldestCacheKey;
    /**
     * تمیز کردن کش منقضی شده
     */
    private cleanExpiredCache;
    /**
     * تمیز کردن تاریخچه قدیمی attempt ها
     */
    private cleanOldAttemptHistory;
    /**
     * دریافت آمار کش با اطلاعات attempt
     */
    getCacheStats(): {
        totalPools: number;
        hitRate: number;
        memoryUsage: number;
        mostUsedPools: Array<{
            key: string;
            usageCount: number;
            attemptNumber?: number;
        }>;
        attemptStats: {
            totalUsers: number;
            averageAttempts: number;
            maxAttempts: number;
        };
    };
    /**
     * تخمین استفاده از حافظه
     */
    private estimateMemoryUsage;
    /**
     * پاک کردن کل کش
     */
    clearCache(): void;
    /**
     * پاک کردن کش مربوط به دسته‌بندی خاص
     */
    clearCacheByCategory(category: string): void;
    /**
     * دریافت تاریخچه attempt کاربر برای نمایش
     */
    getUserAttemptStats(userId: string, examId: string): UserAttemptHistory | null;
    getQuestionPool(config: QuestionPoolConfig): Promise<any[]>;
    /**
     * روش قدیمی برای سازگاری
     */
    private getQuestionPoolLegacy;
    /**
     * ایجاد پول قدیمی برای سازگاری
     */
    private createQuestionPoolLegacy;
}
export default QuestionCacheService;
