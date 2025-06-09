/**
 * Permissions Middleware
 * میدل‌ویر بررسی مجوزها
 */
import { Request, Response, NextFunction } from 'express';
import { Permission } from '../models/roles';
interface AuthenticatedRequest extends Request {
    user?: any;
}
/**
 * Middleware to check if user has required permission
 * میدل‌ویر بررسی مجوز مورد نیاز کاربر
 */
export declare function requirePermission(permission: Permission): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to check if user has any of the required permissions
 * میدل‌ویر بررسی داشتن حداقل یکی از مجوزهای مورد نیاز
 */
export declare function requireAnyPermission(permissions: Permission[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to check if user has all required permissions
 * میدل‌ویر بررسی داشتن همه مجوزهای مورد نیاز
 */
export declare function requireAllPermissions(permissions: Permission[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to check if user owns the resource or has admin permission
 * میدل‌ویر بررسی مالکیت منبع یا داشتن مجوز مدیریت
 */
export declare function requireOwnershipOrPermission(permission: Permission, userIdField?: string): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to add user permissions to request object
 * میدل‌ویر اضافه کردن مجوزهای کاربر به شیء درخواست
 */
export declare function addUserPermissions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export {};
