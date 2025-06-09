/**
 * Enterprise Security Middleware
 * Comprehensive protection against common attacks and vulnerabilities
 */
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
export declare const securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const corsMiddleware: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
export declare const generalRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const registerRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const passwordResetRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const mongoSanitizeMiddleware: import("express").Handler;
export declare const hppMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const requestId: (req: Request, res: Response, next: NextFunction) => void;
export declare const honeypotCheck: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const timingCheck: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
export declare const securityLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateContentType: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const applySecurity: (app: any) => void;
declare const _default: {
    applySecurity: (app: any) => void;
    securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
    corsMiddleware: (req: cors.CorsRequest, res: {
        statusCode?: number | undefined;
        setHeader(key: string, value: string): any;
        end(): any;
    }, next: (err?: any) => any) => void;
    generalRateLimit: import("express-rate-limit").RateLimitRequestHandler;
    authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
    registerRateLimit: import("express-rate-limit").RateLimitRequestHandler;
    passwordResetRateLimit: import("express-rate-limit").RateLimitRequestHandler;
    handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
    honeypotCheck: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    timingCheck: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    requestId: (req: Request, res: Response, next: NextFunction) => void;
    securityLogger: (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
