/**
 * Roles & Permissions Middleware
 * میدل‌ویر نقش‌ها و مجوزها برای اتصال به همه بخش‌های پروژه
 */
import { Request, Response, NextFunction } from 'express';
import { UserRole, Permission, ActivityType } from '../models/roles';
export { UserRole, Permission, ActivityType };
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
        permissions: Permission[];
        name?: string;
        email?: string;
    };
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (...allowedRoles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requirePermission: (permission: Permission) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireAnyPermission: (...permissions: Permission[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireAllPermissions: (...permissions: Permission[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireOwnerOrRole: (resourceOwnerField: string, ...allowedRoles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const logActivity: (activityType: ActivityType, resourceType: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const courseExamAccess: {
    create: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    read: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    update: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    delete: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    withLogging: (activityType: ActivityType) => ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
};
export declare const questionAccess: {
    create: any[];
    read: any[];
    update: any[];
    delete: any[];
    publish: any[];
};
export declare const testExamAccess: {
    take: any[];
    results: any[];
    manage: any[];
    withLogging: (activityType: ActivityType) => any[];
};
export declare const flashcardAccess: {
    create: any[];
    read: any[];
    purchase: any[];
    manage: any[];
};
export declare const financeAccess: {
    viewPrices: any[];
    manage: any[];
    requestPayment: any[];
    processPayment: any[];
};
export declare const supportAccess: {
    createTicket: any[];
    viewTickets: any[];
    respondTicket: any[];
    manageKnowledgeBase: any[];
};
export type { AuthenticatedRequest };
export { authenticateToken, requireRole, requirePermission, requireAnyPermission, requireAllPermissions, requireOwnerOrRole, logActivity, courseExamAccess, questionAccess, testExamAccess, flashcardAccess, financeAccess, supportAccess };
