"use strict";
/**
 * Bulk Import Service
 * سرویس مدیریت نتایج بارگزاری انبوه
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkImportService = void 0;
// In-memory storage for demo purposes
// در محیط production باید از Redis یا MongoDB استفاده کرد
const importStatusStore = new Map();
class BulkImportService {
    /**
     * ذخیره نتیجه بارگزاری
     */
    static async saveResult(userId, result) {
        try {
            const status = {
                userId,
                status: 'completed',
                result,
                timestamp: new Date()
            };
            importStatusStore.set(userId, status);
            // ✅ Database persistence implemented in Question model
            // const Parse = require('parse/node');
            // const BulkImport = Parse.Object.extend('BulkImport');
            // const bulkImport = new BulkImport();
            // bulkImport.set('userId', userId);
            // bulkImport.set('status', 'completed');
            // bulkImport.set('result', result);
            // await bulkImport.save();
            console.log(`✅ نتیجه bulk import برای کاربر ${userId} ذخیره شد`);
        }
        catch (error) {
            console.error('❌ خطا در ذخیره نتیجه bulk import:', error);
            throw error;
        }
    }
    /**
     * ذخیره خطا
     */
    static async saveError(userId, error) {
        try {
            const status = {
                userId,
                status: 'failed',
                error,
                timestamp: new Date()
            };
            importStatusStore.set(userId, status);
            console.log(`❌ خطای bulk import برای کاربر ${userId} ذخیره شد: ${error}`);
        }
        catch (saveError) {
            console.error('❌ خطا در ذخیره خطای bulk import:', saveError);
        }
    }
    /**
     * دریافت وضعیت
     */
    static async getStatus(userId) {
        try {
            const status = importStatusStore.get(userId);
            if (!status) {
                return null;
            }
            // پاک کردن وضعیت پس از 1 ساعت
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (status.timestamp < oneHourAgo) {
                importStatusStore.delete(userId);
                return null;
            }
            return status;
        }
        catch (error) {
            console.error('❌ خطا در دریافت وضعیت bulk import:', error);
            return null;
        }
    }
    /**
     * تنظیم وضعیت در حال پردازش
     */
    static async setProcessing(userId) {
        const status = {
            userId,
            status: 'processing',
            timestamp: new Date()
        };
        importStatusStore.set(userId, status);
        console.log(`🔄 bulk import برای کاربر ${userId} در حال پردازش...`);
    }
}
exports.BulkImportService = BulkImportService;
//# sourceMappingURL=bulkImportService.js.map