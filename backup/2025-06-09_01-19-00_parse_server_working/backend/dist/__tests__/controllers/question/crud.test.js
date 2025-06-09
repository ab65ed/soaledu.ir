"use strict";
/**
 * Question CRUD Controller Tests
 * تست‌های کنترلر CRUD سوالات
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const questionCrud = __importStar(require("../../../controllers/question/crud"));
// Mock response object
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
// Mock authenticated request
const createMockRequest = (overrides = {}) => {
    return {
        user: { id: 'test-user-id', role: 'teacher', permissions: [] },
        params: {},
        query: {},
        body: {},
        ...overrides
    };
};
describe('Question CRUD Controller', () => {
    describe('getAllQuestions', () => {
        it('should return success response', async () => {
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
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
            const mockRes = createMockResponse();
            await questionCrud.getPublishedQuestions(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'سوالات منتشر شده دریافت شد'
            });
        });
    });
});
//# sourceMappingURL=crud.test.js.map