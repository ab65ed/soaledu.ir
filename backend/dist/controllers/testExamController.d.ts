import { Request, Response } from "express";
export declare const getTestExams: (req: Request, res: Response) => Promise<void>;
export declare const createTestExam: (req: Request, res: Response) => Promise<void>;
export declare const getTestExamById: (req: Request, res: Response) => Promise<void>;
export declare const startTestExam: (req: Request, res: Response) => Promise<void>;
export declare const submitAnswer: (req: Request, res: Response) => Promise<void>;
export declare const finishTestExam: (req: Request, res: Response) => Promise<void>;
export declare const getTestExamResults: (req: Request, res: Response) => Promise<void>;
