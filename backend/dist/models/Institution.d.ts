/**
 * Institution Model
 * مدل نهادهای آموزشی
 */
import mongoose, { Document } from 'mongoose';
export interface IContactInfo {
    email: string;
    phone: string;
    address?: string;
    website?: string;
    contactPersonName?: string;
    contactPersonPhone?: string;
}
export interface IDefaultDiscountSettings {
    defaultDiscountPercentage?: number;
    defaultDiscountAmount?: number;
    maxDiscountPercentage?: number;
    discountPercentage?: number;
    discountAmount?: number;
    allowCustomDiscounts: boolean;
    discountValidityDays?: number;
}
export interface IEnrollmentSettings {
    enrollmentCode: string;
    codeExpirationDate?: Date;
    maxStudents?: number;
    autoApproveStudents: boolean;
    requireApproval: boolean;
}
export interface IInstitution extends Document {
    name: string;
    nameEn?: string;
    type: 'school' | 'university' | 'institute' | 'organization' | 'other';
    description?: string;
    contactInfo: IContactInfo;
    defaultDiscountSettings: IDefaultDiscountSettings;
    enrollmentSettings: IEnrollmentSettings;
    isActive: boolean;
    establishedYear?: number;
    studentCount?: number;
    totalStudents?: number;
    activeStudents?: number;
    uniqueId?: string;
    logo?: string;
    features: string[];
    contractStartDate?: Date;
    contractEndDate?: Date;
    contractTerms?: string;
    notes?: string;
    createdBy: mongoose.Types.ObjectId;
    lastModifiedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    findByEnrollmentCode?: (code: string) => Promise<IInstitution | null>;
    isEnrollmentValid(): boolean;
    canAcceptMoreStudents(): boolean;
}
interface IInstitutionModel extends mongoose.Model<IInstitution> {
    findByEnrollmentCode(code: string): Promise<IInstitution | null>;
}
declare const _default: IInstitutionModel;
export default _default;
