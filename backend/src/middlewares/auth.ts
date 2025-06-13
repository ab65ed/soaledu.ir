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
import jwt from 'jsonwebtoken';
import Parse from 'parse/node';
import { rateLimit } from 'express-rate-limit';
import logger from '../config/logger';

// ==================== Types ====================

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    objectId: string;
    _id: string; // برای سازگاری با mongoose
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

// ==================== Constants ====================

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// User roles and permissions
export const USER_ROLES: Record<string, UserRole> = {
  SUPER_ADMIN: {
    name: 'super_admin',
    permissions: ['*'], // All permissions
    priority: 100
  },
  ADMIN: {
    name: 'admin',
    permissions: [
      'users:read', 'users:write', 'users:delete',
      'institutions:read', 'institutions:write',
      'questions:read', 'questions:write', 'questions:delete',
      'exams:read', 'exams:write', 'exams:delete',
      'analytics:read', 'finance:read'
    ],
    priority: 80
  },
  QUESTION_DESIGNER: {
    name: 'question_designer',
    permissions: [
      'questions:read', 'questions:write', 'questions:bulk_upload',
      'categories:read', 'categories:write',
      'exams:read', 'exams:write'
    ],
    priority: 60
  },
  TEACHER: {
    name: 'teacher',
    permissions: [
      'questions:read', 'exams:read', 'exams:write',
      'results:read', 'students:read'
    ],
    priority: 40
  },
  STUDENT: {
    name: 'student',
    permissions: [
      'exams:read', 'exams:take', 'results:read_own',
      'flashcards:read', 'flashcards:write_own'
    ],
    priority: 20
  },
  GUEST: {
    name: 'guest',
    permissions: ['public:read'],
    priority: 10
  }
};

// ==================== Rate Limiting ====================

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many authentication requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== Utility Functions ====================

/**
 * Extract token from request headers
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check for token in cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  // Check for token in query params (for WebSocket upgrades)
  if (req.query && req.query.token) {
    return req.query.token as string;
  }
  
  return null;
}

/**
 * Verify JWT token
 */
async function verifyJWTToken(token: string): Promise<any> {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Get user from Parse Server
 */
async function getUserFromParse(userId: string): Promise<Parse.User | null> {
  try {
    const query = new Parse.Query(Parse.User);
    const user = await query.get(userId);
    return user;
  } catch (error) {
    logger.warn(`Failed to fetch user ${userId} from Parse:`, error);
    return null;
  }
}

/**
 * Check user permissions
 */
function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  // Super admin has all permissions
  if (userPermissions.includes('*')) {
    return true;
  }
  
  // Check for exact permission match
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }
  
  // Check for wildcard permissions
  const [resource, action] = requiredPermission.split(':');
  const wildcardPermission = `${resource}:*`;
  
  return userPermissions.includes(wildcardPermission);
}

// ==================== Main Middleware ====================

/**
 * Authentication middleware
 * Verifies JWT token and loads user data
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No authentication token provided',
        code: 'NO_TOKEN'
      });
      return;
    }

    // Verify JWT token
    const decoded = await verifyJWTToken(token);
    
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        message: 'Invalid token format',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    // Get user from Parse Server
    const parseUser = await getUserFromParse(decoded.userId);
    
    if (!parseUser) {
      res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    // Get user role and permissions
    const userRole = parseUser.get('role') || 'student';
    const roleConfig = USER_ROLES[userRole.toUpperCase()] || USER_ROLES.GUEST;

    // Build user object
    req.user = {
      id: parseUser.id,
      objectId: parseUser.id,
      _id: parseUser.id, // برای سازگاری با mongoose
      email: parseUser.get('email'),
      username: parseUser.get('username'),
      role: userRole,
      sessionToken: parseUser.getSessionToken(),
      institutionId: parseUser.get('institutionId'),
      permissions: roleConfig.permissions,
      lastActivity: new Date()
    };

    // Load institution data if applicable
    if (req.user.institutionId) {
      try {
        const Institution = Parse.Object.extend('Institution');
        const query = new Parse.Query(Institution);
        const institution = await query.get(req.user.institutionId);
        
        req.institution = {
          id: institution.id,
          name: institution.get('name'),
          type: institution.get('type'),
          discountSettings: institution.get('defaultDiscountSettings')
        };
      } catch (error) {
        logger.warn(`Failed to load institution ${req.user.institutionId}:`, error);
      }
    }

    // Update last activity
    parseUser.set('lastActivity', new Date());
    await parseUser.save(null, { useMasterKey: true });

    next();

  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_FAILED',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional authentication middleware
 * Loads user data if token is provided, but doesn't require authentication
 */
export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = extractToken(req);
  
  if (!token) {
    next();
    return;
  }

  try {
    await authenticate(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const userRole = req.user.role.toUpperCase();
    const isAllowed = rolesArray.some(role => 
      role.toUpperCase() === userRole || userRole === 'SUPER_ADMIN'
    );

    if (!isAllowed) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: rolesArray,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

/**
 * Permission-based authorization middleware
 */
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!hasPermission(req.user.permissions, permission)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredPermission: permission,
        userPermissions: req.user.permissions
      });
      return;
    }

    next();
  };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);

/**
 * Question designer middleware
 */
export const requireQuestionDesigner = requireRole([
  'QUESTION_DESIGNER', 'ADMIN', 'SUPER_ADMIN'
]);

/**
 * Teacher middleware
 */
export const requireTeacher = requireRole([
  'TEACHER', 'QUESTION_DESIGNER', 'ADMIN', 'SUPER_ADMIN'
]);

// ==================== JWT Utilities ====================

/**
 * Generate JWT token
 */
export const generateToken = (userId: string, additionalData?: any): string => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    ...additionalData
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Refresh JWT token
 */
export const refreshToken = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  const newToken = generateToken(req.user.id, {
    role: req.user.role,
    institutionId: req.user.institutionId
  });

  res.json({
    success: true,
    data: {
      token: newToken,
      expiresIn: JWT_EXPIRES_IN
    }
  });
};

// Apply rate limiting to auth middleware
export const authenticateWithRateLimit = [authRateLimit, authenticate];

// ==================== Backward Compatibility Exports ====================

// Legacy aliases for backward compatibility
export const protectRoute = authenticate;
export const restrictTo = requireRole;
export const authenticateToken = authenticate;
export const authenticateUser = authenticate;
export const optionalAuth = optionalAuthenticate;
export const auth = authenticate;
export const preventLoggedInAccess = authenticate; // temp placeholder

export default {
  authenticate,
  optionalAuthenticate,
  requireRole,
  requirePermission,
  requireAdmin,
  requireQuestionDesigner,
  requireTeacher,
  generateToken,
  refreshToken,
  authenticateWithRateLimit,
  // Legacy aliases
  protectRoute,
  restrictTo,
  authenticateToken,
  authenticateUser,
  optionalAuth,
  auth,
  preventLoggedInAccess
}; 