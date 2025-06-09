interface ExamPurchaseConfig {
    subjectId: string;
    categories: string[];
    difficulty: string;
    tags: string[];
    totalQuestions: number;
    userId: string;
    examId?: string;
    isRepetition?: boolean;
}
/**
 * سرویس کش هوشمند برای مدیریت خرید آزمون‌ها
 *
 * ویژگی‌ها:
 * - کش مشترک 6 ساعته برای اولین خرید از هر درس
 * - کش منحصر به فرد برای خریدهای بعدی
 * - کش تکرار برای مرور آزمون‌های خریداری شده
 * - مدیریت هوشمند حافظه و عملکرد
 */
export declare class ExamPurchaseCacheService {
    private static instance;
    private sharedSubjectCache;
    private userPurchaseHistory;
    private examRepetitionHistory;
    private readonly SHARED_CACHE_TTL;
    private readonly MAX_SHARED_CACHES;
    private readonly MAX_REPETITIONS;
    private readonly POOL_SIZE_MULTIPLIER;
    private readonly MIN_UNIQUE_PERCENTAGE;
    private constructor();
    static getInstance(): ExamPurchaseCacheService;
    /**
     * دریافت سوالات آزمون بر اساس نوع درخواست
     */
    getExamQuestions(config: ExamPurchaseConfig): Promise<{
        questions: any[];
        cacheInfo: {
            type: 'shared' | 'unique' | 'repetition';
            hitRate: number;
            purchaseNumber?: number;
            repetitionNumber?: number;
        };
    }>;
    /**
     * دریافت سوالات مشترک برای اولین خرید (کش 6 ساعته)
     */
    private getSharedSubjectQuestions;
    /**
     * دریافت سوالات منحصر به فرد برای خریدهای بعدی
     */
    private getUniqueSubjectQuestions;
    /**
     * دریافت سوالات برای تکرار آزمون
     */
    private getRepetitionQuestions;
    /**
     * ثبت خرید جدید آزمون
     */
    recordExamPurchase(userId: string, examId: string, subjectId: string, questions: any[]): Promise<void>;
    /**
     * ایجاد pool مشترک سوالات
     */
    private createSharedQuestionPool;
    /**
     * ایجاد pool منحصر به فرد سوالات
     */
    private createUniqueQuestionPool;
    /**
     * انتخاب تصادفی سوالات از pool
     */
    private selectRandomQuestions;
    /**
     * ذخیره سوالات در کش مشترک
     */
    private cacheSharedQuestions;
    /**
     * تولید کلید کش مشترک
     */
    private generateSharedCacheKey;
    /**
     * تولید کلید تاریخچه کاربر
     */
    private generateUserHistoryKey;
    /**
     * تولید کلید تکرار آزمون
     */
    private generateRepetitionKey;
    /**
     * دریافت تاریخچه خرید کاربر
     */
    private getUserPurchaseHistory;
    /**
     * یافتن قدیمی‌ترین کش مشترک
     */
    private findOldestSharedCacheKey;
    /**
     * محاسبه نرخ hit
     */
    private calculateHitRate;
    /**
     * تمیز کردن کش‌های منقضی شده
     */
    private cleanExpiredCaches;
    /**
     * تمیز کردن تاریخچه‌های قدیمی
     */
    private cleanOldHistories;
    /**
     * دریافت آمار کش
     */
    getCacheStats(): {
        sharedCaches: {
            total: number;
            hitRate: number;
            memoryUsage: number;
            mostUsed: Array<{
                key: string;
                usageCount: number;
                subjectId: string;
                purchaseNumber: number;
            }>;
        };
        userStats: {
            totalUsers: number;
            totalPurchases: number;
            averagePurchasesPerUser: number;
            totalRepetitions: number;
            averageRepetitionsPerExam: number;
        };
        recommendations: string[];
    };
    /**
     * تخمین استفاده از حافظه
     */
    private estimateMemoryUsage;
    /**
     * تولید پیشنهادات بهینه‌سازی
     */
    private generateRecommendations;
    /**
     * پاک کردن کل کش
     */
    clearAllCaches(): void;
    /**
     * پاک کردن کش مربوط به درس خاص
     */
    clearSubjectCache(subjectId: string): void;
    /**
     * دریافت آمار خرید کاربر
     */
    getUserPurchaseStats(userId: string, subjectId: string): {
        totalPurchases: number;
        purchasedExams: string[];
        lastPurchaseAt: Date | null;
        canPurchaseMore: boolean;
    } | null;
    /**
     * دریافت آمار تکرار آزمون
     */
    getExamRepetitionStats(userId: string, examId: string): {
        repetitionCount: number;
        maxRepetitions: number;
        remainingRepetitions: number;
        lastRepetitionAt: Date | null;
        canRepeat: boolean;
    } | null;
}
export default ExamPurchaseCacheService;
