/**
 * DiscountCode model
 *
 * This file defines the DiscountCode schema for MongoDB.
 * Discount codes provide percentage discounts for wallet top-ups.
 */

import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDiscountValidation {
  valid: boolean;
  reason?: string;
}

export interface IDiscountCalculation {
  valid: boolean;
  reason?: string;
  discountAmount?: number;
  finalAmount?: number;
  discountPercentage?: number;
}

export interface IDiscountCodeResult {
  valid: boolean;
  reason?: string;
  discountCode?: IDiscountCode;
}

export interface IDiscountCode extends Document {
  code: string;
  discountPercentage: number;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  minAmount: number;
  maxDiscount?: number;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isValid(): IDiscountValidation;
  calculateDiscount(amount: number): IDiscountCalculation;
  use(): Promise<IDiscountCode>;
}

export interface IDiscountCodeModel extends Model<IDiscountCode> {
  findValidCode(code: string): Promise<IDiscountCodeResult>;
}

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

const DiscountCodeSchema = new Schema<IDiscountCode>(
  {
    code: {
      type: String,
      required: [true, 'Please provide a discount code'],
      unique: true, // این unique index را نگه می‌داریم و explicit index را حذف می‌کنیم
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
        validator: function(date: Date) {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide creator'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// حذف شد: DiscountCodeSchema.index({ code: 1 }); // چون unique: true در schema خودش index می‌سازد
DiscountCodeSchema.index({ isActive: 1, expiryDate: 1 });

// Method to check if discount code is valid
DiscountCodeSchema.methods.isValid = function(this: IDiscountCode): IDiscountValidation {
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
DiscountCodeSchema.methods.calculateDiscount = function(this: IDiscountCode, amount: number): IDiscountCalculation {
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
DiscountCodeSchema.methods.use = async function(this: IDiscountCode): Promise<IDiscountCode> {
  this.usedCount += 1;
  return this.save();
};

// Static method to find valid discount code
DiscountCodeSchema.statics.findValidCode = async function(this: IDiscountCodeModel, code: string): Promise<IDiscountCodeResult> {
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

export default mongoose.model<IDiscountCode, IDiscountCodeModel>('DiscountCode', DiscountCodeSchema); 