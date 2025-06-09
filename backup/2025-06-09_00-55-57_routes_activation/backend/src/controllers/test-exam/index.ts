/**
 * Test Exam Controllers Index
 * صادرات تمام کنترلرهای آزمون‌های تستی
 */

// Export types and constants
export * from './types';

// Export controllers
export { TestExamCrudController } from './crud';

// Legacy compatibility - export as TestExamController
import { TestExamCrudController } from './crud';

export class TestExamController {
  // CRUD methods
  static create = TestExamCrudController.create;
  static list = TestExamCrudController.list;
  static getById = TestExamCrudController.getById;
  static update = TestExamCrudController.update;

  // Note: Session and results methods will be added after creating those modules
  static async generateQuestions(req: any, res: any): Promise<void> {
    // TODO: Implement after creating question management module
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async startExam(req: any, res: any): Promise<void> {
    // TODO: Implement after creating session module
    res.status(501).json({
      status: 'error', 
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async submitAnswer(req: any, res: any): Promise<void> {
    // TODO: Implement after creating session module
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async finishExam(req: any, res: any): Promise<void> {
    // TODO: Implement after creating session module
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async getResults(req: any, res: any): Promise<void> {
    // TODO: Implement after creating results module
    res.status(501).json({
      status: 'error',
      statusCode: 501, 
      message: 'این قابلیت در حال توسعه است'
    });
  }
} 