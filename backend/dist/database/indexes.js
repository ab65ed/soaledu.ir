"use strict";
/**
 * Database Indexes Configuration
 * تنظیمات Index های بهینه برای عملکرد بالا در MongoDB
 *
 * این فایل شامل تمام index های مورد نیاز برای بهینه‌سازی query ها می‌باشد
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIndexes = exports.contactIndexes = exports.testExamIndexes = exports.courseExamIndexes = exports.walletIndexes = exports.institutionIndexes = exports.discountCodeIndexes = exports.transactionIndexes = exports.categoryIndexes = exports.examIndexes = exports.questionIndexes = exports.userIndexes = void 0;
exports.applyAllIndexes = applyAllIndexes;
exports.getIndexStats = getIndexStats;
exports.dropUnusedIndexes = dropUnusedIndexes;
exports.createOptimizedIndexes = createOptimizedIndexes;
exports.getIndexAnalysis = getIndexAnalysis;
exports.checkIndexHealth = checkIndexHealth;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
/**
 * User Model Indexes - بهینه‌سازی پرس‌وجوهای کاربری
 */
exports.userIndexes = [
    // Unique email index for authentication
    { key: { email: 1 }, options: { unique: true, background: true } },
    // National Code index (sparse for optional field)
    { key: { nationalCode: 1 }, options: { unique: true, sparse: true, background: true } },
    // Phone Number index (sparse for optional field)
    { key: { phoneNumber: 1 }, options: { unique: true, sparse: true, background: true } },
    // Role-based queries
    { key: { role: 1, isActive: 1 }, options: { background: true } },
    // Institution-based queries
    { key: { institutionId: 1, role: 1 }, options: { sparse: true, background: true } },
    // Created date for sorting and filtering
    { key: { createdAt: -1 }, options: { background: true } },
    // Text search for names
    { key: { firstName: 'text', lastName: 'text' }, options: { background: true } },
    // Login tracking
    { key: { lastLoginAt: -1 }, options: { sparse: true, background: true } },
    // Account status queries
    { key: { isActive: 1, isEmailVerified: 1 }, options: { background: true } },
    // Grade level filtering
    { key: { gradeLevel: 1, isActive: 1 }, options: { sparse: true, background: true } },
    // Profile completion status
    { key: { profileCompleted: 1, createdAt: -1 }, options: { background: true } },
    // Compound index for institutional users
    { key: { institutionId: 1, role: 1, isActive: 1 }, options: { sparse: true, background: true } }
];
/**
 * Question Model Indexes - بهینه‌سازی پرس‌وجوهای سوال
 */
exports.questionIndexes = [
    // Category-based queries
    { key: { category: 1, difficulty: 1, isActive: 1 }, options: { background: true } },
    // Lesson-based queries
    { key: { lesson: 1, difficulty: 1 }, options: { sparse: true, background: true } },
    // Creator queries
    { key: { createdBy: 1, createdAt: -1 }, options: { background: true } },
    // Type-based filtering
    { key: { type: 1, difficulty: 1 }, options: { background: true } },
    // Difficulty filtering
    { key: { difficulty: 1, isActive: 1, createdAt: -1 }, options: { background: true } },
    // Status queries
    { key: { status: 1, isActive: 1 }, options: { background: true } },
    // Full-text search for questions
    { key: { title: 'text', content: 'text' }, options: { background: true } },
    // Tags-based search (if using tags)
    { key: { tags: 1, isActive: 1 }, options: { sparse: true, background: true } },
    // Recently created questions
    { key: { createdAt: -1, isActive: 1 }, options: { background: true } },
    // Usage statistics (if tracking)
    { key: { usageCount: -1, isActive: 1 }, options: { sparse: true, background: true } },
    // Review status for moderated content
    { key: { reviewStatus: 1, createdAt: -1 }, options: { sparse: true, background: true } },
    // Compound index for advanced filtering
    { key: { category: 1, lesson: 1, difficulty: 1, isActive: 1 }, options: { sparse: true, background: true } },
    // Scoring and analytics
    { key: { averageScore: -1, usageCount: -1 }, options: { sparse: true, background: true } }
];
/**
 * Exam Model Indexes - بهینه‌سازی پرس‌وجوهای آزمون
 */
exports.examIndexes = [
    // Creator's exams by status and date
    { key: { creator: 1, status: 1, createdAt: -1 }, options: { background: true } },
    // User's exam attempts
    { key: { user: 1, status: 1, startedAt: -1 }, options: { sparse: true, background: true } },
    // Public published exams
    { key: { status: 1, isPublic: 1, createdAt: -1 }, options: { background: true } },
    // Category-based searches
    { key: { category: 1, status: 1, isPublic: 1 }, options: { sparse: true, background: true } },
    // Lesson-based exams
    { key: { lesson: 1, status: 1 }, options: { sparse: true, background: true } },
    // Filter by difficulty
    { key: { difficulty: 1, status: 1 }, options: { background: true } },
    // Scheduled exams
    { key: { scheduledAt: 1, status: 1 }, options: { sparse: true, background: true } },
    // Duration-based queries
    { key: { duration: 1, isPublic: 1 }, options: { sparse: true, background: true } },
    // Score-based ranking
    { key: { maxScore: -1, status: 1 }, options: { sparse: true, background: true } },
    // Recently completed exams
    { key: { completedAt: -1, status: 1 }, options: { sparse: true, background: true } },
    // Exam type filtering
    { key: { examType: 1, isPublic: 1 }, options: { sparse: true, background: true } },
    // Institution-based exams
    { key: { institutionId: 1, status: 1 }, options: { sparse: true, background: true } }
];
/**
 * Category Model Indexes - بهینه‌سازی پرس‌وجوهای دسته‌بندی
 */
exports.categoryIndexes = [
    // Name-based queries (unique)
    { key: { name: 1 }, options: { unique: true, background: true } },
    // Slug for URL routing
    { key: { slug: 1 }, options: { unique: true, background: true } },
    // Parent-child hierarchy
    { key: { parentId: 1, isActive: 1 }, options: { sparse: true, background: true } },
    // Active categories
    { key: { isActive: 1, createdAt: -1 }, options: { background: true } },
    // Order for display
    { key: { order: 1, isActive: 1 }, options: { sparse: true, background: true } },
    // Text search for category names
    { key: { name: 'text', description: 'text' }, options: { background: true } },
    // Level-based queries for hierarchy
    { key: { level: 1, isActive: 1 }, options: { sparse: true, background: true } }
];
/**
 * Transaction Model Indexes - بهینه‌سازی پرس‌وجوهای تراکنش مالی
 */
exports.transactionIndexes = [
    // User's transactions
    { key: { userId: 1, createdAt: -1 }, options: { background: true } },
    // Transaction status
    { key: { status: 1, createdAt: -1 }, options: { background: true } },
    // Payment method filtering
    { key: { paymentMethod: 1, status: 1 }, options: { background: true } },
    // Amount-based queries
    { key: { amount: -1, createdAt: -1 }, options: { background: true } },
    // Reference number for tracking
    { key: { referenceNumber: 1 }, options: { unique: true, sparse: true, background: true } },
    // Transaction type
    { key: { type: 1, status: 1, createdAt: -1 }, options: { background: true } },
    // Gateway tracking
    { key: { gatewayTransactionId: 1 }, options: { sparse: true, background: true } },
    // Date range queries
    { key: { createdAt: -1, status: 1 }, options: { background: true } }
];
/**
 * DiscountCode Model Indexes - بهینه‌سازی پرس‌وجوهای کد تخفیف
 */
exports.discountCodeIndexes = [
    // Code lookup (unique)
    { key: { code: 1 }, options: { unique: true, background: true } },
    // Active codes
    { key: { isActive: 1, validFrom: 1, validTo: 1 }, options: { background: true } },
    // Creator's codes
    { key: { createdBy: 1, isActive: 1 }, options: { background: true } },
    // Usage tracking
    { key: { usageCount: -1, maxUsage: 1 }, options: { sparse: true, background: true } },
    // Expiration tracking
    { key: { validTo: 1, isActive: 1 }, options: { sparse: true, background: true } },
    // Type-based filtering
    { key: { type: 1, isActive: 1 }, options: { background: true } },
    // Institution-specific codes
    { key: { institutionId: 1, isActive: 1 }, options: { sparse: true, background: true } }
];
/**
 * Institution Model Indexes - بهینه‌سازی پرس‌وجوهای سازمان
 */
exports.institutionIndexes = [
    // Name-based queries
    { key: { name: 1 }, options: { background: true } },
    // Domain for email validation
    { key: { domain: 1 }, options: { unique: true, sparse: true, background: true } },
    // Active institutions
    { key: { isActive: 1, createdAt: -1 }, options: { background: true } },
    // Type-based filtering
    { key: { type: 1, isActive: 1 }, options: { background: true } },
    // Location-based queries
    { key: { city: 1, province: 1 }, options: { sparse: true, background: true } },
    // Text search for institutions
    { key: { name: 'text', description: 'text' }, options: { background: true } },
    // Admin user tracking
    { key: { adminUserId: 1 }, options: { sparse: true, background: true } }
];
/**
 * Wallet Model Indexes - بهینه‌سازی پرس‌وجوهای کیف پول
 */
exports.walletIndexes = [
    // User's wallet (unique)
    { key: { userId: 1 }, options: { unique: true, background: true } },
    // Balance tracking
    { key: { balance: -1, isActive: 1 }, options: { background: true } },
    // Active wallets
    { key: { isActive: 1, updatedAt: -1 }, options: { background: true } },
    // Currency-based queries
    { key: { currency: 1, isActive: 1 }, options: { background: true } },
    // Last transaction tracking
    { key: { lastTransactionAt: -1 }, options: { sparse: true, background: true } }
];
/**
 * CourseExam Model Indexes - بهینه‌سازی پرس‌وجوهای آزمون دوره‌ای
 */
exports.courseExamIndexes = [
    // Course-based queries
    { key: { courseId: 1, isActive: 1 }, options: { background: true } },
    // Creator's course exams
    { key: { createdBy: 1, createdAt: -1 }, options: { background: true } },
    // Status and visibility
    { key: { status: 1, isPublic: 1 }, options: { background: true } },
    // Difficulty and category
    { key: { difficulty: 1, category: 1 }, options: { background: true } },
    // Scheduled course exams
    { key: { startDate: 1, endDate: 1 }, options: { sparse: true, background: true } },
    // Duration-based filtering
    { key: { duration: 1, isActive: 1 }, options: { background: true } },
    // Price-based queries
    { key: { price: 1, isPublic: 1 }, options: { sparse: true, background: true } }
];
/**
 * TestExam Model Indexes - بهینه‌سازی پرس‌وجوهای آزمون تستی
 */
exports.testExamIndexes = [
    // Creator's test exams
    { key: { createdBy: 1, createdAt: -1 }, options: { background: true } },
    // Status and type
    { key: { status: 1, examType: 1 }, options: { background: true } },
    // Subject and grade level
    { key: { subject: 1, gradeLevel: 1 }, options: { background: true } },
    // Difficulty filtering
    { key: { difficulty: 1, isActive: 1 }, options: { background: true } },
    // Public test exams
    { key: { isPublic: 1, status: 1, createdAt: -1 }, options: { background: true } },
    // Question count filtering
    { key: { questionCount: 1, duration: 1 }, options: { background: true } },
    // Institution-based test exams
    { key: { institutionId: 1, isActive: 1 }, options: { sparse: true, background: true } }
];
/**
 * Contact Model Indexes - بهینه‌سازی پرس‌وجوهای تماس
 */
exports.contactIndexes = [
    // User's contacts
    { key: { userId: 1, createdAt: -1 }, options: { sparse: true, background: true } },
    // Status-based queries
    { key: { status: 1, createdAt: -1 }, options: { background: true } },
    // Type-based filtering
    { key: { type: 1, status: 1 }, options: { background: true } },
    // Priority handling
    { key: { priority: 1, status: 1 }, options: { background: true } },
    // Email-based lookup
    { key: { email: 1, createdAt: -1 }, options: { background: true } },
    // Phone-based lookup
    { key: { phone: 1 }, options: { sparse: true, background: true } },
    // Text search for subject and message
    { key: { subject: 'text', message: 'text' }, options: { background: true } }
];
/**
 * Payment Model Indexes - بهینه‌سازی پرس‌وجوهای پرداخت
 */
exports.paymentIndexes = [
    // User's payments
    { key: { userId: 1, createdAt: -1 }, options: { background: true } },
    // Payment status
    { key: { status: 1, createdAt: -1 }, options: { background: true } },
    // Gateway tracking
    { key: { gateway: 1, status: 1 }, options: { background: true } },
    // Transaction reference
    { key: { transactionId: 1 }, options: { unique: true, sparse: true, background: true } },
    // Amount-based queries
    { key: { amount: -1, status: 1 }, options: { background: true } },
    // Gateway transaction ID
    { key: { gatewayTransactionId: 1 }, options: { sparse: true, background: true } },
    // Order tracking
    { key: { orderId: 1, status: 1 }, options: { sparse: true, background: true } },
    // Date range queries
    { key: { paidAt: -1, status: 1 }, options: { sparse: true, background: true } }
];
/**
 * اعمال index ها به collection مشخص شده
 */
async function applyIndexesToCollection(collectionName, indexes) {
    try {
        const db = mongoose_1.default.connection.db;
        const collection = db.collection(collectionName);
        logger_1.logger.info(`Starting index creation for ${collectionName}`, {
            collectionName,
            indexCount: indexes.length
        });
        for (const indexConfig of indexes) {
            try {
                const indexName = indexConfig.options.name || 'unnamed_index';
                // بررسی وجود index قبل از ایجاد
                const existingIndexes = await collection.indexes();
                const indexExists = existingIndexes.some(idx => idx.name === indexName);
                if (indexExists) {
                    logger_1.logger.info(`Index ${indexName} already exists, skipping`, {
                        collectionName,
                        indexName
                    });
                    continue;
                }
                await collection.createIndex(indexConfig.fields, indexConfig.options);
                logger_1.logger.info(`Successfully created index: ${indexName}`, {
                    collectionName,
                    indexName,
                    fields: indexConfig.fields
                });
            }
            catch (indexError) {
                logger_1.logger.error(`Failed to create index for ${collectionName}`, {
                    collectionName,
                    indexName: indexConfig.options.name,
                    error: indexError.message,
                    fields: indexConfig.fields
                });
            }
        }
        logger_1.logger.info(`Completed index creation for ${collectionName}`, {
            collectionName
        });
    }
    catch (error) {
        logger_1.logger.error(`Error applying indexes to ${collectionName}:`, {
            collectionName,
            error: error.message
        });
        throw error;
    }
}
/**
 * اعمال تمام index ها
 */
async function applyAllIndexes() {
    try {
        logger_1.logger.info('Starting database optimization with indexes');
        // اعمال index ها به هر collection
        await applyIndexesToCollection('Question', exports.questionIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('User', exports.userIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('Exam', exports.examIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('Category', exports.categoryIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('Transaction', exports.transactionIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('DiscountCode', exports.discountCodeIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('Institution', exports.institutionIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('Wallet', exports.walletIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('CourseExam', exports.courseExamIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('TestExam', exports.testExamIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('Contact', exports.contactIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        await applyIndexesToCollection('Payment', exports.paymentIndexes.map(idx => ({ fields: idx.key, options: idx.options })));
        logger_1.logger.info('Successfully applied all database indexes');
    }
    catch (error) {
        logger_1.logger.error('Failed to apply database indexes:', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}
/**
 * دریافت آمار index ها برای collection مشخص
 */
async function getIndexStats(collectionName) {
    try {
        const db = mongoose_1.default.connection.db;
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();
        const stats = await db.command({ collStats: collectionName });
        return {
            collectionName,
            indexCount: indexes.length,
            indexes: indexes.map(idx => ({
                name: idx.name,
                keys: idx.key,
                unique: idx.unique || false,
                sparse: idx.sparse || false
            })),
            totalIndexSize: stats.totalIndexSize || 0,
            totalSize: stats.size || 0,
            indexSizeRatio: stats.size ? (stats.totalIndexSize / stats.size * 100).toFixed(2) + '%' : '0%'
        };
    }
    catch (error) {
        logger_1.logger.error(`Error getting index stats for ${collectionName}:`, {
            collectionName,
            error: error.message
        });
        throw error;
    }
}
/**
 * حذف index های غیرضروری
 */
async function dropUnusedIndexes(collectionName) {
    try {
        const db = mongoose_1.default.connection.db;
        const collection = db.collection(collectionName);
        // دریافت آمار استفاده از index ها
        const indexStats = await db.admin().command({
            collStats: collectionName,
            indexDetails: true
        });
        logger_1.logger.info(`Index usage stats for ${collectionName}:`, indexStats);
        // این قسمت می‌تواند برای تحلیل استفاده از index ها توسعه یابد
        // در حال حاضر فقط لاگ می‌کند
    }
    catch (error) {
        logger_1.logger.error(`Error analyzing index usage for ${collectionName}:`, {
            collectionName,
            error: error.message
        });
    }
}
/**
 * Database Indexes Management
 *
 * این فایل شامل توابع مدیریت ایندکس‌های پایگاه داده است
 */
/**
 * ایجاد ایندکس‌های بهینه‌سازی شده برای تمام models
 */
async function createOptimizedIndexes() {
    try {
        logger_1.logger.info('شروع ایجاد ایندکس‌های بهینه‌سازی شده...');
        // User Model Indexes
        const User = mongoose_1.default.model('User');
        await User.createIndexes();
        logger_1.logger.info('ایندکس‌های User model ایجاد شد');
        // Question Model Indexes  
        const Question = mongoose_1.default.model('Question');
        await Question.createIndexes();
        logger_1.logger.info('ایندکس‌های Question model ایجاد شد');
        // Exam Model Indexes
        const Exam = mongoose_1.default.model('Exam');
        await Exam.createIndexes();
        logger_1.logger.info('ایندکس‌های Exam model ایجاد شد');
        // Category Model Indexes
        const Category = mongoose_1.default.model('Category');
        await Category.createIndexes();
        logger_1.logger.info('ایندکس‌های Category model ایجاد شد');
        logger_1.logger.info('تمام ایندکس‌های بهینه‌سازی شده با موفقیت ایجاد شد');
    }
    catch (error) {
        logger_1.logger.error('خطا در ایجاد ایندکس‌ها:', error);
        throw error;
    }
}
/**
 * تحلیل عملکرد ایندکس‌های موجود
 */
async function getIndexAnalysis() {
    try {
        logger_1.logger.info('شروع تحلیل ایندکس‌های پایگاه داده...');
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('اتصال به پایگاه داده برقرار نیست');
        }
        const collections = await db.listCollections().toArray();
        const analysis = {};
        for (const collection of collections) {
            const collectionName = collection.name;
            const coll = db.collection(collectionName);
            try {
                // دریافت ایندکس‌ها
                const indexes = await coll.indexes();
                analysis[collectionName] = {
                    totalIndexes: indexes.length,
                    indexes: indexes.map((idx) => ({
                        name: idx.name,
                        key: idx.key,
                        unique: idx.unique || false,
                        sparse: idx.sparse || false
                    }))
                };
            }
            catch (error) {
                logger_1.logger.warn(`خطا در دریافت ایندکس‌های کالکشن ${collectionName}:`, error);
                analysis[collectionName] = {
                    error: 'امکان دریافت ایندکس‌ها وجود ندارد'
                };
            }
        }
        logger_1.logger.info('تحلیل ایندکس‌ها تکمیل شد');
        return analysis;
    }
    catch (error) {
        logger_1.logger.error('خطا در تحلیل ایندکس‌ها:', error);
        throw error;
    }
}
/**
 * بررسی سلامت ایندکس‌ها
 */
async function checkIndexHealth() {
    try {
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('اتصال به پایگاه داده برقرار نیست');
        }
        const admin = db.admin();
        // بررسی وضعیت کلی پایگاه داده
        const dbStats = await db.stats();
        // بررسی عملکرد سرور
        let serverStatus;
        try {
            serverStatus = await admin.serverStatus();
        }
        catch (error) {
            logger_1.logger.warn('امکان دریافت وضعیت سرور وجود ندارد:', error);
            serverStatus = null;
        }
        return {
            database: {
                collections: dbStats.collections,
                indexes: dbStats.indexes,
                dataSize: dbStats.dataSize,
                indexSize: dbStats.indexSize
            },
            performance: serverStatus ? {
                indexHits: serverStatus.indexCounters?.hits || 0,
                indexMisses: serverStatus.indexCounters?.misses || 0
            } : {
                message: 'آمار عملکرد ایندکس در دسترس نیست'
            }
        };
    }
    catch (error) {
        logger_1.logger.error('خطا در بررسی سلامت ایندکس‌ها:', error);
        throw error;
    }
}
exports.default = {
    createOptimizedIndexes,
    getIndexAnalysis,
    checkIndexHealth,
    userIndexes: exports.userIndexes,
    questionIndexes: exports.questionIndexes,
    examIndexes: exports.examIndexes,
    categoryIndexes: exports.categoryIndexes,
    transactionIndexes: exports.transactionIndexes,
    discountCodeIndexes: exports.discountCodeIndexes,
    institutionIndexes: exports.institutionIndexes,
    walletIndexes: exports.walletIndexes,
    courseExamIndexes: exports.courseExamIndexes,
    testExamIndexes: exports.testExamIndexes,
    contactIndexes: exports.contactIndexes,
    paymentIndexes: exports.paymentIndexes
};
//# sourceMappingURL=indexes.js.map