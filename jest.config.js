module.exports = {
  // Test environment configuration
  projects: [
    {
      displayName: 'frontend',
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}'
      ],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/test-utils/setupTests.js'],
      rootDir: 'frontend',
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/services/api.jsx$': '<rootDir>/src/services/api.jsx',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/test-utils/__mocks__/fileMock.js'
      },
      testEnvironmentOptions: {
        url: 'http://localhost'
      },
      modulePaths: ['<rootDir>/src'],
      transform: {
        '^.+\\.(js|jsx)$': ['@swc/jest', {
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true
            },
            transform: {
              react: {
                runtime: 'automatic'
              }
            }
          }
        }],
        '^.+\\.(ts|tsx)$': ['@swc/jest', {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true
            },
            transform: {
              react: {
                runtime: 'automatic'
              }
            }
          }
        }]
      },
      collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/test-utils/**',
        '!src/**/__tests__/**',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/**/*.spec.{js,jsx,ts,tsx}',
        '!src/pages/_app.jsx',
        '!src/pages/_document.jsx',
        '!src/pages/api/**',
        '!src/app/layout.jsx', // App Router layout
        '!src/app/head.jsx', // App Router head
        '!src/lib/queryClient.jsx',
        '!src/store/index.jsx',
        '!src/utils/performance.js', // Performance utilities are tested separately
        '!src/components/molecules/UnansweredQuestionsModal.jsx' // Complex modal tested in E2E
      ],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/backend/tests/**/*.{js,test.js}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/backend/test-utils/setupTests.js'],
      collectCoverageFrom: [
        'backend/src/**/*.js',
        '!backend/src/server.js',
        '!backend/src/config/**',
        '!backend/tests/**',
        '!backend/test-utils/**',
        '!backend/src/**/*.test.js',
        '!backend/src/**/*.spec.js'
      ],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  ],

  // Global configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Test execution settings
  verbose: true,
  testTimeout: 10000,
  maxWorkers: '50%',

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Error handling
  errorOnDeprecated: true,

  // Watch mode settings
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/frontend/node_modules/',
    '<rootDir>/backend/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
    '<rootDir>/cypress/'
  ],

  // Global setup and teardown
  globalSetup: '<rootDir>/test-utils/globalSetup.js',
  globalTeardown: '<rootDir>/test-utils/globalTeardown.js'
};
