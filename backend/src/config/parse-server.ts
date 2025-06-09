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

export const createParseServer = () => {
  logger.info('Creating Parse Server instance...');
  return new ParseServer(parseServerConfig);
}; 