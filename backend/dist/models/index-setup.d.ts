/**
 * MongoDB Index Setup for Parse Server
 * تنظیم ایندکس‌های MongoDB برای بهینه‌سازی کارایی
 */
export interface IndexConfig {
    className: string;
    indexName: string;
    fields: Record<string, any>;
    options?: any;
}
/**
 * تنظیمات ایندکس‌ها برای مدل‌های مختلف
 */
export declare const indexConfigs: IndexConfig[];
/**
 * ایجاد ایندکس‌ها در MongoDB از طریق Parse Server
 * برای Parse Server، ایندکس‌ها باید مستقیماً در MongoDB ایجاد شوند
 */
export declare const createIndexes: () => Promise<void>;
/**
 * بررسی وجود ایندکس‌ها
 */
export declare const checkIndexes: () => Promise<boolean>;
/**
 * اسکریپت نصب ایندکس‌ها برای MongoDB
 */
export declare const generateMongoIndexScript: () => string;
declare const _default: {
    createIndexes: () => Promise<void>;
    checkIndexes: () => Promise<boolean>;
    generateMongoIndexScript: () => string;
    indexConfigs: IndexConfig[];
};
export default _default;
