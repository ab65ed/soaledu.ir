/**
 * Question Controllers Index
 * صادرات تمام کنترلرهای سوالات
 */

// Export types and schemas
export * from './types';

// Import CRUD operations
import * as crud from './crud';

// Export individual functions for backward compatibility
export const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  autoSaveQuestion,
  publishQuestionsToTestExam,
  getCourseExamQuestionStats,
  linkQuestionToCourseExam,
  getPublishedQuestions
} = crud;

// Legacy compatibility - export as QuestionController
export class QuestionController {
  static getAllQuestions = crud.getAllQuestions;
  static getQuestionById = crud.getQuestionById;
  static createQuestion = crud.createQuestion;
  static updateQuestion = crud.updateQuestion;
  static deleteQuestion = crud.deleteQuestion;
  static duplicateQuestion = crud.duplicateQuestion;
  static autoSaveQuestion = crud.autoSaveQuestion;
  static publishQuestionsToTestExam = crud.publishQuestionsToTestExam;
  static getCourseExamQuestionStats = crud.getCourseExamQuestionStats;
  static linkQuestionToCourseExam = crud.linkQuestionToCourseExam;
  static getPublishedQuestions = crud.getPublishedQuestions;
} 