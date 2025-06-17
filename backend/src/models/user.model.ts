/**
 * User model
 *
 * This file defines the User schema for MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Interface for wallet transaction
interface IWalletTransaction {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: Date;
}

// Interface for wallet
interface IWallet {
  balance: number;
  transactions: IWalletTransaction[];
}

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'support' | 'Question Designer';
  educationalGroup?: mongoose.Types.ObjectId;
  nationalCode?: string; // کد ملی برای شناسایی در تخفیف‌های سازمانی
  phoneNumber?: string; // شماره تلفن برای شناسایی در تخفیف‌های سازمانی
  institutionalDiscountPercentage?: number; // درصد تخفیف سازمانی
  institutionalDiscountAmount?: number; // مبلغ ثابت تخفیف سازمانی
  institutionalDiscountGroupId?: mongoose.Types.ObjectId; // ارجاع به گروه تخفیف سازمانی
  institutionId?: mongoose.Types.ObjectId; // ارجاع به نهاد آموزشی
  enrollmentCode?: string; // کد ثبت‌نام استفاده شده
  wallet: IWallet;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  addWalletTransaction(amount: number, type: 'credit' | 'debit', description: string): Promise<IUser>;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           description: User's email address
 *           format: email
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *         role:
 *           type: string
 *           enum: [student, admin, support, Question Designer]
 *           description: User's role
 *         educationalGroup:
 *           type: string
 *           description: Reference to Category (educational group)
 *         wallet:
 *           type: object
 *           properties:
 *             balance:
 *               type: number
 *               description: User's wallet balance
 *             transactions:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                     enum: [credit, debit]
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries
    },
    role: {
      type: String,
      enum: {
        values: ["student", "admin", "support", "Question Designer"],
        message:
          "Role must be either: student, admin, support or Question Designer",
      },
      default: "student",
    },
    educationalGroup: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    nationalCode: {
      type: String,
      trim: true,
      validate: {
        validator: function(value: string) {
          if (!value) return true; // اختیاری است
          // اعتبارسنجی کد ملی ایرانی
          const code = value.toString();
          if (code.length !== 10) return false;
          const check = parseInt(code[9]);
          const sum = code.split('').slice(0, 9).reduce((acc, x, i) => acc + parseInt(x) * (10 - i), 0) % 11;
          return (sum < 2) ? (check === sum) : (check === 11 - sum);
        },
        message: 'کد ملی وارد شده نامعتبر است'
      }
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(value: string) {
          if (!value) return true; // اختیاری است
          // اعتبارسنجی شماره تلفن ایرانی
          const phoneRegex = /^(09\d{9}|9\d{9})$/;
          return phoneRegex.test(value);
        },
        message: 'شماره تلفن وارد شده نامعتبر است'
      }
    },
    institutionalDiscountPercentage: {
      type: Number,
      min: [0, 'درصد تخفیف نمی‌تواند منفی باشد'],
      max: [100, 'درصد تخفیف نمی‌تواند بیش از ۱۰۰ باشد'],
      default: 0
    },
    institutionalDiscountAmount: {
      type: Number,
      min: [0, 'مبلغ تخفیف نمی‌تواند منفی باشد'],
      default: 0
    },
    institutionalDiscountGroupId: {
      type: Schema.Types.ObjectId,
      ref: "InstitutionalDiscountGroup",
    },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
    },
    enrollmentCode: {
      type: String,
      trim: true,
      maxlength: [20, "کد ثبت‌نام نمی‌تواند بیش از ۲۰ کاراکتر باشد"],
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          amount: {
            type: Number,
            required: true,
          },
          type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user's exams
UserSchema.virtual("exams", {
  ref: "Exam",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

// ایندکس‌های ضروری برای بهینه‌سازی عملکرد کوئری
UserSchema.index({ email: 1 }, { unique: true }); // ایندکس منحصر به فرد روی ایمیل
UserSchema.index({ nationalCode: 1 }, { sparse: true }); // ایندکس روی کد ملی (sparse برای مقادیر اختیاری)
UserSchema.index({ phoneNumber: 1 }, { sparse: true }); // ایندکس روی شماره تلفن
UserSchema.index({ role: 1 }); // ایندکس روی نقش کاربر
UserSchema.index({ institutionId: 1 }, { sparse: true }); // ایندکس روی موسسه
UserSchema.index({ institutionalDiscountGroupId: 1 }, { sparse: true }); // ایندکس روی گروه تخفیف
UserSchema.index({ educationalGroup: 1 }, { sparse: true }); // ایندکس روی گروه آموزشی
UserSchema.index({ createdAt: -1 }); // ایندکس نزولی روی تاریخ ایجاد (برای فیلتر کردن کاربران جدید)
UserSchema.index({ enrollmentCode: 1 }, { sparse: true }); // ایندکس روی کد ثبت‌نام

// ایندکس ترکیبی برای جستجوی بهینه کاربران سازمانی
UserSchema.index({ 
  institutionId: 1, 
  institutionalDiscountGroupId: 1, 
  role: 1 
}, { sparse: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add wallet transaction
UserSchema.methods.addWalletTransaction = function (amount: number, type: 'credit' | 'debit', description: string): Promise<IUser> {
  this.wallet.transactions.push({
    amount,
    type,
    description,
  });

  if (type === "credit") {
    this.wallet.balance += amount;
  } else if (type === "debit") {
    this.wallet.balance -= amount;
  }

  return this.save();
};

export default mongoose.model<IUser>("User", UserSchema); 