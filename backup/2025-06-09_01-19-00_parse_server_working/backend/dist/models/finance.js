"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionClass = exports.WithdrawalRequestClass = exports.WalletClass = exports.WITHDRAWAL_LIMITS = exports.DEFAULT_PRICING = exports.NotificationSettingsSchema = exports.TransactionSchema = exports.WithdrawalRequestSchema = exports.PricingConfigSchema = exports.NotificationFrequency = exports.PaymentMethod = exports.WithdrawalStatus = exports.TransactionType = void 0;
exports.calculateDesignerEarning = calculateDesignerEarning;
exports.calculatePlatformFee = calculatePlatformFee;
exports.getExamPrice = getExamPrice;
exports.getFlashcardPrice = getFlashcardPrice;
exports.formatCurrency = formatCurrency;
exports.generateTrackingNumber = generateTrackingNumber;
exports.canRequestWithdrawal = canRequestWithdrawal;
exports.shouldSendNotification = shouldSendNotification;
const node_1 = __importDefault(require("parse/node"));
const zod_1 = require("zod");
// Types and Enums
var TransactionType;
(function (TransactionType) {
    TransactionType["EXAM_PURCHASE"] = "EXAM_PURCHASE";
    TransactionType["FLASHCARD_PURCHASE"] = "FLASHCARD_PURCHASE";
    TransactionType["DESIGNER_EARNING"] = "DESIGNER_EARNING";
    TransactionType["WITHDRAWAL_REQUEST"] = "WITHDRAWAL_REQUEST";
    TransactionType["WITHDRAWAL_APPROVED"] = "WITHDRAWAL_APPROVED";
    TransactionType["WITHDRAWAL_REJECTED"] = "WITHDRAWAL_REJECTED";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "PENDING";
    WithdrawalStatus["APPROVED"] = "APPROVED";
    WithdrawalStatus["REJECTED"] = "REJECTED";
    WithdrawalStatus["PROCESSING"] = "PROCESSING";
    WithdrawalStatus["COMPLETED"] = "COMPLETED";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["IBAN"] = "IBAN";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["WALLET"] = "WALLET";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var NotificationFrequency;
(function (NotificationFrequency) {
    NotificationFrequency["DISABLED"] = "DISABLED";
    NotificationFrequency["EVERY_6_HOURS"] = "EVERY_6_HOURS";
    NotificationFrequency["DAILY"] = "DAILY";
    NotificationFrequency["WEEKLY"] = "WEEKLY";
})(NotificationFrequency || (exports.NotificationFrequency = NotificationFrequency = {}));
// Validation Schemas
exports.PricingConfigSchema = zod_1.z.object({
    examPricing: zod_1.z.object({
        '10-20': zod_1.z.number().min(0),
        '21-30': zod_1.z.number().min(0),
        '31-50': zod_1.z.number().min(0)
    }),
    flashcardPricing: zod_1.z.object({
        defaultPrice: zod_1.z.number().min(0),
        minPrice: zod_1.z.number().min(0),
        maxPrice: zod_1.z.number().min(0)
    }),
    designerShare: zod_1.z.number().min(0).max(100),
    platformFee: zod_1.z.number().min(0).max(100)
});
exports.WithdrawalRequestSchema = zod_1.z.object({
    amount: zod_1.z.number().min(1000, 'حداقل مبلغ برداشت 1000 تومان است'),
    paymentMethod: zod_1.z.nativeEnum(PaymentMethod),
    accountDetails: zod_1.z.union([
        zod_1.z.object({
            accountHolderName: zod_1.z.string().min(2, 'نام صاحب حساب الزامی است'),
            iban: zod_1.z.string().regex(/^IR[0-9]{24}$/, 'شماره شبا نامعتبر است'),
            bankName: zod_1.z.string().min(2, 'نام بانک الزامی است'),
            accountNumber: zod_1.z.string().optional()
        }),
        zod_1.z.object({
            cardHolderName: zod_1.z.string().min(2, 'نام صاحب کارت الزامی است'),
            cardNumber: zod_1.z.string().regex(/^[0-9]{16}$/, 'شماره کارت نامعتبر است'),
            bankName: zod_1.z.string().min(2, 'نام بانک الزامی است')
        })
    ]),
    description: zod_1.z.string().optional()
});
exports.TransactionSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    type: zod_1.z.nativeEnum(TransactionType),
    amount: zod_1.z.number().min(0),
    description: zod_1.z.string().min(1),
    referenceId: zod_1.z.string().optional(),
    designerId: zod_1.z.string().optional(),
    designerShare: zod_1.z.number().optional(),
    platformFee: zod_1.z.number().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
});
exports.NotificationSettingsSchema = zod_1.z.object({
    withdrawalNotifications: zod_1.z.boolean().default(true),
    earningNotifications: zod_1.z.boolean().default(true),
    frequency: zod_1.z.nativeEnum(NotificationFrequency).default(NotificationFrequency.EVERY_6_HOURS),
    email: zod_1.z.string().email().optional(),
    pushNotifications: zod_1.z.boolean().default(true)
});
// Utility Functions
function calculateDesignerEarning(totalAmount, designerShare = 55) {
    return Math.round(totalAmount * (designerShare / 100));
}
function calculatePlatformFee(totalAmount, platformFee = 45) {
    return Math.round(totalAmount * (platformFee / 100));
}
function getExamPrice(questionCount) {
    if (questionCount >= 10 && questionCount <= 20)
        return 800;
    if (questionCount >= 21 && questionCount <= 30)
        return 1000;
    if (questionCount >= 31 && questionCount <= 50)
        return 1200;
    return 800; // پیش‌فرض
}
function getFlashcardPrice(customPrice) {
    const defaultPrice = 200;
    const minPrice = 100;
    const maxPrice = 500;
    if (customPrice && customPrice >= minPrice && customPrice <= maxPrice) {
        return customPrice;
    }
    return defaultPrice;
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR',
        minimumFractionDigits: 0
    }).format(amount);
}
function generateTrackingNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `WD${timestamp.slice(-6)}${random}`.toUpperCase();
}
function canRequestWithdrawal(wallet, requestAmount) {
    return wallet.availableBalance >= requestAmount && requestAmount >= 1000;
}
function shouldSendNotification(settings) {
    if (settings.frequency === NotificationFrequency.DISABLED)
        return false;
    if (!settings.lastNotificationSent)
        return true;
    const now = new Date();
    const lastSent = new Date(settings.lastNotificationSent);
    const diffHours = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
    switch (settings.frequency) {
        case NotificationFrequency.EVERY_6_HOURS:
            return diffHours >= 6;
        case NotificationFrequency.DAILY:
            return diffHours >= 24;
        case NotificationFrequency.WEEKLY:
            return diffHours >= 168;
        default:
            return false;
    }
}
// Constants
exports.DEFAULT_PRICING = {
    examPricing: {
        '10-20': 800,
        '21-30': 1000,
        '31-50': 1200
    },
    flashcardPricing: {
        defaultPrice: 200,
        minPrice: 100,
        maxPrice: 500
    },
    designerShare: 50,
    platformFee: 50
};
exports.WITHDRAWAL_LIMITS = {
    MIN_AMOUNT: 1000,
    MAX_AMOUNT: 10000000, // 10 میلیون تومان
    DAILY_LIMIT: 5000000, // 5 میلیون تومان در روز
    MONTHLY_LIMIT: 50000000 // 50 میلیون تومان در ماه
};
// Parse Classes (اختیاری - برای مدیریت Parse Objects)
class WalletClass extends node_1.default.Object {
    constructor() {
        super('Wallet');
    }
    get userId() { return this.get('userId'); }
    set userId(value) { this.set('userId', value); }
    get balance() { return this.get('balance') || 0; }
    set balance(value) { this.set('balance', value); }
    get totalEarnings() { return this.get('totalEarnings') || 0; }
    set totalEarnings(value) { this.set('totalEarnings', value); }
    get totalWithdrawals() { return this.get('totalWithdrawals') || 0; }
    set totalWithdrawals(value) { this.set('totalWithdrawals', value); }
    get pendingWithdrawals() { return this.get('pendingWithdrawals') || 0; }
    set pendingWithdrawals(value) { this.set('pendingWithdrawals', value); }
    get freezeAmount() { return this.get('freezeAmount') || 0; }
    set freezeAmount(value) { this.set('freezeAmount', value); }
    get availableBalance() {
        return this.balance - this.freezeAmount - this.pendingWithdrawals;
    }
}
exports.WalletClass = WalletClass;
class WithdrawalRequestClass extends node_1.default.Object {
    constructor() {
        super('WithdrawalRequest');
    }
    get userId() { return this.get('userId'); }
    set userId(value) { this.set('userId', value); }
    get amount() { return this.get('amount'); }
    set amount(value) { this.set('amount', value); }
    get paymentMethod() { return this.get('paymentMethod'); }
    set paymentMethod(value) { this.set('paymentMethod', value); }
    get status() { return this.get('status'); }
    set status(value) { this.set('status', value); }
    get trackingNumber() { return this.get('trackingNumber'); }
    set trackingNumber(value) { this.set('trackingNumber', value); }
}
exports.WithdrawalRequestClass = WithdrawalRequestClass;
class TransactionClass extends node_1.default.Object {
    constructor() {
        super('Transaction');
    }
    get userId() { return this.get('userId'); }
    set userId(value) { this.set('userId', value); }
    get type() { return this.get('type'); }
    set type(value) { this.set('type', value); }
    get amount() { return this.get('amount'); }
    set amount(value) { this.set('amount', value); }
    get description() { return this.get('description'); }
    set description(value) { this.set('description', value); }
}
exports.TransactionClass = TransactionClass;
//# sourceMappingURL=finance.js.map