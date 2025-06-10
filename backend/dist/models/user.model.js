"use strict";
/**
 * User model
 *
 * This file defines the User schema for MongoDB.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
const UserSchema = new mongoose_1.Schema({
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
            message: "Role must be either: student, admin, support or Question Designer",
        },
        default: "student",
    },
    educationalGroup: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
    nationalCode: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                if (!value)
                    return true; // اختیاری است
                // اعتبارسنجی کد ملی ایرانی
                const code = value.toString();
                if (code.length !== 10)
                    return false;
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
            validator: function (value) {
                if (!value)
                    return true; // اختیاری است
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
    institutionalDiscountGroupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "InstitutionalDiscountGroup",
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for user's exams
UserSchema.virtual("exams", {
    ref: "Exam",
    localField: "_id",
    foreignField: "user",
    justOne: false,
});
// Hash password before saving
UserSchema.pre("save", async function (next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified("password")) {
        return next();
    }
    try {
        // Generate salt
        const salt = await bcrypt_1.default.genSalt(10);
        // Hash password
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt_1.default.compare(enteredPassword, this.password);
};
// Add wallet transaction
UserSchema.methods.addWalletTransaction = function (amount, type, description) {
    this.wallet.transactions.push({
        amount,
        type,
        description,
    });
    if (type === "credit") {
        this.wallet.balance += amount;
    }
    else if (type === "debit") {
        this.wallet.balance -= amount;
    }
    return this.save();
};
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.model.js.map