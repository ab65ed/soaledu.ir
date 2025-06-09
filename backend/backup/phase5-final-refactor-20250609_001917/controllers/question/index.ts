/**
 * Question Controllers Index
 * صادرات تمام کنترلرهای سوالات
 */

// Export types and schemas
export * from './types';

// Legacy compatibility - export as QuestionController
export class QuestionController {
  // TODO: Implement all methods after creating modular files
  static async getAllQuestions(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async getQuestionById(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async createQuestion(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async updateQuestion(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async deleteQuestion(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async duplicateQuestion(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async autoSaveQuestion(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async publishQuestionsToTestExam(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async getCourseExamQuestionStats(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async linkQuestionToCourseExam(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async getPublishedQuestions(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }
} 