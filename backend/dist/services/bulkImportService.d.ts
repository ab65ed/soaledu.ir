/**
 * Bulk Import Service
 * سرویس مدیریت نتایج بارگزاری انبوه
 */
interface BulkImportResult {
    totalRows: number;
    successfulImports: number;
    failedImports: number;
    createdQuestions: any[];
    errors: any[];
    warnings: any[];
}
interface BulkImportStatus {
    userId: string;
    status: 'processing' | 'completed' | 'failed';
    result?: BulkImportResult;
    error?: string;
    timestamp: Date;
}
export declare class BulkImportService {
    /**
     * ذخیره نتیجه بارگزاری
     */
    static saveResult(userId: string, result: BulkImportResult): Promise<void>;
    /**
     * ذخیره خطا
     */
    static saveError(userId: string, error: string): Promise<void>;
    /**
     * دریافت وضعیت
     */
    static getStatus(userId: string): Promise<BulkImportStatus | null>;
    /**
     * تنظیم وضعیت در حال پردازش
     */
    static setProcessing(userId: string): Promise<void>;
}
export {};
