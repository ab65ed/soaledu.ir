"use strict";
/**
 * InstitutionalDiscountGroup model
 *
 * مدل گروه‌هاای تخفیف سازمانی برای مدیریت تخفیف‌های اعطایی به نهادهای آموزشی
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
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
const InstitutionalDiscountGroupSchema = new mongoose_1.Schema({
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
            validator: function (value) {
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
            validator: function (value) {
                // یکی از دو فیلد discountPercentage یا discountAmount باید وجود داشته باشد
                return Boolean(this.discountPercentage || value);
            },
            message: 'باید یکی از فیلدهای درصد تخفیف یا مبلغ تخفیف را وارد کنید'
        }
    },
    uploadedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ایندکس‌ها برای بهینه‌سازی جستجو
InstitutionalDiscountGroupSchema.index({ uploadedBy: 1 });
InstitutionalDiscountGroupSchema.index({ status: 1 });
InstitutionalDiscountGroupSchema.index({ uploadDate: -1 });
InstitutionalDiscountGroupSchema.index({ isActive: 1 });
// Virtual برای محاسبه درصد موفقیت
InstitutionalDiscountGroupSchema.virtual("successRate").get(function () {
    if (this.totalUsersInFile === 0)
        return 0;
    return Math.round((this.matchedUsersCount / this.totalUsersInFile) * 100);
});
// Virtual برای دریافت اطلاعات کاربر بارگذارکننده
InstitutionalDiscountGroupSchema.virtual("uploader", {
    ref: "User",
    localField: "uploadedBy",
    foreignField: "_id",
    justOne: true,
});
exports.default = mongoose_1.default.model("InstitutionalDiscountGroup", InstitutionalDiscountGroupSchema);
//# sourceMappingURL=InstitutionalDiscountGroup.js.map