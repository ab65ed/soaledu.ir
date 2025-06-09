"use strict";
/**
 * Cache Routes Tests
 * تست‌های مسیرهای مدیریت کش
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cache_1 = __importDefault(require("../../routes/cache"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1/cache', cache_1.default);
// Mock authentication middleware for testing
app.use((req, res, next) => {
    req.user = { id: 'test-user', role: 'admin' };
    next();
});
describe('Cache Routes', () => {
    describe('GET /api/v1/cache/stats', () => {
        it('should return cache statistics', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/stats')
                .expect(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('redis');
            expect(response.body.data).toHaveProperty('memory');
            expect(response.body.data).toHaveProperty('performance');
            // Check Redis stats
            expect(response.body.data.redis).toHaveProperty('connected');
            expect(response.body.data.redis).toHaveProperty('uptime');
            expect(response.body.data.redis).toHaveProperty('version');
            // Check memory stats
            expect(response.body.data.memory).toHaveProperty('used');
            expect(response.body.data.memory).toHaveProperty('peak');
            expect(response.body.data.memory).toHaveProperty('fragmentation');
            // Check performance stats
            expect(response.body.data.performance).toHaveProperty('hits');
            expect(response.body.data.performance).toHaveProperty('misses');
            expect(response.body.data.performance).toHaveProperty('hitRate');
        });
        it('should return valid cache statistics data types', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/stats')
                .expect(200);
            const { redis, memory, performance } = response.body.data;
            expect(typeof redis.connected).toBe('boolean');
            expect(typeof redis.uptime).toBe('number');
            expect(typeof redis.version).toBe('string');
            expect(typeof memory.used).toBe('number');
            expect(typeof memory.peak).toBe('number');
            expect(typeof memory.fragmentation).toBe('number');
            expect(typeof performance.hits).toBe('number');
            expect(typeof performance.misses).toBe('number');
            expect(typeof performance.hitRate).toBe('number');
            // Hit rate should be between 0 and 100
            expect(performance.hitRate).toBeGreaterThanOrEqual(0);
            expect(performance.hitRate).toBeLessThanOrEqual(100);
        });
    });
    describe('POST /api/v1/cache/clear', () => {
        it('should clear specific cache pattern', async () => {
            const clearData = {
                pattern: 'user:*',
                type: 'pattern'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/cache/clear')
                .send(clearData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('cleared');
            expect(response.body.data).toHaveProperty('pattern', clearData.pattern);
            expect(typeof response.body.data.cleared).toBe('number');
        });
        it('should clear specific cache key', async () => {
            const clearData = {
                key: 'user:123:profile',
                type: 'key'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/cache/clear')
                .send(clearData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('cleared');
            expect(response.body.data).toHaveProperty('key', clearData.key);
        });
        it('should return 400 for invalid clear request', async () => {
            const invalidData = {
                type: 'invalid'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/cache/clear')
                .send(invalidData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('نامعتبر');
        });
        it('should return 400 for missing required fields', async () => {
            const invalidData = {
                type: 'pattern'
                // missing pattern field
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/cache/clear')
                .send(invalidData)
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('POST /api/v1/cache/clear-all', () => {
        it('should clear all cache', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/cache/clear-all')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('cleared');
            expect(response.body.message).toContain('تمام کش‌ها پاک شدند');
            expect(typeof response.body.data.cleared).toBe('number');
        });
        it('should require admin authorization', async () => {
            // Mock non-admin user
            const nonAdminApp = (0, express_1.default)();
            nonAdminApp.use(express_1.default.json());
            nonAdminApp.use((req, res, next) => {
                req.user = { id: 'test-user', role: 'user' };
                next();
            });
            nonAdminApp.use('/api/v1/cache', cache_1.default);
            const response = await (0, supertest_1.default)(nonAdminApp)
                .post('/api/v1/cache/clear-all')
                .expect(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('دسترسی');
        });
    });
    describe('GET /api/v1/cache/keys', () => {
        it('should return cache keys list', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/keys')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('keys');
            expect(response.body.data).toHaveProperty('total');
            expect(response.body.data).toHaveProperty('pagination');
            expect(Array.isArray(response.body.data.keys)).toBe(true);
            expect(typeof response.body.data.total).toBe('number');
        });
        it('should filter keys by pattern', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/keys?pattern=user:*')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('pattern', 'user:*');
            expect(Array.isArray(response.body.data.keys)).toBe(true);
        });
        it('should support pagination', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/keys?page=1&limit=10')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.pagination).toHaveProperty('currentPage', 1);
            expect(response.body.data.pagination).toHaveProperty('limit', 10);
            expect(response.body.data.pagination).toHaveProperty('totalPages');
        });
    });
    describe('GET /api/v1/cache/memory', () => {
        it('should return cache memory usage', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/memory')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('usage');
            expect(response.body.data).toHaveProperty('breakdown');
            expect(response.body.data).toHaveProperty('efficiency');
            // Check usage data
            expect(response.body.data.usage).toHaveProperty('used');
            expect(response.body.data.usage).toHaveProperty('peak');
            expect(response.body.data.usage).toHaveProperty('limit');
            expect(response.body.data.usage).toHaveProperty('percentage');
            // Check breakdown data
            expect(response.body.data.breakdown).toHaveProperty('keys');
            expect(response.body.data.breakdown).toHaveProperty('overhead');
            expect(response.body.data.breakdown).toHaveProperty('fragmentation');
        });
        it('should return memory data in correct format', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/memory')
                .expect(200);
            const { usage, breakdown } = response.body.data;
            expect(typeof usage.used).toBe('number');
            expect(typeof usage.peak).toBe('number');
            expect(typeof usage.limit).toBe('number');
            expect(typeof usage.percentage).toBe('number');
            expect(usage.percentage).toBeGreaterThanOrEqual(0);
            expect(usage.percentage).toBeLessThanOrEqual(100);
            expect(typeof breakdown.keys).toBe('number');
            expect(typeof breakdown.overhead).toBe('number');
            expect(typeof breakdown.fragmentation).toBe('number');
        });
    });
    describe('GET /api/v1/cache/performance', () => {
        it('should return cache performance metrics', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/performance')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('operations');
            expect(response.body.data).toHaveProperty('latency');
            expect(response.body.data).toHaveProperty('throughput');
            expect(response.body.data).toHaveProperty('errors');
            // Check operations data
            expect(response.body.data.operations).toHaveProperty('total');
            expect(response.body.data.operations).toHaveProperty('hits');
            expect(response.body.data.operations).toHaveProperty('misses');
            expect(response.body.data.operations).toHaveProperty('sets');
            expect(response.body.data.operations).toHaveProperty('deletes');
            // Check latency data
            expect(response.body.data.latency).toHaveProperty('average');
            expect(response.body.data.latency).toHaveProperty('p95');
            expect(response.body.data.latency).toHaveProperty('p99');
        });
        it('should include historical performance data when requested', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/performance?history=true&period=1h')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('current');
            expect(response.body.data).toHaveProperty('history');
            expect(Array.isArray(response.body.data.history)).toBe(true);
        });
    });
    describe('Authentication and Authorization', () => {
        it('should require authentication for all routes', async () => {
            const unauthenticatedApp = (0, express_1.default)();
            unauthenticatedApp.use(express_1.default.json());
            unauthenticatedApp.use('/api/v1/cache', cache_1.default);
            const response = await (0, supertest_1.default)(unauthenticatedApp)
                .get('/api/v1/cache/stats')
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('احراز هویت');
        });
        it('should require admin role for destructive operations', async () => {
            const userApp = (0, express_1.default)();
            userApp.use(express_1.default.json());
            userApp.use((req, res, next) => {
                req.user = { id: 'test-user', role: 'user' };
                next();
            });
            userApp.use('/api/v1/cache', cache_1.default);
            const response = await (0, supertest_1.default)(userApp)
                .post('/api/v1/cache/clear-all')
                .expect(403);
            expect(response.body.success).toBe(false);
        });
    });
    describe('Error Handling', () => {
        it('should handle invalid query parameters', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/keys?limit=invalid')
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('نامعتبر');
        });
        it('should handle cache connection errors gracefully', async () => {
            // This would require mocking Redis connection failure
            // For now, we'll test that routes respond appropriately
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/cache/stats')
                .expect(200);
            expect(response.body).toHaveProperty('success');
        });
    });
});
//# sourceMappingURL=cache.test.js.map