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
 *     TieredDiscount:
 *       type: object
 *       required:
 *         - count
 *         - discountPercentage
 *       properties:
 *         count:
 *           type: number
 *           description: تعداد کاربران برای این پلکان تخفیف
 *         discountPercentage:
 *           type: number
 *           description: درصد تخفیف برای این پلکان
 *         discountAmount:
 *           type: number
 *           description: مبلغ ثابت تخفیف برای این پلکان (اختیاری)
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
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: تاریخ شروع اعتبار تخفیف
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: تاریخ پایان اعتبار تخفیف
 *         tiers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TieredDiscount'
 *           description: آرایه تخفیف‌های پلکانی
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
// Sub-schema for Tiered Discounts
const TieredDiscountSchema = new mongoose_1.Schema({
    count: {
        type: Number,
        required: [true, 'تعداد کاربران برای پلکان تخفیف الزامی است'],
        min: [1, 'تعداد کاربران باید حداقل ۱ باشد'],
    },
    discountPercentage: {
        type: Number,
        min: [0, 'درصد تخفیف نمی‌تواند منفی باشد'],
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
});
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
                // یکی از دو فیلد discountPercentage یا discountAmount یا tiers باید وجود داشته باشد
                return Boolean(this.discountAmount || value || (this.tiers && this.tiers.length > 0));
            },
            message: 'باید یکی از فیلدهای درصد تخفیف، مبلغ تخفیف یا تخفیف پلکانی را وارد کنید'
        }
    },
    discountAmount: {
        type: Number,
        min: [1000, 'مبلغ تخفیف باید حداقل ۱۰۰۰ تومان باشد'],
        validate: {
            validator: function (value) {
                // یکی از دو فیلد discountPercentage یا discountAmount یا tiers باید وجود داشته باشد
                return Boolean(this.discountPercentage || value || (this.tiers && this.tiers.length > 0));
            },
            message: 'باید یکی از فیلدهای درصد تخفیف، مبلغ تخفیف یا تخفیف پلکانی را وارد کنید'
        }
    },
    // فیلدهای جدید برای تخفیف‌های زمان‌دار
    startDate: {
        type: Date,
        validate: {
            validator: function (value) {
                // اگر تاریخ پایان وجود داشته باشد، تاریخ شروع باید قبل از آن باشد
                if (this.endDate && value) {
                    return value < this.endDate;
                }
                return true;
            },
            message: 'تاریخ شروع باید قبل از تاریخ پایان باشد'
        }
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (value) {
                // اگر تاریخ شروع وجود داشته باشد، تاریخ پایان باید بعد از آن باشد
                if (this.startDate && value) {
                    return value > this.startDate;
                }
                return true;
            },
            message: 'تاریخ پایان باید بعد از تاریخ شروع باشد'
        }
    },
    // فیلد جدید برای تخفیف‌های پلکانی
    tiers: {
        type: [TieredDiscountSchema],
        validate: {
            validator: function (value) {
                // اگر tiers وجود داشته باشد، باید مرتب شده باشد و حداقل یک پلکان داشته باشد
                if (value && value.length > 0) {
                    // بررسی ترتیب صعودی تعداد کاربران
                    for (let i = 1; i < value.length; i++) {
                        if (value[i].count <= value[i - 1].count) {
                            return false;
                        }
                    }
                    return true;
                }
                // اگر tiers وجود نداشته باشد، یکی از فیلدهای تخفیف باید وجود داشته باشد
                return Boolean(this.discountPercentage || this.discountAmount);
            },
            message: 'پلکان‌های تخفیف باید بر اساس تعداد کاربران به صورت صعودی مرتب شده باشند'
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
InstitutionalDiscountGroupSchema.index({ startDate: 1, endDate: 1 }); // برای تخفیف‌های زمان‌دار
// Virtual برای محاسبه درصد موفقیت
InstitutionalDiscountGroupSchema.virtual("successRate").get(function () {
    if (this.totalUsersInFile === 0)
        return 0;
    return Math.round((this.matchedUsersCount / this.totalUsersInFile) * 100);
});
// Virtual برای بررسی اعتبار زمانی تخفیف
InstitutionalDiscountGroupSchema.virtual("isTimeValid").get(function () {
    const now = new Date();
    // اگر تاریخ شروع تعریف شده و هنوز نرسیده
    if (this.startDate && now < this.startDate) {
        return false;
    }
    // اگر تاریخ پایان تعریف شده و گذشته
    if (this.endDate && now > this.endDate) {
        return false;
    }
    return true;
});
// Virtual برای دریافت اطلاعات کاربر بارگذارکننده
InstitutionalDiscountGroupSchema.virtual("uploader", {
    ref: "User",
    localField: "uploadedBy",
    foreignField: "_id",
    justOne: true,
});
// متد برای محاسبه تخفیف پلکانی بر اساس تعداد کاربران
InstitutionalDiscountGroupSchema.methods.calculateTieredDiscount = function (userCount) {
    if (!this.tiers || this.tiers.length === 0) {
        return null;
    }
    // پیدا کردن بالاترین پلکان قابل اعمال
    let applicableTier = null;
    for (const tier of this.tiers) {
        if (userCount >= tier.count) {
            applicableTier = tier;
        }
        else {
            break; // چون پلکان‌ها مرتب شده‌اند، می‌توانیم متوقف شویم
        }
    }
    if (applicableTier) {
        return {
            discountPercentage: applicableTier.discountPercentage,
            discountAmount: applicableTier.discountAmount
        };
    }
    return null;
};
exports.default = mongoose_1.default.model("InstitutionalDiscountGroup", InstitutionalDiscountGroupSchema);
//# sourceMappingURL=InstitutionalDiscountGroup.js.map