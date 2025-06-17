#!/usr/bin/env node

/**
 * Database Optimization Script
 * اسکریپت بهینه‌سازی پایگاه داده
 * 
 * این اسکریپت Index های مورد نیاز را ایجاد می‌کند و بهینه‌سازی‌های لازم را انجام می‌دهد
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { createOptimizedIndexes, getIndexAnalysis } from '../database/indexes';

// Database connection
async function connectDatabase(): Promise<void> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/soaledu';
    await mongoose.connect(MONGODB_URI);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

// Main optimization function
async function optimizeDatabase(): Promise<void> {
  logger.info('🚀 Starting database optimization...');

  try {
    // Connect to database
    await connectDatabase();

    // Create optimized indexes
    logger.info('📊 Creating optimized indexes...');
    await createOptimizedIndexes();

    // Analyze index performance
    logger.info('🔍 Analyzing index performance...');
    
    try {
      const analysis = await getIndexAnalysis();
      logger.info('Index analysis:', analysis);
    } catch (error) {
      logger.warn('Failed to analyze indexes:', error);
    }

    // Database statistics
    logger.info('📈 Gathering database statistics...');
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    logger.info('Database Statistics:', {
      collections: stats.collections,
      objects: stats.objects,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
      indexes: stats.indexes,
      indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`
    });

    logger.info('✅ Database optimization completed successfully!');

  } catch (error) {
    logger.error('❌ Database optimization failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Database disconnected');
  }
}

// Performance monitoring
async function monitorPerformance(): Promise<void> {
  logger.info('🔧 Starting performance monitoring...');

  try {
    await connectDatabase();

    const db = mongoose.connection.db;
    
    // Enable profiling for slow operations
    await db.command({ profile: 2, slowms: 100 });
    logger.info('Database profiling enabled for operations > 100ms');

    // Check current operations
    const currentOps = await db.admin().command({ currentOp: 1 });
    logger.info('Current database operations:', {
      activeOps: currentOps.inprog?.length || 0
    });

    // Check replication lag (if replica set)
    try {
      const replStatus = await db.admin().command({ replSetGetStatus: 1 });
      logger.info('Replica set status:', {
        set: replStatus.set,
        members: replStatus.members?.length || 0
      });
    } catch (error) {
      logger.info('Not running in replica set mode');
    }

  } catch (error) {
    logger.error('Performance monitoring failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Cleanup old data
async function cleanupOldData(): Promise<void> {
  logger.info('🧹 Starting data cleanup...');

  try {
    await connectDatabase();

    const db = mongoose.connection.db;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Clean up old logs
    const logsCollection = db.collection('logs');
    const deletedLogs = await logsCollection.deleteMany({
      createdAt: { $lt: thirtyDaysAgo }
    });
    logger.info(`Deleted ${deletedLogs.deletedCount} old log entries`);

    // Clean up expired sessions
    const sessionsCollection = db.collection('sessions');
    const deletedSessions = await sessionsCollection.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    logger.info(`Deleted ${deletedSessions.deletedCount} expired sessions`);

    // Clean up draft questions older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const questionsCollection = db.collection('questions');
    const deletedDrafts = await questionsCollection.deleteMany({
      isDraft: true,
      createdAt: { $lt: sevenDaysAgo }
    });
    logger.info(`Deleted ${deletedDrafts.deletedCount} old draft questions`);

    logger.info('✅ Data cleanup completed successfully!');

  } catch (error) {
    logger.error('Data cleanup failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || 'optimize';

  switch (command) {
    case 'optimize':
      await optimizeDatabase();
      break;
    case 'monitor':
      await monitorPerformance();
      break;
    case 'cleanup':
      await cleanupOldData();
      break;
    case 'all':
      await optimizeDatabase();
      await monitorPerformance();
      await cleanupOldData();
      break;
    default:
      logger.info('Usage: npm run db:optimize [optimize|monitor|cleanup|all]');
      process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main()
    .then(() => {
      logger.info('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Script failed:', error);
      process.exit(1);
    });
}

export { optimizeDatabase, monitorPerformance, cleanupOldData }; 