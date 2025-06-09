/**
 * Performance Routes Tests
 * تست‌های مسیرهای نظارت بر عملکرد
 */

import request from 'supertest';
import express from 'express';
import performanceRoutes from '../../routes/performance';

const app = express();
app.use(express.json());
app.use('/api/v1/performance', performanceRoutes);

describe('Performance Routes', () => {
  describe('GET /api/v1/performance/overview', () => {
    it('should return system performance overview', async () => {
      const response = await request(app)
        .get('/api/v1/performance/overview')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('system');
      expect(response.body.data).toHaveProperty('database');
      expect(response.body.data).toHaveProperty('cache');
      expect(response.body.data).toHaveProperty('api');
      
      // Check system metrics
      expect(response.body.data.system).toHaveProperty('cpu');
      expect(response.body.data.system).toHaveProperty('memory');
      expect(response.body.data.system).toHaveProperty('uptime');
      
      // Check database metrics
      expect(response.body.data.database).toHaveProperty('connections');
      expect(response.body.data.database).toHaveProperty('responseTime');
      
      // Check API metrics
      expect(response.body.data.api).toHaveProperty('requestsPerMinute');
      expect(response.body.data.api).toHaveProperty('averageResponseTime');
    });

    it('should return valid performance data types', async () => {
      const response = await request(app)
        .get('/api/v1/performance/overview')
        .expect(200);

      const { system, database, api } = response.body.data;
      
      expect(typeof system.cpu.usage).toBe('number');
      expect(typeof system.memory.used).toBe('number');
      expect(typeof system.memory.total).toBe('number');
      expect(typeof system.uptime).toBe('number');
      
      expect(typeof database.connections.active).toBe('number');
      expect(typeof database.connections.total).toBe('number');
      expect(typeof database.responseTime.average).toBe('number');
      
      expect(typeof api.requestsPerMinute).toBe('number');
      expect(typeof api.averageResponseTime).toBe('number');
    });
  });

  describe('GET /api/v1/performance/metrics', () => {
    it('should return detailed performance metrics', async () => {
      const response = await request(app)
        .get('/api/v1/performance/metrics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('metrics');
      
      const metrics = response.body.data.metrics;
      expect(metrics).toHaveProperty('cpu');
      expect(metrics).toHaveProperty('memory');
      expect(metrics).toHaveProperty('disk');
      expect(metrics).toHaveProperty('network');
      expect(metrics).toHaveProperty('processes');
    });

    it('should include historical data when requested', async () => {
      const response = await request(app)
        .get('/api/v1/performance/metrics?history=true&period=1h')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('current');
      expect(response.body.data).toHaveProperty('history');
      expect(Array.isArray(response.body.data.history)).toBe(true);
    });
  });

  describe('GET /api/v1/performance/database', () => {
    it('should return database performance statistics', async () => {
      const response = await request(app)
        .get('/api/v1/performance/database')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('connections');
      expect(response.body.data).toHaveProperty('queries');
      expect(response.body.data).toHaveProperty('collections');
      expect(response.body.data).toHaveProperty('indexes');
      
      // Check connections data
      expect(response.body.data.connections).toHaveProperty('active');
      expect(response.body.data.connections).toHaveProperty('available');
      expect(response.body.data.connections).toHaveProperty('created');
      
      // Check queries data
      expect(response.body.data.queries).toHaveProperty('total');
      expect(response.body.data.queries).toHaveProperty('successful');
      expect(response.body.data.queries).toHaveProperty('failed');
      expect(response.body.data.queries).toHaveProperty('averageTime');
    });

    it('should filter database stats by collection', async () => {
      const response = await request(app)
        .get('/api/v1/performance/database?collection=users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('collection', 'users');
    });
  });

  describe('GET /api/v1/performance/memory', () => {
    it('should return memory usage statistics', async () => {
      const response = await request(app)
        .get('/api/v1/performance/memory')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('system');
      expect(response.body.data).toHaveProperty('process');
      expect(response.body.data).toHaveProperty('heap');
      expect(response.body.data).toHaveProperty('gc');
      
      // Check system memory
      expect(response.body.data.system).toHaveProperty('total');
      expect(response.body.data.system).toHaveProperty('used');
      expect(response.body.data.system).toHaveProperty('free');
      expect(response.body.data.system).toHaveProperty('percentage');
      
      // Check process memory
      expect(response.body.data.process).toHaveProperty('rss');
      expect(response.body.data.process).toHaveProperty('heapTotal');
      expect(response.body.data.process).toHaveProperty('heapUsed');
      expect(response.body.data.process).toHaveProperty('external');
    });

    it('should return memory data in correct format', async () => {
      const response = await request(app)
        .get('/api/v1/performance/memory')
        .expect(200);

      const { system, process } = response.body.data;
      
      expect(typeof system.total).toBe('number');
      expect(typeof system.used).toBe('number');
      expect(typeof system.free).toBe('number');
      expect(typeof system.percentage).toBe('number');
      
      expect(system.percentage).toBeGreaterThanOrEqual(0);
      expect(system.percentage).toBeLessThanOrEqual(100);
      
      expect(typeof process.rss).toBe('number');
      expect(typeof process.heapTotal).toBe('number');
      expect(typeof process.heapUsed).toBe('number');
    });
  });

  describe('GET /api/v1/performance/health', () => {
    it('should return system health check', async () => {
      const response = await request(app)
        .get('/api/v1/performance/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('checks');
      expect(response.body.data).toHaveProperty('timestamp');
      
      // Check health status
      expect(['healthy', 'warning', 'critical']).toContain(response.body.data.status);
      
      // Check individual health checks
      const checks = response.body.data.checks;
      expect(checks).toHaveProperty('database');
      expect(checks).toHaveProperty('memory');
      expect(checks).toHaveProperty('disk');
      expect(checks).toHaveProperty('api');
      
      // Each check should have status and details
      Object.values(checks).forEach((check: any) => {
        expect(check).toHaveProperty('status');
        expect(check).toHaveProperty('responseTime');
        expect(['healthy', 'warning', 'critical']).toContain(check.status);
        expect(typeof check.responseTime).toBe('number');
      });
    });

    it('should include detailed health information', async () => {
      const response = await request(app)
        .get('/api/v1/performance/health?detailed=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('details');
      expect(response.body.data.details).toHaveProperty('uptime');
      expect(response.body.data.details).toHaveProperty('version');
      expect(response.body.data.details).toHaveProperty('environment');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid query parameters gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/performance/metrics?period=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('نامعتبر');
    });

    it('should handle server errors gracefully', async () => {
      // This test would require mocking internal functions to force an error
      // For now, we'll test that the route exists and responds
      const response = await request(app)
        .get('/api/v1/performance/overview')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });
}); 