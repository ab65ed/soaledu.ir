"use strict";
/**
 * CSRF Middleware Tests
 *
 * تست‌های جامع برای میان‌افزار محافظت CSRF
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csrf_middleware_1 = require("../middlewares/csrf.middleware");
// تنظیم اپلیکیشن تست
const createTestApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // مسیرهای تست
    app.use(csrf_middleware_1.setupCSRFToken);
    app.get('/csrf-token', csrf_middleware_1.provideCSRFToken);
    app.post('/protected', csrf_middleware_1.validateCSRFToken, (req, res) => {
        res.json({ success: true, message: 'Protected endpoint accessed' });
    });
    app.get('/public', (req, res) => {
        res.json({ success: true, message: 'Public endpoint' });
    });
    return app;
};
(0, globals_1.describe)('CSRF Middleware Tests', () => {
    (0, globals_1.test)('should pass basic test', () => {
        (0, globals_1.expect)(1 + 1).toBe(2);
    });
});
(0, globals_1.describe)('CSRF Middleware', () => {
    let app;
    (0, globals_1.beforeEach)(() => {
        app = createTestApp();
    });
    (0, globals_1.describe)('Setup CSRF Token', () => {
        (0, globals_1.test)('should generate CSRF token on first visit', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            (0, globals_1.expect)(response.body.success).toBe(true);
            (0, globals_1.expect)(response.body.csrfToken).toBeDefined();
            (0, globals_1.expect)(response.body.csrfToken).toHaveLength(64); // 32 bytes in hex = 64 characters
            // بررسی وجود کوکی
            const cookies = response.headers['set-cookie'];
            (0, globals_1.expect)(cookies).toBeDefined();
            (0, globals_1.expect)(cookies[0]).toContain(csrf_middleware_1.CSRFConfig.cookieName);
        });
        (0, globals_1.test)('should reuse existing CSRF token', async () => {
            // درخواست اول برای دریافت توکن
            const firstResponse = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            const firstToken = firstResponse.body.csrfToken;
            const cookie = firstResponse.headers['set-cookie'][0];
            // درخواست دوم با همان کوکی
            const secondResponse = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .set('Cookie', cookie)
                .expect(200);
            const secondToken = secondResponse.body.csrfToken;
            (0, globals_1.expect)(secondToken).toBe(firstToken);
        });
    });
    (0, globals_1.describe)('Validate CSRF Token', () => {
        (0, globals_1.test)('should allow GET requests without CSRF token', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/public')
                .expect(200);
            (0, globals_1.expect)(response.body.success).toBe(true);
        });
        (0, globals_1.test)('should reject POST request without CSRF token', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/protected')
                .send({ data: 'test' })
                .expect(403);
            (0, globals_1.expect)(response.body.success).toBe(false);
            (0, globals_1.expect)(response.body.error).toBe('CSRF_TOKEN_MISSING');
        });
        (0, globals_1.test)('should reject POST request with missing header token', async () => {
            // دریافت توکن اولیه
            const tokenResponse = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            const cookie = tokenResponse.headers['set-cookie'][0];
            // درخواست POST بدون هدر توکن
            const response = await (0, supertest_1.default)(app)
                .post('/protected')
                .set('Cookie', cookie)
                .send({ data: 'test' })
                .expect(403);
            (0, globals_1.expect)(response.body.success).toBe(false);
            (0, globals_1.expect)(response.body.error).toBe('CSRF_HEADER_MISSING');
        });
        (0, globals_1.test)('should reject POST request with invalid token', async () => {
            // دریافت توکن اولیه
            const tokenResponse = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            const cookie = tokenResponse.headers['set-cookie'][0];
            // درخواست POST با توکن نادرست
            const response = await (0, supertest_1.default)(app)
                .post('/protected')
                .set('Cookie', cookie)
                .set(csrf_middleware_1.CSRFConfig.headerName, 'invalid-token')
                .send({ data: 'test' })
                .expect(403);
            (0, globals_1.expect)(response.body.success).toBe(false);
            (0, globals_1.expect)(response.body.error).toBe('CSRF_TOKEN_INVALID');
        });
        (0, globals_1.test)('should allow POST request with valid token', async () => {
            // دریافت توکن اولیه
            const tokenResponse = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            const token = tokenResponse.body.csrfToken;
            const cookie = tokenResponse.headers['set-cookie'][0];
            // درخواست POST با توکن معتبر
            const response = await (0, supertest_1.default)(app)
                .post('/protected')
                .set('Cookie', cookie)
                .set(csrf_middleware_1.CSRFConfig.headerName, token)
                .send({ data: 'test' })
                .expect(200);
            (0, globals_1.expect)(response.body.success).toBe(true);
            (0, globals_1.expect)(response.body.message).toBe('Protected endpoint accessed');
        });
        (0, globals_1.test)('should handle token length mismatch gracefully', async () => {
            // دریافت توکن اولیه
            const tokenResponse = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            const cookie = tokenResponse.headers['set-cookie'][0];
            // درخواست POST با توکن کوتاه‌تر
            const response = await (0, supertest_1.default)(app)
                .post('/protected')
                .set('Cookie', cookie)
                .set(csrf_middleware_1.CSRFConfig.headerName, 'short')
                .send({ data: 'test' })
                .expect(403);
            (0, globals_1.expect)(response.body.success).toBe(false);
            (0, globals_1.expect)(response.body.error).toBe('CSRF_TOKEN_INVALID');
        });
    });
    (0, globals_1.describe)('CSRF Token Provider', () => {
        (0, globals_1.test)('should provide token in correct format', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: true,
                csrfToken: globals_1.expect.any(String),
                message: globals_1.expect.any(String)
            });
            // بررسی فرمت توکن (64 کاراکتر hex)
            (0, globals_1.expect)(response.body.csrfToken).toMatch(/^[0-9a-f]{64}$/);
        });
    });
    (0, globals_1.describe)('Security Headers', () => {
        (0, globals_1.test)('should set correct cookie attributes', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            const setCookieHeader = response.headers['set-cookie'][0];
            (0, globals_1.expect)(setCookieHeader).toContain('SameSite=Strict');
            (0, globals_1.expect)(setCookieHeader).toContain('Max-Age=86400'); // 24 hours
            // در محیط تست، secure نباید تنظیم شود
            if (process.env.NODE_ENV === 'production') {
                (0, globals_1.expect)(setCookieHeader).toContain('Secure');
            }
        });
    });
    (0, globals_1.describe)('Edge Cases', () => {
        (0, globals_1.test)('should handle malformed cookie gracefully', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/protected')
                .set('Cookie', 'csrf-token=malformed-cookie-value')
                .set(csrf_middleware_1.CSRFConfig.headerName, 'some-token')
                .send({ data: 'test' })
                .expect(403);
            (0, globals_1.expect)(response.body.success).toBe(false);
        });
        (0, globals_1.test)('should handle empty token header', async () => {
            const tokenResponse = await (0, supertest_1.default)(app)
                .get('/csrf-token')
                .expect(200);
            const cookie = tokenResponse.headers['set-cookie'][0];
            const response = await (0, supertest_1.default)(app)
                .post('/protected')
                .set('Cookie', cookie)
                .set(csrf_middleware_1.CSRFConfig.headerName, '')
                .send({ data: 'test' })
                .expect(403);
            (0, globals_1.expect)(response.body.error).toBe('CSRF_HEADER_MISSING');
        });
    });
    (0, globals_1.describe)('Performance', () => {
        (0, globals_1.test)('should handle multiple concurrent requests', async () => {
            const requests = Array(10).fill(null).map(() => (0, supertest_1.default)(app).get('/csrf-token'));
            const responses = await Promise.all(requests);
            responses.forEach(response => {
                (0, globals_1.expect)(response.status).toBe(200);
                (0, globals_1.expect)(response.body.success).toBe(true);
                (0, globals_1.expect)(response.body.csrfToken).toBeDefined();
            });
            // هر درخواست باید توکن منحصر به فرد داشته باشد
            const tokens = responses.map(r => r.body.csrfToken);
            const uniqueTokens = new Set(tokens);
            (0, globals_1.expect)(uniqueTokens.size).toBe(tokens.length);
        });
    });
});
//# sourceMappingURL=csrf.middleware.test.js.map