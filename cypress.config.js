const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test execution settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    
    // Browser settings
    chromeWebSecurity: false,
    
    // Environment variables
    env: {
      apiUrl: 'http://localhost:5000/api/v1',
      testUser: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      },
      testAdmin: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Test Admin'
      }
    },
    
    setupNodeEvents(on, config) {
      // Node event listeners
      on('task', {
        // Custom tasks for database seeding, etc.
        log(message) {
          console.log(message);
          return null;
        },
        
        // Task to seed test data
        seedDatabase() {
          // This would connect to test database and seed data
          console.log('Seeding test database...');
          return null;
        },
        
        // Task to clean database
        cleanDatabase() {
          console.log('Cleaning test database...');
          return null;
        }
      });
      
      // Code coverage (if needed)
      // require('@cypress/code-coverage/task')(on, config);
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.js',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
  
  // Global configuration
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Experimental features
  experimentalStudio: true,
  experimentalWebKitSupport: true,
});
