/**
 * Validation utilities
 *
 * This file exports a validation middleware factory and common validation schemas.
 */
import { Request, Response, NextFunction } from 'express';
type ValidationSchema = Record<string, any>;
/**
 * Create validation middleware
 * @param schema - Validation schema
 * @param source - Source of data to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
declare const validate: (schema: ValidationSchema, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
declare const schemas: {
    readonly register: {
        readonly name: {
            readonly type: "string";
            readonly min: 2;
            readonly max: 50;
        };
        readonly email: {
            readonly type: "email";
        };
        readonly password: {
            readonly type: "string";
            readonly min: 6;
        };
    };
    readonly login: {
        readonly email: {
            readonly type: "email";
        };
        readonly password: {
            readonly type: "string";
            readonly min: 6;
        };
    };
    readonly updateProfile: {
        readonly name: {
            readonly type: "string";
            readonly min: 2;
            readonly max: 50;
            readonly optional: true;
        };
        readonly educationalGroup: {
            readonly type: "string";
            readonly optional: true;
        };
    };
    readonly createExamConfig: {
        readonly category: {
            readonly type: "string";
        };
        readonly lesson: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly hasNegativeMarking: {
            readonly type: "boolean";
            readonly optional: true;
        };
        readonly timerOption: {
            readonly type: "enum";
            readonly values: readonly ["50s", "70s", "none"];
            readonly optional: true;
        };
    };
    readonly submitAnswer: {
        readonly questionId: {
            readonly type: "string";
        };
        readonly selectedOption: {
            readonly type: "number";
            readonly integer: true;
            readonly min: 0;
        };
    };
    readonly createTicket: {
        readonly subject: {
            readonly type: "string";
            readonly min: 3;
            readonly max: 100;
        };
        readonly message: {
            readonly type: "string";
            readonly min: 10;
        };
        readonly priority: {
            readonly type: "enum";
            readonly values: readonly ["low", "medium", "high"];
            readonly optional: true;
        };
    };
    readonly addTicketResponse: {
        readonly message: {
            readonly type: "string";
            readonly min: 1;
        };
    };
    readonly createPayment: {
        readonly amount: {
            readonly type: "number";
            readonly positive: true;
        };
        readonly paymentMethod: {
            readonly type: "enum";
            readonly values: readonly ["credit-card", "paypal", "bank-transfer", "other"];
        };
        readonly packageName: {
            readonly type: "string";
            readonly optional: true;
        };
    };
    readonly createBlogPost: {
        readonly title: {
            readonly type: "string";
            readonly min: 3;
            readonly max: 200;
        };
        readonly content: {
            readonly type: "string";
            readonly min: 10;
        };
        readonly category: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly coverImage: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly tags: {
            readonly type: "array";
            readonly items: "string";
            readonly optional: true;
        };
        readonly metaTitle: {
            readonly type: "string";
            readonly max: 100;
            readonly optional: true;
        };
        readonly metaDescription: {
            readonly type: "string";
            readonly max: 200;
            readonly optional: true;
        };
        readonly status: {
            readonly type: "enum";
            readonly values: readonly ["draft", "published", "archived"];
            readonly optional: true;
        };
    };
};
/**
 * Alternative name for validate function for backward compatibility
 */
export declare const validateRequest: (schema: ValidationSchema, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
export { validate, schemas, };
