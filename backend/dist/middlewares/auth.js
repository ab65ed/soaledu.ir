"use strict";
/**
 * Authentication middleware
 *
 * This file contains middleware functions for authentication and authorization.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateUser = exports.preventLoggedInAccess = exports.restrictAdminSupport = exports.restrictSensitive = exports.restrictTo = exports.protectRoute = exports.auth = exports.requireRole = exports.authenticateToken = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const user_model_1 = __importDefault(require("../models/user.model"));
const env_1 = require("../config/env");
/**
 * Protect routes - Verify JWT token and attach user to request
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const protectRoute = async (req, res, next) => {
    try {
        let token;
        // Check if token exists in cookies
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        // Fallback to Authorization header
        else if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];
        }
        // Check if token exists
        if (!token) {
            return next(new errorHandler_1.ApiError("Not authorized to access this route", 401));
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
            // Attach user to request
            req.user = await user_model_1.default.findById(decoded.userId).select("-password");
            if (!req.user) {
                return next(new errorHandler_1.ApiError("User not found", 404));
            }
            req.token = token;
            next();
        }
        catch (error) {
            return next(new errorHandler_1.ApiError("Not authorized to access this route", 401));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protectRoute = protectRoute;
/**
 * Restrict access to specific roles
 * @param {string | string[]} roles - Role(s) allowed to access the route
 * @returns {Function} Middleware function
 */
const restrictTo = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.ApiError("User not found", 404));
        }
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(req.user.role)) {
            return next(new errorHandler_1.ApiError("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
/**
 * Restrict sensitive routes - Block unauthenticated users and redirect to login
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const restrictSensitive = (req, res, next) => {
    if (!req.user) {
        return next(new errorHandler_1.ApiError("Please log in to access this resource", 401));
    }
    next();
};
exports.restrictSensitive = restrictSensitive;
/**
 * Restrict admin and support routes
 * - Allow 'admin' for all admin routes
 * - Allow 'support' only for /api/v1/tickets
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const restrictAdminSupport = (req, res, next) => {
    if (!req.user) {
        return next(new errorHandler_1.ApiError("User not found", 404));
    }
    if (req.user.role === "admin") {
        // Admin can access all routes
        return next();
    }
    if (req.user.role === "support" &&
        req.originalUrl.includes("/api/v1/tickets")) {
        // Support can only access ticket routes
        return next();
    }
    return next(new errorHandler_1.ApiError("You do not have permission to perform this action", 403));
};
exports.restrictAdminSupport = restrictAdminSupport;
/**
 * Prevent logged-in users from accessing login/register routes
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const preventLoggedInAccess = (req, res, next) => {
    let token;
    // Check cookies first
    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    // Fallback to headers
    else if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
        try {
            jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
            return next(new errorHandler_1.ApiError("You are already logged in. Please log out first.", 400));
        }
        catch (error) {
            // Token is invalid, allow access to login/register
            next();
        }
    }
    else {
        // No token, allow access to login/register
        next();
    }
};
exports.preventLoggedInAccess = preventLoggedInAccess;
/**
 * Protect routes - Verify JWT token and attach user to request (alias for compatibility)
 */
exports.protect = protectRoute;
/**
 * Alternative name for protectRoute for backward compatibility
 */
exports.authenticateToken = protectRoute;
/**
 * Alternative name for restrictTo for backward compatibility
 */
exports.requireRole = restrictTo;
/**
 * Alternative auth middleware for simple authentication
 */
exports.auth = protectRoute;
/**
 * Authenticate user - alias for protectRoute
 */
const authenticateUser = protectRoute;
exports.authenticateUser = authenticateUser;
/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        // Check if token exists in cookies
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        // Fallback to Authorization header
        else if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // If no token, continue without user
        if (!token) {
            return next();
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
            // Attach user to request
            req.user = await user_model_1.default.findById(decoded.userId).select("-password");
            req.token = token;
        }
        catch (error) {
            // Invalid token, continue without user
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map