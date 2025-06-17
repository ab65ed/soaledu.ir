import { Request, Response } from "express";
export declare const getBlogPosts: (req: Request, res: Response) => Promise<void>;
export declare const getBlogPost: (req: Request, res: Response) => Promise<void>;
export declare const createBlogPost: (req: Request, res: Response) => Promise<void>;
export declare const getBlogCategories: (req: Request, res: Response) => Promise<void>;
export declare const createBlogCategory: (req: Request, res: Response) => Promise<void>;
