/**
 * Parse Server Configuration
 * پیکربندی Parse Server برای پروژه
 */
import ParseServer from 'parse-server';
export declare const parseServerConfig: {
    databaseURI: string;
    appId: string;
    masterKey: string;
    maintenanceKey: string;
    serverURL: string;
    publicServerURL: string;
    allowClientClassCreation: boolean;
    enableAnonymousUsers: boolean;
    sessionLength: number;
    maxUploadSize: string;
    logLevel: string;
    verbose: boolean;
    silent: boolean;
    encodeParseObjectInCloudFunction: boolean;
    enableInsecureAuthAdapters: boolean;
    enforcePrivateUsers: boolean;
    allowExpiredAuthDataToken: boolean;
    pages: {
        enableRouter: boolean;
        enableLocalization: boolean;
    };
    directAccess: boolean;
    auth: {
        anonymous: {
            enabled: boolean;
        };
    };
};
export declare const createParseServer: () => ParseServer;
