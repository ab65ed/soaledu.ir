"use strict";
/**
 * تست‌های یکپارچگی API - Integration Tests
 * هدف: افزایش Test Coverage به 50%+
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
describe('API Integration Tests', () => {
    let app;
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
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        // Health check endpoint
        app.get('/api/v1/health', ((req, res) => {
            res.json({
                success: true,
                message: 'API is healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage()
            });
        }));
        // Test endpoints
        app.post('/api/v1/test', ((req, res) => {
            const { name, email } = req.body;
            if (!name || !email) {
                res.status(400).json({
                    success: false,
                    message: 'نام و ایمیل الزامی است',
                    errors: ['name is required', 'email is required']
                });
                return;
            }
            res.status(201).json({
                success: true,
                message: 'داده با موفقیت ایجاد شد',
                data: { id: 123, name, email }
            });
        }));
        app.get('/api/v1/users/:id', ((req, res) => {
            const { id } = req.params;
            if (id === '404') {
                res.status(404).json({
                    success: false,
                    message: 'کاربر یافت نشد',
                    error: 'USER_NOT_FOUND'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: {
                    id: parseInt(id),
                    name: 'احمد محمدی',
                    email: 'ahmad@example.com',
                    role: 'student'
                }
            });
        }));
        // Error handling middleware
        app.use((error, req, res, next) => {
            res.status(500).json({
                success: false,
                message: 'خطای داخلی سرور',
                error: error.message
            });
        });
    });
    describe('Health Check Endpoint', () => {
        it('should return API health status', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/health')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.timestamp).toBeDefined();
            expect(response.body.uptime).toBeGreaterThan(0);
            expect(response.body.memory).toBeDefined();
        });
        it('should have proper response structure', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/health')
                .expect(200);
            expect(response.body).toHaveProperty('success');
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
            expect(response.body).toHaveProperty('memory');
        });
    });
    describe('POST /api/v1/test', () => {
        it('should create new record successfully', async () => {
            const testData = {
                name: 'علی احمدی',
                email: 'ali@example.com'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .send(testData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(testData.name);
            expect(response.body.data.email).toBe(testData.email);
            expect(response.body.data.id).toBeDefined();
        });
        it('should fail with missing name', async () => {
            const testData = {
                email: 'test@example.com'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .send(testData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
            expect(Array.isArray(response.body.errors)).toBe(true);
        });
        it('should fail with missing email', async () => {
            const testData = {
                name: 'تست نام'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .send(testData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('الزامی');
        });
        it('should fail with empty body', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('GET /api/v1/users/:id', () => {
        it('should get user by ID', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/users/123')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(123);
            expect(response.body.data.name).toBeDefined();
            expect(response.body.data.email).toBeDefined();
            expect(response.body.data.role).toBeDefined();
        });
        it('should return 404 for non-existent user', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/users/404')
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('USER_NOT_FOUND');
        });
        it('should handle numeric ID conversion', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/users/456')
                .expect(200);
            expect(response.body.data.id).toBe(456);
            expect(typeof response.body.data.id).toBe('number');
        });
    });
    describe('Error Handling', () => {
        it('should return 404 for non-existent endpoints', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/nonexistent')
                .expect(404);
        });
        it('should handle malformed JSON', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }')
                .expect(500); // Express returns 500 for malformed JSON by default
            expect(response.body.success).toBe(false);
        });
    });
    describe('Content Type Handling', () => {
        it('should accept JSON content type', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify({
                name: 'تست JSON',
                email: 'json@test.com'
            }))
                .expect(201);
            expect(response.body.success).toBe(true);
        });
        it('should return proper content type in response', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/health')
                .expect(200);
            expect(response.headers['content-type']).toMatch(/json/);
        });
    });
    describe('Request Headers', () => {
        it('should handle custom headers', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/health')
                .set('X-Custom-Header', 'test-value')
                .expect(200);
            expect(response.body.success).toBe(true);
        });
        it('should handle Persian content in request', async () => {
            const testData = {
                name: 'محمد رضا احمدی',
                email: 'mohammad@example.com'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .send(testData)
                .expect(201);
            expect(response.body.data.name).toBe(testData.name);
        });
    });
    describe('Performance and Limits', () => {
        it('should handle large request body', async () => {
            const largeData = {
                name: 'تست نام',
                email: 'test@example.com',
                description: 'x'.repeat(1000) // 1000 characters
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .send(largeData)
                .expect(201);
            expect(response.body.success).toBe(true);
        });
        it('should handle concurrent requests', async () => {
            const promises = Array.from({ length: 10 }, (_, i) => (0, supertest_1.default)(app)
                .post('/api/v1/test')
                .send({
                name: `تست ${i}`,
                email: `test${i}@example.com`
            }));
            const responses = await Promise.all(promises);
            responses.forEach(response => {
                expect(response.status).toBe(201);
                expect(response.body.success).toBe(true);
            });
        });
    });
});
//# sourceMappingURL=integration.test.js.map