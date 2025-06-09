/**
 * Payment validation middleware
 *
 * This file contains validation schemas and middleware for payment-related requests
 * using fastest-validator.
 */
import { Request, Response, NextFunction } from 'express';
declare const paymentSchema: {
    amount: {
        type: string;
        positive: boolean;
        min: number;
        max: number;
        messages: {
            required: string;
            number: string;
            positive: string;
            min: string;
            max: string;
        };
    };
    discountCode: {
        type: string;
        optional: boolean;
        trim: boolean;
        min: number;
        max: number;
        messages: {
            string: string;
            min: string;
            max: string;
        };
    };
};
declare const discountCodeSchema: {
    code: {
        type: string;
        trim: boolean;
        min: number;
        max: number;
        messages: {
            required: string;
            string: string;
            min: string;
            max: string;
        };
    };
    amount: {
        type: string;
        positive: boolean;
        min: number;
        max: number;
        messages: {
            required: string;
            number: string;
            positive: string;
            min: string;
            max: string;
        };
    };
};
declare const createDiscountCodeSchema: {
    code: {
        type: string;
        trim: boolean;
        min: number;
        max: number;
        messages: {
            required: string;
            string: string;
            min: string;
            max: string;
        };
    };
    discountPercentage: {
        type: string;
        positive: boolean;
        min: number;
        max: number;
        messages: {
            required: string;
            number: string;
            positive: string;
            min: string;
            max: string;
        };
    };
    expiryDate: {
        type: string;
        convert: boolean;
        messages: {
            required: string;
            date: string;
        };
    };
    usageLimit: {
        type: string;
        optional: boolean;
        positive: boolean;
        min: number;
        messages: {
            number: string;
            positive: string;
            min: string;
        };
    };
    minAmount: {
        type: string;
        optional: boolean;
        positive: boolean;
        default: number;
        messages: {
            number: string;
            positive: string;
        };
    };
    maxDiscount: {
        type: string;
        optional: boolean;
        positive: boolean;
        messages: {
            number: string;
            positive: string;
        };
    };
    description: {
        type: string;
        optional: boolean;
        trim: boolean;
        max: number;
        messages: {
            string: string;
            max: string;
        };
    };
};
declare const transactionFilterSchema: {
    page: {
        type: string;
        optional: boolean;
        positive: boolean;
        integer: boolean;
        min: number;
        convert: boolean;
        default: number;
        messages: {
            number: string;
            positive: string;
            integer: string;
            min: string;
        };
    };
    limit: {
        type: string;
        optional: boolean;
        positive: boolean;
        integer: boolean;
        min: number;
        max: number;
        convert: boolean;
        default: number;
        messages: {
            number: string;
            positive: string;
            integer: string;
            min: string;
            max: string;
        };
    };
    status: {
        type: string;
        optional: boolean;
        enum: string[];
        messages: {
            string: string;
            enum: string;
        };
    };
    userId: {
        type: string;
        optional: boolean;
        trim: boolean;
        messages: {
            string: string;
        };
    };
    startDate: {
        type: string;
        optional: boolean;
        convert: boolean;
        messages: {
            date: string;
        };
    };
    endDate: {
        type: string;
        optional: boolean;
        convert: boolean;
        messages: {
            date: string;
        };
    };
};
export declare const validatePayment: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateDiscountCode: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreateDiscountCode: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTransactionFilter: (req: Request, res: Response, next: NextFunction) => void;
export { paymentSchema, discountCodeSchema, createDiscountCodeSchema, transactionFilterSchema, };
