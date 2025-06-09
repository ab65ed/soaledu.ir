"use strict";
/**
 * Roles & Permissions Middleware
 * میدل‌ویر نقش‌ها و مجوزها برای اتصال به همه بخش‌های پروژه
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportAccess = exports.financeAccess = exports.flashcardAccess = exports.testExamAccess = exports.questionAccess = exports.courseExamAccess = exports.logActivity = exports.requireOwnerOrRole = exports.requireAllPermissions = exports.requireAnyPermission = exports.requirePermission = exports.requireRole = exports.authenticate = exports.ActivityType = exports.Permission = exports.UserRole = void 0;
exports.getDefaultPermissions = getDefaultPermissions;
exports.generateActivityDescription = generateActivityDescription;
exports.sanitizeRequestBody = sanitizeRequestBody;
const node_1 = __importDefault(require("parse/node"));
const roles_1 = require("../models/roles");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return roles_1.UserRole; } });
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return roles_1.Permission; } });
Object.defineProperty(exports, "ActivityType", { enumerable: true, get: function () { return roles_1.ActivityType; } });
// Authentication middleware for Parse Server
const authenticate = async (req, res, next) => {
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
            const User = node_1.default.Object.extend('User');
            const query = new node_1.default.Query(User);
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
                role: user.get('role') || roles_1.UserRole.STUDENT,
                permissions: user.get('permissions') || getDefaultPermissions(user.get('role') || roles_1.UserRole.STUDENT),
                name: user.get('name') || user.get('username'),
                email: user.get('email')
            };
            next();
        }
        catch (parseError) {
            console.error('Parse authentication error:', parseError);
            res.status(401).json({
                success: false,
                message: 'خطا در احراز هویت'
            });
        }
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'خطای سرور در احراز هویت'
        });
    }
};
exports.authenticate = authenticate;
// Role-based authorization middleware
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
// Permission-based authorization middleware
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'احراز هویت ضروری است'
            });
            return;
        }
        if (!(0, roles_1.hasPermission)(req.user.permissions, permission)) {
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
exports.requirePermission = requirePermission;
// Multiple permissions middleware (any of them)
const requireAnyPermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'احراز هویت ضروری است'
            });
            return;
        }
        if (!(0, roles_1.hasAnyPermission)(req.user.permissions, permissions)) {
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
exports.requireAnyPermission = requireAnyPermission;
// All permissions middleware (all of them)
const requireAllPermissions = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'احراز هویت ضروری است'
            });
            return;
        }
        if (!(0, roles_1.hasAllPermissions)(req.user.permissions, permissions)) {
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
exports.requireAllPermissions = requireAllPermissions;
// Owner or role middleware (user owns resource or has role)
const requireOwnerOrRole = (resourceOwnerField, ...allowedRoles) => {
    return async (req, res, next) => {
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
            }
            catch (error) {
                console.error('Ownership check error:', error);
            }
        }
        res.status(403).json({
            success: false,
            message: 'دسترسی مجاز نیست - مالک منبع یا نقش مجاز ضروری است'
        });
    };
};
exports.requireOwnerOrRole = requireOwnerOrRole;
// Activity logging middleware
const logActivity = (activityType, resourceType) => {
    return async (req, res, next) => {
        try {
            // Continue with the request first
            next();
            // Log activity after successful request
            if (req.user && res.statusCode < 400) {
                try {
                    const ActivityLogClass = node_1.default.Object.extend('ActivityLog');
                    const activityLog = new ActivityLogClass();
                    const resourceId = req.params.id || req.body.id || 'unknown';
                    const description = generateActivityDescription(activityType, resourceType, req.user.name || req.user.id, resourceId);
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
                }
                catch (logError) {
                    console.error('Activity logging error:', logError);
                    // Don't fail the request if logging fails
                }
            }
        }
        catch (error) {
            console.error('Activity logging middleware error:', error);
            next();
        }
    };
};
exports.logActivity = logActivity;
// Module-specific middleware combinations
// Course-Exam access control
exports.courseExamAccess = {
    // طراح می‌تواند درس ایجاد و ویرایش کند
    create: [exports.authenticate, (0, exports.requireAnyPermission)(roles_1.Permission.CREATE_CONTENT, roles_1.Permission.MANAGE_SYSTEM)],
    // همه می‌توانند درس‌ها را مشاهده کنند
    read: [exports.authenticate],
    // فقط مالک یا ادمین می‌تواند ویرایش کند
    update: [exports.authenticate, (0, exports.requireOwnerOrRole)('createdBy', roles_1.UserRole.ADMIN)],
    // فقط مالک یا ادمین می‌تواند حذف کند
    delete: [exports.authenticate, (0, exports.requireOwnerOrRole)('createdBy', roles_1.UserRole.ADMIN)],
    // لاگ فعالیت
    withLogging: (activityType) => [
        ...exports.courseExamAccess.read,
        (0, exports.logActivity)(activityType, 'course_exam')
    ]
};
// Question access control  
exports.questionAccess = {
    // طراح می‌تواند سوال ایجاد کند
    create: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.CREATE_CONTENT), (0, exports.logActivity)(roles_1.ActivityType.CREATE, 'question')],
    // همه می‌توانند سوالات را مشاهده کنند
    read: [exports.authenticate],
    // فقط مالک یا ادمین/کارشناس می‌تواند ویرایش کند
    update: [exports.authenticate, (0, exports.requireOwnerOrRole)('createdBy', roles_1.UserRole.ADMIN, roles_1.UserRole.EXPERT), (0, exports.logActivity)(roles_1.ActivityType.UPDATE, 'question')],
    // فقط مالک یا ادمین می‌تواند حذف کند
    delete: [exports.authenticate, (0, exports.requireOwnerOrRole)('createdBy', roles_1.UserRole.ADMIN), (0, exports.logActivity)(roles_1.ActivityType.DELETE, 'question')],
    // انتشار سوال برای آزمون - کارشناس یا ادمین
    publish: [exports.authenticate, (0, exports.requireAnyPermission)(roles_1.Permission.APPROVE_CONTENT, roles_1.Permission.MANAGE_SYSTEM), (0, exports.logActivity)(roles_1.ActivityType.APPROVE, 'question')]
};
// Test-Exam access control
exports.testExamAccess = {
    // دانشجویان می‌توانند آزمون بگیرند
    take: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.TAKE_EXAMS)],
    // مشاهده نتایج
    results: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.VIEW_RESULTS)],
    // مدیریت آزمون‌ها - کارشناس یا ادمین
    manage: [exports.authenticate, (0, exports.requireAnyPermission)(roles_1.Permission.MANAGE_EXAMS, roles_1.Permission.MANAGE_SYSTEM)],
    // لاگ فعالیت
    withLogging: (activityType) => [
        ...exports.testExamAccess.take,
        (0, exports.logActivity)(activityType, 'test_exam')
    ]
};
// Flashcard access control
exports.flashcardAccess = {
    // طراح می‌تواند فلش‌کارت ایجاد کند
    create: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.CREATE_CONTENT), (0, exports.logActivity)(roles_1.ActivityType.CREATE, 'flashcard')],
    // همه می‌توانند فلش‌کارت‌ها را مشاهده کنند
    read: [exports.authenticate],
    // خرید فلش‌کارت
    purchase: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.PURCHASE_CONTENT), (0, exports.logActivity)(roles_1.ActivityType.VIEW, 'flashcard_purchase')],
    // مدیریت فلش‌کارت‌ها
    manage: [exports.authenticate, (0, exports.requireAnyPermission)(roles_1.Permission.MANAGE_SYSTEM, roles_1.Permission.APPROVE_CONTENT)]
};
// Finance access control
exports.financeAccess = {
    // مشاهده قیمت‌ها - همه
    viewPrices: [exports.authenticate],
    // مدیریت مالی - فقط ادمین
    manage: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.MANAGE_PAYMENTS)],
    // درخواست وجه - طراحان
    requestPayment: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.REQUEST_PAYMENT), (0, exports.logActivity)(roles_1.ActivityType.PAYMENT_REQUEST, 'payment_request')],
    // پردازش پرداخت
    processPayment: [exports.authenticate, (0, exports.logActivity)(roles_1.ActivityType.VIEW, 'payment')]
};
// Support access control
exports.supportAccess = {
    // ایجاد تیکت - همه
    createTicket: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.CREATE_TICKETS), (0, exports.logActivity)(roles_1.ActivityType.TICKET_CREATED, 'support_ticket')],
    // مشاهده تیکت‌ها - پشتیبانی یا ادمین
    viewTickets: [exports.authenticate, (0, exports.requireAnyPermission)(roles_1.Permission.VIEW_TICKETS, roles_1.Permission.MANAGE_SYSTEM)],
    // پاسخ به تیکت - پشتیبانی
    respondTicket: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.RESPOND_TICKETS), (0, exports.logActivity)(roles_1.ActivityType.UPDATE, 'support_ticket')],
    // مدیریت پایگاه دانش
    manageKnowledgeBase: [exports.authenticate, (0, exports.requirePermission)(roles_1.Permission.MANAGE_KNOWLEDGE_BASE)]
};
// Utility functions
function getDefaultPermissions(role) {
    const defaultPermissions = {
        [roles_1.UserRole.ADMIN]: [
            roles_1.Permission.MANAGE_USERS,
            roles_1.Permission.MANAGE_ROLES,
            roles_1.Permission.VIEW_ANALYTICS,
            roles_1.Permission.MANAGE_SYSTEM,
            roles_1.Permission.VIEW_LOGS,
            roles_1.Permission.MANAGE_PAYMENTS
        ],
        [roles_1.UserRole.DESIGNER]: [
            roles_1.Permission.CREATE_CONTENT,
            roles_1.Permission.EDIT_CONTENT,
            roles_1.Permission.PUBLISH_CONTENT,
            roles_1.Permission.REQUEST_PAYMENT
        ],
        [roles_1.UserRole.EXPERT]: [
            roles_1.Permission.REVIEW_CONTENT,
            roles_1.Permission.APPROVE_CONTENT,
            roles_1.Permission.CREATE_QUESTIONS,
            roles_1.Permission.MANAGE_EXAMS,
            roles_1.Permission.VIEW_LOGS
        ],
        [roles_1.UserRole.SUPPORT]: [
            roles_1.Permission.VIEW_TICKETS,
            roles_1.Permission.RESPOND_TICKETS,
            roles_1.Permission.MANAGE_KNOWLEDGE_BASE,
            roles_1.Permission.LIVE_CHAT
        ],
        [roles_1.UserRole.STUDENT]: [
            roles_1.Permission.TAKE_EXAMS,
            roles_1.Permission.VIEW_RESULTS,
            roles_1.Permission.PURCHASE_CONTENT,
            roles_1.Permission.CREATE_TICKETS
        ]
    };
    return defaultPermissions[role] || defaultPermissions[roles_1.UserRole.STUDENT];
}
function generateActivityDescription(activityType, resourceType, userName, resourceId) {
    const actionMap = {
        [roles_1.ActivityType.LOGIN]: 'ورود به سیستم',
        [roles_1.ActivityType.LOGOUT]: 'خروج از سیستم',
        [roles_1.ActivityType.CREATE]: 'ایجاد',
        [roles_1.ActivityType.UPDATE]: 'ویرایش',
        [roles_1.ActivityType.DELETE]: 'حذف',
        [roles_1.ActivityType.VIEW]: 'مشاهده',
        [roles_1.ActivityType.APPROVE]: 'تایید',
        [roles_1.ActivityType.REJECT]: 'رد',
        [roles_1.ActivityType.PAYMENT_REQUEST]: 'درخواست وجه',
        [roles_1.ActivityType.TICKET_CREATED]: 'ایجاد تیکت',
        [roles_1.ActivityType.TICKET_RESOLVED]: 'حل تیکت'
    };
    const resourceMap = {
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
function sanitizeRequestBody(body) {
    if (!body || typeof body !== 'object')
        return body;
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
//# sourceMappingURL=roles.js.map