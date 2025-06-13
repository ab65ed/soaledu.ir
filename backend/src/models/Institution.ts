/**
 * Institution Model
 * مدل نهادهای آموزشی
 */

import mongoose, { Document, Schema } from 'mongoose';

// Interface for contact information
export interface IContactInfo {
  email: string;
  phone: string;
  address?: string;
  website?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
}

// Interface for default discount settings
export interface IDefaultDiscountSettings {
  defaultDiscountPercentage?: number;
  defaultDiscountAmount?: number;
  maxDiscountPercentage?: number;
  discountPercentage?: number; // کوتاه‌ترین نام برای backward compatibility
  discountAmount?: number; // کوتاه‌ترین نام برای backward compatibility
  allowCustomDiscounts: boolean;
  discountValidityDays?: number;
}

// Interface for enrollment settings
export interface IEnrollmentSettings {
  enrollmentCode: string;
  codeExpirationDate?: Date;
  maxStudents?: number;
  autoApproveStudents: boolean;
  requireApproval: boolean;
}

// Interface for Institution document
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
  totalStudents?: number; // اضافه شده برای سازگاری
  activeStudents?: number; // اضافه شده برای سازگاری
  uniqueId?: string; // اضافه شده برای سازگاری
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
  
  // Methods
  findByEnrollmentCode?: (code: string) => Promise<IInstitution | null>;
  isEnrollmentValid(): boolean;
  canAcceptMoreStudents(): boolean;
}

// Contact Info Schema
const ContactInfoSchema = new Schema<IContactInfo>({
  email: {
    type: String,
    required: [true, 'ایمیل نهاد الزامی است'],
    trim: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'لطفاً یک ایمیل معتبر وارد کنید',
    ],
  },
  phone: {
    type: String,
    required: [true, 'شماره تلفن نهاد الزامی است'],
    trim: true,
    validate: {
      validator: function(value: string) {
        // اعتبارسنجی شماره تلفن ایرانی
        const phoneRegex = /^(0\d{2,3}\d{8}|09\d{9})$/;
        return phoneRegex.test(value);
      },
      message: 'شماره تلفن وارد شده نامعتبر است'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'آدرس نمی‌تواند بیش از ۵۰۰ کاراکتر باشد'],
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(value: string) {
        if (!value) return true; // اختیاری است
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlRegex.test(value);
      },
      message: 'آدرس وب‌سایت نامعتبر است'
    }
  },
  contactPersonName: {
    type: String,
    trim: true,
    maxlength: [100, 'نام شخص تماس نمی‌تواند بیش از ۱۰۰ کاراکتر باشد'],
  },
  contactPersonPhone: {
    type: String,
    trim: true,
    validate: {
      validator: function(value: string) {
        if (!value) return true; // اختیاری است
        const phoneRegex = /^(09\d{9}|0\d{2,3}\d{8})$/;
        return phoneRegex.test(value);
      },
      message: 'شماره تلفن شخص تماس نامعتبر است'
    }
  },
});

// Default Discount Settings Schema
const DefaultDiscountSettingsSchema = new Schema<IDefaultDiscountSettings>({
  defaultDiscountPercentage: {
    type: Number,
    min: [0, 'درصد تخفیف نمی‌تواند منفی باشد'],
    max: [100, 'درصد تخفیف نمی‌تواند بیش از ۱۰۰ باشد'],
    default: 0,
  },
  defaultDiscountAmount: {
    type: Number,
    min: [0, 'مبلغ تخفیف نمی‌تواند منفی باشد'],
    default: 0,
  },
  maxDiscountPercentage: {
    type: Number,
    min: [0, 'حداکثر درصد تخفیف نمی‌تواند منفی باشد'],
    max: [100, 'حداکثر درصد تخفیف نمی‌تواند بیش از ۱۰۰ باشد'],
    default: 50,
  },
  allowCustomDiscounts: {
    type: Boolean,
    default: true,
  },
  discountValidityDays: {
    type: Number,
    min: [0, 'مدت اعتبار تخفیف نمی‌تواند منفی باشد'],
    default: 365, // یک سال
  },
});

// Enrollment Settings Schema
const EnrollmentSettingsSchema = new Schema<IEnrollmentSettings>({
  enrollmentCode: {
    type: String,
    required: [true, 'کد ثبت‌نام الزامی است'],
    unique: true, // این unique index را نگه می‌داریم و explicit index را حذف می‌کنیم
    trim: true,
    uppercase: true,
    minlength: [4, 'کد ثبت‌نام باید حداقل ۴ کاراکتر باشد'],
    maxlength: [20, 'کد ثبت‌نام نمی‌تواند بیش از ۲۰ کاراکتر باشد'],
    validate: {
      validator: function(value: string) {
        // فقط حروف انگلیسی و اعداد
        return /^[A-Z0-9]+$/.test(value);
      },
      message: 'کد ثبت‌نام فقط می‌تواند شامل حروف انگلیسی بزرگ و اعداد باشد'
    }
  },
  codeExpirationDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        if (!value) return true; // اختیاری است
        return value > new Date();
      },
      message: 'تاریخ انقضای کد باید در آینده باشد'
    }
  },
  maxStudents: {
    type: Number,
    min: [0, 'حداکثر تعداد دانش‌آموزان نمی‌تواند منفی باشد'],
  },
  autoApproveStudents: {
    type: Boolean,
    default: false,
  },
  requireApproval: {
    type: Boolean,
    default: true,
  },
});

// Main Institution Schema
const InstitutionSchema = new Schema<IInstitution>(
  {
    name: {
      type: String,
      required: [true, 'نام نهاد الزامی است'],
      trim: true,
      maxlength: [200, 'نام نهاد نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'],
      index: true,
    },
    nameEn: {
      type: String,
      trim: true,
      maxlength: [200, 'نام انگلیسی نهاد نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'],
    },
    type: {
      type: String,
      enum: {
        values: ['school', 'university', 'institute', 'organization', 'other'],
        message: 'نوع نهاد باید یکی از: مدرسه، دانشگاه، مؤسسه، سازمان، سایر باشد',
      },
      required: [true, 'نوع نهاد الزامی است'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'توضیحات نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد'],
    },
    contactInfo: {
      type: ContactInfoSchema,
      required: [true, 'اطلاعات تماس الزامی است'],
    },
    defaultDiscountSettings: {
      type: DefaultDiscountSettingsSchema,
      required: [true, 'تنظیمات پیش‌فرض تخفیف الزامی است'],
    },
    enrollmentSettings: {
      type: EnrollmentSettingsSchema,
      required: [true, 'تنظیمات ثبت‌نام الزامی است'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    establishedYear: {
      type: Number,
      min: [1900, 'سال تأسیس نمی‌تواند قبل از ۱۹۰۰ باشد'],
      max: [new Date().getFullYear(), 'سال تأسیس نمی‌تواند در آینده باشد'],
    },
    studentCount: {
      type: Number,
      min: [0, 'تعداد دانش‌آموزان نمی‌تواند منفی باشد'],
      default: 0,
    },
    totalStudents: {
      type: Number,
      min: [0, 'کل دانش‌آموزان نمی‌تواند منفی باشد'],
      default: 0,
    },
    activeStudents: {
      type: Number,
      min: [0, 'دانش‌آموزان فعال نمی‌تواند منفی باشد'],
      default: 0,
    },
    uniqueId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: function(features: string[]) {
          return features.length <= 20;
        },
        message: 'نمی‌توان بیش از ۲۰ ویژگی تعریف کرد'
      }
    },
    contractStartDate: {
      type: Date,
    },
    contractEndDate: {
      type: Date,
      validate: {
        validator: function(this: IInstitution, value: Date) {
          if (!value || !this.contractStartDate) return true;
          return value > this.contractStartDate;
        },
        message: 'تاریخ پایان قرارداد باید بعد از تاریخ شروع باشد'
      }
    },
    contractTerms: {
      type: String,
      trim: true,
      maxlength: [2000, 'شرایط قرارداد نمی‌تواند بیش از ۲۰۰۰ کاراکتر باشد'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'یادداشت‌ها نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'شناسه کاربر ایجادکننده الزامی است'],
      index: true,
    },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
InstitutionSchema.index({ name: 'text', 'contactInfo.email': 'text' });
// حذف شد: InstitutionSchema.index({ 'enrollmentSettings.enrollmentCode': 1 }); // چون unique: true در schema خودش index می‌سازد
InstitutionSchema.index({ createdAt: -1 });
InstitutionSchema.index({ type: 1, isActive: 1 });

// Virtual for total students enrolled
InstitutionSchema.virtual('enrolledStudents', {
  ref: 'User',
  localField: '_id',
  foreignField: 'institutionId',
  count: true,
});

// Virtual for active discount groups
InstitutionSchema.virtual('activeDiscountGroups', {
  ref: 'InstitutionalDiscountGroup',
  localField: '_id',
  foreignField: 'institutionId',
  match: { isActive: true },
});

// Pre-save middleware to generate enrollment code if not provided
InstitutionSchema.pre('save', function (next) {
  if (!this.enrollmentSettings.enrollmentCode) {
    // تولید کد ثبت‌نام منحصر به فرد
    const prefix = this.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.enrollmentSettings.enrollmentCode = `${prefix}${randomSuffix}`;
  }
  next();
});

// Method to check if enrollment is still valid
InstitutionSchema.methods.isEnrollmentValid = function(): boolean {
  if (!this.isActive) return false;
  if (this.enrollmentSettings.codeExpirationDate && this.enrollmentSettings.codeExpirationDate < new Date()) {
    return false;
  }
  return true;
};

// Method to check if student limit is reached
InstitutionSchema.methods.canAcceptMoreStudents = function(): boolean {
  if (!this.enrollmentSettings.maxStudents) return true;
  return this.studentCount < this.enrollmentSettings.maxStudents;
};

// Interface for static methods
interface IInstitutionModel extends mongoose.Model<IInstitution> {
  findByEnrollmentCode(code: string): Promise<IInstitution | null>;
}

// Static method to find by enrollment code
InstitutionSchema.statics.findByEnrollmentCode = function(code: string) {
  return this.findOne({ 
    'enrollmentSettings.enrollmentCode': code.toUpperCase(),
    isActive: true
  });
};

export default mongoose.model<IInstitution, IInstitutionModel>('Institution', InstitutionSchema); 