/**
 * Payment model
 *
 * This file defines the Payment schema for MongoDB.
 * Payments represent transaction history for wallet credits.
 */

import mongoose, { Document, Schema, Model } from "mongoose";

export type PaymentMethod = "zarinpal" | "credit-card" | "paypal" | "bank-transfer" | "other";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  originalAmount: number;
  discountAmount: number;
  credits: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  packageName?: string;
  discountCode?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  discountPercentage: number;
  persianSavings: string | null;
  
  // Methods
  complete(transactionId: string): Promise<IPayment>;
  fail(reason?: string): Promise<IPayment>;
  refund(reason?: string): Promise<IPayment>;
}

export interface IPaymentModel extends Model<IPayment> {}

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

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
        message:
          "Payment method must be either: zarinpal, credit-card, paypal, bank-transfer, or other",
      },
      required: [true, "Please provide a payment method"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed", "refunded"],
        message:
          "Status must be either: pending, completed, failed, or refunded",
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
      type: Schema.Types.ObjectId,
      ref: "DiscountCode",
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PaymentSchema.index({ user: 1, status: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ createdAt: -1 });

// Method to complete payment and add credits to user wallet
PaymentSchema.methods.complete = async function (this: IPayment, transactionId: string): Promise<IPayment> {
  try {
    const User = mongoose.model("User");
    const user = await User.findById(this.user);

    if (!user) {
      throw new Error("User not found");
    }

    // Update payment status
    this.status = "completed";
    this.transactionId = transactionId;

    // Add credits to user wallet
    await user.addWalletTransaction(
      this.credits,
      "credit",
      `Payment for ${this.credits} credits (${
        this.packageName || "Standard package"
      })`
    );

    return this.save();
  } catch (error) {
    throw error;
  }
};

// Method to mark payment as failed
PaymentSchema.methods.fail = function (this: IPayment, reason?: string): Promise<IPayment> {
  this.status = "failed";
  this.notes = reason || "Payment failed";
  return this.save();
};

// Method to refund payment
PaymentSchema.methods.refund = async function (this: IPayment, reason?: string): Promise<IPayment> {
  try {
    if (this.status !== "completed") {
      throw new Error("Only completed payments can be refunded");
    }

    const User = mongoose.model("User");
    const user = await User.findById(this.user);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has enough credits
    if (user.wallet.balance < this.credits) {
      throw new Error("Insufficient credits for refund");
    }

    // Deduct credits from user wallet
    await user.addWalletTransaction(
      this.credits,
      "debit",
      `Refund for payment ${this._id} (${reason || "Requested by user"})`
    );

    // Update payment status
    this.status = "refunded";
    this.notes = reason || "Refunded";

    return this.save();
  } catch (error) {
    throw error;
  }
};

// Virtual for discount percentage
PaymentSchema.virtual("discountPercentage").get(function (this: IPayment): number {
  if (this.originalAmount > 0 && this.discountAmount > 0) {
    return Math.round((this.discountAmount / this.originalAmount) * 100);
  }
  return 0;
});

// Virtual for savings amount in Persian format
PaymentSchema.virtual("persianSavings").get(function (this: IPayment): string | null {
  if (this.discountAmount > 0) {
    return `${this.discountAmount.toLocaleString("fa-IR")} تومان صرفه‌جویی`;
  }
  return null;
});

// Ensure virtual fields are serialized
PaymentSchema.set("toJSON", { virtuals: true });
PaymentSchema.set("toObject", { virtuals: true });

export default mongoose.model<IPayment, IPaymentModel>("Payment", PaymentSchema); 