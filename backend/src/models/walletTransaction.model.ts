/**
 * WalletTransaction Model
 * مدل تراکنش‌های کیف پول
 */

import mongoose, { Document, Schema } from "mongoose";
import { TransactionType, TransactionStatus } from "./wallet";

// Interface for WalletTransaction document
export interface IWalletTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  userName?: string;
  userEmail?: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  processedBy?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  
  // فیلدهای جدید برای تخفیف‌های سازمانی
  institutionalDiscountGroupId?: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  discountAmount?: number;
  discountPercentage?: number;
  originalAmount?: number; // مبلغ اصلی قبل از اعمال تخفیف
  isInstitutionalDiscount?: boolean; // آیا از تخفیف سازمانی استفاده شده
  
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
        values: Object.values(TransactionType),
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
        values: Object.values(TransactionStatus),
        message: "وضعیت تراکنش نامعتبر است"
      },
      required: [true, "وضعیت تراکنش الزامی است"],
      default: TransactionStatus.PENDING,
      index: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    
    // فیلدهای جدید برای تخفیف‌های سازمانی
    institutionalDiscountGroupId: {
      type: Schema.Types.ObjectId,
      ref: "InstitutionalDiscountGroup",
      index: true,
    },
    institutionId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ایندکس‌های ترکیبی برای بهینه‌سازی گزارش‌گیری
WalletTransactionSchema.index({ userId: 1, createdAt: -1 });
WalletTransactionSchema.index({ type: 1, status: 1 });
WalletTransactionSchema.index({ institutionalDiscountGroupId: 1, status: 1 });
WalletTransactionSchema.index({ institutionId: 1, status: 1 });
WalletTransactionSchema.index({ isInstitutionalDiscount: 1, status: 1, createdAt: -1 });
WalletTransactionSchema.index({ createdAt: -1 });

// Virtual for formatted amount
WalletTransactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('fa-IR').format(this.amount) + ' تومان';
});

// Virtual for formatted discount
WalletTransactionSchema.virtual('formattedDiscount').get(function() {
  if (this.discountAmount && this.discountAmount > 0) {
    return new Intl.NumberFormat('fa-IR').format(this.discountAmount) + ' تومان';
  }
  if (this.discountPercentage && this.discountPercentage > 0) {
    return `${this.discountPercentage}%`;
  }
  return null;
});

// Pre-save middleware for calculating fields
WalletTransactionSchema.pre('save', function(next) {
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
WalletTransactionSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

WalletTransactionSchema.statics.findInstitutionalDiscountTransactions = function(groupId?: string, institutionId?: string) {
  const filter: any = { isInstitutionalDiscount: true, status: TransactionStatus.COMPLETED };
  if (groupId) filter.institutionalDiscountGroupId = groupId;
  if (institutionId) filter.institutionId = institutionId;
  return this.find(filter).sort({ createdAt: -1 });
};

export default mongoose.model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema); 