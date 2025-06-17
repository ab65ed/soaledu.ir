"use strict";
/**
 * Jest Global Teardown
 * پاکسازی محیط تست
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = async () => {
    console.log('🧹 پاکسازی محیط تست...');
    try {
        // قطع اتصال mongoose
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.disconnect();
            console.log('✅ اتصال mongoose قطع شد');
        }
        // پاکسازی متغیرهای global
        delete globalThis.__MONGO_URI__;
        console.log('✅ پاکسازی محیط تست تکمیل شد');
    }
    catch (error) {
        console.error('❌ خطا در پاکسازی محیط تست:', error);
        // ادامه دادن به جای throw error تا تست‌ها متوقف نشوند
    }
};
//# sourceMappingURL=globalTeardown.js.map