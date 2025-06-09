"use strict";
/**
 * Parse Server Configuration
 * پیکربندی Parse Server برای پروژه
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParseServer = exports.parseServerConfig = void 0;
const parse_server_1 = __importDefault(require("parse-server"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
exports.parseServerConfig = {
    databaseURI: env_1.MONGO_URI,
    appId: env_1.PARSE_APPLICATION_ID,
    masterKey: env_1.PARSE_MASTER_KEY,
    maintenanceKey: `${env_1.PARSE_MASTER_KEY}_maintenance`, // Must be different from masterKey
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
const createParseServer = () => {
    logger_1.default.info('Creating Parse Server instance with secure configuration...');
    logger_1.default.info('Parse Server deprecation warnings have been resolved');
    return new parse_server_1.default(exports.parseServerConfig);
};
exports.createParseServer = createParseServer;
//# sourceMappingURL=parse-server.js.map