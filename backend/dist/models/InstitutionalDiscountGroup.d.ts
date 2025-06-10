/**
 * InstitutionalDiscountGroup model
 *
 * مدل گروه‌هاای تخفیف سازمانی برای مدیریت تخفیف‌های اعطایی به نهادهای آموزشی
 */
import mongoose, { Document } from "mongoose";
export interface IInstitutionalDiscountGroup extends Document {
    groupName?: string;
    discountPercentage?: number;
    discountAmount?: number;
    uploadedBy: mongoose.Types.ObjectId;
    uploadDate: Date;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    totalUsersInFile: number;
    matchedUsersCount: number;
    unmatchedUsersCount: number;
    invalidDataCount: number;
    errorLog: string[];
    fileName?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IInstitutionalDiscountGroup, {}, {}, {}, mongoose.Document<unknown, {}, IInstitutionalDiscountGroup, {}> & IInstitutionalDiscountGroup & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
