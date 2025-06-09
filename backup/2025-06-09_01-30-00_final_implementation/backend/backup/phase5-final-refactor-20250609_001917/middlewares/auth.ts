/**
 * Authentication middleware
 *
 * This file contains middleware functions for authentication and authorization.
 */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler";
import User from "../models/user.model";
import { JWT_SECRET } from "../config/env";
import { RequestWithUser, JWTPayload } from "../types";

/**
 * Protect routes - Verify JWT token and attach user to request
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const protectRoute = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check if token exists in cookies
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Fallback to Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return next(new ApiError("Not authorized to access this route", 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // Attach user to request
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return next(new ApiError("User not found", 404));
      }

      req.token = token;
      next();
    } catch (error) {
      return next(new ApiError("Not authorized to access this route", 401));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Restrict access to specific roles
 * @param {string | string[]} roles - Role(s) allowed to access the route
 * @returns {Function} Middleware function
 */
const restrictTo = (roles: string | string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError("User not found", 404));
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

/**
 * Restrict sensitive routes - Block unauthenticated users and redirect to login
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const restrictSensitive = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new ApiError("Please log in to access this resource", 401));
  }
  next();
};

/**
 * Restrict admin and support routes
 * - Allow 'admin' for all admin routes
 * - Allow 'support' only for /api/v1/tickets
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const restrictAdminSupport = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new ApiError("User not found", 404));
  }

  if (req.user.role === "admin") {
    // Admin can access all routes
    return next();
  }

  if (
    req.user.role === "support" &&
    req.originalUrl.includes("/api/v1/tickets")
  ) {
    // Support can only access ticket routes
    return next();
  }

  return next(
    new ApiError("You do not have permission to perform this action", 403)
  );
};

/**
 * Prevent logged-in users from accessing login/register routes
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const preventLoggedInAccess = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // Check cookies first
  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // Fallback to headers
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return next(
        new ApiError("You are already logged in. Please log out first.", 400)
      );
    } catch (error) {
      // Token is invalid, allow access to login/register
      next();
    }
  } else {
    // No token, allow access to login/register
    next();
  }
};

/**
 * Protect routes - Verify JWT token and attach user to request (alias for compatibility)
 */
export const protect = protectRoute;

/**
 * Alternative name for protectRoute for backward compatibility
 */
export const authenticateToken = protectRoute;

/**
 * Alternative name for restrictTo for backward compatibility
 */
export const requireRole = restrictTo;

/**
 * Alternative auth middleware for simple authentication
 */
export const auth = protectRoute;

/**
 * Authenticate user - alias for protectRoute
 */
const authenticateUser = protectRoute;

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check if token exists in cookies
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Fallback to Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token, continue without user
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // Attach user to request
      req.user = await User.findById(decoded.userId).select("-password");
      req.token = token;
    } catch (error) {
      // Invalid token, continue without user
    }

    next();
  } catch (error) {
    next(error);
  }
};

export {
  protectRoute,
  restrictTo,
  restrictSensitive,
  restrictAdminSupport,
  preventLoggedInAccess,
  authenticateUser,
  optionalAuth,
}; 