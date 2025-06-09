/**
 * Roles & Permissions Middleware
 * میدل‌ویر نقش‌ها و مجوزها برای اتصال به همه بخش‌های پروژه
 */

import { Request, Response, NextFunction } from 'express';
import Parse from 'parse/node';
import {
  UserRole,
  Permission,
  ActivityType,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
} from '../models/roles';

// Re-export types for use in other modules
export { UserRole, Permission, ActivityType };

// Extended Request interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    permissions: Permission[];
    name?: string;
    email?: string;
  };
}

// Authentication middleware for Parse Server
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'توکن احراز هویت ضروری است'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify session token with Parse Server
      const User = Parse.Object.extend('User');
      const query = new Parse.Query(User);
      query.equalTo('sessionToken', token);
      
      const user = await query.first({ useMasterKey: true });
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'توکن نامعتبر یا منقضی'
        });
        return;
      }

      // Set user data in request
      req.user = {
        id: user.id,
        role: user.get('role') || UserRole.STUDENT,
        permissions: user.get('permissions') || getDefaultPermissions(user.get('role') || UserRole.STUDENT),
        name: user.get('name') || user.get('username'),
        email: user.get('email')
      };

      next();
    } catch (parseError) {
      console.error('Parse authentication error:', parseError);
      res.status(401).json({
        success: false,
        message: 'خطا در احراز هویت'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در احراز هویت'
    });
  }
};

// Role-based authorization middleware
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'احراز هویت ضروری است'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'دسترسی مجاز نیست',
        required: allowedRoles,
        current: req.user.role
      });
      return;
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'احراز هویت ضروری است'
      });
      return;
    }

    if (!hasPermission(req.user.permissions, permission)) {
      res.status(403).json({
        success: false,
        message: 'مجوز کافی ندارید',
        required: permission,
        userPermissions: req.user.permissions
      });
      return;
    }

    next();
  };
};

// Multiple permissions middleware (any of them)
export const requireAnyPermission = (...permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'احراز هویت ضروری است'
      });
      return;
    }

    if (!hasAnyPermission(req.user.permissions, permissions)) {
      res.status(403).json({
        success: false,
        message: 'حداقل یکی از مجوزها ضروری است',
        required: permissions,
        userPermissions: req.user.permissions
      });
      return;
    }

    next();
  };
};

// All permissions middleware (all of them)
export const requireAllPermissions = (...permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'احراز هویت ضروری است'
      });
      return;
    }

    if (!hasAllPermissions(req.user.permissions, permissions)) {
      res.status(403).json({
        success: false,
        message: 'تمام مجوزها ضروری است',
        required: permissions,
        userPermissions: req.user.permissions
      });
      return;
    }

    next();
  };
};

// Owner or role middleware (user owns resource or has role)
export const requireOwnerOrRole = (resourceOwnerField: string, ...allowedRoles: UserRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'احراز هویت ضروری است'
      });
      return;
    }

    // Check if user has allowed role
    if (allowedRoles.includes(req.user.role)) {
      next();
      return;
    }

    // Check ownership based on resource
    const resourceId = req.params.id;
    if (resourceId) {
      try {
        // This would be implemented based on specific resource type
        // For now, check if user ID matches
        if (req.body && req.body[resourceOwnerField] === req.user.id) {
          next();
          return;
        }
      } catch (error) {
        console.error('Ownership check error:', error);
      }
    }

    res.status(403).json({
      success: false,
      message: 'دسترسی مجاز نیست - مالک منبع یا نقش مجاز ضروری است'
    });
  };
};

// Activity logging middleware
export const logActivity = (activityType: ActivityType, resourceType: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Continue with the request first
      next();

      // Log activity after successful request
      if (req.user && res.statusCode < 400) {
        try {
          const ActivityLogClass = Parse.Object.extend('ActivityLog');
          const activityLog = new ActivityLogClass();

          const resourceId = req.params.id || req.body.id || 'unknown';
          const description = generateActivityDescription(
            activityType,
            resourceType,
            req.user.name || req.user.id,
            resourceId
          );

          activityLog.set('userId', req.user.id);
          activityLog.set('userRole', req.user.role);
          activityLog.set('activityType', activityType);
          activityLog.set('resourceType', resourceType);
          activityLog.set('resourceId', resourceId);
          activityLog.set('description', description);
          activityLog.set('metadata', {
            method: req.method,
            path: req.path,
            body: sanitizeRequestBody(req.body)
          });
          activityLog.set('ipAddress', req.ip);
          activityLog.set('userAgent', req.get('User-Agent'));

          await activityLog.save();
        } catch (logError) {
          console.error('Activity logging error:', logError);
          // Don't fail the request if logging fails
        }
      }
    } catch (error) {
      console.error('Activity logging middleware error:', error);
      next();
    }
  };
};

// Module-specific middleware combinations

// Course-Exam access control
export const courseExamAccess = {
  // طراح می‌تواند درس ایجاد و ویرایش کند
  create: [authenticate, requireAnyPermission(Permission.CREATE_CONTENT, Permission.MANAGE_SYSTEM)],
  
  // همه می‌توانند درس‌ها را مشاهده کنند
  read: [authenticate],
  
  // فقط مالک یا ادمین می‌تواند ویرایش کند
  update: [authenticate, requireOwnerOrRole('createdBy', UserRole.ADMIN)],
  
  // فقط مالک یا ادمین می‌تواند حذف کند
  delete: [authenticate, requireOwnerOrRole('createdBy', UserRole.ADMIN)],
  
  // لاگ فعالیت
  withLogging: (activityType: ActivityType) => [
    ...courseExamAccess.read,
    logActivity(activityType, 'course_exam')
  ]
};

// Question access control  
export const questionAccess = {
  // طراح می‌تواند سوال ایجاد کند
  create: [authenticate, requirePermission(Permission.CREATE_CONTENT), logActivity(ActivityType.CREATE, 'question')],
  
  // همه می‌توانند سوالات را مشاهده کنند
  read: [authenticate],
  
  // فقط مالک یا ادمین/کارشناس می‌تواند ویرایش کند
  update: [authenticate, requireOwnerOrRole('createdBy', UserRole.ADMIN, UserRole.EXPERT), logActivity(ActivityType.UPDATE, 'question')],
  
  // فقط مالک یا ادمین می‌تواند حذف کند
  delete: [authenticate, requireOwnerOrRole('createdBy', UserRole.ADMIN), logActivity(ActivityType.DELETE, 'question')],
  
  // انتشار سوال برای آزمون - کارشناس یا ادمین
  publish: [authenticate, requireAnyPermission(Permission.APPROVE_CONTENT, Permission.MANAGE_SYSTEM), logActivity(ActivityType.APPROVE, 'question')]
};

// Test-Exam access control
export const testExamAccess = {
  // دانشجویان می‌توانند آزمون بگیرند
  take: [authenticate, requirePermission(Permission.TAKE_EXAMS)],
  
  // مشاهده نتایج
  results: [authenticate, requirePermission(Permission.VIEW_RESULTS)],
  
  // مدیریت آزمون‌ها - کارشناس یا ادمین
  manage: [authenticate, requireAnyPermission(Permission.MANAGE_EXAMS, Permission.MANAGE_SYSTEM)],
  
  // لاگ فعالیت
  withLogging: (activityType: ActivityType) => [
    ...testExamAccess.take,
    logActivity(activityType, 'test_exam')
  ]
};

// Flashcard access control
export const flashcardAccess = {
  // طراح می‌تواند فلش‌کارت ایجاد کند
  create: [authenticate, requirePermission(Permission.CREATE_CONTENT), logActivity(ActivityType.CREATE, 'flashcard')],
  
  // همه می‌توانند فلش‌کارت‌ها را مشاهده کنند
  read: [authenticate],
  
  // خرید فلش‌کارت
  purchase: [authenticate, requirePermission(Permission.PURCHASE_CONTENT), logActivity(ActivityType.VIEW, 'flashcard_purchase')],
  
  // مدیریت فلش‌کارت‌ها
  manage: [authenticate, requireAnyPermission(Permission.MANAGE_SYSTEM, Permission.APPROVE_CONTENT)]
};

// Finance access control
export const financeAccess = {
  // مشاهده قیمت‌ها - همه
  viewPrices: [authenticate],
  
  // مدیریت مالی - فقط ادمین
  manage: [authenticate, requirePermission(Permission.MANAGE_PAYMENTS)],
  
  // درخواست وجه - طراحان
  requestPayment: [authenticate, requirePermission(Permission.REQUEST_PAYMENT), logActivity(ActivityType.PAYMENT_REQUEST, 'payment_request')],
  
  // پردازش پرداخت
  processPayment: [authenticate, logActivity(ActivityType.VIEW, 'payment')]
};

// Support access control
export const supportAccess = {
  // ایجاد تیکت - همه
  createTicket: [authenticate, requirePermission(Permission.CREATE_TICKETS), logActivity(ActivityType.TICKET_CREATED, 'support_ticket')],
  
  // مشاهده تیکت‌ها - پشتیبانی یا ادمین
  viewTickets: [authenticate, requireAnyPermission(Permission.VIEW_TICKETS, Permission.MANAGE_SYSTEM)],
  
  // پاسخ به تیکت - پشتیبانی
  respondTicket: [authenticate, requirePermission(Permission.RESPOND_TICKETS), logActivity(ActivityType.UPDATE, 'support_ticket')],
  
  // مدیریت پایگاه دانش
  manageKnowledgeBase: [authenticate, requirePermission(Permission.MANAGE_KNOWLEDGE_BASE)]
};

// Utility functions

function getDefaultPermissions(role: UserRole): Permission[] {
  const defaultPermissions: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
      Permission.MANAGE_USERS,
      Permission.MANAGE_ROLES,
      Permission.VIEW_ANALYTICS,
      Permission.MANAGE_SYSTEM,
      Permission.VIEW_LOGS,
      Permission.MANAGE_PAYMENTS
    ],
    [UserRole.DESIGNER]: [
      Permission.CREATE_CONTENT,
      Permission.EDIT_CONTENT,
      Permission.PUBLISH_CONTENT,
      Permission.REQUEST_PAYMENT
    ],
    [UserRole.EXPERT]: [
      Permission.REVIEW_CONTENT,
      Permission.APPROVE_CONTENT,
      Permission.CREATE_QUESTIONS,
      Permission.MANAGE_EXAMS,
      Permission.VIEW_LOGS
    ],
    [UserRole.SUPPORT]: [
      Permission.VIEW_TICKETS,
      Permission.RESPOND_TICKETS,
      Permission.MANAGE_KNOWLEDGE_BASE,
      Permission.LIVE_CHAT
    ],
    [UserRole.STUDENT]: [
      Permission.TAKE_EXAMS,
      Permission.VIEW_RESULTS,
      Permission.PURCHASE_CONTENT,
      Permission.CREATE_TICKETS
    ]
  };

  return defaultPermissions[role] || defaultPermissions[UserRole.STUDENT];
}

function generateActivityDescription(
  activityType: ActivityType,
  resourceType: string,
  userName: string,
  resourceId: string
): string {
  const actionMap: Record<ActivityType, string> = {
    [ActivityType.LOGIN]: 'ورود به سیستم',
    [ActivityType.LOGOUT]: 'خروج از سیستم',
    [ActivityType.CREATE]: 'ایجاد',
    [ActivityType.UPDATE]: 'ویرایش',
    [ActivityType.DELETE]: 'حذف',
    [ActivityType.VIEW]: 'مشاهده',
    [ActivityType.APPROVE]: 'تایید',
    [ActivityType.REJECT]: 'رد',
    [ActivityType.PAYMENT_REQUEST]: 'درخواست وجه',
    [ActivityType.TICKET_CREATED]: 'ایجاد تیکت',
    [ActivityType.TICKET_RESOLVED]: 'حل تیکت'
  };

  const resourceMap: Record<string, string> = {
    'course_exam': 'درس-آزمون',
    'question': 'سوال',
    'test_exam': 'آزمون تستی',
    'flashcard': 'فلش‌کارت',
    'payment_request': 'درخواست پرداخت',
    'support_ticket': 'تیکت پشتیبانی'
  };

  const action = actionMap[activityType] || activityType;
  const resource = resourceMap[resourceType] || resourceType;

  return `${userName} - ${action} ${resource} (${resourceId})`;
}

function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') return body;

  const sanitized = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'sessionToken', 'masterKey'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
}

// Export all middleware functions and utility functions
export type { AuthenticatedRequest };
export {
  getDefaultPermissions,
  generateActivityDescription,
  sanitizeRequestBody
}; 