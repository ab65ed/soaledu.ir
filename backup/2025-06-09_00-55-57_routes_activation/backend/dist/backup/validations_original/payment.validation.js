"use strict";
/**
 * Payment validation middleware
 *
 * This file contains validation schemas and middleware for payment-related requests
 * using fastest-validator.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionFilterSchema = exports.createDiscountCodeSchema = exports.discountCodeSchema = exports.paymentSchema = exports.validateTransactionFilter = exports.validateCreateDiscountCode = exports.validateDiscountCode = exports.validatePayment = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const v = new fastest_validator_1.default();
// Payment initiation validation schema
const paymentSchema = {
    amount: {
        type: "number",
        positive: true,
        min: 1000, // Minimum 1000 Tomans
        max: 10000000, // Maximum 10 million Tomans
        messages: {
            required: "مبلغ پرداخت الزامی است",
            number: "مبلغ پرداخت باید عدد باشد",
            positive: "مبلغ پرداخت باید مثبت باشد",
            min: "حداقل مبلغ پرداخت ۱۰۰۰ تومان است",
            max: "حداکثر مبلغ پرداخت ۱۰ میلیون تومان است",
        },
    },
    discountCode: {
        type: "string",
        optional: true,
        trim: true,
        min: 3,
        max: 20,
        messages: {
            string: "کد تخفیف باید متن باشد",
            min: "کد تخفیف باید حداقل ۳ کاراکتر باشد",
            max: "کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد",
        },
    },
};
exports.paymentSchema = paymentSchema;
// Discount code validation schema
const discountCodeSchema = {
    code: {
        type: "string",
        trim: true,
        min: 3,
        max: 20,
        messages: {
            required: "کد تخفیف الزامی است",
            string: "کد تخفیف باید متن باشد",
            min: "کد تخفیف باید حداقل ۳ کاراکتر باشد",
            max: "کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد",
        },
    },
    amount: {
        type: "number",
        positive: true,
        min: 1000,
        max: 10000000,
        messages: {
            required: "مبلغ پرداخت الزامی است",
            number: "مبلغ پرداخت باید عدد باشد",
            positive: "مبلغ پرداخت باید مثبت باشد",
            min: "حداقل مبلغ پرداخت ۱۰۰۰ تومان است",
            max: "حداکثر مبلغ پرداخت ۱۰ میلیون تومان است",
        },
    },
};
exports.discountCodeSchema = discountCodeSchema;
// Admin discount code creation schema
const createDiscountCodeSchema = {
    code: {
        type: "string",
        trim: true,
        min: 3,
        max: 20,
        messages: {
            required: "کد تخفیف الزامی است",
            string: "کد تخفیف باید متن باشد",
            min: "کد تخفیف باید حداقل ۳ کاراکتر باشد",
            max: "کد تخفیف نمی‌تواند بیش از ۲۰ کاراکتر باشد",
        },
    },
    discountPercentage: {
        type: "number",
        positive: true,
        min: 1,
        max: 100,
        messages: {
            required: "درصد تخفیف الزامی است",
            number: "درصد تخفیف باید عدد باشد",
            positive: "درصد تخفیف باید مثبت باشد",
            min: "حداقل درصد تخفیف ۱ درصد است",
            max: "حداکثر درصد تخفیف ۱۰۰ درصد است",
        },
    },
    expiryDate: {
        type: "date",
        convert: true,
        messages: {
            required: "تاریخ انقضا الزامی است",
            date: "تاریخ انقضا باید تاریخ معتبر باشد",
        },
    },
    usageLimit: {
        type: "number",
        optional: true,
        positive: true,
        min: 1,
        messages: {
            number: "محدودیت استفاده باید عدد باشد",
            positive: "محدودیت استفاده باید مثبت باشد",
            min: "حداقل محدودیت استفاده ۱ بار است",
        },
    },
    minAmount: {
        type: "number",
        optional: true,
        positive: true,
        default: 0,
        messages: {
            number: "حداقل مبلغ باید عدد باشد",
            positive: "حداقل مبلغ باید مثبت باشد",
        },
    },
    maxDiscount: {
        type: "number",
        optional: true,
        positive: true,
        messages: {
            number: "حداکثر تخفیف باید عدد باشد",
            positive: "حداکثر تخفیف باید مثبت باشد",
        },
    },
    description: {
        type: "string",
        optional: true,
        trim: true,
        max: 200,
        messages: {
            string: "توضیحات باید متن باشد",
            max: "توضیحات نمی‌تواند بیش از ۲۰۰ کاراکتر باشد",
        },
    },
};
exports.createDiscountCodeSchema = createDiscountCodeSchema;
// Transaction filter validation schema
const transactionFilterSchema = {
    page: {
        type: "number",
        optional: true,
        positive: true,
        integer: true,
        min: 1,
        convert: true,
        default: 1,
        messages: {
            number: "شماره صفحه باید عدد باشد",
            positive: "شماره صفحه باید مثبت باشد",
            integer: "شماره صفحه باید عدد صحیح باشد",
            min: "شماره صفحه باید حداقل ۱ باشد",
        },
    },
    limit: {
        type: "number",
        optional: true,
        positive: true,
        integer: true,
        min: 1,
        max: 100,
        convert: true,
        default: 10,
        messages: {
            number: "تعداد آیتم در صفحه باید عدد باشد",
            positive: "تعداد آیتم در صفحه باید مثبت باشد",
            integer: "تعداد آیتم در صفحه باید عدد صحیح باشد",
            min: "تعداد آیتم در صفحه باید حداقل ۱ باشد",
            max: "تعداد آیتم در صفحه نمی‌تواند بیش از ۱۰۰ باشد",
        },
    },
    status: {
        type: "string",
        optional: true,
        enum: ["pending", "completed", "failed", "refunded"],
        messages: {
            string: "وضعیت باید متن باشد",
            enum: "وضعیت باید یکی از مقادیر مجاز باشد",
        },
    },
    userId: {
        type: "string",
        optional: true,
        trim: true,
        messages: {
            string: "شناسه کاربر باید متن باشد",
        },
    },
    startDate: {
        type: "date",
        optional: true,
        convert: true,
        messages: {
            date: "تاریخ شروع باید تاریخ معتبر باشد",
        },
    },
    endDate: {
        type: "date",
        optional: true,
        convert: true,
        messages: {
            date: "تاریخ پایان باید تاریخ معتبر باشد",
        },
    },
};
exports.transactionFilterSchema = transactionFilterSchema;
// Compile validation functions
const validatePaymentData = v.compile(paymentSchema);
const validateDiscountCodeData = v.compile(discountCodeSchema);
const validateCreateDiscountCodeData = v.compile(createDiscountCodeSchema);
const validateTransactionFilterData = v.compile(transactionFilterSchema);
// Middleware functions
const validatePayment = (req, res, next) => {
    const result = validatePaymentData(req.body);
    if (result !== true) {
        const errors = (Array.isArray(result) ? result : []).map((error) => ({
            field: error.field,
            message: error.message,
            value: error.actual,
        }));
        res.status(400).json({
            success: false,
            message: "داده‌های ورودی نامعتبر است",
            errors: errors,
        });
        return;
    }
    next();
};
exports.validatePayment = validatePayment;
const validateDiscountCode = (req, res, next) => {
    const result = validateDiscountCodeData(req.body);
    if (result !== true) {
        const errors = (Array.isArray(result) ? result : []).map((error) => ({
            field: error.field,
            message: error.message,
            value: error.actual,
        }));
        res.status(400).json({
            success: false,
            message: "داده‌های ورودی نامعتبر است",
            errors: errors,
        });
        return;
    }
    next();
};
exports.validateDiscountCode = validateDiscountCode;
const validateCreateDiscountCode = (req, res, next) => {
    const result = validateCreateDiscountCodeData(req.body);
    if (result !== true) {
        const errors = (Array.isArray(result) ? result : []).map((error) => ({
            field: error.field,
            message: error.message,
            value: error.actual,
        }));
        res.status(400).json({
            success: false,
            message: "داده‌های ورودی نامعتبر است",
            errors: errors,
        });
        return;
    }
    // Additional validation for expiry date
    const expiryDate = new Date(req.body.expiryDate);
    const now = new Date();
    if (expiryDate <= now) {
        res.status(400).json({
            success: false,
            message: "تاریخ انقضا باید در آینده باشد",
            errors: [
                {
                    field: "expiryDate",
                    message: "تاریخ انقضا باید در آینده باشد",
                    value: req.body.expiryDate,
                },
            ],
        });
        return;
    }
    next();
};
exports.validateCreateDiscountCode = validateCreateDiscountCode;
const validateTransactionFilter = (req, res, next) => {
    const result = validateTransactionFilterData(req.query);
    if (result !== true) {
        const errors = (Array.isArray(result) ? result : []).map((error) => ({
            field: error.field,
            message: error.message,
            value: error.actual,
        }));
        res.status(400).json({
            success: false,
            message: "پارامترهای فیلتر نامعتبر است",
            errors: errors,
        });
        return;
    }
    // Additional validation for date range
    if (req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
        if (startDate >= endDate) {
            res.status(400).json({
                success: false,
                message: "تاریخ شروع باید قبل از تاریخ پایان باشد",
                errors: [
                    {
                        field: "dateRange",
                        message: "تاریخ شروع باید قبل از تاریخ پایان باشد",
                        value: {
                            startDate: req.query.startDate,
                            endDate: req.query.endDate,
                        },
                    },
                ],
            });
            return;
        }
    }
    next();
};
exports.validateTransactionFilter = validateTransactionFilter;
//# sourceMappingURL=payment.validation.js.map