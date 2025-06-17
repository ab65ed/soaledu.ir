"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
describe('Test Exam Controller Tests', () => {
    describe('GET /api/v1/test-exams/', () => {
        it('should get list of test exams successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/test-exams/')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
    });
    describe('POST /api/v1/test-exams/', () => {
        it('should create test exam successfully', async () => {
            const testExamData = {
                title: 'آزمون تستی نمونه',
                description: 'توضیحات آزمون تستی'
            };
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/v1/test-exams/')
                .send(testExamData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
    });
    describe('GET /api/v1/test-exams/:id', () => {
        it('should get test exam by ID successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/test-exams/test-id')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
        });
    });
    describe('POST /api/v1/test-exams/:id/start', () => {
        it('should start test exam successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/v1/test-exams/test-id/start')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
    });
    describe('POST /api/v1/test-exams/:id/submit-answer', () => {
        it('should submit answer successfully', async () => {
            const answerData = {
                questionId: 'q1',
                answer: 'A'
            };
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/v1/test-exams/test-id/submit-answer')
                .send(answerData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
    });
    describe('POST /api/v1/test-exams/:id/finish', () => {
        it('should finish test exam successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/v1/test-exams/test-id/finish')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
    });
    describe('GET /api/v1/test-exams/:id/results', () => {
        it('should get test exam results successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/test-exams/test-id/results')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
        });
    });
    describe('Error Handling', () => {
        it('should handle server errors gracefully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/test-exams/nonexistent/invalid')
                .expect(404);
        });
    });
});
//# sourceMappingURL=testExam.controller.test.js.map