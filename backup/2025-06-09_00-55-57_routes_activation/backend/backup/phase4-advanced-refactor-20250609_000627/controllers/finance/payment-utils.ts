/**
 * Payment Utilities
 * توابع کمکی برای پردازش پرداخت
 */

import Parse from 'parse/node';

/**
 * Verify payment with gateway (simulated)
 * تایید پرداخت با درگاه (شبیه‌سازی شده)
 */
export async function verifyWithGateway(paymentReference: string): Promise<boolean> {
  // This would integrate with actual payment gateway
  // For now, simulate verification
  return paymentReference && paymentReference.length > 10;
}

/**
 * Grant exam access to user
 * اعطای دسترسی آزمون به کاربر
 */
export async function grantExamAccess(userId: string, examId: string): Promise<void> {
  const UserExamAccess = Parse.Object.extend('UserExamAccess');
  const access = new UserExamAccess();

  access.set('userId', userId);
  access.set('examId', examId);
  access.set('grantedAt', new Date());
  access.set('isActive', true);

  const acl = new Parse.ACL();
  acl.setReadAccess(userId, true);
  access.setACL(acl);

  await access.save();
}

/**
 * Update user purchase history
 * به‌روزرسانی تاریخچه خرید کاربر
 */
export async function updateUserPurchaseHistory(userId: string, transaction: any): Promise<void> {
  const User = Parse.Object.extend('User');
  const query = new Parse.Query(User);
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