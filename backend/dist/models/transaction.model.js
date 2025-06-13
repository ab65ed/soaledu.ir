"use strict";
/**
 * Transaction Model
 * مدل تراکنش‌ها برای آمارگیری
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
exports.TransactionType = exports.TransactionStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Transaction Status enum
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
// Transaction Type enum
var TransactionType;
(function (TransactionType) {
    TransactionType["PAYMENT"] = "payment";
    TransactionType["REFUND"] = "refund";
    TransactionType["COMMISSION"] = "commission";
    TransactionType["BONUS"] = "bonus";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
const TransactionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "شناسه کاربر الزامی است"],
        index: true,
    },
    amount: {
        type: Number,
        required: [true, "مبلغ تراکنش الزامی است"],
        min: [0, "مبلغ تراکنش نمی‌تواند منفی باشد"],
    },
    type: {
        type: String,
        enum: {
            values: Object.values(TransactionType),
            message: "نوع تراکنش نامعتبر است"
        },
        required: [true, "نوع تراکنش الزامی است"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: Object.values(TransactionStatus),
            message: "وضعیت تراکنش نامعتبر است"
        },
        required: [true, "وضعیت تراکنش الزامی است"],
        default: TransactionStatus.PENDING,
        index: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"],
    },
    referenceId: {
        type: String,
        trim: true,
        index: true,
    },
    examId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Exam",
        index: true,
    },
    institutionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Institution",
        index: true,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ایندکس‌های ترکیبی برای بهینه‌سازی کوئری‌ها
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ createdAt: -1 });
// Static methods
TransactionSchema.statics.findByUser = function (userId) {
    return this.find({ userId }).sort({ createdAt: -1 });
};
TransactionSchema.statics.findCompleted = function () {
    return this.find({ status: TransactionStatus.COMPLETED });
};
exports.default = mongoose_1.default.model("Transaction", TransactionSchema);
//# sourceMappingURL=transaction.model.js.map