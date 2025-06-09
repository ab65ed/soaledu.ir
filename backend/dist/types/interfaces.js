"use strict";
// نوع‌ها و رابط‌های مورد نیاز برای سیستم سوال و آزمون
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionAction = exports.PermissionResource = exports.ActivityType = exports.Permission = void 0;
// انواع اجازه‌ها
var Permission;
(function (Permission) {
    // اجازه‌های کاربر
    Permission["VIEW_PROFILE"] = "VIEW_PROFILE";
    Permission["EDIT_PROFILE"] = "EDIT_PROFILE";
    // اجازه‌های سوال
    Permission["CREATE_QUESTION"] = "CREATE_QUESTION";
    Permission["EDIT_QUESTION"] = "EDIT_QUESTION";
    Permission["DELETE_QUESTION"] = "DELETE_QUESTION";
    Permission["VIEW_QUESTION"] = "VIEW_QUESTION";
    Permission["PUBLISH_QUESTION"] = "PUBLISH_QUESTION";
    // اجازه‌های آزمون
    Permission["CREATE_EXAM"] = "CREATE_EXAM";
    Permission["EDIT_EXAM"] = "EDIT_EXAM";
    Permission["DELETE_EXAM"] = "DELETE_EXAM";
    Permission["VIEW_EXAM"] = "VIEW_EXAM";
    Permission["CONDUCT_EXAM"] = "CONDUCT_EXAM";
    // اجازه‌های مالی
    Permission["VIEW_FINANCIAL_REPORTS"] = "VIEW_FINANCIAL_REPORTS";
    Permission["MANAGE_PAYMENTS"] = "MANAGE_PAYMENTS";
    Permission["PROCESS_REFUNDS"] = "PROCESS_REFUNDS";
    Permission["VIEW_USER_PROFILES"] = "VIEW_USER_PROFILES";
    Permission["EXPORT_DATA"] = "EXPORT_DATA";
    // اجازه‌های مدیریت
    Permission["ADMIN"] = "ADMIN";
    Permission["MANAGE_USERS"] = "MANAGE_USERS";
    Permission["MANAGE_SYSTEM"] = "MANAGE_SYSTEM";
    Permission["VIEW_ANALYTICS"] = "VIEW_ANALYTICS";
})(Permission || (exports.Permission = Permission = {}));
// انواع فعالیت برای لاگ
var ActivityType;
(function (ActivityType) {
    ActivityType["READ"] = "READ";
    ActivityType["CREATE"] = "CREATE";
    ActivityType["UPDATE"] = "UPDATE";
    ActivityType["DELETE"] = "DELETE";
    ActivityType["DUPLICATE"] = "DUPLICATE";
    ActivityType["AUTO_SAVE"] = "AUTO_SAVE";
    ActivityType["READ_STATS"] = "READ_STATS";
    ActivityType["BULK_CREATE"] = "BULK_CREATE";
    ActivityType["BULK_UPDATE"] = "BULK_UPDATE";
    ActivityType["BULK_DELETE"] = "BULK_DELETE";
    ActivityType["SEARCH_TAGS"] = "SEARCH_TAGS";
    ActivityType["TOGGLE_ACTIVE"] = "TOGGLE_ACTIVE";
    ActivityType["PUBLISH_TO_TEST_EXAM"] = "PUBLISH_TO_TEST_EXAM";
    ActivityType["READ_PUBLISHED"] = "READ_PUBLISHED";
    ActivityType["LINK_COURSE_EXAM"] = "LINK_COURSE_EXAM";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
// انواع منابع
var PermissionResource;
(function (PermissionResource) {
    PermissionResource["QUESTION"] = "QUESTION";
    PermissionResource["EXAM"] = "EXAM";
    PermissionResource["USER"] = "USER";
    PermissionResource["SYSTEM"] = "SYSTEM";
})(PermissionResource || (exports.PermissionResource = PermissionResource = {}));
// انواع عمل
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "CREATE";
    PermissionAction["READ"] = "READ";
    PermissionAction["UPDATE"] = "UPDATE";
    PermissionAction["DELETE"] = "DELETE";
    PermissionAction["PUBLISH"] = "PUBLISH";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
//# sourceMappingURL=interfaces.js.map