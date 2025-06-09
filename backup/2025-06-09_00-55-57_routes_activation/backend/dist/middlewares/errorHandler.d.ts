/**
 * Error handling middleware
 *
 * This middleware catches and formats errors for consistent API responses.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Custom error class for API errors
 */
export declare class ApiError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
/**
 * Error handler middleware
 */
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
