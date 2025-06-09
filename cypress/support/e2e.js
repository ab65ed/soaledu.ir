// Import commands
import './commands';

// Import Cypress plugins
import 'cypress-real-events/support';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // that are not related to our tests
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  return true;
});

// Global before hook
beforeEach(() => {
  // Clear localStorage and sessionStorage
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Set viewport for consistent testing
  cy.viewport(1280, 720);
  
  // Intercept common API calls
  cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe');
  cy.intercept('POST', '/api/v1/auth/login', { fixture: 'loginResponse.json' }).as('login');
  cy.intercept('POST', '/api/v1/auth/logout', { statusCode: 200, body: { success: true } }).as('logout');
});

// Global after hook
afterEach(() => {
  // Clean up any test data if needed
  cy.task('log', 'Test completed');
});

// Custom assertions
Cypress.Commands.add('shouldBeVisible', (selector) => {
  cy.get(selector).should('be.visible');
});

Cypress.Commands.add('shouldContainText', (selector, text) => {
  cy.get(selector).should('contain.text', text);
});

Cypress.Commands.add('shouldHaveClass', (selector, className) => {
  cy.get(selector).should('have.class', className);
});

// Accessibility testing
Cypress.Commands.add('checkA11y', (selector = null) => {
  // Basic accessibility checks
  if (selector) {
    cy.get(selector).should('be.visible');
  }
  
  // Check for proper heading structure
  cy.get('h1').should('have.length.at.most', 1);
  
  // Check for alt text on images
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.attr', 'alt');
  });
  
  // Check for form labels
  cy.get('input, textarea, select').each(($input) => {
    const id = $input.attr('id');
    if (id) {
      cy.get(`label[for="${id}"]`).should('exist');
    }
  });
});

// Performance testing
Cypress.Commands.add('checkPageLoad', (maxTime = 3000) => {
  cy.window().then((win) => {
    const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
    expect(loadTime).to.be.lessThan(maxTime);
  });
});

// Mobile testing helpers
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667); // iPhone SE
});

Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024); // iPad
});

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720); // Desktop
});

// RTL testing helpers
Cypress.Commands.add('checkRTL', () => {
  cy.get('html').should('have.attr', 'dir', 'rtl');
  cy.get('body').should('have.css', 'direction', 'rtl');
});

// Persian text validation
Cypress.Commands.add('shouldContainPersianText', (selector, text) => {
  cy.get(selector).should('contain.text', text);
  // Additional Persian text validation can be added here
});

// Wait for animations to complete
Cypress.Commands.add('waitForAnimations', () => {
  cy.wait(500); // Wait for common animation durations
});

// Custom error handling
Cypress.on('fail', (err, runnable) => {
  // Log additional context on failure
  cy.task('log', `Test failed: ${runnable.title}`);
  cy.task('log', `Error: ${err.message}`);
  throw err;
});
