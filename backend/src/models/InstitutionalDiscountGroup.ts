/**
 * InstitutionalDiscountGroup model
 * 
 * مدل گروه‌هاای تخفیف سازمانی برای مدیریت تخفیف‌های اعطایی به نهادهای آموزشی
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for InstitutionalDiscountGroup document
export interface IInstitutionalDiscountGroup extends Document {
  groupName?: string; // نام گروه (اختیاری)
  discountPercentage?: number; // درصد تخفیف
  discountAmount?: number; // مبلغ ثابت تخفیف (به تومان)
  uploadedBy: mongoose.Types.ObjectId; // شناسه ادمین بارگذارکننده
  uploadDate: Date; // تاریخ بارگذاری
  status: 'pending' | 'processing' | 'completed' | 'failed'; // وضعیت پردازش
  totalUsersInFile: number; // تعداد کل ردیف‌ها در فایل
  matchedUsersCount: number; // تعداد کاربران تطبیق‌یافته
  unmatchedUsersCount: number; // تعداد کاربران پیدا نشده
  invalidDataCount: number; // تعداد ردیف‌های با اطلاعات نامعتبر
  errorLog: string[]; // لاگ خطاهای پردازش
  fileName?: string; // نام فایل بارگذاری شده
  isActive: boolean; // فعال بودن گروه تخفیف
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     InstitutionalDiscountGroup:
 *       type: object
 *       required:
 *         - uploadedBy
 *         - totalUsersInFile
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         groupName:
 *           type: string
 *           description: نام گروه تخفیف (مثل "دانش‌آموزان مدرسه البرز - ۲۰۲۵")
 *         discountPercentage:
 *           type: number
 *           description: درصد تخفیف (۱ تا ۱۰۰)
 *         discountAmount:
 *           type: number
 *           description: مبلغ ثابت تخفیف به تومان
 *         uploadedBy:
 *           type: string
 *           description: شناسه ادمین بارگذارکننده
 *         uploadDate:
 *           type: string
 *           format: date-time
 *           description: تاریخ بارگذاری
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, failed]
 *           description: وضعیت پردازش فایل
 *         totalUsersInFile:
 *           type: number
 *           description: تعداد کل ردیف‌ها در فایل
 *         matchedUsersCount:
 *           type: number
 *           description: تعداد کاربران تطبیق‌یافته
 *         unmatchedUsersCount:
 *           type: number
 *           description: تعداد کاربران پیدا نشده
 *         invalidDataCount:
 *           type: number
 *           description: تعداد ردیف‌های با اطلاعات نامعتبر
 *         errorLog:
 *           type: array
 *           items:
 *             type: string
 *           description: لاگ خطاهای پردازش
 *         fileName:
 *           type: string
 *           description: نام فایل بارگذاری شده
 *         isActive:
 *           type: boolean
 *           description: فعال بودن گروه تخفیف
 */

const InstitutionalDiscountGroupSchema = new Schema<IInstitutionalDiscountGroup>(
  {
    groupName: {
      type: String,
      trim: true,
      maxlength: [200, "نام گروه نمی‌تواند بیش از ۲۰۰ کاراکتر باشد"],
    },
    discountPercentage: {
      type: Number,
      min: [1, 'درصد تخفیف باید حداقل ۱ درصد باشد'],
      max: [100, 'درصد تخفیف نمی‌تواند بیش از ۱۰۰ درصد باشد'],
      validate: {
        validator: function(this: IInstitutionalDiscountGroup, value: number) {
          // یکی از دو فیلد discountPercentage یا discountAmount باید وجود داشته باشد
          return Boolean(this.discountAmount || value);
        },
        message: 'باید یکی از فیلدهای درصد تخفیف یا مبلغ تخفیف را وارد کنید'
      }
    },
    discountAmount: {
      type: Number,
      min: [1000, 'مبلغ تخفیف باید حداقل ۱۰۰۰ تومان باشد'],
      validate: {
        validator: function(this: IInstitutionalDiscountGroup, value: number) {
          // یکی از دو فیلد discountPercentage یا discountAmount باید وجود داشته باشد
          return Boolean(this.discountPercentage || value);
        },
        message: 'باید یکی از فیلدهای درصد تخفیف یا مبلغ تخفیف را وارد کنید'
      }
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه کاربر بارگذارکننده الزامی است"],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "processing", "completed", "failed"],
        message: "وضعیت باید یکی از موارد: pending, processing, completed, failed باشد",
      },
      default: "pending",
    },
    totalUsersInFile: {
      type: Number,
      required: [true, "تعداد کل کاربران در فایل الزامی است"],
      min: [1, "تعداد کاربران باید حداقل ۱ باشد"],
    },
    matchedUsersCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد کاربران تطبیق‌یافته نمی‌تواند منفی باشد"],
    },
    unmatchedUsersCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد کاربران پیدا نشده نمی‌تواند منفی باشد"],
    },
    invalidDataCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد داده‌های نامعتبر نمی‌تواند منفی باشد"],
    },
    errorLog: {
      type: [{
        type: String,
        maxlength: [1000, "هر پیام خطا نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد"],
      }],
      default: [],
    },
    fileName: {
      type: String,
      trim: true,
      maxlength: [255, "نام فایل نمی‌تواند بیش از ۲۵۵ کاراکتر باشد"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ایندکس‌ها برای بهینه‌سازی جستجو
InstitutionalDiscountGroupSchema.index({ uploadedBy: 1 });
InstitutionalDiscountGroupSchema.index({ status: 1 });
InstitutionalDiscountGroupSchema.index({ uploadDate: -1 });
InstitutionalDiscountGroupSchema.index({ isActive: 1 });

// Virtual برای محاسبه درصد موفقیت
InstitutionalDiscountGroupSchema.virtual("successRate").get(function(this: IInstitutionalDiscountGroup) {
  if (this.totalUsersInFile === 0) return 0;
  return Math.round((this.matchedUsersCount / this.totalUsersInFile) * 100);
});

// Virtual برای دریافت اطلاعات کاربر بارگذارکننده
InstitutionalDiscountGroupSchema.virtual("uploader", {
  ref: "User",
  localField: "uploadedBy",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model<IInstitutionalDiscountGroup>("InstitutionalDiscountGroup", InstitutionalDiscountGroupSchema); 