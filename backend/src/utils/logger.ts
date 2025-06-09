/**
 * Enterprise Security Logger
 * Comprehensive logging for security monitoring and audit trails
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { Request } from 'express';

// ============================= LOG LEVELS ============================= //

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'grey',
  debug: 'white',
  silly: 'rainbow'
};

winston.addColors(LOG_COLORS);

// ============================= FORMATTERS ============================= //

// Security log format (structured for SIEM systems)
const securityFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
      // Add security-specific fields
      eventType: meta.eventType || 'general',
      severity: getSeverityLevel(level),
      source: 'exam-edu-backend'
    });
  })
);

// Console format (human-readable for development)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// ============================= HELPER FUNCTIONS ============================= //

function getSeverityLevel(level: string): string {
  switch (level) {
    case 'error': return 'HIGH';
    case 'warn': return 'MEDIUM';
    case 'info': return 'LOW';
    default: return 'INFO';
  }
}

function sanitizeForLogging(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveFields = [
    'password', 'confirmPassword', 'token', 'accessToken', 
    'refreshToken', 'apiKey', 'secret', 'privateKey',
    'authorization', 'cookie', 'session'
  ];

  const sanitized = { ...data };

  function recursiveSanitize(obj: any, path: string = ''): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const key in obj) {
      const fullPath = path ? `${path}.${key}` : key;
      const lowerKey = key.toLowerCase();

      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = recursiveSanitize(obj[key], fullPath);
      }
    }

    return obj;
  }

  return recursiveSanitize(sanitized);
}

// ============================= TRANSPORTS ============================= //

const logDir = path.join(process.cwd(), 'logs');

// General application logs
const generalFileTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '30d',
  format: securityFormat,
  level: 'info'
});

// Security-specific logs
const securityFileTransport = new DailyRotateFile({
  filename: path.join(logDir, 'security-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '100m',
  maxFiles: '90d', // Keep security logs longer
  format: securityFormat,
  level: 'warn' // Only warnings and errors
});

// Error logs
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '90d',
  format: securityFormat,
  level: 'error'
});

// Audit trail for compliance
const auditFileTransport = new DailyRotateFile({
  filename: path.join(logDir, 'audit-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '100m',
  maxFiles: '365d', // Keep audit logs for 1 year
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.json()
  )
});

// Console transport for development
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
});

// ============================= LOGGER CONFIGURATION ============================= //

const logger = winston.createLogger({
  levels: LOG_LEVELS,
  transports: [
    generalFileTransport,
    securityFileTransport,
    errorFileTransport,
    auditFileTransport,
    consoleTransport
  ],
  exitOnError: false, // Don't crash on unhandled exceptions
  handleExceptions: true,
  handleRejections: true
});

// ============================= SECURITY-SPECIFIC METHODS ============================= //

interface SecurityEvent {
  eventType: 'authentication' | 'authorization' | 'validation' | 'injection' | 'rateLimit' | 'suspicious';
  action: string;
  ip?: string;
  userAgent?: string;
  userId?: string;
  requestId?: string;
  resource?: string;
  success?: boolean;
  metadata?: any;
}

interface AuditEvent {
  eventType: 'user_action' | 'admin_action' | 'system_action' | 'data_access';
  action: string;
  userId?: string;
  ip?: string;
  resource?: string;
  before?: any;
  after?: any;
  requestId?: string;
  metadata?: any;
}

// Security event logger
logger.security = (message: string, event: SecurityEvent) => {
  const sanitizedEvent = sanitizeForLogging(event);
  logger.warn(message, {
    ...sanitizedEvent,
    category: 'SECURITY',
    timestamp: new Date().toISOString()
  });
};

// Audit trail logger
logger.audit = (message: string, event: AuditEvent) => {
  const sanitizedEvent = sanitizeForLogging(event);
  auditFileTransport.write({
    level: 'info',
    message,
    ...sanitizedEvent,
    category: 'AUDIT',
    timestamp: new Date().toISOString()
  });
};

// Authentication events
logger.auth = {
  success: (userId: string, ip: string, userAgent?: string, requestId?: string) => {
    logger.security('Authentication successful', {
      eventType: 'authentication',
      action: 'login_success',
      userId,
      ip,
      userAgent,
      requestId,
      success: true
    });
  },

  failure: (email: string, ip: string, reason: string, userAgent?: string, requestId?: string) => {
    logger.security('Authentication failed', {
      eventType: 'authentication',
      action: 'login_failure',
      ip,
      userAgent,
      requestId,
      success: false,
      metadata: { email: sanitizeForLogging(email), reason }
    });
  },

  logout: (userId: string, ip: string, userAgent?: string, requestId?: string) => {
    logger.security('User logout', {
      eventType: 'authentication',
      action: 'logout',
      userId,
      ip,
      userAgent,
      requestId,
      success: true
    });
  },

  register: (userId: string, email: string, ip: string, userAgent?: string, requestId?: string) => {
    logger.audit('User registration', {
      eventType: 'user_action',
      action: 'register',
      userId,
      ip,
      requestId,
      metadata: { email: sanitizeForLogging(email), userAgent }
    });
  }
};

// Authorization events
logger.authz = {
  denied: (userId: string, resource: string, action: string, ip: string, requestId?: string) => {
    logger.security('Access denied', {
      eventType: 'authorization',
      action: 'access_denied',
      userId,
      resource,
      ip,
      requestId,
      success: false,
      metadata: { attempted_action: action }
    });
  },

  granted: (userId: string, resource: string, action: string, ip: string, requestId?: string) => {
    logger.audit('Access granted', {
      eventType: 'user_action',
      action: 'access_granted',
      userId,
      resource,
      ip,
      requestId,
      metadata: { granted_action: action }
    });
  }
};

// Validation and injection attempts
logger.validation = {
  failed: (ip: string, errors: any[], url: string, userAgent?: string, requestId?: string) => {
    logger.security('Validation failed', {
      eventType: 'validation',
      action: 'validation_failure',
      ip,
      userAgent,
      requestId,
      resource: url,
      success: false,
      metadata: { errors: sanitizeForLogging(errors) }
    });
  },

  injectionAttempt: (ip: string, type: string, payload: string, url: string, userAgent?: string, requestId?: string) => {
    logger.security('Injection attempt detected', {
      eventType: 'injection',
      action: `${type}_injection_attempt`,
      ip,
      userAgent,
      requestId,
      resource: url,
      success: false,
      metadata: { 
        injection_type: type,
        payload: payload.substring(0, 100) // Limit payload size in logs
      }
    });
  }
};

// Rate limiting events
logger.rateLimit = {
  exceeded: (ip: string, endpoint: string, limit: number, userAgent?: string, requestId?: string) => {
    logger.security('Rate limit exceeded', {
      eventType: 'rateLimit',
      action: 'rate_limit_exceeded',
      ip,
      userAgent,
      requestId,
      resource: endpoint,
      success: false,
      metadata: { limit, window: '15m' }
    });
  }
};

// Suspicious activity
logger.suspicious = {
  activity: (ip: string, description: string, metadata: any = {}, userAgent?: string, requestId?: string) => {
    logger.security('Suspicious activity detected', {
      eventType: 'suspicious',
      action: 'suspicious_activity',
      ip,
      userAgent,
      requestId,
      success: false,
      metadata: {
        description,
        ...sanitizeForLogging(metadata)
      }
    });
  },

  botDetected: (ip: string, method: string, userAgent?: string, requestId?: string, metadata?: any) => {
    logger.security('Bot detected', {
      eventType: 'suspicious',
      action: 'bot_detected',
      ip,
      userAgent,
      requestId,
      success: false,
      metadata: {
        detection_method: method,
        ...sanitizeForLogging(metadata)
      }
    });
  }
};

// ============================= REQUEST LOGGER ============================= //

export const requestLogger = (req: Request, res: any, next: any) => {
  const startTime = Date.now();
  
  // Log request start
  logger.http('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'http';
    
    logger.log(logLevel, 'HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

// ============================= ERROR LOGGER ============================= //

export const errorLogger = (error: Error, req: Request, res: any, next: any) => {
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });

  next(error);
};

// ============================= EXPORTS ============================= //

export { logger };
export default logger;

// Types for TypeScript
declare module 'winston' {
  interface Logger {
    security: (message: string, event: SecurityEvent) => void;
    audit: (message: string, event: AuditEvent) => void;
    auth: {
      success: (userId: string, ip: string, userAgent?: string, requestId?: string) => void;
      failure: (email: string, ip: string, reason: string, userAgent?: string, requestId?: string) => void;
      logout: (userId: string, ip: string, userAgent?: string, requestId?: string) => void;
      register: (userId: string, email: string, ip: string, userAgent?: string, requestId?: string) => void;
    };
    authz: {
      denied: (userId: string, resource: string, action: string, ip: string, requestId?: string) => void;
      granted: (userId: string, resource: string, action: string, ip: string, requestId?: string) => void;
    };
    validation: {
      failed: (ip: string, errors: any[], url: string, userAgent?: string, requestId?: string) => void;
      injectionAttempt: (ip: string, type: string, payload: string, url: string, userAgent?: string, requestId?: string) => void;
    };
    rateLimit: {
      exceeded: (ip: string, endpoint: string, limit: number, userAgent?: string, requestId?: string) => void;
    };
    suspicious: {
      activity: (ip: string, description: string, metadata?: any, userAgent?: string, requestId?: string) => void;
      botDetected: (ip: string, method: string, userAgent?: string, requestId?: string, metadata?: any) => void;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
} 