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
    create: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    read: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    update: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    delete: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    publish: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
};
export declare const testExamAccess: {
    take: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    results: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    manage: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    withLogging: (activityType: ActivityType) => ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
};
export declare const flashcardAccess: {
    create: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    read: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    purchase: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    manage: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
};
export declare const financeAccess: {
    viewPrices: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
    manage: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    requestPayment: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    processPayment: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>)[];
};
export declare const supportAccess: {
    createTicket: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    viewTickets: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    respondTicket: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
    manageKnowledgeBase: ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void)[];
};
declare function getDefaultPermissions(role: UserRole): Permission[];
declare function generateActivityDescription(activityType: ActivityType, resourceType: string, userName: string, resourceId: string): string;
declare function sanitizeRequestBody(body: any): any;
export type { AuthenticatedRequest };
export { getDefaultPermissions, generateActivityDescription, sanitizeRequestBody };
