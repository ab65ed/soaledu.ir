"use strict";
/**
 * Jest Global Setup
 * راه‌اندازی محیط تست با MongoDB محلی
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = async () => {
    console.log('🚀 راه‌اندازی محیط تست...');
    try {
        // استفاده از MongoDB محلی برای تست
        const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/exam-edu-test';
        console.log(`✅ استفاده از MongoDB: ${mongoUri}`);
        // ذخیره در global برای استفاده در تست‌ها
        globalThis.__MONGO_URI__ = mongoUri;
        // تنظیم متغیرهای محیطی
        process.env.MONGODB_URI = mongoUri;
        process.env.NODE_ENV = 'test';
        process.env.JWT_SECRET = 'test-jwt-secret-for-testing';
        process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-for-testing';
        console.log('🔧 متغیرهای محیطی تست تنظیم شد');
        // تست اتصال
        await mongoose_1.default.connect(mongoUri, {
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000
        });
        console.log('✅ اتصال تست به MongoDB موفق بود');
        // پاکسازی پایگاه داده تست
        await mongoose_1.default.connection.db.dropDatabase();
        console.log('🧹 پایگاه داده تست پاکسازی شد');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('❌ خطا در راه‌اندازی محیط تست:', error);
        console.log('💡 نکته: اطمینان حاصل کنید که MongoDB روی localhost:27017 در حال اجرا است');
        // اگر MongoDB محلی در دسترس نیست، از fallback استفاده کن
        console.log('🔄 تلاش برای استفاده از fallback...');
        const fallbackUri = 'mongodb://127.0.0.1:27017/exam-edu-test-fallback';
        globalThis.__MONGO_URI__ = fallbackUri;
        process.env.MONGODB_URI = fallbackUri;
        console.log('⚠️ استفاده از fallback URI - ممکن است برخی تست‌ها skip شوند');
    }
};
//# sourceMappingURL=globalSetup.js.map