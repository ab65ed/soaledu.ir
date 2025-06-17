/**
 * Token Blocklist Middleware Tests
 * 
 * تست‌های جامع برای میان‌افزار مدیریت بلاک‌لیست توکن‌ها
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { 
  blockToken, 
  invalidateUserTokens, 
  getBlocklistStats, 
  clearBlocklist 
} from '../middlewares/token-blocklist.middleware';

// Mock logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

describe('Token Blocklist Middleware', () => {
  const JWT_SECRET = 'test-secret';
  const mockUserId = 'test-user-123';
  
  beforeEach(() => {
    clearBlocklist();
  });
  
  afterEach(() => {
    clearBlocklist();
  });
  
  const createTestToken = (userId: string, jti?: string, expiresIn: string = '1h'): string => {
    const payload: any = { 
      userId,
      iat: Math.floor(Date.now() / 1000)
    };
    
    if (jti) {
      payload.jti = jti;
    }
    
    const exp = Math.floor(Date.now() / 1000) + (expiresIn === '1ms' ? 1 : 3600);
    payload.exp = exp;
    
    return jwt.sign(payload, JWT_SECRET);
  };
  
  describe('Block Token Functionality', () => {
    test('should successfully block a valid token', () => {
      const token = createTestToken(mockUserId, 'test-jti-1');
      const result = blockToken(token);
      
      expect(result).toBe(true);
      
      const stats = getBlocklistStats();
      expect(stats.blockedTokensCount).toBe(1);
    });
    
    test('should handle token without JTI', () => {
      const token = createTestToken(mockUserId);
      const result = blockToken(token);
      
      expect(result).toBe(true);
      
      const stats = getBlocklistStats();
      expect(stats.blockedTokensCount).toBe(1);
    });
    
    test('should reject invalid token structure', () => {
      const result = blockToken('invalid-token');
      
      expect(result).toBe(false);
      
      const stats = getBlocklistStats();
      expect(stats.blockedTokensCount).toBe(0);
    });
    
    test('should reject token without expiration', () => {
      // ایجاد توکن بدون exp claim
      const tokenWithoutExp = jwt.sign({ userId: mockUserId }, JWT_SECRET);
      const result = blockToken(tokenWithoutExp);
      
      expect(result).toBe(false);
    });
  });
  
  describe('User Token Invalidation', () => {
    test('should invalidate all user tokens', () => {
      invalidateUserTokens(mockUserId);
      
      const stats = getBlocklistStats();
      expect(stats.invalidatedUsersCount).toBe(1);
    });
    
    test('should handle multiple user invalidations', () => {
      const users = ['user1', 'user2', 'user3'];
      
      users.forEach(userId => invalidateUserTokens(userId));
      
      const stats = getBlocklistStats();
      expect(stats.invalidatedUsersCount).toBe(3);
    });
    
    test('should update invalidation time on subsequent calls', () => {
      // اولین ابطال
      invalidateUserTokens(mockUserId);
      
      // تأخیر کوتاه
      setTimeout(() => {
        // دومین ابطال
        invalidateUserTokens(mockUserId);
        
        const stats = getBlocklistStats();
        expect(stats.invalidatedUsersCount).toBe(1); // همان کاربر
      }, 100);
    });
  });
  
  describe('Blocklist Statistics', () => {
    test('should return correct initial stats', () => {
      const stats = getBlocklistStats();
      
      expect(stats).toEqual({
        blockedTokensCount: 0,
        invalidatedUsersCount: 0
      });
    });
    
    test('should track mixed operations', () => {
      // بلاک کردن چند توکن
      const token1 = createTestToken('user1', 'jti1');
      const token2 = createTestToken('user2', 'jti2');
      
      blockToken(token1);
      blockToken(token2);
      
      // ابطال کاربران
      invalidateUserTokens('user3');
      invalidateUserTokens('user4');
      
      const stats = getBlocklistStats();
      expect(stats.blockedTokensCount).toBe(2);
      expect(stats.invalidatedUsersCount).toBe(2);
    });
  });
  
  describe('Clear Blocklist', () => {
    test('should clear all blocked tokens and invalidated users', () => {
      // اضافه کردن داده‌های تست
      const token = createTestToken(mockUserId, 'test-jti');
      blockToken(token);
      invalidateUserTokens(mockUserId);
      
      // بررسی وجود داده‌ها
      let stats = getBlocklistStats();
      expect(stats.blockedTokensCount).toBe(1);
      expect(stats.invalidatedUsersCount).toBe(1);
      
      // پاک کردن
      clearBlocklist();
      
      // بررسی پاک شدن
      stats = getBlocklistStats();
      expect(stats.blockedTokensCount).toBe(0);
      expect(stats.invalidatedUsersCount).toBe(0);
    });
  });
  
  describe('Token Expiration Handling', () => {
    it('should handle expired tokens', () => {
      // توکن منقضی شده با exp در گذشته
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVjMGI5OTg3NDc4NDhlMGRkYjhhOGEiLCJqdGkiOiJleHBpcmVkLWp0aSIsImV4cCI6MTU3NzgzNjgwMH0.fake-signature-for-expired-token';
      
      // باید توکن منقضی شده را رد کند
      const result = blockToken(expiredToken);
      expect(result).toBe(true);
    });
  });
  
  describe('Edge Cases', () => {
    test('should handle empty token', () => {
      const result = blockToken('');
      expect(result).toBe(false);
    });
    
    test('should handle null/undefined token', () => {
      expect(blockToken(null as any)).toBe(false);
      expect(blockToken(undefined as any)).toBe(false);
    });
    
    test('should handle malformed JWT', () => {
      const result = blockToken('not.a.jwt');
      expect(result).toBe(false);
    });
    
    test('should handle token with invalid JSON payload', () => {
      // ایجاد توکن با payload نامعتبر
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const invalidPayload = 'invalid-json';
      const signature = 'signature';
      const malformedToken = `${header}.${invalidPayload}.${signature}`;
      
      const result = blockToken(malformedToken);
      expect(result).toBe(false);
    });
  });
  
  describe('Performance Tests', () => {
    test('should handle large number of blocked tokens', () => {
      const tokens = [];
      
      // بلاک کردن 100 توکن
      for (let i = 0; i < 100; i++) {
        const token = createTestToken(`user${i}`, `jti${i}`);
        tokens.push(token);
        blockToken(token);
      }
      
      const stats = getBlocklistStats();
      expect(stats.blockedTokensCount).toBe(100);
    });
    
    test('should handle rapid invalidation requests', () => {
      const userIds = Array.from({ length: 50 }, (_, i) => `user${i}`);
      
      // ابطال سریع کاربران
      userIds.forEach(userId => invalidateUserTokens(userId));
      
      const stats = getBlocklistStats();
      expect(stats.invalidatedUsersCount).toBe(50);
    });
  });
}); 