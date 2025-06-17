#!/usr/bin/env node
"use strict";
/**
 * Database Optimization Script
 * اسکریپت بهینه‌سازی پایگاه داده
 *
 * این اسکریپت Index های مورد نیاز را ایجاد می‌کند و بهینه‌سازی‌های لازم را انجام می‌دهد
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeDatabase = optimizeDatabase;
exports.monitorPerformance = monitorPerformance;
exports.cleanupOldData = cleanupOldData;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const indexes_1 = require("../database/indexes");
// Database connection
async function connectDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/soaledu';
        await mongoose_1.default.connect(MONGODB_URI);
        logger_1.logger.info('Database connected successfully');
    }
    catch (error) {
        logger_1.logger.error('Database connection failed:', error);
        throw error;
    }
}
// Main optimization function
async function optimizeDatabase() {
    logger_1.logger.info('🚀 Starting database optimization...');
    try {
        // Connect to database
        await connectDatabase();
        // Create optimized indexes
        logger_1.logger.info('📊 Creating optimized indexes...');
        await (0, indexes_1.createOptimizedIndexes)();
        // Analyze index performance
        logger_1.logger.info('🔍 Analyzing index performance...');
        try {
            const analysis = await (0, indexes_1.getIndexAnalysis)();
            logger_1.logger.info('Index analysis:', analysis);
        }
        catch (error) {
            logger_1.logger.warn('Failed to analyze indexes:', error);
        }
        // Database statistics
        logger_1.logger.info('📈 Gathering database statistics...');
        const db = mongoose_1.default.connection.db;
        const stats = await db.stats();
        logger_1.logger.info('Database Statistics:', {
            collections: stats.collections,
            objects: stats.objects,
            dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
            storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
            indexes: stats.indexes,
            indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`
        });
        logger_1.logger.info('✅ Database optimization completed successfully!');
    }
    catch (error) {
        logger_1.logger.error('❌ Database optimization failed:', error);
        throw error;
    }
    finally {
        await mongoose_1.default.disconnect();
        logger_1.logger.info('Database disconnected');
    }
}
// Performance monitoring
async function monitorPerformance() {
    logger_1.logger.info('🔧 Starting performance monitoring...');
    try {
        await connectDatabase();
        const db = mongoose_1.default.connection.db;
        // Enable profiling for slow operations
        await db.command({ profile: 2, slowms: 100 });
        logger_1.logger.info('Database profiling enabled for operations > 100ms');
        // Check current operations
        const currentOps = await db.admin().command({ currentOp: 1 });
        logger_1.logger.info('Current database operations:', {
            activeOps: currentOps.inprog?.length || 0
        });
        // Check replication lag (if replica set)
        try {
            const replStatus = await db.admin().command({ replSetGetStatus: 1 });
            logger_1.logger.info('Replica set status:', {
                set: replStatus.set,
                members: replStatus.members?.length || 0
            });
        }
        catch (error) {
            logger_1.logger.info('Not running in replica set mode');
        }
    }
    catch (error) {
        logger_1.logger.error('Performance monitoring failed:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
// Cleanup old data
async function cleanupOldData() {
    logger_1.logger.info('🧹 Starting data cleanup...');
    try {
        await connectDatabase();
        const db = mongoose_1.default.connection.db;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        // Clean up old logs
        const logsCollection = db.collection('logs');
        const deletedLogs = await logsCollection.deleteMany({
            createdAt: { $lt: thirtyDaysAgo }
        });
        logger_1.logger.info(`Deleted ${deletedLogs.deletedCount} old log entries`);
        // Clean up expired sessions
        const sessionsCollection = db.collection('sessions');
        const deletedSessions = await sessionsCollection.deleteMany({
            expiresAt: { $lt: new Date() }
        });
        logger_1.logger.info(`Deleted ${deletedSessions.deletedCount} expired sessions`);
        // Clean up draft questions older than 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const questionsCollection = db.collection('questions');
        const deletedDrafts = await questionsCollection.deleteMany({
            isDraft: true,
            createdAt: { $lt: sevenDaysAgo }
        });
        logger_1.logger.info(`Deleted ${deletedDrafts.deletedCount} old draft questions`);
        logger_1.logger.info('✅ Data cleanup completed successfully!');
    }
    catch (error) {
        logger_1.logger.error('Data cleanup failed:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
// Main execution
async function main() {
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
            logger_1.logger.info('Usage: npm run db:optimize [optimize|monitor|cleanup|all]');
            process.exit(1);
    }
}
// Execute if called directly
if (require.main === module) {
    main()
        .then(() => {
        logger_1.logger.info('Script completed successfully');
        process.exit(0);
    })
        .catch((error) => {
        logger_1.logger.error('Script failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=optimize-database.js.map