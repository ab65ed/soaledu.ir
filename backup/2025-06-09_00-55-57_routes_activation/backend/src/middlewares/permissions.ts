/**
 * Permissions Middleware
 * میدل‌ویر بررسی مجوزها
 */

import { Request, Response, NextFunction } from 'express';
import Parse from 'parse/node';
import { Permission, hasPermission } from '../models/roles';

interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware to check if user has required permission
 * میدل‌ویر بررسی مجوز مورد نیاز کاربر
 */
export function requirePermission(permission: Permission) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'کاربر احراز هویت نشده است'
        });
        return;
      }

      // Get user permissions
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(userId);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
        return;
      }

      const userPermissions = user.get('permissions') || [];

      // Check if user has the required permission
      if (!hasPermission(userPermissions, permission)) {
        res.status(403).json({
          success: false,
          message: 'شما مجاز به انجام این عملیات نیستید',
          requiredPermission: permission
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در بررسی مجوزها',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * Middleware to check if user has any of the required permissions
 * میدل‌ویر بررسی داشتن حداقل یکی از مجوزهای مورد نیاز
 */
export function requireAnyPermission(permissions: Permission[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'کاربر احراز هویت نشده است'
        });
        return;
      }

      // Get user permissions
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(userId);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
        return;
      }

      const userPermissions = user.get('permissions') || [];

      // Check if user has any of the required permissions
      const hasAnyPermission = permissions.some(permission => 
        hasPermission(userPermissions, permission)
      );

      if (!hasAnyPermission) {
        res.status(403).json({
          success: false,
          message: 'شما مجاز به انجام این عملیات نیستید',
          requiredPermissions: permissions
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در بررسی مجوزها',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * Middleware to check if user has all required permissions
 * میدل‌ویر بررسی داشتن همه مجوزهای مورد نیاز
 */
export function requireAllPermissions(permissions: Permission[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'کاربر احراز هویت نشده است'
        });
        return;
      }

      // Get user permissions
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(userId);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
        return;
      }

      const userPermissions = user.get('permissions') || [];

      // Check if user has all required permissions
      const hasAllPermissions = permissions.every(permission => 
        hasPermission(userPermissions, permission)
      );

      if (!hasAllPermissions) {
        const missingPermissions = permissions.filter(permission => 
          !hasPermission(userPermissions, permission)
        );

        res.status(403).json({
          success: false,
          message: 'شما مجاز به انجام این عملیات نیستید',
          requiredPermissions: permissions,
          missingPermissions
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در بررسی مجوزها',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * Middleware to check if user owns the resource or has admin permission
 * میدل‌ویر بررسی مالکیت منبع یا داشتن مجوز مدیریت
 */
export function requireOwnershipOrPermission(permission: Permission, userIdField: string = 'userId') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user?.id;
      const resourceUserId = req.params[userIdField] || req.body[userIdField];

      if (!currentUserId) {
        res.status(401).json({
          success: false,
          message: 'کاربر احراز هویت نشده است'
        });
        return;
      }

      // If user is accessing their own resource, allow
      if (currentUserId === resourceUserId) {
        next();
        return;
      }

      // Otherwise, check if user has the required permission
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(currentUserId);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
        return;
      }

      const userPermissions = user.get('permissions') || [];

      if (!hasPermission(userPermissions, permission)) {
        res.status(403).json({
          success: false,
          message: 'شما مجاز به دسترسی به این منبع نیستید'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error checking ownership or permission:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در بررسی مجوزها',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * Middleware to add user permissions to request object
 * میدل‌ویر اضافه کردن مجوزهای کاربر به شیء درخواست
 */
export async function addUserPermissions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      next();
      return;
    }

    // Get user permissions
    const User = Parse.Object.extend('User');
    const userQuery = new Parse.Query(User);
    const user = await userQuery.get(userId);

    if (user) {
      req.user.permissions = user.get('permissions') || [];
      req.user.role = user.get('role');
    }

    next();
  } catch (error) {
    console.error('Error adding user permissions:', error);
    next(); // Continue even if there's an error
  }
} 