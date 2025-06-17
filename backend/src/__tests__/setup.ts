/**
 * Jest Setup
 * تنظیمات عمومی برای تمام تست‌ها
 */

import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// افزایش timeout برای تست‌های پایگاه داده
jest.setTimeout(30000);

// مدیریت اتصال MongoDB برای هر تست
beforeEach(async () => {
  // بررسی وجود URI در environment
  const mongoUri = process.env.MONGODB_URI || globalThis.__MONGO_URI__;
  
  if (!mongoUri) {
    throw new Error('MongoDB URI not found in environment or global variables');
  }
  
  // اتصال فقط اگر قبلاً متصل نباشیم
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000
    });
  }
});

// پاکسازی پایگاه داده بعد از هر تست
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    // پاکسازی تمام collections
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany({});
    }
  }
});

// قطع اتصال در پایان هر test suite
afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.warn('Warning: Error disconnecting mongoose in teardown:', error);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

export {}; 