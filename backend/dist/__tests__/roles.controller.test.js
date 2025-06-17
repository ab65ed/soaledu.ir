"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
describe('Roles Controller Tests', () => {
    describe('GET /api/v1/roles/', () => {
        it('should get list of roles successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/roles/')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
    });
    describe('GET /api/v1/roles/permissions', () => {
        it('should get list of permissions successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/roles/permissions')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
    });
    describe('GET /api/v1/roles/dashboard-stats', () => {
        it('should get dashboard stats successfully', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/roles/dashboard-stats')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
        });
    });
    describe('Error Handling', () => {
        it('should handle server errors gracefully', async () => {
            // This test ensures error handling works
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/v1/roles/nonexistent')
                .expect(404);
        });
    });
});
//# sourceMappingURL=roles.controller.test.js.map