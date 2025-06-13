/**
 * Transaction Model
 * مدل تراکنش‌ها برای آمارگیری
 */
import mongoose, { Document } from "mongoose";
export declare enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum TransactionType {
    PAYMENT = "payment",
    REFUND = "refund",
    COMMISSION = "commission",
    BONUS = "bonus"
}
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
declare const _default: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}> & ITransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
