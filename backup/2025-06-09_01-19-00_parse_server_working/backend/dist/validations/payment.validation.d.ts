/**
 * Payment validation middleware with Zod
 *
 * This file contains validation schemas and middleware for payment-related requests
 * using Zod.
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const PaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    discountCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount?: number;
    discountCode?: string;
}, {
    amount?: number;
    discountCode?: string;
}>;
export declare const DiscountCodeSchema: z.ZodObject<{
    code: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    code?: string;
    amount?: number;
}, {
    code?: string;
    amount?: number;
}>;
export declare const CreateDiscountCodeSchema: z.ZodObject<{
    code: z.ZodString;
    discountPercentage: z.ZodNumber;
    expiryDate: z.ZodEffects<z.ZodDate, Date, Date>;
    usageLimit: z.ZodOptional<z.ZodNumber>;
    minAmount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    maxDiscount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code?: string;
    discountPercentage?: number;
    expiryDate?: Date;
    usageLimit?: number;
    minAmount?: number;
    maxDiscount?: number;
    description?: string;
}, {
    code?: string;
    discountPercentage?: number;
    expiryDate?: Date;
    usageLimit?: number;
    minAmount?: number;
    maxDiscount?: number;
    description?: string;
}>;
export declare const TransactionFilterSchema: z.ZodEffects<z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodEnum<["pending", "completed", "failed", "refunded"]>>;
    userId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "completed" | "failed" | "refunded";
    page?: number;
    limit?: number;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}, {
    status?: "pending" | "completed" | "failed" | "refunded";
    page?: number;
    limit?: number;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}>, {
    status?: "pending" | "completed" | "failed" | "refunded";
    page?: number;
    limit?: number;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}, {
    status?: "pending" | "completed" | "failed" | "refunded";
    page?: number;
    limit?: number;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}>;
export declare const validatePayment: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateDiscountCode: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreateDiscountCode: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTransactionFilter: (req: Request, res: Response, next: NextFunction) => void;
export type PaymentType = z.infer<typeof PaymentSchema>;
export type DiscountCodeType = z.infer<typeof DiscountCodeSchema>;
export type CreateDiscountCodeType = z.infer<typeof CreateDiscountCodeSchema>;
export type TransactionFilterType = z.infer<typeof TransactionFilterSchema>;
