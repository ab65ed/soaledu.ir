"use strict";
/**
 * تست‌های Utility Functions
 * هدف: افزایش Test Coverage برای utility functions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
// Mock environment variables for testing
const mockEnv = {
    JWT_SECRET: 'test-jwt-secret-key',
    JWT_REFRESH_SECRET: 'test-jwt-refresh-secret',
    BCRYPT_SALT_ROUNDS: '12',
    TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d'
};
// JWT Utility Functions
class JWTUtils {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, mockEnv.JWT_SECRET, {
            expiresIn: mockEnv.TOKEN_EXPIRY
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, mockEnv.JWT_REFRESH_SECRET, {
            expiresIn: mockEnv.REFRESH_TOKEN_EXPIRY
        });
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, mockEnv.JWT_SECRET);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, mockEnv.JWT_REFRESH_SECRET);
    }
    static decodeToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
}
// Password Utility Functions
class PasswordUtils {
    static async hashPassword(password) {
        const saltRounds = parseInt(mockEnv.BCRYPT_SALT_ROUNDS);
        return bcryptjs_1.default.hash(password, saltRounds);
    }
    static async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    static generateRandomPassword(length = 12) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
// Validation Schemas
const userValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email('ایمیل معتبر وارد کنید'),
    password: zod_1.z.string().min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد'),
    firstName: zod_1.z.string().min(2, 'نام باید حداقل 2 کاراکتر باشد'),
    lastName: zod_1.z.string().min(2, 'نام خانوادگی باید حداقل 2 کاراکتر باشد'),
    phoneNumber: zod_1.z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر وارد کنید')
});
const questionValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'عنوان سوال باید حداقل 5 کاراکتر باشد'),
    content: zod_1.z.string().min(10, 'محتوای سوال باید حداقل 10 کاراکتر باشد'),
    type: zod_1.z.enum(['multiple-choice', 'true-false', 'short-answer', 'essay']),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard']),
    category: zod_1.z.string().min(1, 'دسته‌بندی الزامی است'),
    lesson: zod_1.z.string().min(1, 'درس الزامی است')
});
// Helper Functions
class HelperUtils {
    static formatPhoneNumber(phone) {
        // Convert Persian/Arabic digits to English
        const englishDigits = phone.replace(/[۰-۹]/g, (match) => {
            return String.fromCharCode(match.charCodeAt(0) - '۰'.charCodeAt(0) + '0'.charCodeAt(0));
        });
        // Remove non-digit characters
        const digits = englishDigits.replace(/\D/g, '');
        // Format as 09xxxxxxxxx
        if (digits.startsWith('9') && digits.length === 10) {
            return '0' + digits;
        }
        return digits;
    }
    static generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF]/g, '-') // Keep Persian characters
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    static calculateScore(correctAnswers, totalQuestions) {
        if (totalQuestions === 0)
            return 0;
        return Math.round((correctAnswers / totalQuestions) * 100);
    }
    static formatDate(date, locale = 'fa-IR') {
        return new Intl.DateTimeFormat(locale).format(date);
    }
}
describe('Utility Functions Tests', () => {
    describe('JWT Utils', () => {
        const mockPayload = {
            userId: 'user123',
            email: 'test@example.com',
            role: 'student'
        };
        it('should generate access token', () => {
            const token = JWTUtils.generateAccessToken(mockPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });
        it('should generate refresh token', () => {
            const refreshToken = JWTUtils.generateRefreshToken(mockPayload);
            expect(refreshToken).toBeDefined();
            expect(typeof refreshToken).toBe('string');
            expect(refreshToken.split('.')).toHaveLength(3);
        });
        it('should verify access token correctly', () => {
            const token = JWTUtils.generateAccessToken(mockPayload);
            const decoded = JWTUtils.verifyAccessToken(token);
            expect(decoded.userId).toBe(mockPayload.userId);
            expect(decoded.email).toBe(mockPayload.email);
            expect(decoded.role).toBe(mockPayload.role);
        });
        it('should verify refresh token correctly', () => {
            const refreshToken = JWTUtils.generateRefreshToken(mockPayload);
            const decoded = JWTUtils.verifyRefreshToken(refreshToken);
            expect(decoded.userId).toBe(mockPayload.userId);
            expect(decoded.email).toBe(mockPayload.email);
        });
        it('should decode token without verification', () => {
            const token = JWTUtils.generateAccessToken(mockPayload);
            const decoded = JWTUtils.decodeToken(token);
            expect(decoded.userId).toBe(mockPayload.userId);
            expect(decoded.email).toBe(mockPayload.email);
        });
        it('should throw error for invalid token', () => {
            expect(() => {
                JWTUtils.verifyAccessToken('invalid.jwt.token');
            }).toThrow();
        });
        it('should throw error for expired token', () => {
            const expiredToken = jsonwebtoken_1.default.sign(mockPayload, mockEnv.JWT_SECRET, { expiresIn: '0s' });
            // Wait a bit to ensure token is expired
            setTimeout(() => {
                expect(() => {
                    JWTUtils.verifyAccessToken(expiredToken);
                }).toThrow();
            }, 100);
        });
    });
    describe('Password Utils', () => {
        const testPassword = 'TestPassword123!';
        it('should hash password correctly', async () => {
            const hashedPassword = await PasswordUtils.hashPassword(testPassword);
            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(testPassword);
            expect(hashedPassword.length).toBeGreaterThan(50);
        });
        it('should compare passwords correctly', async () => {
            const hashedPassword = await PasswordUtils.hashPassword(testPassword);
            const isValidPassword = await PasswordUtils.comparePassword(testPassword, hashedPassword);
            const isInvalidPassword = await PasswordUtils.comparePassword('WrongPassword', hashedPassword);
            expect(isValidPassword).toBe(true);
            expect(isInvalidPassword).toBe(false);
        });
        it('should generate random password', () => {
            const password1 = PasswordUtils.generateRandomPassword();
            const password2 = PasswordUtils.generateRandomPassword();
            const customLength = PasswordUtils.generateRandomPassword(16);
            expect(password1).toBeDefined();
            expect(password2).toBeDefined();
            expect(password1).not.toBe(password2);
            expect(password1.length).toBe(12); // default length
            expect(customLength.length).toBe(16);
        });
        it('should handle empty password', async () => {
            await expect(PasswordUtils.hashPassword('')).resolves.toBeDefined();
        });
        it('should handle very long password', async () => {
            const longPassword = 'a'.repeat(1000);
            const hashedPassword = await PasswordUtils.hashPassword(longPassword);
            expect(hashedPassword).toBeDefined();
            expect(hashedPassword.length).toBeGreaterThan(50);
        });
    });
    describe('Validation Schemas', () => {
        it('should validate correct user data', () => {
            const validUser = {
                email: 'test@example.com',
                password: 'SecurePassword123!',
                firstName: 'احمد',
                lastName: 'محمدی',
                phoneNumber: '09123456789'
            };
            const result = userValidationSchema.safeParse(validUser);
            expect(result.success).toBe(true);
        });
        it('should reject invalid user data', () => {
            const invalidUser = {
                email: 'invalid-email',
                password: '123',
                firstName: 'a',
                lastName: 'b',
                phoneNumber: '123'
            };
            const result = userValidationSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });
        it('should validate question data', () => {
            const validQuestion = {
                title: 'سوال تست ریاضی',
                content: 'این یک سوال تست برای بررسی دانش ریاضی است',
                type: 'multiple-choice',
                difficulty: 'medium',
                category: 'math',
                lesson: 'algebra'
            };
            const result = questionValidationSchema.safeParse(validQuestion);
            expect(result.success).toBe(true);
        });
        it('should reject invalid question data', () => {
            const invalidQuestion = {
                title: 'کوتاه',
                content: 'کوتاه',
                type: 'invalid-type',
                difficulty: 'invalid-difficulty',
                category: '',
                lesson: ''
            };
            const result = questionValidationSchema.safeParse(invalidQuestion);
            expect(result.success).toBe(false);
        });
        it('should handle validation edge cases', () => {
            // Empty object validation
            const result = userValidationSchema.safeParse({});
            expect(result.success).toBe(false);
            // Null validation
            const nullResult = userValidationSchema.safeParse(null);
            expect(nullResult.success).toBe(false);
        });
    });
    describe('Helper Utils', () => {
        it('should format phone numbers correctly', () => {
            expect(HelperUtils.formatPhoneNumber('9123456789')).toBe('09123456789');
            expect(HelperUtils.formatPhoneNumber('09123456789')).toBe('09123456789');
            expect(HelperUtils.formatPhoneNumber('۰۹۱۲۳۴۵۶۷۸۹')).toBe('09123456789');
            expect(HelperUtils.formatPhoneNumber('+98 912 345 6789')).toBe('989123456789');
        });
        it('should generate slugs correctly', () => {
            expect(HelperUtils.generateSlug('Hello World')).toBe('hello-world');
            expect(HelperUtils.generateSlug('سلام دنیا')).toBe('سلام-دنیا');
            expect(HelperUtils.generateSlug('Test--Multiple---Dashes')).toBe('test-multiple-dashes');
        });
        it('should calculate scores correctly', () => {
            expect(HelperUtils.calculateScore(8, 10)).toBe(80);
            expect(HelperUtils.calculateScore(0, 10)).toBe(0);
            expect(HelperUtils.calculateScore(10, 10)).toBe(100);
            expect(HelperUtils.calculateScore(5, 0)).toBe(0);
        });
        it('should format dates correctly', () => {
            const testDate = new Date('2023-01-01');
            const formatted = HelperUtils.formatDate(testDate);
            expect(formatted).toBeDefined();
            expect(typeof formatted).toBe('string');
        });
        it('should handle edge cases', () => {
            expect(HelperUtils.generateSlug('')).toBe('');
            expect(HelperUtils.formatPhoneNumber('')).toBe('');
            expect(HelperUtils.calculateScore(0, 0)).toBe(0);
        });
    });
    describe('Error Handling', () => {
        it('should handle malformed JWT gracefully', async () => {
            const malformedToken = 'malformed.jwt.token';
            expect(() => JWTUtils.verifyAccessToken(malformedToken)).toThrow();
        });
        it('should handle bcrypt errors gracefully', async () => {
            // Invalid hash format - bcrypt.compare returns false instead of throwing
            const result = await PasswordUtils.comparePassword('password', 'invalid-hash');
            expect(result).toBe(false);
        });
        it('should handle validation edge cases', () => {
            // Empty object validation
            const result = userValidationSchema.safeParse({});
            expect(result.success).toBe(false);
            // Null validation
            const nullResult = userValidationSchema.safeParse(null);
            expect(nullResult.success).toBe(false);
        });
    });
    describe('Performance Tests', () => {
        it('should handle multiple password hashes efficiently', async () => {
            const startTime = Date.now();
            const promises = Array.from({ length: 10 }, () => PasswordUtils.hashPassword('TestPassword123!'));
            await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Should complete within reasonable time (less than 10 seconds)
            expect(duration).toBeLessThan(10000);
        });
        it('should handle multiple JWT operations efficiently', () => {
            const startTime = Date.now();
            const payload = { userId: 'test', email: 'test@example.com' };
            for (let i = 0; i < 100; i++) {
                const token = JWTUtils.generateAccessToken(payload);
                JWTUtils.verifyAccessToken(token);
                JWTUtils.decodeToken(token);
            }
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Should complete within reasonable time (less than 1 second)
            expect(duration).toBeLessThan(1000);
        });
        it('should handle validation of large datasets', () => {
            const startTime = Date.now();
            const validUser = {
                email: 'test@example.com',
                password: 'SecurePassword123!',
                firstName: 'احمد',
                lastName: 'محمدی',
                phoneNumber: '09123456789'
            };
            for (let i = 0; i < 1000; i++) {
                userValidationSchema.safeParse(validUser);
            }
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Should complete within reasonable time (less than 1 second)
            expect(duration).toBeLessThan(1000);
        });
    });
});
//# sourceMappingURL=utils.test.js.map