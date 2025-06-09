"use strict";
/**
 * DiscountCode model
 *
 * This file defines the DiscountCode schema for MongoDB.
 * Discount codes provide percentage discounts for wallet top-ups.
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
 *     DiscountCode:
 *       type: object
 *       required:
 *         - code
 *         - discountPercentage
 *         - expiryDate
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         code:
 *           type: string
 *           description: Unique discount code
 *         discountPercentage:
 *           type: number
 *           description: Discount percentage (0-100)
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiry date of the discount code
 *         usageLimit:
 *           type: number
 *           description: Maximum number of times this code can be used
 *         usedCount:
 *           type: number
 *           description: Number of times this code has been used
 *         isActive:
 *           type: boolean
 *           description: Whether the discount code is active
 *         minAmount:
 *           type: number
 *           description: Minimum amount required to use this discount
 *         maxDiscount:
 *           type: number
 *           description: Maximum discount amount in currency
 *         description:
 *           type: string
 *           description: Description of the discount code
 *         createdBy:
 *           type: string
 *           description: Reference to Admin who created this code
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const DiscountCodeSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a discount code'],
        unique: true,
        uppercase: true,
        trim: true,
        minlength: [3, 'Discount code must be at least 3 characters'],
        maxlength: [20, 'Discount code cannot exceed 20 characters'],
    },
    discountPercentage: {
        type: Number,
        required: [true, 'Please provide discount percentage'],
        min: [1, 'Discount percentage must be at least 1%'],
        max: [100, 'Discount percentage cannot exceed 100%'],
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please provide expiry date'],
        validate: {
            validator: function (date) {
                return date > new Date();
            },
            message: 'Expiry date must be in the future'
        }
    },
    usageLimit: {
        type: Number,
        default: null, // null means unlimited
        min: [1, 'Usage limit must be at least 1'],
    },
    usedCount: {
        type: Number,
        default: 0,
        min: [0, 'Used count cannot be negative'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    minAmount: {
        type: Number,
        default: 0,
        min: [0, 'Minimum amount cannot be negative'],
    },
    maxDiscount: {
        type: Number,
        default: null, // null means no maximum
        min: [0, 'Maximum discount cannot be negative'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide creator'],
    },
}, {
    timestamps: true,
});
// Index for faster queries
DiscountCodeSchema.index({ code: 1 });
DiscountCodeSchema.index({ isActive: 1, expiryDate: 1 });
// Method to check if discount code is valid
DiscountCodeSchema.methods.isValid = function () {
    const now = new Date();
    // Check if code is active
    if (!this.isActive) {
        return { valid: false, reason: 'کد تخفیف غیرفعال است' };
    }
    // Check if code has expired
    if (this.expiryDate <= now) {
        return { valid: false, reason: 'کد تخفیف منقضی شده است' };
    }
    // Check usage limit
    if (this.usageLimit && this.usedCount >= this.usageLimit) {
        return { valid: false, reason: 'کد تخفیف به حد مجاز استفاده رسیده است' };
    }
    return { valid: true };
};
// Method to calculate discount amount
DiscountCodeSchema.methods.calculateDiscount = function (amount) {
    // Check if amount meets minimum requirement
    if (amount < this.minAmount) {
        return {
            valid: false,
            reason: `حداقل مبلغ برای استفاده از این کد ${this.minAmount.toLocaleString('fa-IR')} تومان است`
        };
    }
    let discountAmount = (amount * this.discountPercentage) / 100;
    // Apply maximum discount limit if set
    if (this.maxDiscount && discountAmount > this.maxDiscount) {
        discountAmount = this.maxDiscount;
    }
    return {
        valid: true,
        discountAmount: Math.round(discountAmount),
        finalAmount: amount - Math.round(discountAmount),
        discountPercentage: this.discountPercentage
    };
};
// Method to use the discount code
DiscountCodeSchema.methods.use = async function () {
    this.usedCount += 1;
    return this.save();
};
// Static method to find valid discount code
DiscountCodeSchema.statics.findValidCode = async function (code) {
    const discountCode = await this.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() }
    });
    if (!discountCode) {
        return { valid: false, reason: 'کد تخفیف یافت نشد یا معتبر نیست' };
    }
    const validation = discountCode.isValid();
    if (!validation.valid) {
        return validation;
    }
    return { valid: true, discountCode };
};
exports.default = mongoose_1.default.model('DiscountCode', DiscountCodeSchema);
//# sourceMappingURL=discountCode.model.js.map