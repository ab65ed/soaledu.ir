/**
 * Question Controllers Index
 * صادرات تمام کنترلرهای سوالات
 */
export * from './types';
export declare const getAllQuestions: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, getQuestionById: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, createQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, updateQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, deleteQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, duplicateQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, autoSaveQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, publishQuestionsToTestExam: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, getCourseExamQuestionStats: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, linkQuestionToCourseExam: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>, getPublishedQuestions: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
export declare class QuestionController {
    static getAllQuestions: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static getQuestionById: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static createQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static updateQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static deleteQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static duplicateQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static autoSaveQuestion: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static publishQuestionsToTestExam: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static getCourseExamQuestionStats: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static linkQuestionToCourseExam: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
    static getPublishedQuestions: (req: import("./types").AuthenticatedRequest, res: import("express").Response) => Promise<void>;
}
