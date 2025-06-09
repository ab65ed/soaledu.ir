/**
 * A/B Test Controller
 *
 * Handles A/B test operations including creation, management, participant assignment, and analytics
 */
import { Request, Response } from 'express';
import { RequestWithUser } from '../types/index';
/**
 * دریافت لیست تست‌های A/B
 */
export declare const getABTests: (req: RequestWithUser, res: Response) => Promise<void>;
/**
 * ایجاد تست A/B جدید
 */
export declare const createABTest: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * دریافت تست A/B بر اساس ID
 */
export declare const getABTestById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * شروع تست A/B
 */
export declare const startABTest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * متوقف کردن تست A/B
 */
export declare const pauseABTest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * پایان تست A/B
 */
export declare const stopABTest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * اختصاص کاربر به variant
 * با پشتیبانی از course-exam و questions
 */
export declare const assignUserToVariant: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * ثبت conversion
 * با پشتیبانی از course-exam و question interactions
 */
export declare const recordConversion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * دریافت نتایج تست A/B
 */
export declare const getABTestResults: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * دریافت تحلیل‌های تست A/B
 */
export declare const getABTestAnalytics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * بروزرسانی تست A/B
 */
export declare const updateABTest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * حذف تست A/B
 */
export declare const deleteABTest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
