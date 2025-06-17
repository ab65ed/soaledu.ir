/**
 * سرویس نظارت بر عملکرد سیستم (Performance Monitoring)
 * ویژگی‌ها: متریک‌های Performance، Error Tracking، Database Health
 */

import logger from '../config/logger';
import mongoose from 'mongoose';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

interface PerformanceMetrics {
  timestamp: Date;
  memory: NodeJS.MemoryUsage;
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  database: {
    connected: boolean;
    responseTime: number;
    activeConnections: number;
  };
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
  errors: {
    count: number;
    types: Record<string, number>;
    recent: Array<{
      timestamp: Date;
      message: string;
      stack?: string;
      type: string;
    }>;
  };
}

interface AlertConfig {
  memoryThreshold: number; // MB
  cpuThreshold: number; // Percentage
  errorRateThreshold: number; // Percentage
  responseTimeThreshold: number; // ms
}

class MonitoringService {
  private metrics: PerformanceMetrics;
  private requestStats: Map<string, number> = new Map();
  private responseTimeSamples: number[] = [];
  private errorLog: Array<any> = [];
  private alertConfig: AlertConfig;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.alertConfig = {
      memoryThreshold: 512, // 512 MB
      cpuThreshold: 80, // 80%
      errorRateThreshold: 5, // 5%
      responseTimeThreshold: 2000 // 2 seconds
    };

    this.startMonitoring();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      timestamp: new Date(),
      memory: process.memoryUsage(),
      cpu: {
        usage: 0,
        loadAverage: []
      },
      database: {
        connected: false,
        responseTime: 0,
        activeConnections: 0
      },
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0
      },
      errors: {
        count: 0,
        types: {},
        recent: []
      }
    };
  }

  /**
   * شروع نظارت مداوم
   */
  startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      await this.collectMetrics();
      this.checkAlerts();
    }, 30000); // Every 30 seconds

    logger.info('🔍 سیستم نظارت شروع شد', {
      interval: '30 seconds',
      alertConfig: this.alertConfig
    });
  }

  /**
   * توقف نظارت
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logger.info('⏹️ سیستم نظارت متوقف شد');
    }
  }

  /**
   * جمع‌آوری متریک‌های عملکرد
   */
  private async collectMetrics(): Promise<void> {
    try {
      // Memory metrics
      this.metrics.memory = process.memoryUsage();

      // CPU metrics
      this.metrics.cpu = await this.getCpuMetrics();

      // Database metrics
      this.metrics.database = await this.getDatabaseMetrics();

      // Request metrics
      this.metrics.requests = this.getRequestMetrics();

      // Error metrics
      this.metrics.errors = this.getErrorMetrics();

      this.metrics.timestamp = new Date();

      // Log metrics periodically
      if (new Date().getMinutes() % 5 === 0) {
        this.logMetricsSummary();
      }

    } catch (error) {
      logger.error('❌ خطا در جمع‌آوری متریک‌ها:', error);
    }
  }

  /**
   * دریافت متریک‌های CPU
   */
  private async getCpuMetrics(): Promise<{ usage: number; loadAverage: number[] }> {
    try {
      const loadAverage = process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0];
      
      // Simple CPU usage calculation
      let cpuUsage = 0;
      try {
        const { stdout } = await execAsync('ps -o %cpu -p ' + process.pid);
        const cpuLine = stdout.split('\n')[1];
        cpuUsage = parseFloat(cpuLine) || 0;
      } catch {
        cpuUsage = 0;
      }

      return {
        usage: cpuUsage,
        loadAverage: loadAverage
      };
    } catch (error) {
      return {
        usage: 0,
        loadAverage: [0, 0, 0]
      };
    }
  }

  /**
   * دریافت متریک‌های پایگاه داده
   */
  private async getDatabaseMetrics(): Promise<{
    connected: boolean;
    responseTime: number;
    activeConnections: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Test database connection
      await mongoose.connection.db.admin().ping();
      const responseTime = Date.now() - startTime;

      const connected = mongoose.connection.readyState === 1;
      const activeConnections = mongoose.connections.length;

      return {
        connected,
        responseTime,
        activeConnections
      };

    } catch (error) {
      return {
        connected: false,
        responseTime: Date.now() - startTime,
        activeConnections: 0
      };
    }
  }

  /**
   * دریافت متریک‌های درخواست‌ها
   */
  private getRequestMetrics(): typeof this.metrics.requests {
    const total = this.requestStats.get('total') || 0;
    const successful = this.requestStats.get('successful') || 0;
    const failed = this.requestStats.get('failed') || 0;

    const averageResponseTime = this.responseTimeSamples.length > 0
      ? this.responseTimeSamples.reduce((a, b) => a + b, 0) / this.responseTimeSamples.length
      : 0;

    return {
      total,
      successful,
      failed,
      averageResponseTime: Math.round(averageResponseTime)
    };
  }

  /**
   * دریافت متریک‌های خطاها
   */
  private getErrorMetrics(): typeof this.metrics.errors {
    const recent = this.errorLog
      .slice(-10) // Last 10 errors
      .map(error => ({
        timestamp: error.timestamp,
        message: error.message,
        stack: error.stack,
        type: error.type || 'unknown'
      }));

    const types: Record<string, number> = {};
    this.errorLog.forEach(error => {
      const type = error.type || 'unknown';
      types[type] = (types[type] || 0) + 1;
    });

    return {
      count: this.errorLog.length,
      types,
      recent
    };
  }

  /**
   * ثبت درخواست
   */
  recordRequest(success: boolean, responseTime: number): void {
    const total = this.requestStats.get('total') || 0;
    this.requestStats.set('total', total + 1);

    if (success) {
      const successful = this.requestStats.get('successful') || 0;
      this.requestStats.set('successful', successful + 1);
    } else {
      const failed = this.requestStats.get('failed') || 0;
      this.requestStats.set('failed', failed + 1);
    }

    // Keep only last 100 response time samples
    this.responseTimeSamples.push(responseTime);
    if (this.responseTimeSamples.length > 100) {
      this.responseTimeSamples.shift();
    }
  }

  /**
   * ثبت خطا
   */
  recordError(error: Error, type?: string): void {
    const errorRecord = {
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      type: type || error.constructor.name
    };

    this.errorLog.push(errorRecord);

    // Keep only last 1000 errors
    if (this.errorLog.length > 1000) {
      this.errorLog.shift();
    }

    logger.error('🚨 خطای جدید ثبت شد:', {
      type: errorRecord.type,
      message: errorRecord.message
    });
  }

  /**
   * بررسی هشدارها
   */
  private checkAlerts(): void {
    const alerts: string[] = [];

    // Memory alert
    const memoryUsageMB = this.metrics.memory.heapUsed / 1024 / 1024;
    if (memoryUsageMB > this.alertConfig.memoryThreshold) {
      alerts.push(`مصرف حافظه زیاد: ${Math.round(memoryUsageMB)} MB`);
    }

    // CPU alert
    if (this.metrics.cpu.usage > this.alertConfig.cpuThreshold) {
      alerts.push(`مصرف CPU زیاد: ${this.metrics.cpu.usage}%`);
    }

    // Database alert
    if (!this.metrics.database.connected) {
      alerts.push('قطع اتصال پایگاه داده');
    } else if (this.metrics.database.responseTime > 1000) {
      alerts.push(`پاسخ کند پایگاه داده: ${this.metrics.database.responseTime}ms`);
    }

    // Error rate alert
    const errorRate = this.metrics.requests.total > 0
      ? (this.metrics.requests.failed / this.metrics.requests.total) * 100
      : 0;
    
    if (errorRate > this.alertConfig.errorRateThreshold) {
      alerts.push(`نرخ خطای بالا: ${Math.round(errorRate)}%`);
    }

    // Response time alert
    if (this.metrics.requests.averageResponseTime > this.alertConfig.responseTimeThreshold) {
      alerts.push(`زمان پاسخ بالا: ${this.metrics.requests.averageResponseTime}ms`);
    }

    // Send alerts
    if (alerts.length > 0) {
      this.sendAlerts(alerts);
    }
  }

  /**
   * ارسال هشدارها
   */
  private sendAlerts(alerts: string[]): void {
    logger.warn('🚨 هشدارهای سیستم:', {
      alerts,
      timestamp: new Date().toISOString()
    });

    // TODO: Send to external monitoring service (Slack, Email, etc.)
    // For now, just log to console
    console.warn('\n🚨 هشدارهای سیستم:');
    alerts.forEach(alert => console.warn(`  - ${alert}`));
    console.warn('');
  }

  /**
   * لاگ خلاصه متریک‌ها
   */
  private logMetricsSummary(): void {
    const memoryMB = Math.round(this.metrics.memory.heapUsed / 1024 / 1024);
    const errorRate = this.metrics.requests.total > 0
      ? ((this.metrics.requests.failed / this.metrics.requests.total) * 100).toFixed(2)
      : '0.00';

    logger.info('📊 خلاصه متریک‌های سیستم:', {
      memory: `${memoryMB} MB`,
      cpu: `${this.metrics.cpu.usage}%`,
      database: {
        connected: this.metrics.database.connected,
        responseTime: `${this.metrics.database.responseTime}ms`
      },
      requests: {
        total: this.metrics.requests.total,
        errorRate: `${errorRate}%`,
        avgResponseTime: `${this.metrics.requests.averageResponseTime}ms`
      },
      errors: this.metrics.errors.count
    });
  }

  /**
   * دریافت گزارش کامل
   */
  getHealthReport(): {
    status: 'healthy' | 'warning' | 'critical';
    metrics: PerformanceMetrics;
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check memory
    const memoryMB = this.metrics.memory.heapUsed / 1024 / 1024;
    if (memoryMB > this.alertConfig.memoryThreshold) {
      issues.push('high_memory');
      recommendations.push('بررسی نشت حافظه و بهینه‌سازی کد');
    }

    // Check CPU
    if (this.metrics.cpu.usage > this.alertConfig.cpuThreshold) {
      issues.push('high_cpu');
      recommendations.push('بهینه‌سازی الگوریتم‌ها و اضافه کردن کش');
    }

    // Check database
    if (!this.metrics.database.connected) {
      issues.push('database_disconnected');
      recommendations.push('بررسی اتصال پایگاه داده');
    } else if (this.metrics.database.responseTime > 500) {
      issues.push('slow_database');
      recommendations.push('بهینه‌سازی کوئری‌ها و اضافه کردن ایندکس');
    }

    // Check error rate
    const errorRate = this.metrics.requests.total > 0
      ? (this.metrics.requests.failed / this.metrics.requests.total) * 100
      : 0;

    if (errorRate > this.alertConfig.errorRateThreshold) {
      issues.push('high_error_rate');
      recommendations.push('بررسی و رفع خطاهای رایج');
    }

    // Determine status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.some(issue => issue.includes('disconnected'))) {
      status = 'critical';
    } else if (issues.length > 0) {
      status = 'warning';
    }

    return {
      status,
      metrics: this.metrics,
      recommendations
    };
  }

  /**
   * ریست کردن آمار
   */
  resetStats(): void {
    this.requestStats.clear();
    this.responseTimeSamples = [];
    this.errorLog = [];
    this.metrics = this.initializeMetrics();

    logger.info('🔄 آمار سیستم نظارت ریست شد');
  }

  /**
   * تنظیم حد آستانه‌های هشدار
   */
  setAlertThresholds(config: Partial<AlertConfig>): void {
    this.alertConfig = { ...this.alertConfig, ...config };
    
    logger.info('⚙️ تنظیمات هشدار به‌روزرسانی شد:', this.alertConfig);
  }

  /**
   * دریافت متریک‌های فعلی
   */
  getCurrentMetrics(): PerformanceMetrics {
    return this.metrics;
  }

  /**
   * پاک‌سازی منابع
   */
  cleanup(): void {
    this.stopMonitoring();
    this.resetStats();
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();

export { MonitoringService };
export type { PerformanceMetrics, AlertConfig }; 