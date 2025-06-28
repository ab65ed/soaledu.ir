/**
 * User model
 *
 * This file defines the User schema for MongoDB.
 */
import mongoose, { Document } from "mongoose";
interface IWalletTransaction {
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    createdAt: Date;
}
interface IWallet {
    balance: number;
    transactions: IWalletTransaction[];
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'admin' | 'support' | 'Question Designer';
    nationalCode?: string;
    phoneNumber?: string;
    institutionalDiscountPercentage?: number;
    institutionalDiscountAmount?: number;
    institutionalDiscountGroupId?: mongoose.Types.ObjectId;
    institutionId?: mongoose.Types.ObjectId;
    enrollmentCode?: string;
    wallet: IWallet;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
    addWalletTransaction(amount: number, type: 'credit' | 'debit', description: string): Promise<IUser>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
