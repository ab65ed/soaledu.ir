"use strict";
/**
 * Payment model
 *
 * This file defines the Payment schema for MongoDB.
 * Payments represent transaction history for wallet credits.
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
/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - user
 *         - amount
 *         - paymentMethod
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         user:
 *           type: string
 *           description: Reference to User who made the payment
 *         amount:
 *           type: number
 *           description: Final payment amount (after discount)
 *         originalAmount:
 *           type: number
 *           description: Original payment amount (before discount)
 *         discountAmount:
 *           type: number
 *           description: Discount amount applied
 *         credits:
 *           type: number
 *           description: Credits purchased
 *         paymentMethod:
 *           type: string
 *           enum: [zarinpal, credit-card, paypal, bank-transfer, other]
 *           description: Payment method used
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           description: Payment status
 *         transactionId:
 *           type: string
 *           description: External payment processor transaction ID
 *         packageName:
 *           type: string
 *           description: Name of the credit package purchased
 *         discountCode:
 *           type: string
 *           description: Reference to applied discount code
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const PaymentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide a user"],
    },
    amount: {
        type: Number,
        required: [true, "Please provide an amount"],
        min: [0, "Amount cannot be negative"],
    },
    originalAmount: {
        type: Number,
        required: [true, "Please provide original amount"],
        min: [0, "Original amount cannot be negative"],
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: [0, "Discount amount cannot be negative"],
    },
    credits: {
        type: Number,
        required: [true, "Please provide credits amount"],
        min: [0, "Credits cannot be negative"],
    },
    paymentMethod: {
        type: String,
        enum: {
            values: ["zarinpal", "credit-card", "paypal", "bank-transfer", "other"],
            message: "Payment method must be either: zarinpal, credit-card, paypal, bank-transfer, or other",
        },
        required: [true, "Please provide a payment method"],
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "completed", "failed", "refunded"],
            message: "Status must be either: pending, completed, failed, or refunded",
        },
        default: "pending",
    },
    transactionId: {
        type: String,
        trim: true,
    },
    packageName: {
        type: String,
        trim: true,
    },
    discountCode: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "DiscountCode",
        default: null,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, "Notes cannot exceed 500 characters"],
    },
}, {
    timestamps: true,
});
// Index for faster queries
PaymentSchema.index({ user: 1, status: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ createdAt: -1 });
// Method to complete payment and add credits to user wallet
PaymentSchema.methods.complete = async function (transactionId) {
    try {
        const User = mongoose_1.default.model("User");
        const user = await User.findById(this.user);
        if (!user) {
            throw new Error("User not found");
        }
        // Update payment status
        this.status = "completed";
        this.transactionId = transactionId;
        // Add credits to user wallet
        await user.addWalletTransaction(this.credits, "credit", `Payment for ${this.credits} credits (${this.packageName || "Standard package"})`);
        return this.save();
    }
    catch (error) {
        throw error;
    }
};
// Method to mark payment as failed
PaymentSchema.methods.fail = function (reason) {
    this.status = "failed";
    this.notes = reason || "Payment failed";
    return this.save();
};
// Method to refund payment
PaymentSchema.methods.refund = async function (reason) {
    try {
        if (this.status !== "completed") {
            throw new Error("Only completed payments can be refunded");
        }
        const User = mongoose_1.default.model("User");
        const user = await User.findById(this.user);
        if (!user) {
            throw new Error("User not found");
        }
        // Check if user has enough credits
        if (user.wallet.balance < this.credits) {
            throw new Error("Insufficient credits for refund");
        }
        // Deduct credits from user wallet
        await user.addWalletTransaction(this.credits, "debit", `Refund for payment ${this._id} (${reason || "Requested by user"})`);
        // Update payment status
        this.status = "refunded";
        this.notes = reason || "Refunded";
        return this.save();
    }
    catch (error) {
        throw error;
    }
};
// Virtual for discount percentage
PaymentSchema.virtual("discountPercentage").get(function () {
    if (this.originalAmount > 0 && this.discountAmount > 0) {
        return Math.round((this.discountAmount / this.originalAmount) * 100);
    }
    return 0;
});
// Virtual for savings amount in Persian format
PaymentSchema.virtual("persianSavings").get(function () {
    if (this.discountAmount > 0) {
        return `${this.discountAmount.toLocaleString("fa-IR")} تومان صرفه‌جویی`;
    }
    return null;
});
// Ensure virtual fields are serialized
PaymentSchema.set("toJSON", { virtuals: true });
PaymentSchema.set("toObject", { virtuals: true });
exports.default = mongoose_1.default.model("Payment", PaymentSchema);
//# sourceMappingURL=payment.model.js.map