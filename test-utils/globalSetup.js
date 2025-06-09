const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
  process.env.JWT_EXPIRES_IN = '7d';
  
  // Mock external service URLs
  process.env.ZARINPAL_MERCHANT_ID = 'test-merchant-id';
  process.env.ZARINPAL_SANDBOX = 'true';
  
  // Mock email service
  process.env.EMAIL_SERVICE = 'test';
  process.env.EMAIL_FROM = 'test@example.com';
  
  // Mock upload service
  process.env.UPLOAD_PATH = '/tmp/test-uploads';
  process.env.MAX_FILE_SIZE = '5242880'; // 5MB
  
  // Mock Back4App (if used)
  process.env.BACK4APP_APP_ID = 'test-app-id';
  process.env.BACK4APP_REST_API_KEY = 'test-rest-api-key';
  
  console.log('Global test setup completed');
};
