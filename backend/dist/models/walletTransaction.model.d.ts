/**
 * WalletTransaction Model
 * مدل تراکنش‌های کیف پول
 */
import mongoose, { Document } from "mongoose";
import { TransactionType, TransactionStatus } from "./wallet";
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
    institutionalDiscountGroupId?: mongoose.Types.ObjectId;
    institutionId?: mongoose.Types.ObjectId;
    discountAmount?: number;
    discountPercentage?: number;
    originalAmount?: number;
    isInstitutionalDiscount?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IWalletTransaction, {}, {}, {}, mongoose.Document<unknown, {}, IWalletTransaction, {}> & IWalletTransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
