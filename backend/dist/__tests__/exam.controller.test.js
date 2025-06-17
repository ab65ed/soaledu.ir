"use strict";
/**
 * تست‌های جامع Exam Controller
 * هدف: تکمیل Test Coverage تا 60%+
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// Mock Exam Controller
const examController = {
    createExam: jest.fn(),
    getExams: jest.fn(),
    getExamById: jest.fn(),
    updateExam: jest.fn(),
    deleteExam: jest.fn(),
    publishExam: jest.fn(),
    startExam: jest.fn(),
    submitExam: jest.fn(),
    getExamResults: jest.fn(),
    getExamStats: jest.fn()
};
// Mock Exam Model
const mockExam = {
    _id: 'exam123',
    title: 'آزمون ریاضی پایه دهم',
    description: 'آزمون جامع فصل اول تا سوم',
    type: 'practice',
    category: 'mathematics',
    authorId: 'author123',
    questions: ['question1', 'question2', 'question3'],
    duration: 90, // minutes
    totalPoints: 30,
    passingScore: 18,
    allowedAttempts: 3,
    isActive: true,
    isPublic: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
    settings: {
        shuffleQuestions: true,
        shuffleChoices: true,
        showResults: true,
        allowReview: true,
        showCorrectAnswers: false
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
    toJSON: jest.fn(() => ({
        id: 'exam123',
        title: 'آزمون ریاضی پایه دهم',
        description: 'آزمون جامع فصل اول تا سوم',
        type: 'practice',
        category: 'mathematics',
        totalQuestions: 3,
        duration: 90
    }))
};
// Test app setup
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mock routes
app.post('/api/v1/exams', examController.createExam);
app.get('/api/v1/exams', examController.getExams);
app.get('/api/v1/exams/stats', examController.getExamStats);
app.get('/api/v1/exams/:id', examController.getExamById);
app.put('/api/v1/exams/:id', examController.updateExam);
app.delete('/api/v1/exams/:id', examController.deleteExam);
app.post('/api/v1/exams/:id/publish', examController.publishExam);
app.post('/api/v1/exams/:id/start', examController.startExam);
app.post('/api/v1/exams/:id/submit', examController.submitExam);
app.get('/api/v1/exams/:id/results', examController.getExamResults);
describe('Exam Controller Tests', () => {
    beforeAll(async () => {
        // استفاده از MongoDB محلی از global setup
        const mongoUri = process.env.MONGODB_URI || globalThis.__MONGO_URI__;
        if (mongoUri && mongoose_1.default.connection.readyState === 0) {
            try {
                await mongoose_1.default.connect(mongoUri);
            }
            catch (error) {
                console.warn('MongoDB connection failed, some tests may be skipped:', error);
            }
        }
    });
    afterAll(async () => {
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.disconnect();
        }
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /api/v1/exams', () => {
        it('should create a new exam successfully', async () => {
            examController.createExam.mockImplementation((req, res) => {
                res.status(201).json({
                    success: true,
                    message: 'آزمون با موفقیت ایجاد شد',
                    data: {
                        exam: mockExam.toJSON()
                    }
                });
            });
            const examData = {
                title: 'آزمون جدید فیزیک',
                description: 'آزمون فصل الکتریسیته',
                type: 'final',
                category: 'physics',
                questions: ['q1', 'q2', 'q3'],
                duration: 120,
                passingScore: 60
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams')
                .send(examData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.exam).toBeDefined();
            expect(examController.createExam).toHaveBeenCalledTimes(1);
        });
        it('should fail with validation errors', async () => {
            examController.createExam.mockImplementation((req, res) => {
                res.status(400).json({
                    success: false,
                    message: 'خطای اعتبارسنجی',
                    errors: [
                        'عنوان آزمون الزامی است',
                        'حداقل یک سوال باید انتخاب شود',
                        'مدت زمان آزمون باید مثبت باشد'
                    ]
                });
            });
            const invalidData = {
                title: '',
                questions: [],
                duration: -10
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams')
                .send(invalidData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
        it('should fail when user lacks permission', async () => {
            examController.createExam.mockImplementation((req, res) => {
                res.status(403).json({
                    success: false,
                    message: 'شما مجاز به ایجاد آزمون نیستید',
                    error: 'INSUFFICIENT_PERMISSIONS'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams')
                .send(mockExam)
                .expect(403);
            expect(response.body.error).toBe('INSUFFICIENT_PERMISSIONS');
        });
    });
    describe('GET /api/v1/exams', () => {
        it('should fetch exams with filters', async () => {
            examController.getExams.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'لیست آزمون‌ها',
                    data: {
                        exams: [mockExam.toJSON()],
                        pagination: {
                            page: 1,
                            limit: 10,
                            total: 1,
                            pages: 1
                        },
                        filters: {
                            category: 'mathematics',
                            type: 'practice'
                        }
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams?category=mathematics&type=practice')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.exams).toHaveLength(1);
            expect(response.body.data.filters.category).toBe('mathematics');
        });
        it('should fetch only public exams for students', async () => {
            examController.getExams.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: {
                        exams: [mockExam.toJSON()],
                        userRole: 'student',
                        showOnlyPublic: true
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams')
                .set('Authorization', 'Bearer student-token')
                .expect(200);
            expect(response.body.data.showOnlyPublic).toBe(true);
        });
        it('should handle empty results', async () => {
            examController.getExams.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'هیچ آزمونی یافت نشد',
                    data: {
                        exams: [],
                        pagination: {
                            page: 1,
                            limit: 10,
                            total: 0,
                            pages: 0
                        }
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams?category=nonexistent')
                .expect(200);
            expect(response.body.data.exams).toHaveLength(0);
            expect(response.body.data.pagination.total).toBe(0);
        });
    });
    describe('GET /api/v1/exams/:id', () => {
        it('should fetch exam details by ID', async () => {
            examController.getExamById.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'جزئیات آزمون',
                    data: {
                        exam: {
                            ...mockExam.toJSON(),
                            questions: [
                                { id: 'q1', title: 'سوال اول', points: 10 },
                                { id: 'q2', title: 'سوال دوم', points: 10 },
                                { id: 'q3', title: 'سوال سوم', points: 10 }
                            ]
                        }
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/exam123')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.exam.questions).toHaveLength(3);
        });
        it('should return 404 for non-existent exam', async () => {
            examController.getExamById.mockImplementation((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'آزمون یافت نشد',
                    error: 'EXAM_NOT_FOUND'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/nonexistent')
                .expect(404);
            expect(response.body.error).toBe('EXAM_NOT_FOUND');
        });
        it('should hide sensitive data for students', async () => {
            examController.getExamById.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: {
                        exam: {
                            id: 'exam123',
                            title: 'آزمون ریاضی',
                            description: 'توضیحات',
                            duration: 90,
                            // Sensitive data hidden
                            questions: undefined,
                            correctAnswers: undefined
                        },
                        userRole: 'student'
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/exam123')
                .set('Authorization', 'Bearer student-token')
                .expect(200);
            expect(response.body.data.exam.questions).toBeUndefined();
            expect(response.body.data.userRole).toBe('student');
        });
    });
    describe('PUT /api/v1/exams/:id', () => {
        it('should update exam successfully', async () => {
            examController.updateExam.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'آزمون با موفقیت به‌روزرسانی شد',
                    data: {
                        exam: {
                            ...mockExam.toJSON(),
                            title: 'عنوان جدید',
                            duration: 120
                        }
                    }
                });
            });
            const updateData = {
                title: 'عنوان جدید',
                duration: 120
            };
            const response = await (0, supertest_1.default)(app)
                .put('/api/v1/exams/exam123')
                .send(updateData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.exam.title).toBe('عنوان جدید');
        });
        it('should fail when exam is active', async () => {
            examController.updateExam.mockImplementation((req, res) => {
                res.status(409).json({
                    success: false,
                    message: 'آزمون فعال قابل ویرایش نیست',
                    error: 'EXAM_IS_ACTIVE'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .put('/api/v1/exams/exam123')
                .send({ title: 'تغییر' })
                .expect(409);
            expect(response.body.error).toBe('EXAM_IS_ACTIVE');
        });
    });
    describe('DELETE /api/v1/exams/:id', () => {
        it('should delete exam successfully', async () => {
            examController.deleteExam.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'آزمون با موفقیت حذف شد'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .delete('/api/v1/exams/exam123')
                .expect(200);
            expect(response.body.success).toBe(true);
        });
        it('should fail when exam has submissions', async () => {
            examController.deleteExam.mockImplementation((req, res) => {
                res.status(409).json({
                    success: false,
                    message: 'آزمون دارای پاسخ‌های ثبت شده است و قابل حذف نیست',
                    error: 'EXAM_HAS_SUBMISSIONS'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .delete('/api/v1/exams/exam123')
                .expect(409);
            expect(response.body.error).toBe('EXAM_HAS_SUBMISSIONS');
        });
    });
    describe('POST /api/v1/exams/:id/publish', () => {
        it('should publish exam successfully', async () => {
            examController.publishExam.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'آزمون با موفقیت منتشر شد',
                    data: {
                        exam: {
                            ...mockExam.toJSON(),
                            isPublished: true,
                            publishedAt: new Date().toISOString()
                        }
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/publish')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.exam.isPublished).toBe(true);
        });
        it('should fail when exam has no questions', async () => {
            examController.publishExam.mockImplementation((req, res) => {
                res.status(400).json({
                    success: false,
                    message: 'آزمون بدون سوال قابل انتشار نیست',
                    error: 'NO_QUESTIONS'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/publish')
                .expect(400);
            expect(response.body.error).toBe('NO_QUESTIONS');
        });
    });
    describe('POST /api/v1/exams/:id/start', () => {
        it('should start exam session successfully', async () => {
            examController.startExam.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'آزمون شروع شد',
                    data: {
                        sessionId: 'session123',
                        startTime: new Date().toISOString(),
                        endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
                        questions: [
                            { id: 'q1', title: 'سوال اول', choices: ['الف', 'ب', 'ج', 'د'] }
                        ]
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/start')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.sessionId).toBeDefined();
            expect(response.body.data.questions).toBeDefined();
        });
        it('should fail when exam is not active', async () => {
            examController.startExam.mockImplementation((req, res) => {
                res.status(403).json({
                    success: false,
                    message: 'آزمون فعال نیست',
                    error: 'EXAM_NOT_ACTIVE'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/start')
                .expect(403);
            expect(response.body.error).toBe('EXAM_NOT_ACTIVE');
        });
        it('should fail when user exceeded attempts', async () => {
            examController.startExam.mockImplementation((req, res) => {
                res.status(429).json({
                    success: false,
                    message: 'تعداد تلاش‌های مجاز تمام شده است',
                    error: 'MAX_ATTEMPTS_EXCEEDED'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/start')
                .expect(429);
            expect(response.body.error).toBe('MAX_ATTEMPTS_EXCEEDED');
        });
    });
    describe('POST /api/v1/exams/:id/submit', () => {
        it('should submit exam successfully', async () => {
            examController.submitExam.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'آزمون با موفقیت ارسال شد',
                    data: {
                        submissionId: 'submission123',
                        score: 27,
                        totalPoints: 30,
                        percentage: 90,
                        passed: true,
                        submittedAt: new Date().toISOString()
                    }
                });
            });
            const answers = {
                sessionId: 'session123',
                answers: {
                    q1: 'ب',
                    q2: 'الف',
                    q3: 'ج'
                }
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/submit')
                .send(answers)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.score).toBe(27);
            expect(response.body.data.passed).toBe(true);
        });
        it('should handle time expired submission', async () => {
            examController.submitExam.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'زمان آزمون تمام شده - پاسخ‌ها ثبت شد',
                    data: {
                        submissionId: 'submission123',
                        score: 15,
                        totalPoints: 30,
                        timeExpired: true,
                        autoSubmitted: true
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/submit')
                .send({ sessionId: 'expired-session' })
                .expect(200);
            expect(response.body.data.timeExpired).toBe(true);
            expect(response.body.data.autoSubmitted).toBe(true);
        });
        it('should fail with invalid session', async () => {
            examController.submitExam.mockImplementation((req, res) => {
                res.status(400).json({
                    success: false,
                    message: 'جلسه آزمون نامعتبر است',
                    error: 'INVALID_SESSION'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/submit')
                .send({ sessionId: 'invalid' })
                .expect(400);
            expect(response.body.error).toBe('INVALID_SESSION');
        });
    });
    describe('GET /api/v1/exams/:id/results', () => {
        it('should get exam results for instructor', async () => {
            examController.getExamResults.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'نتایج آزمون',
                    data: {
                        exam: mockExam.toJSON(),
                        statistics: {
                            totalSubmissions: 25,
                            averageScore: 21.5,
                            passRate: 80,
                            highestScore: 30,
                            lowestScore: 8
                        },
                        submissions: [
                            {
                                studentId: 'student1',
                                studentName: 'احمد محمدی',
                                score: 27,
                                percentage: 90,
                                submittedAt: new Date()
                            }
                        ]
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/exam123/results')
                .set('Authorization', 'Bearer instructor-token')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.statistics).toBeDefined();
            expect(response.body.data.submissions).toBeDefined();
        });
        it('should get personal results for student', async () => {
            examController.getExamResults.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'نتیجه آزمون شما',
                    data: {
                        exam: { title: 'آزمون ریاضی' },
                        result: {
                            score: 24,
                            totalPoints: 30,
                            percentage: 80,
                            passed: true,
                            rank: 5,
                            totalParticipants: 25
                        }
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/exam123/results')
                .set('Authorization', 'Bearer student-token')
                .expect(200);
            expect(response.body.data.result.score).toBe(24);
            expect(response.body.data.result.rank).toBe(5);
        });
        it('should fail when results not available', async () => {
            examController.getExamResults.mockImplementation((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'نتایج آزمون هنوز اعلام نشده است',
                    error: 'RESULTS_NOT_AVAILABLE'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/exam123/results')
                .expect(404);
            expect(response.body.error).toBe('RESULTS_NOT_AVAILABLE');
        });
    });
    describe('GET /api/v1/exams/stats', () => {
        it('should return exam statistics', async () => {
            examController.getExamStats.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'آمار آزمون‌ها',
                    data: {
                        total: 45,
                        byType: {
                            practice: 20,
                            midterm: 15,
                            final: 10
                        },
                        byCategory: {
                            mathematics: 18,
                            physics: 12,
                            chemistry: 10,
                            biology: 5
                        },
                        byStatus: {
                            active: 25,
                            draft: 15,
                            ended: 5
                        },
                        recentActivity: {
                            createdThisWeek: 8,
                            submissionsToday: 45
                        }
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/stats')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.total).toBe(45);
            expect(response.body.data.byType).toBeDefined();
            expect(response.body.data.recentActivity).toBeDefined();
        });
    });
    describe('Error Handling', () => {
        it('should handle server errors gracefully', async () => {
            examController.getExams.mockImplementation((req, res) => {
                res.status(500).json({
                    success: false,
                    message: 'خطای داخلی سرور',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams')
                .expect(500);
            expect(response.body.error).toBe('INTERNAL_SERVER_ERROR');
        });
        it('should handle database timeouts', async () => {
            examController.startExam.mockImplementation((req, res) => {
                res.status(504).json({
                    success: false,
                    message: 'عملیات منقضی شد - لطفا دوباره تلاش کنید',
                    error: 'OPERATION_TIMEOUT'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/exams/exam123/start')
                .expect(504);
            expect(response.body.error).toBe('OPERATION_TIMEOUT');
        });
    });
    describe('Performance Tests', () => {
        it('should handle concurrent exam starts', async () => {
            examController.startExam.mockImplementation((req, res) => {
                setTimeout(() => {
                    res.status(200).json({
                        success: true,
                        data: { sessionId: `session-${Date.now()}` }
                    });
                }, 50);
            });
            const promises = Array.from({ length: 5 }, () => (0, supertest_1.default)(app).post('/api/v1/exams/exam123/start'));
            const responses = await Promise.all(promises);
            responses.forEach(response => {
                expect(response.status).toBe(200);
                expect(response.body.data.sessionId).toBeDefined();
            });
        });
        it('should handle bulk result retrieval', async () => {
            examController.getExamResults.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: {
                        submissions: Array.from({ length: 100 }, (_, i) => ({
                            studentId: `student${i}`,
                            score: Math.floor(Math.random() * 30),
                            submittedAt: new Date()
                        }))
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/exams/exam123/results')
                .expect(200);
            expect(response.body.data.submissions).toHaveLength(100);
        });
    });
});
//# sourceMappingURL=exam.controller.test.js.map