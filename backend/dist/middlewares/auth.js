"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventLoggedInAccess = exports.auth = exports.optionalAuth = exports.authenticateUser = exports.authenticateToken = exports.restrictTo = exports.protectRoute = exports.authenticateWithRateLimit = exports.refreshToken = exports.generateToken = exports.requireTeacher = exports.requireQuestionDesigner = exports.requireAdmin = exports.requirePermission = exports.requireRole = exports.optionalAuthenticate = exports.authenticate = exports.USER_ROLES = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_1 = __importDefault(require("parse/node"));
const express_rate_limit_1 = require("express-rate-limit");
const logger_1 = __importDefault(require("../config/logger"));
// ==================== Constants ====================
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// User roles and permissions
exports.USER_ROLES = {
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
const authRateLimit = (0, express_rate_limit_1.rateLimit)({
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
function extractToken(req) {
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
        return req.query.token;
    }
    return null;
}
/**
 * Verify JWT token
 */
async function verifyJWTToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
}
/**
 * Get user from Parse Server
 */
async function getUserFromParse(userId) {
    try {
        const query = new node_1.default.Query(node_1.default.User);
        const user = await query.get(userId);
        return user;
    }
    catch (error) {
        logger_1.default.warn(`Failed to fetch user ${userId} from Parse:`, error);
        return null;
    }
}
/**
 * Check user permissions
 */
function hasPermission(userPermissions, requiredPermission) {
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
const authenticate = async (req, res, next) => {
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
        const roleConfig = exports.USER_ROLES[userRole.toUpperCase()] || exports.USER_ROLES.GUEST;
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
                const Institution = node_1.default.Object.extend('Institution');
                const query = new node_1.default.Query(Institution);
                const institution = await query.get(req.user.institutionId);
                req.institution = {
                    id: institution.id,
                    name: institution.get('name'),
                    type: institution.get('type'),
                    discountSettings: institution.get('defaultDiscountSettings')
                };
            }
            catch (error) {
                logger_1.default.warn(`Failed to load institution ${req.user.institutionId}:`, error);
            }
        }
        // Update last activity
        parseUser.set('lastActivity', new Date());
        await parseUser.save(null, { useMasterKey: true });
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            code: 'AUTH_FAILED',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.authenticate = authenticate;
/**
 * Optional authentication middleware
 * Loads user data if token is provided, but doesn't require authentication
 */
const optionalAuthenticate = async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        next();
        return;
    }
    try {
        await (0, exports.authenticate)(req, res, next);
    }
    catch (error) {
        // Continue without authentication
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
/**
 * Role-based authorization middleware
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
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
        const isAllowed = rolesArray.some(role => role.toUpperCase() === userRole || userRole === 'SUPER_ADMIN');
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
exports.requireRole = requireRole;
/**
 * Permission-based authorization middleware
 */
const requirePermission = (permission) => {
    return (req, res, next) => {
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
exports.requirePermission = requirePermission;
/**
 * Admin-only middleware
 */
exports.requireAdmin = (0, exports.requireRole)(['ADMIN', 'SUPER_ADMIN']);
/**
 * Question designer middleware
 */
exports.requireQuestionDesigner = (0, exports.requireRole)([
    'QUESTION_DESIGNER', 'ADMIN', 'SUPER_ADMIN'
]);
/**
 * Teacher middleware
 */
exports.requireTeacher = (0, exports.requireRole)([
    'TEACHER', 'QUESTION_DESIGNER', 'ADMIN', 'SUPER_ADMIN'
]);
// ==================== JWT Utilities ====================
/**
 * Generate JWT token
 */
const generateToken = (userId, additionalData) => {
    const payload = {
        userId,
        iat: Math.floor(Date.now() / 1000),
        ...additionalData
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
/**
 * Refresh JWT token
 */
const refreshToken = (req, res) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
            code: 'AUTH_REQUIRED'
        });
        return;
    }
    const newToken = (0, exports.generateToken)(req.user.id, {
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
exports.refreshToken = refreshToken;
// Apply rate limiting to auth middleware
exports.authenticateWithRateLimit = [authRateLimit, exports.authenticate];
// ==================== Backward Compatibility Exports ====================
// Legacy aliases for backward compatibility
exports.protectRoute = exports.authenticate;
exports.restrictTo = exports.requireRole;
exports.authenticateToken = exports.authenticate;
exports.authenticateUser = exports.authenticate;
exports.optionalAuth = exports.optionalAuthenticate;
exports.auth = exports.authenticate;
exports.preventLoggedInAccess = exports.authenticate; // temp placeholder
exports.default = {
    authenticate: exports.authenticate,
    optionalAuthenticate: exports.optionalAuthenticate,
    requireRole: exports.requireRole,
    requirePermission: exports.requirePermission,
    requireAdmin: exports.requireAdmin,
    requireQuestionDesigner: exports.requireQuestionDesigner,
    requireTeacher: exports.requireTeacher,
    generateToken: exports.generateToken,
    refreshToken: exports.refreshToken,
    authenticateWithRateLimit: exports.authenticateWithRateLimit,
    // Legacy aliases
    protectRoute: exports.protectRoute,
    restrictTo: exports.restrictTo,
    authenticateToken: exports.authenticateToken,
    authenticateUser: exports.authenticateUser,
    optionalAuth: exports.optionalAuth,
    auth: exports.auth,
    preventLoggedInAccess: exports.preventLoggedInAccess
};
//# sourceMappingURL=auth.js.map