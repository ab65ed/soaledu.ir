"use strict";
/**
 * Payment Utilities
 * توابع کمکی برای پردازش پرداخت
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWithGateway = verifyWithGateway;
exports.grantExamAccess = grantExamAccess;
exports.updateUserPurchaseHistory = updateUserPurchaseHistory;
const node_1 = __importDefault(require("parse/node"));
/**
 * Verify payment with gateway (simulated)
 * تایید پرداخت با درگاه (شبیه‌سازی شده)
 */
async function verifyWithGateway(paymentReference) {
    // This would integrate with actual payment gateway
    // For now, simulate verification
    return paymentReference && paymentReference.length > 10;
}
/**
 * Grant exam access to user
 * اعطای دسترسی آزمون به کاربر
 */
async function grantExamAccess(userId, examId) {
    const UserExamAccess = node_1.default.Object.extend('UserExamAccess');
    const access = new UserExamAccess();
    access.set('userId', userId);
    access.set('examId', examId);
    access.set('grantedAt', new Date());
    access.set('isActive', true);
    const acl = new node_1.default.ACL();
    acl.setReadAccess(userId, true);
    access.setACL(acl);
    await access.save();
}
/**
 * Update user purchase history
 * به‌روزرسانی تاریخچه خرید کاربر
 */
async function updateUserPurchaseHistory(userId, transaction) {
    const User = node_1.default.Object.extend('User');
    const query = new node_1.default.Query(User);
    const user = await query.get(userId);
    const purchaseHistory = user.get('purchaseHistory') || [];
    purchaseHistory.push({
        transactionId: transaction.objectId,
        examId: transaction.examId,
        amount: transaction.amount,
        purchasedAt: new Date()
    });
    user.set('purchaseHistory', purchaseHistory);
    await user.save();
}
//# sourceMappingURL=payment-utils.js.map