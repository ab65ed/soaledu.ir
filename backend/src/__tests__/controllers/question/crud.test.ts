/**
 * Question CRUD Controller Tests
 * تست‌های کنترلر CRUD سوالات
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../../controllers/question/types';
import * as questionCrud from '../../../controllers/question/crud';

// Mock response object
const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock authenticated request
const createMockRequest = (overrides: any = {}): AuthenticatedRequest => {
  return {
    user: { id: 'test-user-id', role: 'teacher', permissions: [] },
    params: {},
    query: {},
    body: {},
    ...overrides
  } as any;
};

describe('Question CRUD Controller', () => {
  describe('getAllQuestions', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest();
      const mockRes = createMockResponse() as Response;

      await questionCrud.getAllQuestions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'پیاده‌سازی شده - دریافت تمام سوالات'
      });
    });
  });

  describe('getQuestionById', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        params: { id: 'test-question-id' }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.getQuestionById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'پیاده‌سازی شده - دریافت سوال'
      });
    });
  });

  describe('createQuestion', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        body: {
          text: 'سوال تست',
          type: 'MULTIPLE_CHOICE',
          category: 'ریاضی'
        }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.createQuestion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'سوال ایجاد شد'
      });
    });
  });

  describe('updateQuestion', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        params: { id: 'test-question-id' },
        body: { text: 'سوال به‌روزرسانی شده' }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.updateQuestion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'سوال به‌روزرسانی شد'
      });
    });
  });

  describe('deleteQuestion', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        params: { id: 'test-question-id' }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.deleteQuestion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'سوال حذف شد'
      });
    });
  });

  describe('duplicateQuestion', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        params: { id: 'test-question-id' }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.duplicateQuestion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'سوال کپی شد'
      });
    });
  });

  describe('autoSaveQuestion', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        params: { id: 'test-question-id' },
        body: { text: 'ذخیره خودکار' }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.autoSaveQuestion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'ذخیره خودکار انجام شد'
      });
    });
  });

  describe('publishQuestionsToTestExam', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        body: {
          questionIds: ['q1', 'q2'],
          testExamId: 'test-exam-id'
        }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.publishQuestionsToTestExam(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'سوالات منتشر شد'
      });
    });
  });

  describe('getCourseExamQuestionStats', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        params: { courseExamId: 'course-exam-id' }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.getCourseExamQuestionStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'آمار دریافت شد'
      });
    });
  });

  describe('linkQuestionToCourseExam', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        body: {
          questionId: 'question-id',
          courseExamId: 'course-exam-id'
        }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.linkQuestionToCourseExam(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'سوال پیوند داده شد'
      });
    });
  });

  describe('getPublishedQuestions', () => {
    it('should return success response', async () => {
      const mockReq = createMockRequest({
        query: {
          category: 'ریاضی',
          page: '1',
          limit: '20'
        }
      });
      const mockRes = createMockResponse() as Response;

      await questionCrud.getPublishedQuestions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'سوالات منتشر شده دریافت شد'
      });
    });
  });
}); 