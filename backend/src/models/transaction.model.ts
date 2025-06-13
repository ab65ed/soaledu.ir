/**
 * Transaction Model
 * مدل تراکنش‌ها برای آمارگیری
 */

import mongoose, { Document, Schema } from "mongoose";

// Transaction Status enum
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Transaction Type enum
export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  COMMISSION = 'commission',
  BONUS = 'bonus'
}

// Interface for Transaction document
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  referenceId?: string;
  examId?: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "Exam",
      index: true,
    },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ایندکس‌های ترکیبی برای بهینه‌سازی کوئری‌ها
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ createdAt: -1 });

// Static methods
TransactionSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

TransactionSchema.statics.findCompleted = function() {
  return this.find({ status: TransactionStatus.COMPLETED });
};

export default mongoose.model<ITransaction>("Transaction", TransactionSchema); 