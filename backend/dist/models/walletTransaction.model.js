"use strict";
/**
 * WalletTransaction Model
 * مدل تراکنش‌های کیف پول
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const wallet_1 = require("./wallet");
const WalletTransactionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "شناسه کاربر الزامی است"],
        index: true,
    },
    userName: {
        type: String,
        trim: true,
        maxlength: [100, "نام کاربر نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"],
    },
    userEmail: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [255, "ایمیل کاربر نمی‌تواند بیش از ۲۵۵ کاراکتر باشد"],
    },
    type: {
        type: String,
        enum: {
            values: Object.values(wallet_1.TransactionType),
            message: "نوع تراکنش نامعتبر است"
        },
        required: [true, "نوع تراکنش الزامی است"],
        index: true,
    },
    amount: {
        type: Number,
        required: [true, "مبلغ تراکنش الزامی است"],
        min: [0, "مبلغ تراکنش نمی‌تواند منفی باشد"],
    },
    description: {
        type: String,
        required: [true, "توضیحات تراکنش الزامی است"],
        trim: true,
        maxlength: [500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"],
    },
    status: {
        type: String,
        enum: {
            values: Object.values(wallet_1.TransactionStatus),
            message: "وضعیت تراکنش نامعتبر است"
        },
        required: [true, "وضعیت تراکنش الزامی است"],
        default: wallet_1.TransactionStatus.PENDING,
        index: true,
    },
    processedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    // فیلدهای جدید برای تخفیف‌های سازمانی
    institutionalDiscountGroupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "InstitutionalDiscountGroup",
        index: true,
    },
    institutionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Institution",
        index: true,
    },
    discountAmount: {
        type: Number,
        min: [0, "مبلغ تخفیف نمی‌تواند منفی باشد"],
        default: 0,
    },
    discountPercentage: {
        type: Number,
        min: [0, "درصد تخفیف نمی‌تواند منفی باشد"],
        max: [100, "درصد تخفیف نمی‌تواند بیش از ۱۰۰ درصد باشد"],
        default: 0,
    },
    originalAmount: {
        type: Number,
        min: [0, "مبلغ اصلی نمی‌تواند منفی باشد"],
    },
    isInstitutionalDiscount: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ایندکس‌های ترکیبی برای بهینه‌سازی گزارش‌گیری
WalletTransactionSchema.index({ userId: 1, createdAt: -1 });
WalletTransactionSchema.index({ type: 1, status: 1 });
WalletTransactionSchema.index({ institutionalDiscountGroupId: 1, status: 1 });
WalletTransactionSchema.index({ institutionId: 1, status: 1 });
WalletTransactionSchema.index({ isInstitutionalDiscount: 1, status: 1, createdAt: -1 });
WalletTransactionSchema.index({ createdAt: -1 });
// Virtual for formatted amount
WalletTransactionSchema.virtual('formattedAmount').get(function () {
    return new Intl.NumberFormat('fa-IR').format(this.amount) + ' تومان';
});
// Virtual for formatted discount
WalletTransactionSchema.virtual('formattedDiscount').get(function () {
    if (this.discountAmount && this.discountAmount > 0) {
        return new Intl.NumberFormat('fa-IR').format(this.discountAmount) + ' تومان';
    }
    if (this.discountPercentage && this.discountPercentage > 0) {
        return `${this.discountPercentage}%`;
    }
    return null;
});
// Pre-save middleware for calculating fields
WalletTransactionSchema.pre('save', function (next) {
    // محاسبه مبلغ اصلی اگر تخفیف وجود داشته باشد
    if (this.isInstitutionalDiscount && this.discountAmount && !this.originalAmount) {
        this.originalAmount = this.amount + this.discountAmount;
    }
    // محاسبه درصد تخفیف اگر وجود نداشته باشد
    if (this.isInstitutionalDiscount && this.discountAmount && this.originalAmount && !this.discountPercentage) {
        this.discountPercentage = Math.round((this.discountAmount / this.originalAmount) * 100);
    }
    next();
});
// Static methods
WalletTransactionSchema.statics.findByUser = function (userId) {
    return this.find({ userId }).sort({ createdAt: -1 });
};
WalletTransactionSchema.statics.findInstitutionalDiscountTransactions = function (groupId, institutionId) {
    const filter = { isInstitutionalDiscount: true, status: wallet_1.TransactionStatus.COMPLETED };
    if (groupId)
        filter.institutionalDiscountGroupId = groupId;
    if (institutionId)
        filter.institutionId = institutionId;
    return this.find(filter).sort({ createdAt: -1 });
};
exports.default = mongoose_1.default.model("WalletTransaction", WalletTransactionSchema);
//# sourceMappingURL=walletTransaction.model.js.map