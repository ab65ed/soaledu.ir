/**
 * Finance Controllers Index
 * صادرات تمام کنترلرهای مالی
 */

// Export types and constants
export * from './types';

// Export controllers
export { PricingController } from './pricing';
export { PaymentController } from './payment';

// Export utilities
export * from './pricing-utils';
export * from './payment-utils';

// Legacy compatibility - export as FinanceController
import { PricingController } from './pricing';
import { PaymentController } from './payment';

export class FinanceController {
  // Pricing methods
  static calculatePrice = PricingController.calculatePrice;
  static calculateFlashcardPrice = PricingController.calculateFlashcardPrice;
  static getFlashcardPrice = PricingController.getFlashcardPrice;
  static getExamPrice = PricingController.getExamPrice;

  // Payment methods
  static createPayment = PaymentController.createPayment;
  static verifyPayment = PaymentController.verifyPayment;
  static getPaymentHistory = PaymentController.getPaymentHistory;
} 