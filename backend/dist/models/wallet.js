"use strict";
/**
 * Wallet Models and Types
 * مدل‌ها و انواع داده‌های کیف پول
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_BULK_OPERATIONS = exports.MAX_EXPORT_RECORDS = exports.MAX_DESCRIPTION_LENGTH = exports.MIN_TRANSACTION_AMOUNT = exports.MAX_TRANSACTION_AMOUNT = exports.DEFAULT_WALLET_STATS = exports.DEFAULT_TRANSACTION_FILTERS = exports.TRANSACTION_STATUS_COLORS = exports.TRANSACTION_TYPE_COLORS = exports.TRANSACTION_STATUS_DISPLAY_NAMES = exports.TRANSACTION_TYPE_DISPLAY_NAMES = exports.TransactionStatus = exports.TransactionType = void 0;
exports.hasPermission = hasPermission;
exports.hasAnyPermission = hasAnyPermission;
exports.hasAllPermissions = hasAllPermissions;
exports.validateChargeRequest = validateChargeRequest;
exports.validateDeductRequest = validateDeductRequest;
exports.validateRefundRequest = validateRefundRequest;
exports.formatCurrency = formatCurrency;
exports.getTransactionTypeDisplayName = getTransactionTypeDisplayName;
exports.getTransactionStatusDisplayName = getTransactionStatusDisplayName;
exports.getTransactionTypeColor = getTransactionTypeColor;
exports.getTransactionStatusColor = getTransactionStatusColor;
exports.isChargeType = isChargeType;
exports.isDeductType = isDeductType;
// Transaction Types
var TransactionType;
(function (TransactionType) {
    TransactionType["CHARGE"] = "charge";
    TransactionType["DEDUCT"] = "deduct";
    TransactionType["PURCHASE"] = "purchase";
    TransactionType["REFUND"] = "refund";
    TransactionType["BONUS"] = "bonus";
    TransactionType["PENALTY"] = "penalty"; // جریمه
})(TransactionType || (exports.TransactionType = TransactionType = {}));
// Transaction Status
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled"; // لغو شده
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
// Wallet Permission Helper Functions
function hasPermission(userPermissions, permission) {
    return userPermissions.includes(permission);
}
function hasAnyPermission(userPermissions, permissions) {
    return permissions.some(permission => userPermissions.includes(permission));
}
function hasAllPermissions(userPermissions, permissions) {
    return permissions.every(permission => userPermissions.includes(permission));
}
// Transaction Type Display Names
exports.TRANSACTION_TYPE_DISPLAY_NAMES = {
    [TransactionType.CHARGE]: 'شارژ',
    [TransactionType.DEDUCT]: 'کسر',
    [TransactionType.PURCHASE]: 'خرید',
    [TransactionType.REFUND]: 'بازگشت وجه',
    [TransactionType.BONUS]: 'جایزه',
    [TransactionType.PENALTY]: 'جریمه'
};
// Transaction Status Display Names
exports.TRANSACTION_STATUS_DISPLAY_NAMES = {
    [TransactionStatus.PENDING]: 'در انتظار',
    [TransactionStatus.COMPLETED]: 'تکمیل شده',
    [TransactionStatus.FAILED]: 'ناموفق',
    [TransactionStatus.CANCELLED]: 'لغو شده'
};
// Transaction Type Colors
exports.TRANSACTION_TYPE_COLORS = {
    [TransactionType.CHARGE]: 'text-green-600 bg-green-100',
    [TransactionType.BONUS]: 'text-green-600 bg-green-100',
    [TransactionType.DEDUCT]: 'text-red-600 bg-red-100',
    [TransactionType.PURCHASE]: 'text-blue-600 bg-blue-100',
    [TransactionType.PENALTY]: 'text-red-600 bg-red-100',
    [TransactionType.REFUND]: 'text-yellow-600 bg-yellow-100'
};
// Transaction Status Colors
exports.TRANSACTION_STATUS_COLORS = {
    [TransactionStatus.PENDING]: 'text-yellow-600 bg-yellow-100',
    [TransactionStatus.COMPLETED]: 'text-green-600 bg-green-100',
    [TransactionStatus.FAILED]: 'text-red-600 bg-red-100',
    [TransactionStatus.CANCELLED]: 'text-gray-600 bg-gray-100'
};
// Validation Functions
function validateChargeRequest(request) {
    const errors = [];
    if (!request.userId || request.userId.trim() === '') {
        errors.push('شناسه کاربر الزامی است');
    }
    if (!request.amount || request.amount <= 0) {
        errors.push('مبلغ باید بیشتر از صفر باشد');
    }
    if (request.amount > 100000000) {
        errors.push('مبلغ نمی‌تواند بیشتر از 100 میلیون تومان باشد');
    }
    if (!request.description || request.description.trim() === '') {
        errors.push('توضیحات الزامی است');
    }
    if (request.description && request.description.length > 500) {
        errors.push('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد');
    }
    if (!Object.values([TransactionType.CHARGE, TransactionType.BONUS]).includes(request.type)) {
        errors.push('نوع تراکنش برای شارژ معتبر نیست');
    }
    return errors;
}
function validateDeductRequest(request) {
    const errors = [];
    if (!request.userId || request.userId.trim() === '') {
        errors.push('شناسه کاربر الزامی است');
    }
    if (!request.amount || request.amount <= 0) {
        errors.push('مبلغ باید بیشتر از صفر باشد');
    }
    if (request.amount > 100000000) {
        errors.push('مبلغ نمی‌تواند بیشتر از 100 میلیون تومان باشد');
    }
    if (!request.description || request.description.trim() === '') {
        errors.push('توضیحات الزامی است');
    }
    if (request.description && request.description.length > 500) {
        errors.push('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد');
    }
    if (!Object.values([TransactionType.DEDUCT, TransactionType.PURCHASE, TransactionType.PENALTY]).includes(request.type)) {
        errors.push('نوع تراکنش برای کسر معتبر نیست');
    }
    return errors;
}
function validateRefundRequest(request) {
    const errors = [];
    if (!request.transactionId || request.transactionId.trim() === '') {
        errors.push('شناسه تراکنش الزامی است');
    }
    if (request.amount && request.amount <= 0) {
        errors.push('مبلغ بازگشت باید بیشتر از صفر باشد');
    }
    if (!request.reason || request.reason.trim() === '') {
        errors.push('دلیل بازگشت وجه الزامی است');
    }
    if (request.reason && request.reason.length > 500) {
        errors.push('دلیل بازگشت وجه نمی‌تواند بیشتر از 500 کاراکتر باشد');
    }
    return errors;
}
// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}
function getTransactionTypeDisplayName(type) {
    return exports.TRANSACTION_TYPE_DISPLAY_NAMES[type] || type;
}
function getTransactionStatusDisplayName(status) {
    return exports.TRANSACTION_STATUS_DISPLAY_NAMES[status] || status;
}
function getTransactionTypeColor(type) {
    return exports.TRANSACTION_TYPE_COLORS[type] || 'text-gray-600 bg-gray-100';
}
function getTransactionStatusColor(status) {
    return exports.TRANSACTION_STATUS_COLORS[status] || 'text-gray-600 bg-gray-100';
}
function isChargeType(type) {
    return [TransactionType.CHARGE, TransactionType.BONUS, TransactionType.REFUND].includes(type);
}
function isDeductType(type) {
    return [TransactionType.DEDUCT, TransactionType.PURCHASE, TransactionType.PENALTY].includes(type);
}
// Default Values
exports.DEFAULT_TRANSACTION_FILTERS = {
    page: 1,
    limit: 20
};
exports.DEFAULT_WALLET_STATS = {
    totalCharges: 0,
    totalDeductions: 0,
    pendingTransactions: 0,
    netAmount: 0
};
// Constants
exports.MAX_TRANSACTION_AMOUNT = 100000000; // 100 million tomans
exports.MIN_TRANSACTION_AMOUNT = 1000; // 1000 tomans
exports.MAX_DESCRIPTION_LENGTH = 500;
exports.MAX_EXPORT_RECORDS = 10000;
exports.MAX_BULK_OPERATIONS = 100;
//# sourceMappingURL=wallet.js.map