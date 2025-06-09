"use strict";
/**
 * Payment routes
 *
 * This file defines routes for payment processing including ZarinPal integration,
 * discount code validation, and transaction management.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const payment_model_1 = __importDefault(require("../models/payment.model"));
const discountCode_model_1 = __importDefault(require("../models/discountCode.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_1 = require("../middlewares/auth");
const payment_validation_1 = require("../validations/payment.validation");
const router = express_1.default.Router();
// ZarinPal configuration
const ZARINPAL_CONFIG = {
    MERCHANT_ID: process.env.ZARINPAL_MERCHANT_ID || "test",
    SANDBOX_URL: "https://sandbox.zarinpal.com/pg/rest/WebGate/",
    PRODUCTION_URL: "https://api.zarinpal.com/pg/rest/WebGate/",
    CALLBACK_URL: process.env.ZARINPAL_CALLBACK_URL ||
        "http://localhost:3000/payment/callback",
    IS_SANDBOX: process.env.NODE_ENV !== "production",
};
/**
 * @swagger
 * /api/payment/initiate:
 *   post:
 *     summary: Initiate payment with ZarinPal
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount in Tomans
 *               discountCode:
 *                 type: string
 *                 description: Optional discount code
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post("/initiate", auth_1.protectRoute, payment_validation_1.validatePayment, async (req, res) => {
    try {
        const { amount, discountCode } = req.body;
        const userId = req.user?.id;
        let finalAmount = amount;
        let discountAmount = 0;
        let appliedDiscount = null;
        // Validate and apply discount code if provided
        if (discountCode) {
            const discountValidation = await discountCode_model_1.default.findValidCode(discountCode);
            if (!discountValidation.valid) {
                res.status(400).json({
                    success: false,
                    message: discountValidation.reason,
                });
                return;
            }
            const discountCalculation = discountValidation.discountCode.calculateDiscount(amount);
            if (!discountCalculation.valid) {
                res.status(400).json({
                    success: false,
                    message: discountCalculation.reason,
                });
                return;
            }
            finalAmount = discountCalculation.finalAmount;
            discountAmount = discountCalculation.discountAmount;
            appliedDiscount = discountValidation.discountCode;
        }
        // Create payment record
        const payment = new payment_model_1.default({
            user: userId,
            amount: finalAmount,
            credits: finalAmount, // 1 Toman = 1 Credit
            paymentMethod: "zarinpal",
            status: "pending",
            packageName: `شارژ کیف پول - ${amount.toLocaleString("fa-IR")} تومان`,
            discountCode: appliedDiscount?._id,
            originalAmount: amount,
            discountAmount: discountAmount,
        });
        await payment.save();
        // Prepare ZarinPal request
        const zarinpalUrl = ZARINPAL_CONFIG.IS_SANDBOX
            ? ZARINPAL_CONFIG.SANDBOX_URL
            : ZARINPAL_CONFIG.PRODUCTION_URL;
        const zarinpalData = {
            merchant_id: ZARINPAL_CONFIG.MERCHANT_ID,
            amount: finalAmount,
            callback_url: `${ZARINPAL_CONFIG.CALLBACK_URL}?payment_id=${payment._id}`,
            description: `شارژ کیف پول کاربر ${req.user?.name}`,
            metadata: {
                mobile: req.user?.phone || "",
                email: req.user?.email || "",
            },
        };
        // Request payment from ZarinPal
        const zarinpalResponse = await axios_1.default.post(`${zarinpalUrl}PaymentRequest.json`, zarinpalData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (zarinpalResponse.data.data && zarinpalResponse.data.data.code === 100) {
            // Update payment with ZarinPal authority
            payment.transactionId = zarinpalResponse.data.data.authority;
            await payment.save();
            // Use discount code if applied
            if (appliedDiscount) {
                await appliedDiscount.use();
            }
            const gatewayUrl = ZARINPAL_CONFIG.IS_SANDBOX
                ? `https://sandbox.zarinpal.com/pg/StartPay/${zarinpalResponse.data.data.authority}`
                : `https://www.zarinpal.com/pg/StartPay/${zarinpalResponse.data.data.authority}`;
            res.json({
                success: true,
                data: {
                    paymentId: payment._id,
                    authority: zarinpalResponse.data.data.authority,
                    gatewayUrl: gatewayUrl,
                    amount: finalAmount,
                    originalAmount: amount,
                    discountAmount: discountAmount,
                },
                message: "پرداخت با موفقیت آغاز شد",
            });
        }
        else {
            payment.status = "failed";
            await payment.save();
            res.status(400).json({
                success: false,
                message: "خطا در اتصال به درگاه پرداخت",
                error: zarinpalResponse.data,
            });
        }
    }
    catch (error) {
        console.error("Payment initiation error:", error);
        res.status(500).json({
            success: false,
            message: "خطای سرور در آغاز پرداخت",
            error: error.message,
        });
    }
});
/**
 * @swagger
 * /api/payment/callback:
 *   get:
 *     summary: Handle ZarinPal payment callback
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: Authority
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: Status
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Payment failed or invalid
 */
router.get("/callback", async (req, res) => {
    try {
        const { Authority, Status, payment_id } = req.query;
        if (!payment_id) {
            res.status(400).json({
                success: false,
                message: "شناسه پرداخت یافت نشد",
            });
            return;
        }
        const payment = await payment_model_1.default.findById(payment_id).populate('user');
        if (!payment) {
            res.status(404).json({
                success: false,
                message: "پرداخت یافت نشد",
            });
            return;
        }
        if (Status === "OK" && Authority) {
            // Verify payment with ZarinPal
            const zarinpalUrl = ZARINPAL_CONFIG.IS_SANDBOX
                ? ZARINPAL_CONFIG.SANDBOX_URL
                : ZARINPAL_CONFIG.PRODUCTION_URL;
            const verificationData = {
                merchant_id: ZARINPAL_CONFIG.MERCHANT_ID,
                authority: Authority,
                amount: payment.amount,
            };
            const verificationResponse = await axios_1.default.post(`${zarinpalUrl}PaymentVerification.json`, verificationData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (verificationResponse.data.data.code === 100) {
                // Payment successful
                payment.status = "completed";
                payment.transactionId = Authority;
                payment.completedAt = new Date();
                await payment.save();
                // Update user wallet
                const user = await user_model_1.default.findById(req.user?.id).select('wallet');
                if (user && user.wallet) {
                    user.wallet.balance += payment.credits;
                    await user.wallet.save();
                }
                res.json({
                    success: true,
                    message: "پرداخت با موفقیت انجام شد",
                    data: {
                        paymentId: payment._id,
                        amount: payment.amount,
                        credits: payment.credits,
                        transactionId: Authority,
                    },
                });
            }
            else {
                // Payment verification failed
                payment.status = "failed";
                await payment.save();
                res.status(400).json({
                    success: false,
                    message: "تایید پرداخت ناموفق بود",
                    error: verificationResponse.data,
                });
            }
        }
        else {
            // Payment cancelled or failed
            payment.status = "failed";
            await payment.save();
            res.status(400).json({
                success: false,
                message: "پرداخت لغو شد یا ناموفق بود",
            });
        }
    }
    catch (error) {
        console.error("Payment callback error:", error);
        res.status(500).json({
            success: false,
            message: "خطای سرور در پردازش پرداخت",
            error: error.message,
        });
    }
});
/**
 * @swagger
 * /api/payment/history:
 *   get:
 *     summary: Get user payment history
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/history", auth_1.protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const payments = await payment_model_1.default.find({ user: req.user?.id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await payment_model_1.default.countDocuments({ user: req.user?.id });
        res.json({
            success: true,
            data: {
                payments,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        console.error("Payment history error:", error);
        res.status(500).json({
            success: false,
            message: "خطا در دریافت تاریخچه پرداخت",
            error: error.message,
        });
    }
});
/**
 * @swagger
 * /api/payment/validate-discount:
 *   post:
 *     summary: Validate discount code
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - amount
 *             properties:
 *               code:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Discount code validation result
 *       400:
 *         description: Invalid discount code
 */
router.post("/validate-discount", auth_1.protectRoute, payment_validation_1.validateDiscountCode, async (req, res) => {
    try {
        const { discountCode, amount } = req.body;
        const discountValidation = await discountCode_model_1.default.findValidCode(discountCode);
        if (!discountValidation.valid) {
            res.status(400).json({
                success: false,
                message: discountValidation.reason,
            });
            return;
        }
        const discountCalculation = discountValidation.discountCode.calculateDiscount(amount);
        if (!discountCalculation.valid) {
            res.status(400).json({
                success: false,
                message: discountCalculation.reason,
            });
            return;
        }
        res.json({
            success: true,
            data: {
                discountCode: discountValidation.discountCode.code,
                discountType: discountValidation.discountCode.type,
                discountValue: discountValidation.discountCode.value,
                originalAmount: amount,
                discountAmount: discountCalculation.discountAmount,
                finalAmount: discountCalculation.finalAmount,
            },
            message: "کد تخفیف معتبر است",
        });
    }
    catch (error) {
        console.error("Discount validation error:", error);
        res.status(500).json({
            success: false,
            message: "خطای سرور در اعتبارسنجی کد تخفیف",
            error: error.message,
        });
    }
});
/**
 * @swagger
 * /api/payment/wallet:
 *   get:
 *     summary: Get user wallet balance
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/wallet", auth_1.protectRoute, async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.user?.id).select('wallet');
        res.json({
            success: true,
            data: {
                balance: user?.wallet || 0,
            },
        });
    }
    catch (error) {
        console.error("Wallet balance error:", error);
        res.status(500).json({
            success: false,
            message: "خطا در دریافت موجودی کیف پول",
            error: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=payment.js.map