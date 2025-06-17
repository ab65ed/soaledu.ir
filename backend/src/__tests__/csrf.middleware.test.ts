/**
 * CSRF Middleware Tests
 * 
 * تست‌های جامع برای میان‌افزار محافظت CSRF
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { 
  setupCSRFToken, 
  validateCSRFToken, 
  provideCSRFToken,
  CSRFConfig
} from '../middlewares/csrf.middleware';

// تنظیم اپلیکیشن تست
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  
  // مسیرهای تست
  app.use(setupCSRFToken);
  app.get('/csrf-token', provideCSRFToken);
  app.post('/protected', validateCSRFToken, (req, res) => {
    res.json({ success: true, message: 'Protected endpoint accessed' });
  });
  app.get('/public', (req, res) => {
    res.json({ success: true, message: 'Public endpoint' });
  });
  
  return app;
};

describe('CSRF Middleware Tests', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('CSRF Middleware', () => {
  let app: express.Application;
  
  beforeEach(() => {
    app = createTestApp();
  });
  
  describe('Setup CSRF Token', () => {
    test('should generate CSRF token on first visit', async () => {
      const response = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.csrfToken).toBeDefined();
      expect(response.body.csrfToken).toHaveLength(64); // 32 bytes in hex = 64 characters
      
      // بررسی وجود کوکی
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain(CSRFConfig.cookieName);
    });
    
    test('should reuse existing CSRF token', async () => {
      // درخواست اول برای دریافت توکن
      const firstResponse = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      const firstToken = firstResponse.body.csrfToken;
      const cookie = firstResponse.headers['set-cookie'][0];
      
      // درخواست دوم با همان کوکی
      const secondResponse = await request(app)
        .get('/csrf-token')
        .set('Cookie', cookie)
        .expect(200);
      
      const secondToken = secondResponse.body.csrfToken;
      
      expect(secondToken).toBe(firstToken);
    });
  });
  
  describe('Validate CSRF Token', () => {
    test('should allow GET requests without CSRF token', async () => {
      const response = await request(app)
        .get('/public')
        .expect(200);
      
      expect(response.body.success).toBe(true);
    });
    
    test('should reject POST request without CSRF token', async () => {
      const response = await request(app)
        .post('/protected')
        .send({ data: 'test' })
        .expect(403);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('CSRF_TOKEN_MISSING');
    });
    
    test('should reject POST request with missing header token', async () => {
      // دریافت توکن اولیه
      const tokenResponse = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      const cookie = tokenResponse.headers['set-cookie'][0];
      
      // درخواست POST بدون هدر توکن
      const response = await request(app)
        .post('/protected')
        .set('Cookie', cookie)
        .send({ data: 'test' })
        .expect(403);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('CSRF_HEADER_MISSING');
    });
    
    test('should reject POST request with invalid token', async () => {
      // دریافت توکن اولیه
      const tokenResponse = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      const cookie = tokenResponse.headers['set-cookie'][0];
      
      // درخواست POST با توکن نادرست
      const response = await request(app)
        .post('/protected')
        .set('Cookie', cookie)
        .set(CSRFConfig.headerName, 'invalid-token')
        .send({ data: 'test' })
        .expect(403);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('CSRF_TOKEN_INVALID');
    });
    
    test('should allow POST request with valid token', async () => {
      // دریافت توکن اولیه
      const tokenResponse = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      const token = tokenResponse.body.csrfToken;
      const cookie = tokenResponse.headers['set-cookie'][0];
      
      // درخواست POST با توکن معتبر
      const response = await request(app)
        .post('/protected')
        .set('Cookie', cookie)
        .set(CSRFConfig.headerName, token)
        .send({ data: 'test' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Protected endpoint accessed');
    });
    
    test('should handle token length mismatch gracefully', async () => {
      // دریافت توکن اولیه
      const tokenResponse = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      const cookie = tokenResponse.headers['set-cookie'][0];
      
      // درخواست POST با توکن کوتاه‌تر
      const response = await request(app)
        .post('/protected')
        .set('Cookie', cookie)
        .set(CSRFConfig.headerName, 'short')
        .send({ data: 'test' })
        .expect(403);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('CSRF_TOKEN_INVALID');
    });
  });
  
  describe('CSRF Token Provider', () => {
    test('should provide token in correct format', async () => {
      const response = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      expect(response.body).toMatchObject({
        success: true,
        csrfToken: expect.any(String),
        message: expect.any(String)
      });
      
      // بررسی فرمت توکن (64 کاراکتر hex)
      expect(response.body.csrfToken).toMatch(/^[0-9a-f]{64}$/);
    });
  });
  
  describe('Security Headers', () => {
    test('should set correct cookie attributes', async () => {
      const response = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      const setCookieHeader = response.headers['set-cookie'][0];
      
      expect(setCookieHeader).toContain('SameSite=Strict');
      expect(setCookieHeader).toContain('Max-Age=86400'); // 24 hours
      
      // در محیط تست، secure نباید تنظیم شود
      if (process.env.NODE_ENV === 'production') {
        expect(setCookieHeader).toContain('Secure');
      }
    });
  });
  
  describe('Edge Cases', () => {
    test('should handle malformed cookie gracefully', async () => {
      const response = await request(app)
        .post('/protected')
        .set('Cookie', 'csrf-token=malformed-cookie-value')
        .set(CSRFConfig.headerName, 'some-token')
        .send({ data: 'test' })
        .expect(403);
      
      expect(response.body.success).toBe(false);
    });
    
    test('should handle empty token header', async () => {
      const tokenResponse = await request(app)
        .get('/csrf-token')
        .expect(200);
      
      const cookie = tokenResponse.headers['set-cookie'][0];
      
      const response = await request(app)
        .post('/protected')
        .set('Cookie', cookie)
        .set(CSRFConfig.headerName, '')
        .send({ data: 'test' })
        .expect(403);
      
      expect(response.body.error).toBe('CSRF_HEADER_MISSING');
    });
  });
  
  describe('Performance', () => {
    test('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/csrf-token')
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.csrfToken).toBeDefined();
      });
      
      // هر درخواست باید توکن منحصر به فرد داشته باشد
      const tokens = responses.map(r => r.body.csrfToken);
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(tokens.length);
    });
  });
}); 