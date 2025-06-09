"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveWithdrawal = exports.getDashboardStats = exports.updateNotificationSettings = exports.getNotificationSettings = exports.getFinancialReport = exports.getTransactions = exports.getWithdrawals = exports.requestWithdrawal = exports.recordDesignerEarning = exports.getWallet = void 0;
const node_1 = __importDefault(require("parse/node"));
const finance_1 = require("../models/finance");
// Helper Functions
async function getUserWallet(userId) {
    const query = new node_1.default.Query('Wallet');
    query.equalTo('userId', userId);
    try {
        const wallet = await query.first({ useMasterKey: true });
        if (!wallet) {
            // ایجاد کیف پول جدید
            const newWallet = new finance_1.WalletClass();
            newWallet.userId = userId;
            newWallet.balance = 0;
            newWallet.totalEarnings = 0;
            newWallet.totalWithdrawals = 0;
            newWallet.pendingWithdrawals = 0;
            newWallet.freezeAmount = 0;
            newWallet.set('lastUpdated', new Date());
            await newWallet.save(null, { useMasterKey: true });
            return {
                userId,
                balance: 0,
                totalEarnings: 0,
                totalWithdrawals: 0,
                pendingWithdrawals: 0,
                lastUpdated: new Date(),
                freezeAmount: 0,
                availableBalance: 0
            };
        }
        const data = wallet.toJSON();
        return {
            userId: data.userId,
            balance: data.balance || 0,
            totalEarnings: data.totalEarnings || 0,
            totalWithdrawals: data.totalWithdrawals || 0,
            pendingWithdrawals: data.pendingWithdrawals || 0,
            lastUpdated: data.lastUpdated || new Date(),
            freezeAmount: data.freezeAmount || 0,
            availableBalance: (data.balance || 0) - (data.freezeAmount || 0) - (data.pendingWithdrawals || 0)
        };
    }
    catch (error) {
        console.error('Error getting user wallet:', error);
        throw new Error('خطا در بازیابی کیف پول کاربر');
    }
}
async function updateWalletBalance(userId, amount, type) {
    const query = new node_1.default.Query('Wallet');
    query.equalTo('userId', userId);
    try {
        let wallet = await query.first({ useMasterKey: true });
        if (!wallet) {
            wallet = new finance_1.WalletClass();
            wallet.userId = userId;
            wallet.balance = 0;
            wallet.totalEarnings = 0;
            wallet.totalWithdrawals = 0;
            wallet.pendingWithdrawals = 0;
            wallet.freezeAmount = 0;
        }
        const currentBalance = wallet.get('balance') || 0;
        const newBalance = type === 'ADD' ? currentBalance + amount : currentBalance - amount;
        wallet.set('balance', Math.max(0, newBalance));
        wallet.set('lastUpdated', new Date());
        if (type === 'ADD') {
            const currentEarnings = wallet.get('totalEarnings') || 0;
            wallet.set('totalEarnings', currentEarnings + amount);
        }
        else {
            const currentWithdrawals = wallet.get('totalWithdrawals') || 0;
            wallet.set('totalWithdrawals', currentWithdrawals + amount);
        }
        await wallet.save(null, { useMasterKey: true });
    }
    catch (error) {
        console.error('Error updating wallet balance:', error);
        throw new Error('خطا در به‌روزرسانی موجودی کیف پول');
    }
}
async function createTransaction(data) {
    const transaction = new finance_1.TransactionClass();
    transaction.set('userId', data.userId);
    transaction.set('type', data.type);
    transaction.set('amount', data.amount);
    transaction.set('description', data.description);
    transaction.set('status', 'COMPLETED');
    transaction.set('date', new Date());
    if (data.referenceId)
        transaction.set('referenceId', data.referenceId);
    if (data.designerId)
        transaction.set('designerId', data.designerId);
    if (data.designerShare)
        transaction.set('designerShare', data.designerShare);
    if (data.platformFee)
        transaction.set('platformFee', data.platformFee);
    if (data.metadata)
        transaction.set('metadata', data.metadata);
    try {
        await transaction.save(null, { useMasterKey: true });
        return transaction.id;
    }
    catch (error) {
        console.error('Error creating transaction:', error);
        throw new Error('خطا در ایجاد تراکنش');
    }
}
// Controllers
// دریافت اطلاعات کیف پول
const getWallet = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        const wallet = await getUserWallet(userId);
        res.json({
            success: true,
            data: {
                ...wallet,
                formattedBalance: (0, finance_1.formatCurrency)(wallet.balance),
                formattedTotalEarnings: (0, finance_1.formatCurrency)(wallet.totalEarnings),
                formattedAvailableBalance: (0, finance_1.formatCurrency)(wallet.availableBalance)
            }
        });
    }
    catch (error) {
        console.error('Error in getWallet:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.getWallet = getWallet;
// ثبت درآمد طراح (هنگام فروش آزمون یا فلش‌کارت)
const recordDesignerEarning = async (req, res) => {
    try {
        const { designerId, totalAmount, itemType, itemId, itemTitle } = req.body;
        if (!designerId || !totalAmount || !itemType || !itemId) {
            res.status(400).json({
                success: false,
                message: 'اطلاعات ناقص ارسال شده است'
            });
            return;
        }
        const designerShare = (0, finance_1.calculateDesignerEarning)(totalAmount);
        const platformFee = (0, finance_1.calculatePlatformFee)(totalAmount);
        // به‌روزرسانی کیف پول طراح
        await updateWalletBalance(designerId, designerShare, 'ADD');
        // ثبت تراکنش
        await createTransaction({
            userId: designerId,
            type: finance_1.TransactionType.DESIGNER_EARNING,
            amount: designerShare,
            description: `درآمد از فروش ${itemType === 'EXAM' ? 'آزمون' : 'فلش‌کارت'}: ${itemTitle}`,
            referenceId: itemId,
            designerId,
            designerShare,
            platformFee,
            metadata: {
                itemType,
                itemTitle,
                totalAmount,
                designerSharePercentage: finance_1.DEFAULT_PRICING.designerShare
            }
        });
        res.json({
            success: true,
            message: 'درآمد طراح با موفقیت ثبت شد',
            data: {
                designerShare,
                platformFee,
                formattedDesignerShare: (0, finance_1.formatCurrency)(designerShare)
            }
        });
    }
    catch (error) {
        console.error('Error in recordDesignerEarning:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.recordDesignerEarning = recordDesignerEarning;
// درخواست برداشت وجه
const requestWithdrawal = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        // اعتبارسنجی داده‌ها
        const validationResult = finance_1.WithdrawalRequestSchema.safeParse(req.body);
        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            res.status(400).json({
                success: false,
                message: 'اطلاعات ارسال شده نامعتبر است',
                errors
            });
            return;
        }
        const { amount, paymentMethod, accountDetails, description } = validationResult.data;
        // بررسی موجودی کیف پول
        const wallet = await getUserWallet(userId);
        if (!(0, finance_1.canRequestWithdrawal)(wallet, amount)) {
            res.status(400).json({
                success: false,
                message: 'موجودی کافی برای برداشت وجود ندارد یا مبلغ کمتر از حداقل مجاز است',
                data: {
                    availableBalance: wallet.availableBalance,
                    minAmount: finance_1.WITHDRAWAL_LIMITS.MIN_AMOUNT,
                    formattedAvailableBalance: (0, finance_1.formatCurrency)(wallet.availableBalance)
                }
            });
            return;
        }
        // بررسی محدودیت‌های روزانه/ماهانه (اختیاری)
        // این قسمت می‌تواند بعداً پیاده‌سازی شود
        // ایجاد درخواست برداشت
        const withdrawal = new finance_1.WithdrawalRequestClass();
        withdrawal.userId = userId;
        withdrawal.amount = amount;
        withdrawal.paymentMethod = paymentMethod;
        withdrawal.set('accountDetails', accountDetails);
        withdrawal.status = finance_1.WithdrawalStatus.PENDING;
        withdrawal.set('requestDate', new Date());
        withdrawal.trackingNumber = (0, finance_1.generateTrackingNumber)();
        if (description) {
            withdrawal.set('description', description);
        }
        await withdrawal.save(null, { useMasterKey: true });
        // مسدود کردن مبلغ در کیف پول
        const query = new node_1.default.Query('Wallet');
        query.equalTo('userId', userId);
        const walletObj = await query.first({ useMasterKey: true });
        if (walletObj) {
            const currentPending = walletObj.get('pendingWithdrawals') || 0;
            walletObj.set('pendingWithdrawals', currentPending + amount);
            await walletObj.save(null, { useMasterKey: true });
        }
        // ثبت تراکنش
        await createTransaction({
            userId,
            type: finance_1.TransactionType.WITHDRAWAL_REQUEST,
            amount,
            description: `درخواست برداشت وجه - شماره پیگیری: ${withdrawal.trackingNumber}`,
            referenceId: withdrawal.id,
            metadata: {
                trackingNumber: withdrawal.trackingNumber,
                paymentMethod,
                accountDetails
            }
        });
        res.json({
            success: true,
            message: 'درخواست برداشت وجه با موفقیت ثبت شد',
            data: {
                trackingNumber: withdrawal.trackingNumber,
                amount,
                formattedAmount: (0, finance_1.formatCurrency)(amount),
                status: finance_1.WithdrawalStatus.PENDING,
                requestDate: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error in requestWithdrawal:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.requestWithdrawal = requestWithdrawal;
// دریافت لیست درخواست‌های برداشت
const getWithdrawals = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        const { page = 1, limit = 10, status } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = new node_1.default.Query('WithdrawalRequest');
        query.equalTo('userId', userId);
        query.descending('createdAt');
        query.skip(skip);
        query.limit(Number(limit));
        if (status && Object.values(finance_1.WithdrawalStatus).includes(status)) {
            query.equalTo('status', status);
        }
        const [withdrawals, total] = await Promise.all([
            query.find({ useMasterKey: true }),
            query.count({ useMasterKey: true })
        ]);
        const formattedWithdrawals = withdrawals.map(w => {
            const data = w.toJSON();
            return {
                id: w.id,
                amount: data.amount,
                formattedAmount: (0, finance_1.formatCurrency)(data.amount),
                status: data.status,
                paymentMethod: data.paymentMethod,
                requestDate: data.requestDate,
                processedDate: data.processedDate,
                trackingNumber: data.trackingNumber,
                description: data.description,
                rejectionReason: data.rejectionReason
            };
        });
        res.json({
            success: true,
            data: {
                withdrawals: formattedWithdrawals,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Error in getWithdrawals:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.getWithdrawals = getWithdrawals;
// دریافت تاریخچه تراکنش‌ها
const getTransactions = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        const { page = 1, limit = 10, type, startDate, endDate } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = new node_1.default.Query('Transaction');
        query.equalTo('userId', userId);
        query.descending('createdAt');
        query.skip(skip);
        query.limit(Number(limit));
        if (type && Object.values(finance_1.TransactionType).includes(type)) {
            query.equalTo('type', type);
        }
        if (startDate) {
            query.greaterThanOrEqualTo('createdAt', new Date(startDate));
        }
        if (endDate) {
            query.lessThanOrEqualTo('createdAt', new Date(endDate));
        }
        const [transactions, total] = await Promise.all([
            query.find({ useMasterKey: true }),
            query.count({ useMasterKey: true })
        ]);
        const formattedTransactions = transactions.map(t => {
            const data = t.toJSON();
            return {
                id: t.id,
                type: data.type,
                amount: data.amount,
                formattedAmount: (0, finance_1.formatCurrency)(data.amount),
                description: data.description,
                date: data.createdAt,
                status: data.status,
                referenceId: data.referenceId,
                metadata: data.metadata
            };
        });
        res.json({
            success: true,
            data: {
                transactions: formattedTransactions,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Error in getTransactions:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.getTransactions = getTransactions;
// دریافت گزارش مالی
const getFinancialReport = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        const { period = 'MONTHLY', startDate, endDate } = req.query;
        let start;
        let end = new Date();
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        }
        else {
            // محاسبه خودکار بازه بر اساس period
            switch (period) {
                case 'DAILY':
                    start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case 'WEEKLY':
                    start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'YEARLY':
                    start = new Date(end.getFullYear(), 0, 1);
                    break;
                default: // MONTHLY
                    start = new Date(end.getFullYear(), end.getMonth(), 1);
            }
        }
        // دریافت تراکنش‌های درآمدی
        const earningsQuery = new node_1.default.Query('Transaction');
        earningsQuery.equalTo('userId', userId);
        earningsQuery.equalTo('type', finance_1.TransactionType.DESIGNER_EARNING);
        earningsQuery.greaterThanOrEqualTo('createdAt', start);
        earningsQuery.lessThanOrEqualTo('createdAt', end);
        // دریافت تراکنش‌های برداشت
        const withdrawalsQuery = new node_1.default.Query('Transaction');
        withdrawalsQuery.equalTo('userId', userId);
        withdrawalsQuery.containedIn('type', [
            finance_1.TransactionType.WITHDRAWAL_REQUEST,
            finance_1.TransactionType.WITHDRAWAL_APPROVED
        ]);
        withdrawalsQuery.greaterThanOrEqualTo('createdAt', start);
        withdrawalsQuery.lessThanOrEqualTo('createdAt', end);
        const [earnings, withdrawals] = await Promise.all([
            earningsQuery.find({ useMasterKey: true }),
            withdrawalsQuery.find({ useMasterKey: true })
        ]);
        const totalEarnings = earnings.reduce((sum, t) => sum + (t.get('amount') || 0), 0);
        const totalWithdrawals = withdrawals.reduce((sum, t) => sum + (t.get('amount') || 0), 0);
        // تحلیل پرفروش‌ترین آیتم‌ها
        const itemSales = {};
        earnings.forEach(t => {
            const metadata = t.get('metadata') || {};
            const itemId = t.get('referenceId');
            const itemType = metadata.itemType;
            const itemTitle = metadata.itemTitle;
            const amount = t.get('amount') || 0;
            if (itemId && itemType && itemTitle) {
                if (!itemSales[itemId]) {
                    itemSales[itemId] = {
                        itemId,
                        itemType,
                        itemTitle,
                        sales: 0,
                        revenue: 0
                    };
                }
                itemSales[itemId].sales += 1;
                itemSales[itemId].revenue += amount;
            }
        });
        const topSellingItems = Object.values(itemSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        // درآمد روزانه
        const dailyEarningsMap = {};
        earnings.forEach(t => {
            const date = t.get('createdAt') || new Date();
            const dateKey = date.toISOString().split('T')[0];
            const amount = t.get('amount') || 0;
            dailyEarningsMap[dateKey] = (dailyEarningsMap[dateKey] || 0) + amount;
        });
        const dailyEarnings = Object.entries(dailyEarningsMap).map(([date, amount]) => ({
            date,
            amount
        }));
        const report = {
            userId,
            period: period,
            startDate: start,
            endDate: end,
            totalEarnings,
            totalWithdrawals,
            transactionCount: earnings.length + withdrawals.length,
            topSellingItems,
            dailyEarnings
        };
        res.json({
            success: true,
            data: {
                ...report,
                formattedTotalEarnings: (0, finance_1.formatCurrency)(totalEarnings),
                formattedTotalWithdrawals: (0, finance_1.formatCurrency)(totalWithdrawals),
                netIncome: totalEarnings - totalWithdrawals,
                formattedNetIncome: (0, finance_1.formatCurrency)(totalEarnings - totalWithdrawals)
            }
        });
    }
    catch (error) {
        console.error('Error in getFinancialReport:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.getFinancialReport = getFinancialReport;
// تنظیمات نوتیفیکیشن
const getNotificationSettings = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        const query = new node_1.default.Query('NotificationSettings');
        query.equalTo('userId', userId);
        let settings = await query.first({ useMasterKey: true });
        if (!settings) {
            // ایجاد تنظیمات پیش‌فرض
            settings = new node_1.default.Object('NotificationSettings');
            settings.set('userId', userId);
            settings.set('withdrawalNotifications', true);
            settings.set('earningNotifications', true);
            settings.set('frequency', finance_1.NotificationFrequency.EVERY_6_HOURS);
            settings.set('pushNotifications', true);
            await settings.save(null, { useMasterKey: true });
        }
        const data = settings.toJSON();
        res.json({
            success: true,
            data: {
                userId: data.userId,
                withdrawalNotifications: data.withdrawalNotifications,
                earningNotifications: data.earningNotifications,
                frequency: data.frequency,
                email: data.email,
                pushNotifications: data.pushNotifications,
                lastNotificationSent: data.lastNotificationSent
            }
        });
    }
    catch (error) {
        console.error('Error in getNotificationSettings:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.getNotificationSettings = getNotificationSettings;
// به‌روزرسانی تنظیمات نوتیفیکیشن
const updateNotificationSettings = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        // اعتبارسنجی داده‌ها
        const validationResult = finance_1.NotificationSettingsSchema.safeParse(req.body);
        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            res.status(400).json({
                success: false,
                message: 'اطلاعات ارسال شده نامعتبر است',
                errors
            });
            return;
        }
        const updateData = validationResult.data;
        const query = new node_1.default.Query('NotificationSettings');
        query.equalTo('userId', userId);
        let settings = await query.first({ useMasterKey: true });
        if (!settings) {
            settings = new node_1.default.Object('NotificationSettings');
            settings.set('userId', userId);
        }
        // به‌روزرسانی تنظیمات
        Object.entries(updateData).forEach(([key, value]) => {
            settings.set(key, value);
        });
        await settings.save(null, { useMasterKey: true });
        res.json({
            success: true,
            message: 'تنظیمات نوتیفیکیشن با موفقیت به‌روزرسانی شد',
            data: settings.toJSON()
        });
    }
    catch (error) {
        console.error('Error in updateNotificationSettings:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.updateNotificationSettings = updateNotificationSettings;
// دریافت آمار کلی داشبورد
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
            return;
        }
        const [wallet, recentTransactions, pendingWithdrawals] = await Promise.all([
            getUserWallet(userId),
            // تراکنش‌های اخیر
            (async () => {
                const query = new node_1.default.Query('Transaction');
                query.equalTo('userId', userId);
                query.descending('createdAt');
                query.limit(5);
                const transactions = await query.find({ useMasterKey: true });
                return transactions.map(t => ({
                    id: t.id,
                    type: t.get('type'),
                    amount: t.get('amount'),
                    formattedAmount: (0, finance_1.formatCurrency)(t.get('amount')),
                    description: t.get('description'),
                    date: t.get('createdAt')
                }));
            })(),
            // درخواست‌های برداشت در انتظار
            (async () => {
                const query = new node_1.default.Query('WithdrawalRequest');
                query.equalTo('userId', userId);
                query.equalTo('status', finance_1.WithdrawalStatus.PENDING);
                return await query.count({ useMasterKey: true });
            })()
        ]);
        // محاسبه درآمد ماه جاری
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const earningsQuery = new node_1.default.Query('Transaction');
        earningsQuery.equalTo('userId', userId);
        earningsQuery.equalTo('type', finance_1.TransactionType.DESIGNER_EARNING);
        earningsQuery.greaterThanOrEqualTo('createdAt', startOfMonth);
        const monthlyTransactions = await earningsQuery.find({ useMasterKey: true });
        const monthlyEarnings = monthlyTransactions.reduce((sum, t) => sum + (t.get('amount') || 0), 0);
        res.json({
            success: true,
            data: {
                wallet: {
                    ...wallet,
                    formattedBalance: (0, finance_1.formatCurrency)(wallet.balance),
                    formattedAvailableBalance: (0, finance_1.formatCurrency)(wallet.availableBalance),
                    formattedTotalEarnings: (0, finance_1.formatCurrency)(wallet.totalEarnings)
                },
                monthlyEarnings,
                formattedMonthlyEarnings: (0, finance_1.formatCurrency)(monthlyEarnings),
                recentTransactions,
                pendingWithdrawals,
                canWithdraw: wallet.availableBalance >= finance_1.WITHDRAWAL_LIMITS.MIN_AMOUNT
            }
        });
    }
    catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.getDashboardStats = getDashboardStats;
// Admin Functions (برای مدیریت درخواست‌های برداشت)
const approveWithdrawal = async (req, res) => {
    try {
        const { withdrawalId } = req.params;
        const { adminNotes } = req.body;
        // بررسی مجوز ادمین
        const user = req.user;
        if (!user || !user.get('isAdmin')) {
            res.status(403).json({ success: false, message: 'دسترسی مجاز نیست' });
            return;
        }
        const withdrawal = await new node_1.default.Query('WithdrawalRequest').get(withdrawalId, { useMasterKey: true });
        if (!withdrawal) {
            res.status(404).json({ success: false, message: 'درخواست برداشت یافت نشد' });
            return;
        }
        if (withdrawal.get('status') !== finance_1.WithdrawalStatus.PENDING) {
            res.status(400).json({ success: false, message: 'درخواست قبلاً پردازش شده است' });
            return;
        }
        const userId = withdrawal.get('userId');
        const amount = withdrawal.get('amount');
        // به‌روزرسانی وضعیت درخواست
        withdrawal.set('status', finance_1.WithdrawalStatus.APPROVED);
        withdrawal.set('processedDate', new Date());
        withdrawal.set('adminNotes', adminNotes);
        await withdrawal.save(null, { useMasterKey: true });
        // به‌روزرسانی کیف پول
        await updateWalletBalance(userId, amount, 'SUBTRACT');
        // کاهش مبلغ pending
        const walletQuery = new node_1.default.Query('Wallet');
        walletQuery.equalTo('userId', userId);
        const walletObj = await walletQuery.first({ useMasterKey: true });
        if (walletObj) {
            const currentPending = walletObj.get('pendingWithdrawals') || 0;
            walletObj.set('pendingWithdrawals', Math.max(0, currentPending - amount));
            await walletObj.save(null, { useMasterKey: true });
        }
        // ثبت تراکنش تایید
        await createTransaction({
            userId,
            type: finance_1.TransactionType.WITHDRAWAL_APPROVED,
            amount,
            description: `تایید برداشت وجه - شماره پیگیری: ${withdrawal.get('trackingNumber')}`,
            referenceId: withdrawal.id,
            metadata: {
                trackingNumber: withdrawal.get('trackingNumber'),
                adminNotes
            }
        });
        res.json({
            success: true,
            message: 'درخواست برداشت با موفقیت تایید شد'
        });
    }
    catch (error) {
        console.error('Error in approveWithdrawal:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'خطای داخلی سرور'
        });
    }
};
exports.approveWithdrawal = approveWithdrawal;
//# sourceMappingURL=designer-finance.js.map