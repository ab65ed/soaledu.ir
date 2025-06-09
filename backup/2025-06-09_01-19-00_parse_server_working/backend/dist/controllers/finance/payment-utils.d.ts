/**
 * Payment Utilities
 * توابع کمکی برای پردازش پرداخت
 */
/**
 * Verify payment with gateway (simulated)
 * تایید پرداخت با درگاه (شبیه‌سازی شده)
 */
export declare function verifyWithGateway(paymentReference: string): Promise<boolean>;
/**
 * Grant exam access to user
 * اعطای دسترسی آزمون به کاربر
 */
export declare function grantExamAccess(userId: string, examId: string): Promise<void>;
/**
 * Update user purchase history
 * به‌روزرسانی تاریخچه خرید کاربر
 */
export declare function updateUserPurchaseHistory(userId: string, transaction: any): Promise<void>;
