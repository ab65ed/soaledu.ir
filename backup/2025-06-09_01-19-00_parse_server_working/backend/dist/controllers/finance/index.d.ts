/**
 * Finance Controllers Index
 * صادرات تمام کنترلرهای مالی
 */
export * from './types';
export { PricingController } from './pricing';
export { PaymentController } from './payment';
export * from './pricing-utils';
export * from './payment-utils';
import { PricingController } from './pricing';
import { PaymentController } from './payment';
export declare class FinanceController {
    static calculatePrice: typeof PricingController.calculatePrice;
    static calculateFlashcardPrice: typeof PricingController.calculateFlashcardPrice;
    static getFlashcardPrice: typeof PricingController.getFlashcardPrice;
    static getExamPrice: typeof PricingController.getExamPrice;
    static createPayment: typeof PaymentController.createPayment;
    static verifyPayment: typeof PaymentController.verifyPayment;
    static getPaymentHistory: typeof PaymentController.getPaymentHistory;
}
