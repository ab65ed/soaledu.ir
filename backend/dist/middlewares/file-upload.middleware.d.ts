/**
 * File Upload Security Middleware
 * اعتبارسنجی و امنیت فایل‌های آپلود شده
 */
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
export declare const uploadMiddleware: multer.Multer;
export declare const validateImageDimensions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const scanFileForMalware: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const handleUploadError: (error: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
