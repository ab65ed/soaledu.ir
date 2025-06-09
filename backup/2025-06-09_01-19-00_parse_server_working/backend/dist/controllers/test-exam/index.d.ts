/**
 * Test Exam Controllers Index
 * صادرات تمام کنترلرهای آزمون‌های تستی
 */
export * from './types';
export { TestExamCrudController } from './crud';
import { TestExamCrudController } from './crud';
export declare class TestExamController {
    static create: typeof TestExamCrudController.create;
    static list: typeof TestExamCrudController.list;
    static getById: typeof TestExamCrudController.getById;
    static update: typeof TestExamCrudController.update;
    static generateQuestions(req: any, res: any): Promise<void>;
    static startExam(req: any, res: any): Promise<void>;
    static submitAnswer(req: any, res: any): Promise<void>;
    static finishExam(req: any, res: any): Promise<void>;
    static getResults(req: any, res: any): Promise<void>;
}
