/**
 * سرویس نظارت بر عملکرد سیستم (Performance Monitoring)
 * ویژگی‌ها: متریک‌های Performance، Error Tracking، Database Health
 */
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
    memoryThreshold: number;
    cpuThreshold: number;
    errorRateThreshold: number;
    responseTimeThreshold: number;
}
declare class MonitoringService {
    private metrics;
    private requestStats;
    private responseTimeSamples;
    private errorLog;
    private alertConfig;
    private monitoringInterval;
    constructor();
    private initializeMetrics;
    /**
     * شروع نظارت مداوم
     */
    startMonitoring(): void;
    /**
     * توقف نظارت
     */
    stopMonitoring(): void;
    /**
     * جمع‌آوری متریک‌های عملکرد
     */
    private collectMetrics;
    /**
     * دریافت متریک‌های CPU
     */
    private getCpuMetrics;
    /**
     * دریافت متریک‌های پایگاه داده
     */
    private getDatabaseMetrics;
    /**
     * دریافت متریک‌های درخواست‌ها
     */
    private getRequestMetrics;
    /**
     * دریافت متریک‌های خطاها
     */
    private getErrorMetrics;
    /**
     * ثبت درخواست
     */
    recordRequest(success: boolean, responseTime: number): void;
    /**
     * ثبت خطا
     */
    recordError(error: Error, type?: string): void;
    /**
     * بررسی هشدارها
     */
    private checkAlerts;
    /**
     * ارسال هشدارها
     */
    private sendAlerts;
    /**
     * لاگ خلاصه متریک‌ها
     */
    private logMetricsSummary;
    /**
     * دریافت گزارش کامل
     */
    getHealthReport(): {
        status: 'healthy' | 'warning' | 'critical';
        metrics: PerformanceMetrics;
        recommendations: string[];
    };
    /**
     * ریست کردن آمار
     */
    resetStats(): void;
    /**
     * تنظیم حد آستانه‌های هشدار
     */
    setAlertThresholds(config: Partial<AlertConfig>): void;
    /**
     * دریافت متریک‌های فعلی
     */
    getCurrentMetrics(): PerformanceMetrics;
    /**
     * پاک‌سازی منابع
     */
    cleanup(): void;
}
export declare const monitoringService: MonitoringService;
export { MonitoringService };
export type { PerformanceMetrics, AlertConfig };
