"use strict";
/**
 * Test Exam CRUD Controller Tests
 * تست‌های کنترلر CRUD آزمون‌های تستی
 */
Object.defineProperty(exports, "__esModule", { value: true });
const crud_1 = require("../../../controllers/test-exam/crud");
// Mock Parse
jest.mock('parse/node');
describe('TestExamCrudController', () => {
    let mockReq;
    let mockRes;
    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: { id: 'user123', role: 'admin' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should create exam successfully with valid data', async () => {
            mockReq.body = {
                title: 'Test Exam',
                description: 'Test Description',
                type: 'practice',
                configuration: {
                    totalQuestions: 20,
                    timeLimit: 60
                }
            };
            await crud_1.TestExamCrudController.create(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: expect.any(Object)
            }));
        });
        it('should return 400 for invalid data', async () => {
            mockReq.body = {
                title: '', // Invalid: empty title
                type: 'practice'
            };
            await crud_1.TestExamCrudController.create(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                statusCode: 400,
                message: 'داده‌های ورودی نامعتبر'
            }));
        });
    });
    describe('list', () => {
        it('should return paginated exam list', async () => {
            mockReq.query = {
                page: '1',
                limit: '10',
                publishedOnly: 'true'
            };
            await crud_1.TestExamCrudController.list(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: expect.objectContaining({
                    exams: expect.any(Array),
                    pagination: expect.objectContaining({
                        currentPage: 1,
                        totalPages: expect.any(Number),
                        totalCount: expect.any(Number)
                    })
                })
            }));
        });
        it('should filter by search term', async () => {
            mockReq.query = {
                search: 'mathematics',
                page: '1',
                limit: '10'
            };
            await crud_1.TestExamCrudController.list(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success'
            }));
        });
    });
    describe('getById', () => {
        it('should return exam by id for authorized user', async () => {
            mockReq.params = { id: 'exam123' };
            await crud_1.TestExamCrudController.getById(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: expect.any(Object)
            }));
        });
        it('should return 404 for non-existent exam', async () => {
            mockReq.params = { id: 'nonexistent' };
            await crud_1.TestExamCrudController.getById(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                statusCode: 404,
                message: 'آزمون یافت نشد'
            }));
        });
    });
    describe('update', () => {
        it('should update exam successfully', async () => {
            mockReq.params = { id: 'exam123' };
            mockReq.body = {
                title: 'Updated Title',
                description: 'Updated Description'
            };
            await crud_1.TestExamCrudController.update(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: expect.any(Object)
            }));
        });
        it('should return 403 for unauthorized user', async () => {
            mockReq.params = { id: 'exam123' };
            mockReq.user = { id: 'otheruser', role: 'student' };
            mockReq.body = { title: 'Hacked Title' };
            await crud_1.TestExamCrudController.update(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                statusCode: 403,
                message: 'دسترسی غیرمجاز'
            }));
        });
    });
});
//# sourceMappingURL=crud.test.js.map