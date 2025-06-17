import request from 'supertest';
import app from '../server';

describe('Roles Controller Tests', () => {
  describe('GET /api/v1/roles/', () => {
    it('should get list of roles successfully', async () => {
      const response = await request(app)
        .get('/api/v1/roles/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/roles/permissions', () => {
    it('should get list of permissions successfully', async () => {
      const response = await request(app)
        .get('/api/v1/roles/permissions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/roles/dashboard-stats', () => {
    it('should get dashboard stats successfully', async () => {
      const response = await request(app)
        .get('/api/v1/roles/dashboard-stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // This test ensures error handling works
      const response = await request(app)
        .get('/api/v1/roles/nonexistent')
        .expect(404);
    });
  });
}); 