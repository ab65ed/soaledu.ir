/**
 * DiscountCode model
 *
 * This file defines the DiscountCode schema for MongoDB.
 * Discount codes provide percentage discounts for wallet top-ups.
 */
import mongoose, { Document, Model } from 'mongoose';
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
    isValid(): IDiscountValidation;
    calculateDiscount(amount: number): IDiscountCalculation;
    use(): Promise<IDiscountCode>;
}
export interface IDiscountCodeModel extends Model<IDiscountCode> {
    findValidCode(code: string): Promise<IDiscountCodeResult>;
}
declare const _default: IDiscountCodeModel;
export default _default;
