"use strict";
/**
 * Roles Models and Types
 * مدل‌ها و انواع نقش‌ها
 *
 * این فایل شامل تعاریف TypeScript برای سیستم نقش‌ها است
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAllPermissions = exports.hasAnyPermission = exports.hasPermission = exports.getTicketPriorityDisplayName = exports.getTicketStatusDisplayName = exports.getActivityTypeDisplayName = exports.getPermissionDisplayName = exports.getRoleDisplayName = exports.DEFAULT_ROLES = exports.ROLE_VALIDATION = exports.PaymentRequestStatus = exports.TicketPriority = exports.TicketStatus = exports.ActivityType = exports.Permission = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["DESIGNER"] = "designer";
    UserRole["STUDENT"] = "student";
    UserRole["EXPERT"] = "expert";
    UserRole["SUPPORT"] = "support";
})(UserRole || (exports.UserRole = UserRole = {}));
var Permission;
(function (Permission) {
    // Admin permissions
    Permission["MANAGE_USERS"] = "manage_users";
    Permission["MANAGE_ROLES"] = "manage_roles";
    Permission["VIEW_ANALYTICS"] = "view_analytics";
    Permission["MANAGE_SYSTEM"] = "manage_system";
    Permission["VIEW_LOGS"] = "view_logs";
    Permission["MANAGE_PAYMENTS"] = "manage_payments";
    // Designer permissions
    Permission["CREATE_CONTENT"] = "create_content";
    Permission["EDIT_CONTENT"] = "edit_content";
    Permission["PUBLISH_CONTENT"] = "publish_content";
    Permission["REQUEST_PAYMENT"] = "request_payment";
    // Expert permissions
    Permission["REVIEW_CONTENT"] = "review_content";
    Permission["APPROVE_CONTENT"] = "approve_content";
    Permission["CREATE_QUESTIONS"] = "create_questions";
    Permission["MANAGE_EXAMS"] = "manage_exams";
    // Support permissions
    Permission["VIEW_TICKETS"] = "view_tickets";
    Permission["RESPOND_TICKETS"] = "respond_tickets";
    Permission["MANAGE_KNOWLEDGE_BASE"] = "manage_knowledge_base";
    Permission["LIVE_CHAT"] = "live_chat";
    // Student permissions
    Permission["TAKE_EXAMS"] = "take_exams";
    Permission["VIEW_RESULTS"] = "view_results";
    Permission["PURCHASE_CONTENT"] = "purchase_content";
    Permission["CREATE_TICKETS"] = "create_tickets";
})(Permission || (exports.Permission = Permission = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["LOGIN"] = "login";
    ActivityType["LOGOUT"] = "logout";
    ActivityType["CREATE"] = "create";
    ActivityType["UPDATE"] = "update";
    ActivityType["DELETE"] = "delete";
    ActivityType["VIEW"] = "view";
    ActivityType["APPROVE"] = "approve";
    ActivityType["REJECT"] = "reject";
    ActivityType["PAYMENT_REQUEST"] = "payment_request";
    ActivityType["TICKET_CREATED"] = "ticket_created";
    ActivityType["TICKET_RESOLVED"] = "ticket_resolved";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "open";
    TicketStatus["IN_PROGRESS"] = "in_progress";
    TicketStatus["RESOLVED"] = "resolved";
    TicketStatus["CLOSED"] = "closed";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "low";
    TicketPriority["MEDIUM"] = "medium";
    TicketPriority["HIGH"] = "high";
    TicketPriority["URGENT"] = "urgent";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
var PaymentRequestStatus;
(function (PaymentRequestStatus) {
    PaymentRequestStatus["PENDING"] = "pending";
    PaymentRequestStatus["APPROVED"] = "approved";
    PaymentRequestStatus["REJECTED"] = "rejected";
    PaymentRequestStatus["PAID"] = "paid";
})(PaymentRequestStatus || (exports.PaymentRequestStatus = PaymentRequestStatus = {}));
// Validation schemas
exports.ROLE_VALIDATION = {
    displayName: {
        minLength: 2,
        maxLength: 50
    },
    description: {
        maxLength: 200
    },
    ticketTitle: {
        minLength: 5,
        maxLength: 100
    },
    ticketDescription: {
        minLength: 10,
        maxLength: 1000
    },
    paymentAmount: {
        min: 1000,
        max: 10000000
    }
};
// Default role definitions
exports.DEFAULT_ROLES = [
    {
        name: UserRole.ADMIN,
        displayName: 'مدیر سیستم',
        description: 'دسترسی کامل به تمام بخش‌های سیستم',
        permissions: [
            Permission.MANAGE_USERS,
            Permission.MANAGE_ROLES,
            Permission.VIEW_ANALYTICS,
            Permission.MANAGE_SYSTEM,
            Permission.VIEW_LOGS,
            Permission.MANAGE_PAYMENTS
        ],
        isActive: true
    },
    {
        name: UserRole.DESIGNER,
        displayName: 'طراح محتوا',
        description: 'ایجاد و ویرایش محتوای آموزشی',
        permissions: [
            Permission.CREATE_CONTENT,
            Permission.EDIT_CONTENT,
            Permission.PUBLISH_CONTENT,
            Permission.REQUEST_PAYMENT
        ],
        isActive: true
    },
    {
        name: UserRole.EXPERT,
        displayName: 'کارشناس',
        description: 'بررسی و تایید محتوای آموزشی',
        permissions: [
            Permission.REVIEW_CONTENT,
            Permission.APPROVE_CONTENT,
            Permission.CREATE_QUESTIONS,
            Permission.MANAGE_EXAMS,
            Permission.VIEW_LOGS
        ],
        isActive: true
    },
    {
        name: UserRole.SUPPORT,
        displayName: 'پشتیبانی',
        description: 'پاسخگویی به کاربران و مدیریت تیکت‌ها',
        permissions: [
            Permission.VIEW_TICKETS,
            Permission.RESPOND_TICKETS,
            Permission.MANAGE_KNOWLEDGE_BASE,
            Permission.LIVE_CHAT
        ],
        isActive: true
    },
    {
        name: UserRole.STUDENT,
        displayName: 'دانشجو',
        description: 'شرکت در آزمون‌ها و استفاده از محتوای آموزشی',
        permissions: [
            Permission.TAKE_EXAMS,
            Permission.VIEW_RESULTS,
            Permission.PURCHASE_CONTENT,
            Permission.CREATE_TICKETS
        ],
        isActive: true
    }
];
// Utility functions
const getRoleDisplayName = (role) => {
    const roleMap = {
        [UserRole.ADMIN]: 'مدیر سیستم',
        [UserRole.DESIGNER]: 'طراح محتوا',
        [UserRole.EXPERT]: 'کارشناس',
        [UserRole.SUPPORT]: 'پشتیبانی',
        [UserRole.STUDENT]: 'دانشجو'
    };
    return roleMap[role] || 'نامشخص';
};
exports.getRoleDisplayName = getRoleDisplayName;
const getPermissionDisplayName = (permission) => {
    const permissionMap = {
        [Permission.MANAGE_USERS]: 'مدیریت کاربران',
        [Permission.MANAGE_ROLES]: 'مدیریت نقش‌ها',
        [Permission.VIEW_ANALYTICS]: 'مشاهده آمار',
        [Permission.MANAGE_SYSTEM]: 'مدیریت سیستم',
        [Permission.VIEW_LOGS]: 'مشاهده لاگ‌ها',
        [Permission.MANAGE_PAYMENTS]: 'مدیریت پرداخت‌ها',
        [Permission.CREATE_CONTENT]: 'ایجاد محتوا',
        [Permission.EDIT_CONTENT]: 'ویرایش محتوا',
        [Permission.PUBLISH_CONTENT]: 'انتشار محتوا',
        [Permission.REQUEST_PAYMENT]: 'درخواست وجه',
        [Permission.REVIEW_CONTENT]: 'بررسی محتوا',
        [Permission.APPROVE_CONTENT]: 'تایید محتوا',
        [Permission.CREATE_QUESTIONS]: 'ایجاد سوال',
        [Permission.MANAGE_EXAMS]: 'مدیریت آزمون‌ها',
        [Permission.VIEW_TICKETS]: 'مشاهده تیکت‌ها',
        [Permission.RESPOND_TICKETS]: 'پاسخ به تیکت‌ها',
        [Permission.MANAGE_KNOWLEDGE_BASE]: 'مدیریت پایگاه دانش',
        [Permission.LIVE_CHAT]: 'چت زنده',
        [Permission.TAKE_EXAMS]: 'شرکت در آزمون',
        [Permission.VIEW_RESULTS]: 'مشاهده نتایج',
        [Permission.PURCHASE_CONTENT]: 'خرید محتوا',
        [Permission.CREATE_TICKETS]: 'ایجاد تیکت'
    };
    return permissionMap[permission] || 'نامشخص';
};
exports.getPermissionDisplayName = getPermissionDisplayName;
const getActivityTypeDisplayName = (activityType) => {
    const activityMap = {
        [ActivityType.LOGIN]: 'ورود',
        [ActivityType.LOGOUT]: 'خروج',
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
    return activityMap[activityType] || 'نامشخص';
};
exports.getActivityTypeDisplayName = getActivityTypeDisplayName;
const getTicketStatusDisplayName = (status) => {
    const statusMap = {
        [TicketStatus.OPEN]: 'باز',
        [TicketStatus.IN_PROGRESS]: 'در حال بررسی',
        [TicketStatus.RESOLVED]: 'حل شده',
        [TicketStatus.CLOSED]: 'بسته شده'
    };
    return statusMap[status] || 'نامشخص';
};
exports.getTicketStatusDisplayName = getTicketStatusDisplayName;
const getTicketPriorityDisplayName = (priority) => {
    const priorityMap = {
        [TicketPriority.LOW]: 'کم',
        [TicketPriority.MEDIUM]: 'متوسط',
        [TicketPriority.HIGH]: 'بالا',
        [TicketPriority.URGENT]: 'فوری'
    };
    return priorityMap[priority] || 'نامشخص';
};
exports.getTicketPriorityDisplayName = getTicketPriorityDisplayName;
const hasPermission = (userPermissions, requiredPermission) => {
    return userPermissions.includes(requiredPermission);
};
exports.hasPermission = hasPermission;
const hasAnyPermission = (userPermissions, requiredPermissions) => {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
};
exports.hasAnyPermission = hasAnyPermission;
const hasAllPermissions = (userPermissions, requiredPermissions) => {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
};
exports.hasAllPermissions = hasAllPermissions;
//# sourceMappingURL=roles.js.map