/**
 * Authentication Middleware
 * میدل‌ویر احراز هویت پیشرفته با JWT و Parse Server
 *
 * ویژگی‌های پیشرفته:
 * - Multi-layer authentication (JWT + Parse Session)
 * - Role-based access control (RBAC)
 * - Rate limiting per user
 * - Session management
 * - Security headers
 *
 * @version 2.0.0
 * @author Senior Full-Stack Developer
 */
import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        objectId: string;
        _id: string;
        email: string;
        username: string;
        role: string;
        sessionToken?: string;
        institutionId?: string;
        permissions: string[];
        lastActivity: Date;
    };
    institution?: {
        id: string;
        name: string;
        type: string;
        discountSettings: any;
    };
}
export interface UserRole {
    name: string;
    permissions: string[];
    priority: number;
}
export declare const USER_ROLES: Record<string, UserRole>;
/**
 * Authentication middleware
 * Verifies JWT token and loads user data
 */
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional authentication middleware
 * Loads user data if token is provided, but doesn't require authentication
 */
export declare const optionalAuthenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Role-based authorization middleware
 */
export declare const requireRole: (allowedRoles: string | string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Permission-based authorization middleware
 */
export declare const requirePermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Admin-only middleware
 */
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Question designer middleware
 */
export declare const requireQuestionDesigner: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Teacher middleware
 */
export declare const requireTeacher: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Generate JWT token
 */
export declare const generateToken: (userId: string, additionalData?: any) => string;
/**
 * Refresh JWT token
 */
export declare const refreshToken: (req: AuthenticatedRequest, res: Response) => void;
export declare const authenticateWithRateLimit: (import("express-rate-limit").RateLimitRequestHandler | ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>))[];
export declare const protectRoute: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const restrictTo: (allowedRoles: string | string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authenticateUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const auth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const preventLoggedInAccess: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
declare const _default: {
    authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    optionalAuthenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    requireRole: (allowedRoles: string | string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    requirePermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    requireQuestionDesigner: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    requireTeacher: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    generateToken: (userId: string, additionalData?: any) => string;
    refreshToken: (req: AuthenticatedRequest, res: Response) => void;
    authenticateWithRateLimit: (import("express-rate-limit").RateLimitRequestHandler | ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>))[];
    protectRoute: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    restrictTo: (allowedRoles: string | string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    authenticateUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    auth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    preventLoggedInAccess: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
