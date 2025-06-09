describe('Authentication - Login', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
    
    // Check for Persian text
    cy.shouldContainPersianText('h1', 'ورود');
    cy.shouldContainPersianText('label', 'ایمیل');
    cy.shouldContainPersianText('label', 'رمز عبور');
  });

  it('should login with valid credentials', () => {
    const user = Cypress.env('testUser');
    
    cy.get('[data-testid="email-input"]').type(user.email);
    cy.get('[data-testid="password-input"]').type(user.password);
    cy.get('[data-testid="login-button"]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.shouldBeLoggedIn();
    
    // Should show success message
    cy.shouldShowSuccessMessage('ورود موفقیت‌آمیز بود');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    // Should stay on login page
    cy.url().should('include', '/auth/login');
    cy.shouldBeLoggedOut();
    
    // Should show error message
    cy.shouldShowErrorMessage('ایمیل یا رمز عبور اشتباه است');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="login-button"]').click();
    
    // Should show validation errors
    cy.get('[data-testid="email-error"]').should('contain.text', 'ایمیل الزامی است');
    cy.get('[data-testid="password-error"]').should('contain.text', 'رمز عبور الزامی است');
  });

  it('should validate email format', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="email-error"]').should('contain.text', 'فرمت ایمیل صحیح نیست');
  });

  it('should toggle password visibility', () => {
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');
    cy.get('[data-testid="password-toggle"]').click();
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text');
    cy.get('[data-testid="password-toggle"]').click();
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');
  });

  it('should navigate to register page', () => {
    cy.get('[data-testid="register-link"]').click();
    cy.url().should('include', '/auth/register');
  });

  it('should navigate to forgot password page', () => {
    cy.get('[data-testid="forgot-password-link"]').click();
    cy.url().should('include', '/auth/forgot-password');
  });

  it('should handle loading state', () => {
    // Intercept login request with delay
    cy.intercept('POST', '/api/v1/auth/login', {
      delay: 2000,
      fixture: 'loginResponse.json'
    }).as('slowLogin');
    
    const user = Cypress.env('testUser');
    cy.get('[data-testid="email-input"]').type(user.email);
    cy.get('[data-testid="password-input"]').type(user.password);
    cy.get('[data-testid="login-button"]').click();
    
    // Should show loading state
    cy.get('[data-testid="login-button"]').should('be.disabled');
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    
    cy.wait('@slowLogin');
    cy.url().should('include', '/dashboard');
  });

  it('should work on mobile devices', () => {
    cy.setMobileViewport();
    
    // Form should be responsive
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
    
    // Should be able to login on mobile
    const user = Cypress.env('testUser');
    cy.get('[data-testid="email-input"]').type(user.email);
    cy.get('[data-testid="password-input"]').type(user.password);
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  it('should support RTL layout', () => {
    cy.checkRTL();
    
    // Check text alignment
    cy.get('[data-testid="login-form"]').should('have.css', 'direction', 'rtl');
    cy.get('[data-testid="email-input"]').should('have.css', 'text-align', 'right');
  });

  it('should handle keyboard navigation', () => {
    // Tab through form elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'email-input');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'password-input');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'login-button');
    
    // Submit with Enter key
    const user = Cypress.env('testUser');
    cy.get('[data-testid="email-input"]').type(user.email);
    cy.get('[data-testid="password-input"]').type(user.password).type('{enter}');
    
    cy.url().should('include', '/dashboard');
  });

  it('should check accessibility', () => {
    cy.checkA11y('[data-testid="login-form"]');
    
    // Check form labels
    cy.get('[data-testid="email-input"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="password-input"]').should('have.attr', 'aria-label');
    
    // Check error messages have proper ARIA attributes
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-error"]').should('have.attr', 'role', 'alert');
  });

  it('should measure page performance', () => {
    cy.checkPageLoad(3000);
  });

  it('should remember user session', () => {
    const user = Cypress.env('testUser');
    
    // Login
    cy.get('[data-testid="email-input"]').type(user.email);
    cy.get('[data-testid="password-input"]').type(user.password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
    
    // Refresh page
    cy.reload();
    
    // Should still be logged in
    cy.url().should('include', '/dashboard');
    cy.shouldBeLoggedIn();
  });

  it('should handle network errors', () => {
    // Simulate network error
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 500,
      body: { success: false, message: 'خطای سرور' }
    }).as('loginError');
    
    const user = Cypress.env('testUser');
    cy.get('[data-testid="email-input"]').type(user.email);
    cy.get('[data-testid="password-input"]').type(user.password);
    cy.get('[data-testid="login-button"]').click();
    
    cy.wait('@loginError');
    cy.shouldShowErrorMessage('خطای سرور');
    cy.shouldBeLoggedOut();
  });
});
