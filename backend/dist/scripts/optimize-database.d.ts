#!/usr/bin/env node
/**
 * Database Optimization Script
 * اسکریپت بهینه‌سازی پایگاه داده
 *
 * این اسکریپت Index های مورد نیاز را ایجاد می‌کند و بهینه‌سازی‌های لازم را انجام می‌دهد
 */
declare function optimizeDatabase(): Promise<void>;
declare function monitorPerformance(): Promise<void>;
declare function cleanupOldData(): Promise<void>;
export { optimizeDatabase, monitorPerformance, cleanupOldData };
