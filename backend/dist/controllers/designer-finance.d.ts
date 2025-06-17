import { Request, Response } from 'express';
import Parse from 'parse/node';
interface AuthenticatedRequest extends Request {
    user?: Parse.User;
    userId?: string;
}
export declare const getWallet: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const recordDesignerEarning: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const requestWithdrawal: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getWithdrawals: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getTransactions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getFinancialReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getNotificationSettings: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateNotificationSettings: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getDashboardStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const approveWithdrawal: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export {};
