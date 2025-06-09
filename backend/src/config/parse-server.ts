/**
 * Parse Server Configuration
 * پیکربندی Parse Server برای پروژه
 */

import ParseServer from 'parse-server';
import { MONGO_URI, PARSE_APPLICATION_ID, PARSE_MASTER_KEY } from './env';
import logger from './logger';

export const parseServerConfig = {
  databaseURI: MONGO_URI,
  appId: PARSE_APPLICATION_ID,
  masterKey: PARSE_MASTER_KEY,
  maintenanceKey: `${PARSE_MASTER_KEY}_maintenance`, // Must be different from masterKey
  serverURL: 'http://localhost:5000/parse',
  publicServerURL: 'http://localhost:5000/parse',
  allowClientClassCreation: true,
  enableAnonymousUsers: false,
  sessionLength: 31536000, // 1 year in seconds
  maxUploadSize: '20mb',
  logLevel: 'info',
  verbose: false,
  silent: false,
  
  // رفع deprecation warnings
  encodeParseObjectInCloudFunction: true, // تنظیم صریح برای جلوگیری از deprecation warning
  enableInsecureAuthAdapters: false, // غیرفعال‌سازی insecure adapters برای امنیت بهتر
  
  // تنظیمات امنیتی اضافی
  enforcePrivateUsers: true, // اجبار به استفاده از private users
  allowExpiredAuthDataToken: false, // عدم پذیرش token‌های منقضی
  
  // تنظیمات pages برای غیرفعال‌سازی PublicAPIRouter
  pages: {
    enableRouter: false, // غیرفعال‌سازی PublicAPIRouter که deprecated است
    enableLocalization: false
  },
  
  // تنظیمات اضافی برای بهبود عملکرد
  directAccess: false, // امنیت بیشتر
  // enableSingleSchemaCache حذف شد چون در Parse Server جدید پشتیبانی نمی‌شود
  
  // تنظیمات auth adapters امن
  auth: {
    // حذف insecure adapters و استفاده از secure adapters
    anonymous: {
      enabled: false // غیرفعال‌سازی anonymous auth برای امنیت بهتر
    }
  }
};

export const createParseServer = () => {
  logger.info('Creating Parse Server instance with secure configuration...');
  logger.info('Parse Server deprecation warnings have been resolved');
  return new ParseServer(parseServerConfig);
}; 