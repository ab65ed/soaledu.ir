const { execSync } = require('child_process');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/src/**/*.test.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/__tests__/setup.ts',
    '<rootDir>/src/__tests__/globalSetup.ts',
    '<rootDir>/src/__tests__/globalTeardown.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/__tests__/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000, // 30 seconds for MongoDB operations
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  globalSetup: '<rootDir>/src/__tests__/globalSetup.ts',
  globalTeardown: '<rootDir>/src/__tests__/globalTeardown.ts',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/backup/'
  ],
  // MongoDB Memory Server configuration
  testEnvironmentOptions: {
    // Options for node environment
  },
  // Handle module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Performance improvements
  maxWorkers: 1, // Single worker for MongoDB Memory Server
  forceExit: true, // Force exit after tests complete
  detectOpenHandles: true, // Detect open handles to help debug
  verbose: true
}; 