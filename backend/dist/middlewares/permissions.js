"use strict";
/**
 * Permissions Middleware
 * میدل‌ویر بررسی مجوزها
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
exports.requireAnyPermission = requireAnyPermission;
exports.requireAllPermissions = requireAllPermissions;
exports.requireOwnershipOrPermission = requireOwnershipOrPermission;
exports.addUserPermissions = addUserPermissions;
const node_1 = __importDefault(require("parse/node"));
const roles_1 = require("../models/roles");
/**
 * Middleware to check if user has required permission
 * میدل‌ویر بررسی مجوز مورد نیاز کاربر
 */
function requirePermission(permission) {
    return async (req, res, next) => {
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
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
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
            if (!(0, roles_1.hasPermission)(userPermissions, permission)) {
                res.status(403).json({
                    success: false,
                    message: 'شما مجاز به انجام این عملیات نیستید',
                    requiredPermission: permission
                });
                return;
            }
            next();
        }
        catch (error) {
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
function requireAnyPermission(permissions) {
    return async (req, res, next) => {
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
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
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
            const hasAnyPermission = permissions.some(permission => (0, roles_1.hasPermission)(userPermissions, permission));
            if (!hasAnyPermission) {
                res.status(403).json({
                    success: false,
                    message: 'شما مجاز به انجام این عملیات نیستید',
                    requiredPermissions: permissions
                });
                return;
            }
            next();
        }
        catch (error) {
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
function requireAllPermissions(permissions) {
    return async (req, res, next) => {
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
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
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
            const hasAllPermissions = permissions.every(permission => (0, roles_1.hasPermission)(userPermissions, permission));
            if (!hasAllPermissions) {
                const missingPermissions = permissions.filter(permission => !(0, roles_1.hasPermission)(userPermissions, permission));
                res.status(403).json({
                    success: false,
                    message: 'شما مجاز به انجام این عملیات نیستید',
                    requiredPermissions: permissions,
                    missingPermissions
                });
                return;
            }
            next();
        }
        catch (error) {
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
function requireOwnershipOrPermission(permission, userIdField = 'userId') {
    return async (req, res, next) => {
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
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(currentUserId);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'کاربر یافت نشد'
                });
                return;
            }
            const userPermissions = user.get('permissions') || [];
            if (!(0, roles_1.hasPermission)(userPermissions, permission)) {
                res.status(403).json({
                    success: false,
                    message: 'شما مجاز به دسترسی به این منبع نیستید'
                });
                return;
            }
            next();
        }
        catch (error) {
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
async function addUserPermissions(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            next();
            return;
        }
        // Get user permissions
        const User = node_1.default.Object.extend('User');
        const userQuery = new node_1.default.Query(User);
        const user = await userQuery.get(userId);
        if (user) {
            req.user.permissions = user.get('permissions') || [];
            req.user.role = user.get('role');
        }
        next();
    }
    catch (error) {
        console.error('Error adding user permissions:', error);
        next(); // Continue even if there's an error
    }
}
//# sourceMappingURL=permissions.js.map