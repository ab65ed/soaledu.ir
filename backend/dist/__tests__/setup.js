"use strict";
/**
 * Jest Setup
 * تنظیمات عمومی برای تمام تست‌ها
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const globals_1 = require("@jest/globals");
// افزایش timeout برای تست‌های پایگاه داده
globals_1.jest.setTimeout(30000);
// مدیریت اتصال MongoDB برای هر تست
beforeEach(async () => {
    // بررسی وجود URI در environment
    const mongoUri = process.env.MONGODB_URI || globalThis.__MONGO_URI__;
    if (!mongoUri) {
        throw new Error('MongoDB URI not found in environment or global variables');
    }
    // اتصال فقط اگر قبلاً متصل نباشیم
    if (mongoose_1.default.connection.readyState === 0) {
        await mongoose_1.default.connect(mongoUri, {
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000
        });
    }
});
// پاکسازی پایگاه داده بعد از هر تست
afterEach(async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        // پاکسازی تمام collections
        const collections = Object.keys(mongoose_1.default.connection.collections);
        for (const collectionName of collections) {
            const collection = mongoose_1.default.connection.collections[collectionName];
            await collection.deleteMany({});
        }
    }
});
// قطع اتصال در پایان هر test suite
afterAll(async () => {
    try {
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.disconnect();
        }
    }
    catch (error) {
        console.warn('Warning: Error disconnecting mongoose in teardown:', error);
    }
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
//# sourceMappingURL=setup.js.map