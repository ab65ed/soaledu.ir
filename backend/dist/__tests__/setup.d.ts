/**
 * Test Setup
 * تنظیمات اولیه تست‌ها
 */
declare const originalError: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
