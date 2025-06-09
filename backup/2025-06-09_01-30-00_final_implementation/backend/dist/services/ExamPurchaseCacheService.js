"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamPurchaseCacheService = void 0;
const node_1 = __importDefault(require("parse/node"));
/**
 * سرویس کش هوشمند برای مدیریت خرید آزمون‌ها
 *
 * ویژگی‌ها:
 * - کش مشترک 6 ساعته برای اولین خرید از هر درس
 * - کش منحصر به فرد برای خریدهای بعدی
 * - کش تکرار برای مرور آزمون‌های خریداری شده
 * - مدیریت هوشمند حافظه و عملکرد
 */
class ExamPurchaseCacheService {
    constructor() {
        // کش مشترک برای اولین خریدها (6 ساعت)
        this.sharedSubjectCache = new Map();
        // تاریخچه خریدهای کاربران
        this.userPurchaseHistory = new Map();
        // تاریخچه تکرار آزمون‌ها
        this.examRepetitionHistory = new Map();
        // تنظیمات
        this.SHARED_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 ساعت
        this.MAX_SHARED_CACHES = 50; // حداکثر کش مشترک
        this.MAX_REPETITIONS = 2; // حداکثر تکرار
        this.POOL_SIZE_MULTIPLIER = 3; // 3 برابر سوالات مورد نیاز
        this.MIN_UNIQUE_PERCENTAGE = 0.7; // 70% سوالات جدید
        // تمیز کردن کش منقضی شده هر 30 دقیقه
        setInterval(() => this.cleanExpiredCaches(), 30 * 60 * 1000);
        // تمیز کردن تاریخچه قدیمی هر 2 ساعت
        setInterval(() => this.cleanOldHistories(), 2 * 60 * 60 * 1000);
    }
    static getInstance() {
        if (!ExamPurchaseCacheService.instance) {
            ExamPurchaseCacheService.instance = new ExamPurchaseCacheService();
        }
        return ExamPurchaseCacheService.instance;
    }
    /**
     * دریافت سوالات آزمون بر اساس نوع درخواست
     */
    async getExamQuestions(config) {
        // اگر تکرار آزمون است
        if (config.isRepetition && config.examId) {
            return this.getRepetitionQuestions(config);
        }
        // دریافت تاریخچه خریدهای کاربر
        const userHistory = this.getUserPurchaseHistory(config.userId, config.subjectId);
        const purchaseNumber = userHistory.totalPurchases + 1;
        // اگر اولین خرید از این درس است
        if (purchaseNumber === 1) {
            return this.getSharedSubjectQuestions(config, purchaseNumber);
        }
        // برای خریدهای بعدی، سوالات منحصر به فرد
        return this.getUniqueSubjectQuestions(config, userHistory, purchaseNumber);
    }
    /**
     * دریافت سوالات مشترک برای اولین خرید (کش 6 ساعته)
     */
    async getSharedSubjectQuestions(config, purchaseNumber) {
        const cacheKey = this.generateSharedCacheKey(config, purchaseNumber);
        const cachedData = this.sharedSubjectCache.get(cacheKey);
        // بررسی وجود کش معتبر
        if (cachedData && cachedData.expiresAt > new Date()) {
            cachedData.usageCount++;
            cachedData.lastUsed = new Date();
            console.log(`Shared Cache HIT for subject ${config.subjectId}, purchase ${purchaseNumber}`);
            const selectedQuestions = this.selectRandomQuestions(cachedData.questions, config.totalQuestions);
            return {
                questions: selectedQuestions,
                cacheInfo: {
                    type: 'shared',
                    hitRate: this.calculateHitRate(),
                    purchaseNumber
                }
            };
        }
        console.log(`Shared Cache MISS for subject ${config.subjectId}, purchase ${purchaseNumber}`);
        // ایجاد کش جدید
        const questions = await this.createSharedQuestionPool(config);
        this.cacheSharedQuestions(cacheKey, questions, config, purchaseNumber);
        const selectedQuestions = this.selectRandomQuestions(questions, config.totalQuestions);
        return {
            questions: selectedQuestions,
            cacheInfo: {
                type: 'shared',
                hitRate: this.calculateHitRate(),
                purchaseNumber
            }
        };
    }
    /**
     * دریافت سوالات منحصر به فرد برای خریدهای بعدی
     */
    async getUniqueSubjectQuestions(config, userHistory, purchaseNumber) {
        console.log(`Creating unique questions for user ${config.userId}, purchase ${purchaseNumber}`);
        // دریافت سوالات جدید که قبلاً استفاده نشده
        const questions = await this.createUniqueQuestionPool(config, userHistory.usedQuestionIds);
        const selectedQuestions = this.selectRandomQuestions(questions, config.totalQuestions);
        return {
            questions: selectedQuestions,
            cacheInfo: {
                type: 'unique',
                hitRate: 0, // سوالات منحصر به فرد هیچ‌وقت cache hit ندارند
                purchaseNumber
            }
        };
    }
    /**
     * دریافت سوالات برای تکرار آزمون
     */
    async getRepetitionQuestions(config) {
        const repetitionKey = this.generateRepetitionKey(config.userId, config.examId);
        const repetitionHistory = this.examRepetitionHistory.get(repetitionKey);
        if (!repetitionHistory) {
            throw new Error('آزمون خریداری نشده یا تاریخچه یافت نشد');
        }
        if (repetitionHistory.repetitionCount >= this.MAX_REPETITIONS) {
            throw new Error(`حداکثر تعداد تکرار (${this.MAX_REPETITIONS}) تجاوز شده است`);
        }
        // افزایش تعداد تکرار
        repetitionHistory.repetitionCount++;
        repetitionHistory.lastRepetitionAt = new Date();
        console.log(`Repetition Cache HIT for exam ${config.examId}, repetition ${repetitionHistory.repetitionCount}`);
        return {
            questions: repetitionHistory.originalQuestions,
            cacheInfo: {
                type: 'repetition',
                hitRate: 100, // تکرار همیشه cache hit است
                repetitionNumber: repetitionHistory.repetitionCount
            }
        };
    }
    /**
     * ثبت خرید جدید آزمون
     */
    async recordExamPurchase(userId, examId, subjectId, questions) {
        // به‌روزرسانی تاریخچه خرید کاربر
        const historyKey = this.generateUserHistoryKey(userId, subjectId);
        const userHistory = this.userPurchaseHistory.get(historyKey) || {
            userId,
            subjectId,
            purchasedExams: [],
            totalPurchases: 0,
            lastPurchaseAt: new Date(),
            usedQuestionIds: []
        };
        userHistory.purchasedExams.push(examId);
        userHistory.totalPurchases++;
        userHistory.lastPurchaseAt = new Date();
        // اضافه کردن ID سوالات استفاده شده
        const questionIds = questions.map(q => q._id || q.id);
        userHistory.usedQuestionIds.push(...questionIds);
        this.userPurchaseHistory.set(historyKey, userHistory);
        // ایجاد تاریخچه تکرار برای آزمون جدید
        const repetitionKey = this.generateRepetitionKey(userId, examId);
        const repetitionHistory = {
            userId,
            examId,
            repetitionCount: 1, // اولین بار
            maxRepetitions: this.MAX_REPETITIONS,
            lastRepetitionAt: new Date(),
            originalQuestions: questions,
            isFirstAttempt: true
        };
        this.examRepetitionHistory.set(repetitionKey, repetitionHistory);
        console.log(`Recorded purchase: User ${userId}, Exam ${examId}, Subject ${subjectId}`);
    }
    /**
     * ایجاد pool مشترک سوالات
     */
    async createSharedQuestionPool(config) {
        const Question = node_1.default.Object.extend('Question');
        const query = new node_1.default.Query(Question);
        query.equalTo('isPublished', true);
        query.equalTo('difficulty', config.difficulty);
        if (config.categories && config.categories.length > 0) {
            query.containedIn('category', config.categories);
        }
        if (config.tags && config.tags.length > 0) {
            query.containedIn('tags', config.tags);
        }
        // دریافت تعداد بیشتری برای pool
        const poolSize = Math.min(config.totalQuestions * this.POOL_SIZE_MULTIPLIER, 1000);
        query.limit(poolSize);
        query.descending('createdAt');
        const questions = await query.find();
        return questions.map(q => q.toJSON());
    }
    /**
     * ایجاد pool منحصر به فرد سوالات
     */
    async createUniqueQuestionPool(config, usedQuestionIds) {
        const Question = node_1.default.Object.extend('Question');
        const query = new node_1.default.Query(Question);
        query.equalTo('isPublished', true);
        query.equalTo('difficulty', config.difficulty);
        if (config.categories && config.categories.length > 0) {
            query.containedIn('category', config.categories);
        }
        if (config.tags && config.tags.length > 0) {
            query.containedIn('tags', config.tags);
        }
        // حذف سوالات استفاده شده قبلی
        if (usedQuestionIds.length > 0) {
            query.notContainedIn('objectId', usedQuestionIds);
        }
        const poolSize = Math.min(config.totalQuestions * this.POOL_SIZE_MULTIPLIER, 1000);
        query.limit(poolSize);
        query.descending('createdAt');
        const questions = await query.find();
        const questionArray = questions.map(q => q.toJSON());
        // اگر سوالات کافی نداریم، هشدار بده
        if (questionArray.length < config.totalQuestions) {
            console.warn(`Insufficient unique questions. Requested: ${config.totalQuestions}, Available: ${questionArray.length}`);
        }
        return questionArray;
    }
    /**
     * انتخاب تصادفی سوالات از pool
     */
    selectRandomQuestions(pool, count) {
        if (pool.length <= count) {
            return [...pool];
        }
        const shuffled = [...pool];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }
    /**
     * ذخیره سوالات در کش مشترک
     */
    cacheSharedQuestions(key, questions, config, purchaseNumber) {
        // حذف قدیمی‌ترین کش در صورت پر بودن
        if (this.sharedSubjectCache.size >= this.MAX_SHARED_CACHES) {
            const oldestKey = this.findOldestSharedCacheKey();
            if (oldestKey) {
                this.sharedSubjectCache.delete(oldestKey);
            }
        }
        const cachedData = {
            subjectId: config.subjectId,
            difficulty: config.difficulty,
            categories: config.categories,
            tags: config.tags,
            purchaseNumber,
            questions,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.SHARED_CACHE_TTL),
            usageCount: 1,
            lastUsed: new Date()
        };
        this.sharedSubjectCache.set(key, cachedData);
    }
    /**
     * تولید کلید کش مشترک
     */
    generateSharedCacheKey(config, purchaseNumber) {
        const sortedCategories = [...(config.categories || [])].sort();
        const sortedTags = [...(config.tags || [])].sort();
        return `shared_${config.subjectId}_${config.difficulty}_${sortedCategories.join(',')}_${sortedTags.join(',')}_${config.totalQuestions}_p${purchaseNumber}`;
    }
    /**
     * تولید کلید تاریخچه کاربر
     */
    generateUserHistoryKey(userId, subjectId) {
        return `user_${userId}_subject_${subjectId}`;
    }
    /**
     * تولید کلید تکرار آزمون
     */
    generateRepetitionKey(userId, examId) {
        return `repetition_${userId}_exam_${examId}`;
    }
    /**
     * دریافت تاریخچه خرید کاربر
     */
    getUserPurchaseHistory(userId, subjectId) {
        const historyKey = this.generateUserHistoryKey(userId, subjectId);
        const existing = this.userPurchaseHistory.get(historyKey);
        if (existing) {
            return existing;
        }
        // ایجاد تاریخچه جدید
        const newHistory = {
            userId,
            subjectId,
            purchasedExams: [],
            totalPurchases: 0,
            lastPurchaseAt: new Date(),
            usedQuestionIds: []
        };
        this.userPurchaseHistory.set(historyKey, newHistory);
        return newHistory;
    }
    /**
     * یافتن قدیمی‌ترین کش مشترک
     */
    findOldestSharedCacheKey() {
        let oldestKey = null;
        let oldestTime = Date.now();
        for (const [key, cache] of this.sharedSubjectCache.entries()) {
            if (cache.lastUsed.getTime() < oldestTime) {
                oldestTime = cache.lastUsed.getTime();
                oldestKey = key;
            }
        }
        return oldestKey;
    }
    /**
     * محاسبه نرخ hit
     */
    calculateHitRate() {
        const caches = Array.from(this.sharedSubjectCache.values());
        const totalUsage = caches.reduce((sum, cache) => sum + cache.usageCount, 0);
        const totalHits = caches.filter(cache => cache.usageCount > 1).length;
        return totalUsage > 0 ? (totalHits / totalUsage) * 100 : 0;
    }
    /**
     * تمیز کردن کش‌های منقضی شده
     */
    cleanExpiredCaches() {
        const now = new Date();
        const expiredKeys = [];
        for (const [key, cache] of this.sharedSubjectCache.entries()) {
            if (cache.expiresAt < now) {
                expiredKeys.push(key);
            }
        }
        expiredKeys.forEach(key => {
            this.sharedSubjectCache.delete(key);
        });
        if (expiredKeys.length > 0) {
            console.log(`Cleaned ${expiredKeys.length} expired shared caches`);
        }
    }
    /**
     * تمیز کردن تاریخچه‌های قدیمی
     */
    cleanOldHistories() {
        const now = new Date();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 روز
        const expiredKeys = [];
        // تمیز کردن تاریخچه خرید
        for (const [key, history] of this.userPurchaseHistory.entries()) {
            if (now.getTime() - history.lastPurchaseAt.getTime() > maxAge) {
                expiredKeys.push(key);
            }
        }
        expiredKeys.forEach(key => {
            this.userPurchaseHistory.delete(key);
        });
        // تمیز کردن تاریخچه تکرار
        const expiredRepetitionKeys = [];
        for (const [key, history] of this.examRepetitionHistory.entries()) {
            if (now.getTime() - history.lastRepetitionAt.getTime() > maxAge) {
                expiredRepetitionKeys.push(key);
            }
        }
        expiredRepetitionKeys.forEach(key => {
            this.examRepetitionHistory.delete(key);
        });
        if (expiredKeys.length > 0 || expiredRepetitionKeys.length > 0) {
            console.log(`Cleaned ${expiredKeys.length} purchase histories and ${expiredRepetitionKeys.length} repetition histories`);
        }
    }
    /**
     * دریافت آمار کش
     */
    getCacheStats() {
        // آمار کش مشترک
        const sharedCaches = Array.from(this.sharedSubjectCache.values());
        const totalUsage = sharedCaches.reduce((sum, cache) => sum + cache.usageCount, 0);
        const totalHits = sharedCaches.filter(cache => cache.usageCount > 1).length;
        const hitRate = totalUsage > 0 ? (totalHits / totalUsage) * 100 : 0;
        const mostUsed = Array.from(this.sharedSubjectCache.entries())
            .map(([key, cache]) => ({
            key,
            usageCount: cache.usageCount,
            subjectId: cache.subjectId,
            purchaseNumber: cache.purchaseNumber
        }))
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, 5);
        // آمار کاربران
        const userHistories = Array.from(this.userPurchaseHistory.values());
        const repetitionHistories = Array.from(this.examRepetitionHistory.values());
        const totalPurchases = userHistories.reduce((sum, h) => sum + h.totalPurchases, 0);
        const totalRepetitions = repetitionHistories.reduce((sum, h) => sum + h.repetitionCount, 0);
        // پیشنهادات
        const recommendations = this.generateRecommendations(hitRate, sharedCaches.length);
        return {
            sharedCaches: {
                total: this.sharedSubjectCache.size,
                hitRate,
                memoryUsage: this.estimateMemoryUsage(),
                mostUsed
            },
            userStats: {
                totalUsers: this.userPurchaseHistory.size,
                totalPurchases,
                averagePurchasesPerUser: userHistories.length > 0 ? totalPurchases / userHistories.length : 0,
                totalRepetitions,
                averageRepetitionsPerExam: repetitionHistories.length > 0 ? totalRepetitions / repetitionHistories.length : 0
            },
            recommendations
        };
    }
    /**
     * تخمین استفاده از حافظه
     */
    estimateMemoryUsage() {
        let totalSize = 0;
        for (const cache of this.sharedSubjectCache.values()) {
            totalSize += JSON.stringify(cache).length;
        }
        for (const history of this.userPurchaseHistory.values()) {
            totalSize += JSON.stringify(history).length;
        }
        for (const repetition of this.examRepetitionHistory.values()) {
            totalSize += JSON.stringify(repetition).length;
        }
        return totalSize; // bytes
    }
    /**
     * تولید پیشنهادات بهینه‌سازی
     */
    generateRecommendations(hitRate, cacheCount) {
        const recommendations = [];
        if (hitRate < 60) {
            recommendations.push('نرخ hit کش مشترک پایین است. TTL را افزایش دهید');
        }
        if (cacheCount > 40) {
            recommendations.push('تعداد کش‌های مشترک زیاد است. MAX_SHARED_CACHES را کاهش دهید');
        }
        if (this.userPurchaseHistory.size > 1000) {
            recommendations.push('تعداد کاربران زیاد است. cleanup interval را کاهش دهید');
        }
        if (recommendations.length === 0) {
            recommendations.push('عملکرد سیستم کش مطلوب است');
        }
        return recommendations;
    }
    /**
     * پاک کردن کل کش
     */
    clearAllCaches() {
        this.sharedSubjectCache.clear();
        this.userPurchaseHistory.clear();
        this.examRepetitionHistory.clear();
        console.log('All caches cleared');
    }
    /**
     * پاک کردن کش مربوط به درس خاص
     */
    clearSubjectCache(subjectId) {
        const keysToDelete = [];
        for (const [key, cache] of this.sharedSubjectCache.entries()) {
            if (cache.subjectId === subjectId) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.sharedSubjectCache.delete(key));
        console.log(`Cleared ${keysToDelete.length} caches for subject: ${subjectId}`);
    }
    /**
     * دریافت آمار خرید کاربر
     */
    getUserPurchaseStats(userId, subjectId) {
        const historyKey = this.generateUserHistoryKey(userId, subjectId);
        const history = this.userPurchaseHistory.get(historyKey);
        if (!history) {
            return {
                totalPurchases: 0,
                purchasedExams: [],
                lastPurchaseAt: null,
                canPurchaseMore: true
            };
        }
        return {
            totalPurchases: history.totalPurchases,
            purchasedExams: history.purchasedExams,
            lastPurchaseAt: history.lastPurchaseAt,
            canPurchaseMore: true // همیشه می‌تواند خرید کند
        };
    }
    /**
     * دریافت آمار تکرار آزمون
     */
    getExamRepetitionStats(userId, examId) {
        const repetitionKey = this.generateRepetitionKey(userId, examId);
        const history = this.examRepetitionHistory.get(repetitionKey);
        if (!history) {
            return null;
        }
        const remainingRepetitions = this.MAX_REPETITIONS - history.repetitionCount;
        return {
            repetitionCount: history.repetitionCount,
            maxRepetitions: this.MAX_REPETITIONS,
            remainingRepetitions,
            lastRepetitionAt: history.lastRepetitionAt,
            canRepeat: remainingRepetitions > 0
        };
    }
}
exports.ExamPurchaseCacheService = ExamPurchaseCacheService;
exports.default = ExamPurchaseCacheService;
//# sourceMappingURL=ExamPurchaseCacheService.js.map