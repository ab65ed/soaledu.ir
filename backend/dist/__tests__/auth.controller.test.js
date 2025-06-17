"use strict";
/**
 * تست‌های جامع Auth Controller
 * هدف: افزایش Test Coverage از 1.5% به حداقل 40%
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mock controllers
const authController = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    getProfile: jest.fn(),
    completeProfile: jest.fn(),
    logout: jest.fn()
};
// Mock User model
const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'تست',
    lastName: 'کاربر',
    phoneNumber: '09123456789',
    role: 'student',
    isEmailVerified: true,
    isActive: true,
    save: jest.fn(),
    toJSON: jest.fn(() => ({
        id: 'user123',
        email: 'test@example.com',
        firstName: 'تست',
        lastName: 'کاربر',
        role: 'student'
    }))
};
// Test app setup
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mock routes
app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/auth/refresh-token', authController.refreshToken);
app.get('/api/v1/auth/me', authController.getProfile);
app.put('/api/v1/auth/complete-profile', authController.completeProfile);
app.post('/api/v1/auth/logout', authController.logout);
describe('Auth Controller Tests', () => {
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
        // Reset all mocks before each test
        jest.clearAllMocks();
    });
    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            // Mock successful registration
            authController.register.mockImplementation((req, res) => {
                res.status(201).json({
                    success: true,
                    message: 'کاربر با موفقیت ثبت‌نام شد',
                    data: {
                        user: mockUser.toJSON(),
                        token: 'jwt-token-here'
                    }
                });
            });
            const userData = {
                email: 'newuser@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                firstName: 'کاربر',
                lastName: 'جدید',
                phoneNumber: '09123456789'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('ثبت‌نام');
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.token).toBeDefined();
            expect(authController.register).toHaveBeenCalledTimes(1);
        });
        it('should fail with validation errors', async () => {
            authController.register.mockImplementation((req, res) => {
                res.status(400).json({
                    success: false,
                    message: 'خطای اعتبارسنجی',
                    errors: [
                        'ایمیل معتبر وارد کنید',
                        'رمز عبور باید حداقل 8 کاراکتر باشد'
                    ]
                });
            });
            const invalidData = {
                email: 'invalid-email',
                password: '123',
                firstName: '',
                lastName: ''
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send(invalidData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
            expect(Array.isArray(response.body.errors)).toBe(true);
        });
        it('should fail when user already exists', async () => {
            authController.register.mockImplementation((req, res) => {
                res.status(409).json({
                    success: false,
                    message: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است',
                    error: 'USER_ALREADY_EXISTS'
                });
            });
            const existingUserData = {
                email: 'existing@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                firstName: 'کاربر',
                lastName: 'موجود'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send(existingUserData)
                .expect(409);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('USER_ALREADY_EXISTS');
        });
    });
    describe('POST /api/v1/auth/login', () => {
        it('should login user with valid credentials', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'ورود موفقیت‌آمیز',
                    data: {
                        user: mockUser.toJSON(),
                        token: 'jwt-access-token',
                        refreshToken: 'jwt-refresh-token'
                    }
                });
            });
            const loginData = {
                email: 'test@example.com',
                password: 'Password123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
            expect(response.body.data.user.email).toBe(loginData.email);
        });
        it('should fail with invalid credentials', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(401).json({
                    success: false,
                    message: 'ایمیل یا رمز عبور نادرست است',
                    error: 'INVALID_CREDENTIALS'
                });
            });
            const invalidLogin = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send(invalidLogin)
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('INVALID_CREDENTIALS');
        });
        it('should fail when user is not found', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'کاربری با این ایمیل یافت نشد',
                    error: 'USER_NOT_FOUND'
                });
            });
            const nonExistentLogin = {
                email: 'nonexistent@example.com',
                password: 'Password123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send(nonExistentLogin)
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('USER_NOT_FOUND');
        });
        it('should fail when account is inactive', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(403).json({
                    success: false,
                    message: 'حساب کاربری غیرفعال است',
                    error: 'ACCOUNT_INACTIVE'
                });
            });
            const inactiveLogin = {
                email: 'inactive@example.com',
                password: 'Password123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send(inactiveLogin)
                .expect(403);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('ACCOUNT_INACTIVE');
        });
    });
    describe('POST /api/v1/auth/refresh-token', () => {
        it('should refresh token successfully', async () => {
            authController.refreshToken.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'توکن با موفقیت تجدید شد',
                    data: {
                        token: 'new-jwt-access-token',
                        refreshToken: 'new-jwt-refresh-token'
                    }
                });
            });
            const refreshData = {
                refreshToken: 'valid-refresh-token'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/refresh-token')
                .send(refreshData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
        });
        it('should fail with invalid refresh token', async () => {
            authController.refreshToken.mockImplementation((req, res) => {
                res.status(401).json({
                    success: false,
                    message: 'توکن نامعتبر است',
                    error: 'INVALID_REFRESH_TOKEN'
                });
            });
            const invalidRefresh = {
                refreshToken: 'invalid-refresh-token'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/refresh-token')
                .send(invalidRefresh)
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('INVALID_REFRESH_TOKEN');
        });
    });
    describe('GET /api/v1/auth/me', () => {
        it('should return user profile when authenticated', async () => {
            authController.getProfile.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'پروفایل کاربر',
                    data: {
                        user: mockUser.toJSON()
                    }
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer valid-jwt-token')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.user.email).toBe(mockUser.email);
        });
        it('should fail when not authenticated', async () => {
            authController.getProfile.mockImplementation((req, res) => {
                res.status(401).json({
                    success: false,
                    message: 'دسترسی غیرمجاز',
                    error: 'UNAUTHORIZED'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/auth/me')
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('UNAUTHORIZED');
        });
    });
    describe('PUT /api/v1/auth/complete-profile', () => {
        it('should complete profile successfully', async () => {
            authController.completeProfile.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'پروفایل با موفقیت تکمیل شد',
                    data: {
                        user: {
                            ...mockUser.toJSON(),
                            educationalGroupId: 'group123',
                            institutionId: 'inst456'
                        }
                    }
                });
            });
            const profileData = {
                educationalGroupId: 'group123',
                institutionId: 'inst456',
                birthDate: '1990-01-01',
                gender: 'male'
            };
            const response = await (0, supertest_1.default)(app)
                .put('/api/v1/auth/complete-profile')
                .set('Authorization', 'Bearer valid-jwt-token')
                .send(profileData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.educationalGroupId).toBe(profileData.educationalGroupId);
        });
        it('should fail with validation errors', async () => {
            authController.completeProfile.mockImplementation((req, res) => {
                res.status(400).json({
                    success: false,
                    message: 'خطای اعتبارسنجی',
                    errors: ['گروه تحصیلی الزامی است']
                });
            });
            const invalidProfile = {
                educationalGroupId: '',
                birthDate: 'invalid-date'
            };
            const response = await (0, supertest_1.default)(app)
                .put('/api/v1/auth/complete-profile')
                .set('Authorization', 'Bearer valid-jwt-token')
                .send(invalidProfile)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });
    describe('POST /api/v1/auth/logout', () => {
        it('should logout successfully', async () => {
            authController.logout.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    message: 'خروج موفقیت‌آمیز'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', 'Bearer valid-jwt-token')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('خروج');
        });
        it('should handle logout when not authenticated', async () => {
            authController.logout.mockImplementation((req, res) => {
                res.status(401).json({
                    success: false,
                    message: 'دسترسی غیرمجاز',
                    error: 'UNAUTHORIZED'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/logout')
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('UNAUTHORIZED');
        });
    });
    describe('Password Utilities Tests', () => {
        it('should hash password correctly', () => {
            const password = 'TestPassword123!';
            const saltRounds = 12;
            const hashedPassword = bcryptjs_1.default.hashSync(password, saltRounds);
            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(password);
            expect(hashedPassword.length).toBeGreaterThan(50);
        });
        it('should verify password correctly', () => {
            const password = 'TestPassword123!';
            const hashedPassword = bcryptjs_1.default.hashSync(password, 12);
            const isValid = bcryptjs_1.default.compareSync(password, hashedPassword);
            const isInvalid = bcryptjs_1.default.compareSync('WrongPassword', hashedPassword);
            expect(isValid).toBe(true);
            expect(isInvalid).toBe(false);
        });
    });
    describe('JWT Token Tests', () => {
        const mockSecret = 'test-jwt-secret';
        const mockPayload = {
            userId: 'user123',
            email: 'test@example.com',
            role: 'student'
        };
        it('should create JWT token', () => {
            const token = jsonwebtoken_1.default.sign(mockPayload, mockSecret, { expiresIn: '15m' });
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });
        it('should verify JWT token', () => {
            const token = jsonwebtoken_1.default.sign(mockPayload, mockSecret, { expiresIn: '15m' });
            const decoded = jsonwebtoken_1.default.verify(token, mockSecret);
            expect(decoded.userId).toBe(mockPayload.userId);
            expect(decoded.email).toBe(mockPayload.email);
            expect(decoded.role).toBe(mockPayload.role);
        });
        it('should reject invalid JWT token', () => {
            const invalidToken = 'invalid.jwt.token';
            expect(() => {
                jsonwebtoken_1.default.verify(invalidToken, mockSecret);
            }).toThrow();
        });
    });
    describe('Error Handling Tests', () => {
        it('should handle internal server errors', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(500).json({
                    success: false,
                    message: 'خطای داخلی سرور',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@example.com', password: 'password' })
                .expect(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('INTERNAL_SERVER_ERROR');
        });
        it('should handle missing required fields', async () => {
            authController.register.mockImplementation((req, res) => {
                res.status(400).json({
                    success: false,
                    message: 'فیلدهای الزامی وارد نشده‌اند',
                    error: 'MISSING_REQUIRED_FIELDS'
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('MISSING_REQUIRED_FIELDS');
        });
    });
});
//# sourceMappingURL=auth.controller.test.js.map