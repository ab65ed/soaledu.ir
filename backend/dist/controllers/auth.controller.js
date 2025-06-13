"use strict";
/**
 * Authentication controller
 *
 * This file contains controller functions for authentication routes.
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
exports.logout = exports.completeProfile = exports.getMe = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const errorHandler_1 = require("../middlewares/errorHandler");
const jwt_1 = require("../utils/jwt");
const logger_1 = __importDefault(require("../config/logger"));
const env_1 = require("../config/env");
/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, enrollmentCode } = req.body;
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return next(new errorHandler_1.ApiError("User already exists with that email", 400));
        }
        // اطلاعات کاربر جدید
        const userData = {
            name,
            email,
            password,
        };
        // بررسی کد ثبت‌نام در صورت وجود
        if (enrollmentCode) {
            // Import Institution model
            const Institution = (await Promise.resolve().then(() => __importStar(require('../models/Institution')))).default;
            const institution = await Institution.findOne({
                enrollmentCode: enrollmentCode.toUpperCase(),
                isActive: true,
                'defaultDiscountSettings.isActive': true
            });
            if (institution) {
                // بررسی انقضای قرارداد
                if (!institution.contractEndDate || institution.contractEndDate >= new Date()) {
                    userData.institutionId = institution._id;
                    userData.enrollmentCode = enrollmentCode.toUpperCase();
                    userData.institutionalDiscountPercentage = institution.defaultDiscountSettings.discountPercentage || 0;
                    userData.institutionalDiscountAmount = institution.defaultDiscountSettings.discountAmount || 0;
                    // افزایش تعداد دانش‌آموزان نهاد
                    await Institution.findByIdAndUpdate(institution._id, {
                        $inc: { totalStudents: 1, activeStudents: 1 }
                    });
                }
                else {
                    return next(new errorHandler_1.ApiError("کد ثبت‌نام منقضی شده است", 400));
                }
            }
            else {
                return next(new errorHandler_1.ApiError("کد ثبت‌نام نامعتبر است", 400));
            }
        }
        // Create new user
        const user = await user_model_1.default.create(userData);
        // Generate tokens
        const tokens = (0, jwt_1.generateAuthTokens)({
            _id: user._id.toString(),
            role: user.role,
        });
        // Set cookies
        res.cookie("accessToken", tokens.accessToken, (0, jwt_1.getCookieOptions)("access"));
        res.cookie("refreshToken", tokens.refreshToken, (0, jwt_1.getCookieOptions)("refresh"));
        // Log registration
        logger_1.default.info(`New user registered: ${user._id}`);
        res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new errorHandler_1.ApiError("Invalid credentials", 401));
        }
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new errorHandler_1.ApiError("Invalid credentials", 401));
        }
        // Generate tokens
        const tokens = (0, jwt_1.generateAuthTokens)({
            _id: user._id.toString(),
            role: user.role,
        });
        // Set cookies
        res.cookie("accessToken", tokens.accessToken, (0, jwt_1.getCookieOptions)("access"));
        res.cookie("refreshToken", tokens.refreshToken, (0, jwt_1.getCookieOptions)("refresh"));
        // Log login
        logger_1.default.info(`User logged in: ${user._id}`);
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    educationalGroup: user.educationalGroup,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return next(new errorHandler_1.ApiError("Refresh token is required", 400));
        }
        // Verify refresh token
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.JWT_REFRESH_SECRET);
            // Get user
            const user = await user_model_1.default.findById(decoded.id);
            if (!user) {
                return next(new errorHandler_1.ApiError("User not found", 404));
            }
            // Generate new tokens
            const tokens = (0, jwt_1.generateAuthTokens)({
                _id: user._id.toString(),
                role: user.role,
            });
            // Set cookies
            res.cookie("accessToken", tokens.accessToken, (0, jwt_1.getCookieOptions)("access"));
            res.cookie("refreshToken", tokens.refreshToken, (0, jwt_1.getCookieOptions)("refresh"));
            res.status(200).json({
                status: "success",
                message: "Token refreshed successfully",
            });
        }
        catch (error) {
            return next(new errorHandler_1.ApiError("Invalid refresh token", 401));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = await user_model_1.default.findById(req.user?.id).populate("educationalGroup");
        if (!user) {
            return next(new errorHandler_1.ApiError("User not found", 404));
        }
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    educationalGroup: user.educationalGroup,
                    wallet: {
                        balance: user.wallet.balance,
                    },
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
/**
 * @desc    Complete user profile (select educational group)
 * @route   PUT /api/v1/auth/complete-profile
 * @access  Private
 */
const completeProfile = async (req, res, next) => {
    try {
        const { educationalGroup } = req.body;
        if (!educationalGroup) {
            return next(new errorHandler_1.ApiError("Educational group is required", 400));
        }
        // Update user
        const user = await user_model_1.default.findByIdAndUpdate(req.user?.id, { educationalGroup }, { new: true, runValidators: true }).populate("educationalGroup");
        if (!user) {
            return next(new errorHandler_1.ApiError("User not found", 404));
        }
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    educationalGroup: user.educationalGroup,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.completeProfile = completeProfile;
/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = (req, res) => {
    // Clear cookies
    res.cookie("accessToken", "", {
        expires: new Date(0),
        httpOnly: true,
    });
    res.cookie("refreshToken", "", {
        expires: new Date(0),
        httpOnly: true,
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map