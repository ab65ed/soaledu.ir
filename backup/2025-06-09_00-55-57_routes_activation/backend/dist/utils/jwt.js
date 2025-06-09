"use strict";
/**
 * JWT utilities
 *
 * This file contains functions for generating and verifying JWT tokens.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieOptions = exports.generateAuthTokens = exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.JWT_SECRET, {
        expiresIn: env_1.JWT_EXPIRE,
    });
};
exports.generateToken = generateToken;
/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.JWT_REFRESH_SECRET, {
        expiresIn: env_1.JWT_REFRESH_EXPIRE,
    });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
};
exports.verifyToken = verifyToken;
/**
 * Verify refresh token
 * @param {String} token - Refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.JWT_REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Generate auth tokens (access and refresh)
 * @param {Object} user - User object
 * @returns {Object} Object containing tokens
 */
const generateAuthTokens = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };
    return {
        accessToken: generateToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};
exports.generateAuthTokens = generateAuthTokens;
/**
 * Set cookie options for JWT tokens
 * @param {String} type - Type of token: 'access' or 'refresh'
 * @returns {Object} Cookie options
 */
const getCookieOptions = (type) => {
    const expires = new Date(Date.now() +
        (type === "refresh" ? env_1.JWT_REFRESH_COOKIE_EXPIRE : env_1.JWT_COOKIE_EXPIRE) *
            24 *
            60 *
            60 *
            1000);
    return {
        expires,
        httpOnly: true,
        secure: env_1.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    };
};
exports.getCookieOptions = getCookieOptions;
//# sourceMappingURL=jwt.js.map