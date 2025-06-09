/**
 * Authentication middleware
 *
 * This file contains middleware functions for authentication and authorization.
 */
import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../types";
/**
 * Protect routes - Verify JWT token and attach user to request
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
declare const protectRoute: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * Restrict access to specific roles
 * @param {string | string[]} roles - Role(s) allowed to access the route
 * @returns {Function} Middleware function
 */
declare const restrictTo: (roles: string | string[]) => (req: RequestWithUser, res: Response, next: NextFunction) => void;
/**
 * Restrict sensitive routes - Block unauthenticated users and redirect to login
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
declare const restrictSensitive: (req: RequestWithUser, res: Response, next: NextFunction) => void;
/**
 * Restrict admin and support routes
 * - Allow 'admin' for all admin routes
 * - Allow 'support' only for /api/v1/tickets
 * @param {RequestWithUser} req - Express request object with user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
declare const restrictAdminSupport: (req: RequestWithUser, res: Response, next: NextFunction) => void;
/**
 * Prevent logged-in users from accessing login/register routes
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
declare const preventLoggedInAccess: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Protect routes - Verify JWT token and attach user to request (alias for compatibility)
 */
export declare const protect: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * Alternative name for protectRoute for backward compatibility
 */
export declare const authenticateToken: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * Alternative name for restrictTo for backward compatibility
 */
export declare const requireRole: (roles: string | string[]) => (req: RequestWithUser, res: Response, next: NextFunction) => void;
/**
 * Alternative auth middleware for simple authentication
 */
export declare const auth: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * Authenticate user - alias for protectRoute
 */
declare const authenticateUser: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional authentication - doesn't fail if no token provided
 */
declare const optionalAuth: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
export { protectRoute, restrictTo, restrictSensitive, restrictAdminSupport, preventLoggedInAccess, authenticateUser, optionalAuth, };
