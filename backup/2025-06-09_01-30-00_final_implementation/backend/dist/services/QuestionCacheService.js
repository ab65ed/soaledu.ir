"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCacheService = void 0;
const node_1 = __importDefault(require("parse/node"));
const Question_1 = require("../models/Question");
/**
 * سرویس کش هوشمند سوالات با پشتیبانی از Multiple Attempts
 * حل مشکل تکرار سوالات در attempt های مختلف
 */
class QuestionCacheService {
    constructor() {
        this.questionPools = new Map();
        this.userAttemptHistory = new Map();
        this.CACHE_TTL = 30 * 60 * 1000; // 30 دقیقه
        this.MAX_POOLS = 100; // افزایش برای multiple versions
        this.POOL_SIZE_MULTIPLIER = 3; // 3 برابر سوالات مورد نیاز
        this.MAX_ATTEMPTS = 5; // حداکثر تعداد attempt
        this.MIN_POOL_OVERLAP = 0.3; // حداقل 30% تفاوت بین pool ها
        // تمیز کردن کش منقضی شده هر 10 دقیقه
        setInterval(() => this.cleanExpiredCache(), 10 * 60 * 1000);
        // تمیز کردن تاریخچه قدیمی هر ساعت
        setInterval(() => this.cleanOldAttemptHistory(), 60 * 60 * 1000);
    }
    static getInstance() {
        if (!QuestionCacheService.instance) {
            QuestionCacheService.instance = new QuestionCacheService();
        }
        return QuestionCacheService.instance;
    }
    /**
     * تولید کلید یکتا برای پول سوالات با در نظر گیری attempt
     */
    generatePoolKey(config) {
        const sortedCategories = [...(config.categories || [])].sort();
        const sortedTags = [...(config.tags || [])].sort();
        const attemptSuffix = config.attemptNumber ? `_v${config.attemptNumber}` : '';
        return `pool_${config.difficulty}_${sortedCategories.join(',')}_${sortedTags.join(',')}_${config.totalQuestions}${attemptSuffix}`;
    }
    /**
     * تولید کلید تاریخچه کاربر
     */
    generateUserHistoryKey(userId, examId) {
        return `user_${userId}_exam_${examId}`;
    }
    /**
     * دریافت پول سوالات با در نظر گیری attempt number
     */
    async getQuestionPoolForAttempt(config, userId, examId) {
        // دریافت تاریخچه attempt های کاربر
        const userHistory = this.getUserAttemptHistory(userId, examId);
        const attemptNumber = userHistory.attemptCount + 1;
        if (attemptNumber > this.MAX_ATTEMPTS) {
            throw new Error(`حداکثر تعداد attempt (${this.MAX_ATTEMPTS}) تجاوز شده است`);
        }
        // تنظیم attempt number در config
        const enhancedConfig = {
            ...config,
            attemptNumber,
            userId
        };
        const poolKey = this.generatePoolKey(enhancedConfig);
        const cachedPool = this.questionPools.get(poolKey);
        // بررسی وجود کش معتبر
        if (cachedPool && cachedPool.expiresAt > new Date()) {
            cachedPool.usageCount++;
            cachedPool.lastUsed = new Date();
            console.log(`Cache HIT for attempt ${attemptNumber}, pool: ${poolKey}`);
            // به‌روزرسانی تاریخچه کاربر
            this.updateUserAttemptHistory(userId, examId, attemptNumber, cachedPool.version);
            return this.getRandomSubset(cachedPool.questions, config.totalQuestions);
        }
        console.log(`Cache MISS for attempt ${attemptNumber}, pool: ${poolKey}`);
        // ایجاد پول جدید با اطمینان از عدم تکرار
        const newPool = await this.createUniqueQuestionPool(enhancedConfig, userHistory);
        // ذخیره در کش
        this.cacheQuestionPool(poolKey, newPool, enhancedConfig, attemptNumber);
        // به‌روزرسانی تاریخچه کاربر
        this.updateUserAttemptHistory(userId, examId, attemptNumber, attemptNumber);
        return this.getRandomSubset(newPool, config.totalQuestions);
    }
    /**
     * ایجاد پول یکتای سوالات که با attempt های قبلی تداخل کمی داشته باشد
     */
    async createUniqueQuestionPool(config, userHistory) {
        const query = new node_1.default.Query(Question_1.Question);
        query.equalTo('isPublished', true);
        query.equalTo('difficulty', config.difficulty);
        if (config.categories && config.categories.length > 0) {
            query.containedIn('category', config.categories);
        }
        if (config.tags && config.tags.length > 0) {
            query.containedIn('tags', config.tags);
        }
        // دریافت تعداد بیشتری برای انتخاب
        const poolSize = Math.min(config.totalQuestions * this.POOL_SIZE_MULTIPLIER * 2, // دو برابر بیشتر برای تنوع
        2000 // حداکثر 2000 سوال
        );
        query.limit(poolSize);
        query.descending('createdAt');
        const allQuestions = await query.find();
        const allQuestionsJson = allQuestions.map(q => q.toJSON());
        // اگر attempt اول است، همه سوالات قابل استفاده هستند
        if (userHistory.attemptCount === 0) {
            return this.shuffleArray(allQuestionsJson);
        }
        // برای attempt های بعدی، سوالات استفاده شده قبلی را حذف کنیم
        const usedQuestionIds = await this.getUsedQuestionIds(config.userId, userHistory);
        const availableQuestions = allQuestionsJson.filter(q => !usedQuestionIds.includes(q._id || q.id));
        // اگر سوالات کافی نداریم، مقداری از سوالات قدیمی را اضافه کنیم
        if (availableQuestions.length < config.totalQuestions * this.POOL_SIZE_MULTIPLIER) {
            const additionalNeeded = (config.totalQuestions * this.POOL_SIZE_MULTIPLIER) - availableQuestions.length;
            const oldQuestions = allQuestionsJson
                .filter(q => usedQuestionIds.includes(q._id || q.id))
                .slice(0, additionalNeeded);
            availableQuestions.push(...oldQuestions);
            console.log(`Added ${oldQuestions.length} previously used questions due to insufficient new questions`);
        }
        return this.shuffleArray(availableQuestions);
    }
    /**
     * دریافت ID های سوالات استفاده شده در attempt های قبلی
     */
    async getUsedQuestionIds(userId, userHistory) {
        const usedIds = [];
        // بررسی pool های استفاده شده قبلی
        for (const version of userHistory.usedPoolVersions) {
            const poolKeys = Array.from(this.questionPools.keys()).filter(key => key.includes(`_v${version}`) && key.includes(userId));
            for (const poolKey of poolKeys) {
                const pool = this.questionPools.get(poolKey);
                if (pool) {
                    const questionIds = pool.questions.map(q => q._id || q.id);
                    usedIds.push(...questionIds);
                }
            }
        }
        return [...new Set(usedIds)]; // حذف تکراری ها
    }
    /**
     * دریافت تاریخچه attempt های کاربر
     */
    getUserAttemptHistory(userId, examId) {
        const historyKey = this.generateUserHistoryKey(userId, examId);
        const existing = this.userAttemptHistory.get(historyKey);
        if (existing) {
            return existing;
        }
        // ایجاد تاریخچه جدید
        const newHistory = {
            userId,
            examId,
            attemptCount: 0,
            usedPoolVersions: [],
            lastAttemptAt: new Date()
        };
        this.userAttemptHistory.set(historyKey, newHistory);
        return newHistory;
    }
    /**
     * به‌روزرسانی تاریخچه attempt کاربر
     */
    updateUserAttemptHistory(userId, examId, attemptNumber, poolVersion) {
        const historyKey = this.generateUserHistoryKey(userId, examId);
        const history = this.userAttemptHistory.get(historyKey);
        if (history) {
            history.attemptCount = attemptNumber;
            history.usedPoolVersions.push(poolVersion);
            history.lastAttemptAt = new Date();
            this.userAttemptHistory.set(historyKey, history);
        }
    }
    /**
     * انتخاب تصادفی زیرمجموعه از پول
     */
    getRandomSubset(pool, count) {
        if (pool.length <= count) {
            return [...pool];
        }
        const shuffled = [...pool];
        // Fisher-Yates shuffle با seed ثابت برای session
        const sessionSeed = Date.now() % 1000000;
        let currentIndex = shuffled.length;
        while (currentIndex !== 0) {
            const randomIndex = Math.floor(this.seededRandom(sessionSeed + currentIndex) * currentIndex);
            currentIndex--;
            [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
        }
        return shuffled.slice(0, count);
    }
    /**
     * تولید عدد تصادفی با seed
     */
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    /**
     * shuffle کردن آرایه
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    /**
     * ذخیره پول در کش
     */
    cacheQuestionPool(key, questions, config, version) {
        // حذف قدیمی‌ترین کش در صورت پر بودن
        if (this.questionPools.size >= this.MAX_POOLS) {
            const oldestKey = this.findOldestCacheKey();
            if (oldestKey) {
                this.questionPools.delete(oldestKey);
            }
        }
        const cachedSet = {
            id: key,
            questions,
            configuration: config,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.CACHE_TTL),
            usageCount: 1,
            lastUsed: new Date(),
            version,
            attemptNumber: config.attemptNumber
        };
        this.questionPools.set(key, cachedSet);
    }
    /**
     * یافتن قدیمی‌ترین کش
     */
    findOldestCacheKey() {
        let oldestKey = null;
        let oldestTime = Date.now();
        for (const [key, pool] of this.questionPools.entries()) {
            if (pool.lastUsed.getTime() < oldestTime) {
                oldestTime = pool.lastUsed.getTime();
                oldestKey = key;
            }
        }
        return oldestKey;
    }
    /**
     * تمیز کردن کش منقضی شده
     */
    cleanExpiredCache() {
        const now = new Date();
        const expiredKeys = [];
        for (const [key, pool] of this.questionPools.entries()) {
            if (pool.expiresAt < now) {
                expiredKeys.push(key);
            }
        }
        expiredKeys.forEach(key => {
            this.questionPools.delete(key);
        });
        if (expiredKeys.length > 0) {
            console.log(`Cleaned ${expiredKeys.length} expired question pools from cache`);
        }
    }
    /**
     * تمیز کردن تاریخچه قدیمی attempt ها
     */
    cleanOldAttemptHistory() {
        const now = new Date();
        const expiredKeys = [];
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 روز
        for (const [key, history] of this.userAttemptHistory.entries()) {
            if (now.getTime() - history.lastAttemptAt.getTime() > maxAge) {
                expiredKeys.push(key);
            }
        }
        expiredKeys.forEach(key => {
            this.userAttemptHistory.delete(key);
        });
        if (expiredKeys.length > 0) {
            console.log(`Cleaned ${expiredKeys.length} old user attempt histories`);
        }
    }
    /**
     * دریافت آمار کش با اطلاعات attempt
     */
    getCacheStats() {
        const pools = Array.from(this.questionPools.values());
        const totalUsage = pools.reduce((sum, pool) => sum + pool.usageCount, 0);
        const totalHits = pools.filter(pool => pool.usageCount > 1).length;
        const mostUsed = Array.from(this.questionPools.entries())
            .map(([key, pool]) => ({
            key,
            usageCount: pool.usageCount,
            attemptNumber: pool.attemptNumber
        }))
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, 5);
        // آمار attempt ها
        const histories = Array.from(this.userAttemptHistory.values());
        const totalAttempts = histories.reduce((sum, h) => sum + h.attemptCount, 0);
        const maxAttempts = Math.max(...histories.map(h => h.attemptCount), 0);
        return {
            totalPools: this.questionPools.size,
            hitRate: totalUsage > 0 ? (totalHits / totalUsage) * 100 : 0,
            memoryUsage: this.estimateMemoryUsage(),
            mostUsedPools: mostUsed,
            attemptStats: {
                totalUsers: this.userAttemptHistory.size,
                averageAttempts: histories.length > 0 ? totalAttempts / histories.length : 0,
                maxAttempts
            }
        };
    }
    /**
     * تخمین استفاده از حافظه
     */
    estimateMemoryUsage() {
        let totalSize = 0;
        for (const pool of this.questionPools.values()) {
            totalSize += JSON.stringify(pool).length;
        }
        for (const history of this.userAttemptHistory.values()) {
            totalSize += JSON.stringify(history).length;
        }
        return totalSize; // bytes
    }
    /**
     * پاک کردن کل کش
     */
    clearCache() {
        this.questionPools.clear();
        this.userAttemptHistory.clear();
        console.log('Question cache and attempt history cleared');
    }
    /**
     * پاک کردن کش مربوط به دسته‌بندی خاص
     */
    clearCacheByCategory(category) {
        const keysToDelete = [];
        for (const [key, pool] of this.questionPools.entries()) {
            if (pool.configuration.categories?.includes(category)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.questionPools.delete(key));
        console.log(`Cleared ${keysToDelete.length} pools for category: ${category}`);
    }
    /**
     * دریافت تاریخچه attempt کاربر برای نمایش
     */
    getUserAttemptStats(userId, examId) {
        const historyKey = this.generateUserHistoryKey(userId, examId);
        return this.userAttemptHistory.get(historyKey) || null;
    }
    // متد سازگاری با کد قبلی
    async getQuestionPool(config) {
        // اگر userId مشخص نشده، از روش قدیمی استفاده کن
        if (!config.userId) {
            return this.getQuestionPoolLegacy(config);
        }
        // در غیر این صورت از روش جدید استفاده کن
        return this.getQuestionPoolForAttempt(config, config.userId, 'default-exam');
    }
    /**
     * روش قدیمی برای سازگاری
     */
    async getQuestionPoolLegacy(config) {
        const poolKey = this.generatePoolKey(config);
        const cachedPool = this.questionPools.get(poolKey);
        if (cachedPool && cachedPool.expiresAt > new Date()) {
            cachedPool.usageCount++;
            cachedPool.lastUsed = new Date();
            return this.getRandomSubset(cachedPool.questions, config.totalQuestions);
        }
        const newPool = await this.createQuestionPoolLegacy(config);
        this.cacheQuestionPool(poolKey, newPool, config, 1);
        return this.getRandomSubset(newPool, config.totalQuestions);
    }
    /**
     * ایجاد پول قدیمی برای سازگاری
     */
    async createQuestionPoolLegacy(config) {
        const query = new node_1.default.Query(Question_1.Question);
        query.equalTo('isPublished', true);
        query.equalTo('difficulty', config.difficulty);
        if (config.categories && config.categories.length > 0) {
            query.containedIn('category', config.categories);
        }
        if (config.tags && config.tags.length > 0) {
            query.containedIn('tags', config.tags);
        }
        const poolSize = Math.min(config.totalQuestions * this.POOL_SIZE_MULTIPLIER, 1000);
        query.limit(poolSize);
        query.descending('createdAt');
        const questions = await query.find();
        return questions.map(q => q.toJSON());
    }
}
exports.QuestionCacheService = QuestionCacheService;
exports.default = QuestionCacheService;
//# sourceMappingURL=QuestionCacheService.js.map