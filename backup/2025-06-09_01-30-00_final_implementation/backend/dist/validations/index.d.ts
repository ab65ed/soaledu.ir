/**
 * Validation utilities with Zod
 *
 * This file exports validation middleware factory and common validation schemas using Zod.
 */
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
/**
 * Create validation middleware for Zod schemas
 * @param schema - Zod validation schema
 * @param source - Source of data to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
declare const validate: <T>(schema: z.ZodSchema<T>, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
declare const schemas: {
    readonly register: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        email?: string;
        password?: string;
    }, {
        name?: string;
        email?: string;
        password?: string;
    }>;
    readonly login: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email?: string;
        password?: string;
    }, {
        email?: string;
        password?: string;
    }>;
    readonly updateProfile: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        educationalGroup: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        educationalGroup?: string;
    }, {
        name?: string;
        educationalGroup?: string;
    }>;
    readonly createExamConfig: z.ZodObject<{
        category: z.ZodString;
        lesson: z.ZodOptional<z.ZodString>;
        hasNegativeMarking: z.ZodOptional<z.ZodBoolean>;
        timerOption: z.ZodOptional<z.ZodEnum<["50s", "70s", "none"]>>;
    }, "strip", z.ZodTypeAny, {
        category?: string;
        lesson?: string;
        hasNegativeMarking?: boolean;
        timerOption?: "50s" | "70s" | "none";
    }, {
        category?: string;
        lesson?: string;
        hasNegativeMarking?: boolean;
        timerOption?: "50s" | "70s" | "none";
    }>;
    readonly submitAnswer: z.ZodObject<{
        questionId: z.ZodString;
        selectedOption: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        questionId?: string;
        selectedOption?: number;
    }, {
        questionId?: string;
        selectedOption?: number;
    }>;
    readonly createTicket: z.ZodObject<{
        subject: z.ZodString;
        message: z.ZodString;
        priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        message?: string;
        subject?: string;
        priority?: "low" | "medium" | "high";
    }, {
        message?: string;
        subject?: string;
        priority?: "low" | "medium" | "high";
    }>;
    readonly addTicketResponse: z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message?: string;
    }, {
        message?: string;
    }>;
    readonly createPayment: z.ZodObject<{
        amount: z.ZodNumber;
        paymentMethod: z.ZodEnum<["credit-card", "paypal", "bank-transfer", "other"]>;
        packageName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount?: number;
        paymentMethod?: "credit-card" | "paypal" | "bank-transfer" | "other";
        packageName?: string;
    }, {
        amount?: number;
        paymentMethod?: "credit-card" | "paypal" | "bank-transfer" | "other";
        packageName?: string;
    }>;
    readonly createBlogPost: z.ZodObject<{
        title: z.ZodString;
        content: z.ZodString;
        category: z.ZodOptional<z.ZodString>;
        coverImage: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metaTitle: z.ZodOptional<z.ZodString>;
        metaDescription: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    }, "strip", z.ZodTypeAny, {
        status?: "draft" | "published" | "archived";
        category?: string;
        title?: string;
        content?: string;
        coverImage?: string;
        tags?: string[];
        metaTitle?: string;
        metaDescription?: string;
    }, {
        status?: "draft" | "published" | "archived";
        category?: string;
        title?: string;
        content?: string;
        coverImage?: string;
        tags?: string[];
        metaTitle?: string;
        metaDescription?: string;
    }>;
};
/**
 * Alternative name for validate function for backward compatibility
 */
export declare const validateRequest: <T>(schema: z.ZodSchema<T>, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
export { validate, schemas, };
