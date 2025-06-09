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
    serverURL: 'http://localhost:1337/parse',
    publicServerURL: 'http://localhost:1337/parse',
    allowClientClassCreation: true,
    enableAnonymousUsers: false,
    sessionLength: 31536000, // 1 year in seconds
    maxUploadSize: '20mb',
    logLevel: 'info',
    verbose: false,
    silent: false
};
const createParseServer = () => {
    logger_1.default.info('Creating Parse Server instance...');
    return new parse_server_1.default(exports.parseServerConfig);
};
exports.createParseServer = createParseServer;
//# sourceMappingURL=parse-server.js.map