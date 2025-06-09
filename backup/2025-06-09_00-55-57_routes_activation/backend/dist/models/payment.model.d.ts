/**
 * Payment model
 *
 * This file defines the Payment schema for MongoDB.
 * Payments represent transaction history for wallet credits.
 */
import mongoose, { Document, Model } from "mongoose";
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
    discountPercentage: number;
    persianSavings: string | null;
    complete(transactionId: string): Promise<IPayment>;
    fail(reason?: string): Promise<IPayment>;
    refund(reason?: string): Promise<IPayment>;
}
export interface IPaymentModel extends Model<IPayment> {
}
declare const _default: IPaymentModel;
export default _default;
