"use strict";
/**
 * Cron Jobs Service
 * سرویس وظایف زمان‌بندی شده
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCronJobs = initializeCronJobs;
exports.expireTimedDiscounts = expireTimedDiscounts;
exports.generateDailyDiscountStats = generateDailyDiscountStats;
exports.cleanupInvalidDiscountGroups = cleanupInvalidDiscountGroups;
const node_cron_1 = __importDefault(require("node-cron"));
const InstitutionalDiscountGroup_1 = __importDefault(require("../models/InstitutionalDiscountGroup"));
/**
 * Initialize all cron jobs
 * راه‌اندازی تمام وظایف زمان‌بندی شده
 */
function initializeCronJobs() {
    console.log('🕐 Initializing cron jobs...');
    // انقضای تخفیف‌های زمان‌دار - هر ساعت یکبار
    node_cron_1.default.schedule('0 * * * *', async () => {
        try {
            await expireTimedDiscounts();
        }
        catch (error) {
            console.error('Error in timed discount expiry cron job:', error);
        }
    });
    // گزارش آماری روزانه - هر روز ساعت 2 صبح
    node_cron_1.default.schedule('0 2 * * *', async () => {
        try {
            await generateDailyDiscountStats();
        }
        catch (error) {
            console.error('Error in daily stats cron job:', error);
        }
    });
    console.log('✅ Cron jobs initialized successfully');
}
/**
 * Expire timed discounts that have passed their end date
 * غیرفعال کردن تخفیف‌های زمان‌داری که به پایان رسیده‌اند
 */
async function expireTimedDiscounts() {
    try {
        const now = new Date();
        // پیدا کردن تخفیف‌های منقضی شده
        const expiredGroups = await InstitutionalDiscountGroup_1.default.find({
            isActive: true,
            endDate: { $lt: now, $exists: true }
        });
        if (expiredGroups.length === 0) {
            console.log('🕐 No expired discount groups found');
            return;
        }
        // غیرفعال کردن تخفیف‌های منقضی شده
        const result = await InstitutionalDiscountGroup_1.default.updateMany({
            isActive: true,
            endDate: { $lt: now, $exists: true }
        }, {
            $set: { isActive: false },
            $push: {
                errorLog: `تخفیف در تاریخ ${now.toISOString()} به دلیل انقضای زمان غیرفعال شد`
            }
        });
        console.log(`🕐 Expired ${result.modifiedCount} discount groups`);
        // ثبت لاگ برای هر گروه منقضی شده
        for (const group of expiredGroups) {
            console.log(`🕐 Expired discount group: ${group.groupName || group._id} (End date: ${group.endDate})`);
        }
    }
    catch (error) {
        console.error('Error expiring timed discounts:', error);
        throw error;
    }
}
/**
 * Generate daily statistics for discount groups
 * تولید آمار روزانه برای گروه‌های تخفیف
 */
async function generateDailyDiscountStats() {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        // آمار کلی
        const totalGroups = await InstitutionalDiscountGroup_1.default.countDocuments();
        const activeGroups = await InstitutionalDiscountGroup_1.default.countDocuments({ isActive: true });
        const expiredGroups = await InstitutionalDiscountGroup_1.default.countDocuments({
            isActive: false,
            endDate: { $exists: true, $lt: now }
        });
        const tieredGroups = await InstitutionalDiscountGroup_1.default.countDocuments({
            'tiers.0': { $exists: true }
        });
        const timedGroups = await InstitutionalDiscountGroup_1.default.countDocuments({
            $or: [
                { startDate: { $exists: true } },
                { endDate: { $exists: true } }
            ]
        });
        // تخفیف‌هایی که امروز منقضی می‌شوند
        const expiringToday = await InstitutionalDiscountGroup_1.default.find({
            isActive: true,
            endDate: { $gte: today, $lt: tomorrow }
        });
        // تخفیف‌هایی که امروز شروع می‌شوند
        const startingToday = await InstitutionalDiscountGroup_1.default.find({
            isActive: true,
            startDate: { $gte: today, $lt: tomorrow }
        });
        const stats = {
            date: today.toISOString().split('T')[0],
            totalGroups,
            activeGroups,
            expiredGroups,
            tieredGroups,
            timedGroups,
            expiringToday: expiringToday.length,
            startingToday: startingToday.length,
            expiringTodayList: expiringToday.map(group => ({
                id: group._id,
                name: group.groupName,
                endDate: group.endDate
            })),
            startingTodayList: startingToday.map(group => ({
                id: group._id,
                name: group.groupName,
                startDate: group.startDate
            }))
        };
        console.log('📊 Daily Discount Stats:', JSON.stringify(stats, null, 2));
        // اگر تخفیف‌هایی امروز منقضی می‌شوند، هشدار دهید
        if (expiringToday.length > 0) {
            console.warn(`⚠️ ${expiringToday.length} discount groups are expiring today!`);
        }
        // اگر تخفیف‌هایی امروز شروع می‌شوند، اطلاع دهید
        if (startingToday.length > 0) {
            console.log(`🎉 ${startingToday.length} discount groups are starting today!`);
        }
    }
    catch (error) {
        console.error('Error generating daily discount stats:', error);
        throw error;
    }
}
/**
 * Manual function to clean up invalid discount groups
 * تابع دستی برای پاک‌سازی گروه‌های تخفیف نامعتبر
 */
async function cleanupInvalidDiscountGroups() {
    try {
        console.log('🧹 Starting cleanup of invalid discount groups...');
        // پیدا کردن گروه‌هایی که هیچ تخفیفی ندارند
        const invalidGroups = await InstitutionalDiscountGroup_1.default.find({
            $and: [
                { discountPercentage: { $exists: false } },
                { discountAmount: { $exists: false } },
                { 'tiers.0': { $exists: false } }
            ]
        });
        if (invalidGroups.length > 0) {
            console.log(`🧹 Found ${invalidGroups.length} invalid discount groups`);
            // غیرفعال کردن گروه‌های نامعتبر
            await InstitutionalDiscountGroup_1.default.updateMany({
                $and: [
                    { discountPercentage: { $exists: false } },
                    { discountAmount: { $exists: false } },
                    { 'tiers.0': { $exists: false } }
                ]
            }, {
                $set: { isActive: false },
                $push: {
                    errorLog: `گروه در تاریخ ${new Date().toISOString()} به دلیل نداشتن تخفیف معتبر غیرفعال شد`
                }
            });
            console.log(`🧹 Deactivated ${invalidGroups.length} invalid discount groups`);
        }
        else {
            console.log('🧹 No invalid discount groups found');
        }
    }
    catch (error) {
        console.error('Error cleaning up invalid discount groups:', error);
        throw error;
    }
}
//# sourceMappingURL=cronJobs.js.map