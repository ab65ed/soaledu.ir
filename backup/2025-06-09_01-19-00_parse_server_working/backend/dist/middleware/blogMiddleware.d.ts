import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../types';
export declare const validateBlogPostData: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const validateCommentData: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const canModerateComments: (req: RequestWithUser, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const setBlogCacheHeaders: (req: Request, res: Response, next: NextFunction) => void;
export declare const commentRateLimit: (req: RequestWithUser, res: Response, next: NextFunction) => void;
