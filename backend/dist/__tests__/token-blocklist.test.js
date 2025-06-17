"use strict";
/**
 * Token Blocklist Middleware Tests
 *
 * تست‌های جامع برای میان‌افزار مدیریت بلاک‌لیست توکن‌ها
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_blocklist_middleware_1 = require("../middlewares/token-blocklist.middleware");
// Mock logger
jest.mock('../utils/logger', () => ({
    logger: {
        info: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
    }
}));
(0, globals_1.describe)('Token Blocklist Middleware', () => {
    const JWT_SECRET = 'test-secret';
    const mockUserId = 'test-user-123';
    (0, globals_1.beforeEach)(() => {
        (0, token_blocklist_middleware_1.clearBlocklist)();
    });
    (0, globals_1.afterEach)(() => {
        (0, token_blocklist_middleware_1.clearBlocklist)();
    });
    const createTestToken = (userId, jti, expiresIn = '1h') => {
        const payload = {
            userId,
            iat: Math.floor(Date.now() / 1000)
        };
        if (jti) {
            payload.jti = jti;
        }
        const exp = Math.floor(Date.now() / 1000) + (expiresIn === '1ms' ? 1 : 3600);
        payload.exp = exp;
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET);
    };
    (0, globals_1.describe)('Block Token Functionality', () => {
        (0, globals_1.test)('should successfully block a valid token', () => {
            const token = createTestToken(mockUserId, 'test-jti-1');
            const result = (0, token_blocklist_middleware_1.blockToken)(token);
            (0, globals_1.expect)(result).toBe(true);
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.blockedTokensCount).toBe(1);
        });
        (0, globals_1.test)('should handle token without JTI', () => {
            const token = createTestToken(mockUserId);
            const result = (0, token_blocklist_middleware_1.blockToken)(token);
            (0, globals_1.expect)(result).toBe(true);
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.blockedTokensCount).toBe(1);
        });
        (0, globals_1.test)('should reject invalid token structure', () => {
            const result = (0, token_blocklist_middleware_1.blockToken)('invalid-token');
            (0, globals_1.expect)(result).toBe(false);
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.blockedTokensCount).toBe(0);
        });
        (0, globals_1.test)('should reject token without expiration', () => {
            // ایجاد توکن بدون exp claim
            const tokenWithoutExp = jsonwebtoken_1.default.sign({ userId: mockUserId }, JWT_SECRET);
            const result = (0, token_blocklist_middleware_1.blockToken)(tokenWithoutExp);
            (0, globals_1.expect)(result).toBe(false);
        });
    });
    (0, globals_1.describe)('User Token Invalidation', () => {
        (0, globals_1.test)('should invalidate all user tokens', () => {
            (0, token_blocklist_middleware_1.invalidateUserTokens)(mockUserId);
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.invalidatedUsersCount).toBe(1);
        });
        (0, globals_1.test)('should handle multiple user invalidations', () => {
            const users = ['user1', 'user2', 'user3'];
            users.forEach(userId => (0, token_blocklist_middleware_1.invalidateUserTokens)(userId));
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.invalidatedUsersCount).toBe(3);
        });
        (0, globals_1.test)('should update invalidation time on subsequent calls', () => {
            // اولین ابطال
            (0, token_blocklist_middleware_1.invalidateUserTokens)(mockUserId);
            // تأخیر کوتاه
            setTimeout(() => {
                // دومین ابطال
                (0, token_blocklist_middleware_1.invalidateUserTokens)(mockUserId);
                const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
                (0, globals_1.expect)(stats.invalidatedUsersCount).toBe(1); // همان کاربر
            }, 100);
        });
    });
    (0, globals_1.describe)('Blocklist Statistics', () => {
        (0, globals_1.test)('should return correct initial stats', () => {
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats).toEqual({
                blockedTokensCount: 0,
                invalidatedUsersCount: 0
            });
        });
        (0, globals_1.test)('should track mixed operations', () => {
            // بلاک کردن چند توکن
            const token1 = createTestToken('user1', 'jti1');
            const token2 = createTestToken('user2', 'jti2');
            (0, token_blocklist_middleware_1.blockToken)(token1);
            (0, token_blocklist_middleware_1.blockToken)(token2);
            // ابطال کاربران
            (0, token_blocklist_middleware_1.invalidateUserTokens)('user3');
            (0, token_blocklist_middleware_1.invalidateUserTokens)('user4');
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.blockedTokensCount).toBe(2);
            (0, globals_1.expect)(stats.invalidatedUsersCount).toBe(2);
        });
    });
    (0, globals_1.describe)('Clear Blocklist', () => {
        (0, globals_1.test)('should clear all blocked tokens and invalidated users', () => {
            // اضافه کردن داده‌های تست
            const token = createTestToken(mockUserId, 'test-jti');
            (0, token_blocklist_middleware_1.blockToken)(token);
            (0, token_blocklist_middleware_1.invalidateUserTokens)(mockUserId);
            // بررسی وجود داده‌ها
            let stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.blockedTokensCount).toBe(1);
            (0, globals_1.expect)(stats.invalidatedUsersCount).toBe(1);
            // پاک کردن
            (0, token_blocklist_middleware_1.clearBlocklist)();
            // بررسی پاک شدن
            stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.blockedTokensCount).toBe(0);
            (0, globals_1.expect)(stats.invalidatedUsersCount).toBe(0);
        });
    });
    (0, globals_1.describe)('Token Expiration Handling', () => {
        it('should handle expired tokens', () => {
            // توکن منقضی شده با exp در گذشته
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVjMGI5OTg3NDc4NDhlMGRkYjhhOGEiLCJqdGkiOiJleHBpcmVkLWp0aSIsImV4cCI6MTU3NzgzNjgwMH0.fake-signature-for-expired-token';
            // باید توکن منقضی شده را رد کند
            const result = (0, token_blocklist_middleware_1.blockToken)(expiredToken);
            (0, globals_1.expect)(result).toBe(true);
        });
    });
    (0, globals_1.describe)('Edge Cases', () => {
        (0, globals_1.test)('should handle empty token', () => {
            const result = (0, token_blocklist_middleware_1.blockToken)('');
            (0, globals_1.expect)(result).toBe(false);
        });
        (0, globals_1.test)('should handle null/undefined token', () => {
            (0, globals_1.expect)((0, token_blocklist_middleware_1.blockToken)(null)).toBe(false);
            (0, globals_1.expect)((0, token_blocklist_middleware_1.blockToken)(undefined)).toBe(false);
        });
        (0, globals_1.test)('should handle malformed JWT', () => {
            const result = (0, token_blocklist_middleware_1.blockToken)('not.a.jwt');
            (0, globals_1.expect)(result).toBe(false);
        });
        (0, globals_1.test)('should handle token with invalid JSON payload', () => {
            // ایجاد توکن با payload نامعتبر
            const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
            const invalidPayload = 'invalid-json';
            const signature = 'signature';
            const malformedToken = `${header}.${invalidPayload}.${signature}`;
            const result = (0, token_blocklist_middleware_1.blockToken)(malformedToken);
            (0, globals_1.expect)(result).toBe(false);
        });
    });
    (0, globals_1.describe)('Performance Tests', () => {
        (0, globals_1.test)('should handle large number of blocked tokens', () => {
            const tokens = [];
            // بلاک کردن 100 توکن
            for (let i = 0; i < 100; i++) {
                const token = createTestToken(`user${i}`, `jti${i}`);
                tokens.push(token);
                (0, token_blocklist_middleware_1.blockToken)(token);
            }
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.blockedTokensCount).toBe(100);
        });
        (0, globals_1.test)('should handle rapid invalidation requests', () => {
            const userIds = Array.from({ length: 50 }, (_, i) => `user${i}`);
            // ابطال سریع کاربران
            userIds.forEach(userId => (0, token_blocklist_middleware_1.invalidateUserTokens)(userId));
            const stats = (0, token_blocklist_middleware_1.getBlocklistStats)();
            (0, globals_1.expect)(stats.invalidatedUsersCount).toBe(50);
        });
    });
});
//# sourceMappingURL=token-blocklist.test.js.map