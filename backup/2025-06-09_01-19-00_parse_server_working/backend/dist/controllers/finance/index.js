"use strict";
/**
 * Finance Controllers Index
 * صادرات تمام کنترلرهای مالی
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = exports.PaymentController = exports.PricingController = void 0;
// Export types and constants
__exportStar(require("./types"), exports);
// Export controllers
var pricing_1 = require("./pricing");
Object.defineProperty(exports, "PricingController", { enumerable: true, get: function () { return pricing_1.PricingController; } });
var payment_1 = require("./payment");
Object.defineProperty(exports, "PaymentController", { enumerable: true, get: function () { return payment_1.PaymentController; } });
// Export utilities
__exportStar(require("./pricing-utils"), exports);
__exportStar(require("./payment-utils"), exports);
// Legacy compatibility - export as FinanceController
const pricing_2 = require("./pricing");
const payment_2 = require("./payment");
class FinanceController {
}
exports.FinanceController = FinanceController;
// Pricing methods
FinanceController.calculatePrice = pricing_2.PricingController.calculatePrice;
FinanceController.calculateFlashcardPrice = pricing_2.PricingController.calculateFlashcardPrice;
FinanceController.getFlashcardPrice = pricing_2.PricingController.getFlashcardPrice;
FinanceController.getExamPrice = pricing_2.PricingController.getExamPrice;
// Payment methods
FinanceController.createPayment = payment_2.PaymentController.createPayment;
FinanceController.verifyPayment = payment_2.PaymentController.verifyPayment;
FinanceController.getPaymentHistory = payment_2.PaymentController.getPaymentHistory;
//# sourceMappingURL=index.js.map