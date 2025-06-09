// Authentication commands
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.session([email, password], () => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('not.include', '/auth/login');
    cy.window().its('localStorage.token').should('exist');
  });
});

Cypress.Commands.add('loginAsAdmin', () => {
  const admin = Cypress.env('testAdmin');
  cy.login(admin.email, admin.password);
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/auth/login');
});

// Navigation commands
Cypress.Commands.add('visitDashboard', () => {
  cy.visit('/dashboard');
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('visitAdminPanel', () => {
  cy.visit('/admin');
  cy.url().should('include', '/admin');
});

Cypress.Commands.add('visitProfile', () => {
  cy.visit('/profile');
  cy.url().should('include', '/profile');
});

Cypress.Commands.add('visitExams', () => {
  cy.visit('/exams');
  cy.url().should('include', '/exams');
});

Cypress.Commands.add('visitBlog', () => {
  cy.visit('/blog');
  cy.url().should('include', '/blog');
});

// Form commands
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    const selector = `[data-testid="${key}-input"]`;
    
    cy.get(selector).then($el => {
      const tagName = $el.prop('tagName').toLowerCase();
      const type = $el.attr('type');
      
      if (tagName === 'select') {
        cy.get(selector).select(value);
      } else if (type === 'checkbox') {
        if (value) {
          cy.get(selector).check();
        } else {
          cy.get(selector).uncheck();
        }
      } else if (type === 'radio') {
        cy.get(`${selector}[value="${value}"]`).check();
      } else {
        cy.get(selector).clear().type(value);
      }
    });
  });
});

Cypress.Commands.add('submitForm', (formSelector = 'form') => {
  cy.get(formSelector).submit();
});

// File upload commands
Cypress.Commands.add('uploadFile', (selector, fileName, fileType = 'image/jpeg') => {
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get(selector).selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName,
      mimeType: fileType,
    });
  });
});

// Wait commands
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
});

Cypress.Commands.add('waitForApiCall', (alias) => {
  cy.wait(alias);
});

// Table commands
Cypress.Commands.add('getTableRow', (rowIndex) => {
  return cy.get('tbody tr').eq(rowIndex);
});

Cypress.Commands.add('getTableCell', (rowIndex, columnIndex) => {
  return cy.getTableRow(rowIndex).find('td').eq(columnIndex);
});

Cypress.Commands.add('sortTableBy', (columnName) => {
  cy.get(`[data-testid="sort-${columnName}"]`).click();
});

Cypress.Commands.add('filterTable', (filterValue) => {
  cy.get('[data-testid="table-filter"]').type(filterValue);
});

// Modal commands
Cypress.Commands.add('openModal', (triggerSelector) => {
  cy.get(triggerSelector).click();
  cy.get('[data-testid="modal"]').should('be.visible');
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close"]').click();
  cy.get('[data-testid="modal"]').should('not.exist');
});

Cypress.Commands.add('confirmModal', () => {
  cy.get('[data-testid="modal-confirm"]').click();
});

// Notification commands
Cypress.Commands.add('shouldShowSuccessMessage', (message) => {
  cy.get('[data-testid="success-toast"]').should('be.visible').and('contain.text', message);
});

Cypress.Commands.add('shouldShowErrorMessage', (message) => {
  cy.get('[data-testid="error-toast"]').should('be.visible').and('contain.text', message);
});

// Search commands
Cypress.Commands.add('searchFor', (query) => {
  cy.get('[data-testid="search-input"]').type(query);
  cy.get('[data-testid="search-button"]').click();
});

Cypress.Commands.add('clearSearch', () => {
  cy.get('[data-testid="search-input"]').clear();
  cy.get('[data-testid="search-button"]').click();
});

// Pagination commands
Cypress.Commands.add('goToPage', (pageNumber) => {
  cy.get(`[data-testid="page-${pageNumber}"]`).click();
});

Cypress.Commands.add('goToNextPage', () => {
  cy.get('[data-testid="next-page"]').click();
});

Cypress.Commands.add('goToPreviousPage', () => {
  cy.get('[data-testid="previous-page"]').click();
});

// Exam commands
Cypress.Commands.add('startExam', (examId) => {
  cy.visit(`/exams/${examId}`);
  cy.get('[data-testid="start-exam-button"]').click();
});

Cypress.Commands.add('answerQuestion', (questionIndex, answerIndex) => {
  cy.get(`[data-testid="question-${questionIndex}"]`).within(() => {
    cy.get(`[data-testid="option-${answerIndex}"]`).click();
  });
});

Cypress.Commands.add('submitExam', () => {
  cy.get('[data-testid="submit-exam-button"]').click();
  cy.get('[data-testid="confirm-submit"]').click();
});

// Payment commands
Cypress.Commands.add('addToWallet', (amount) => {
  cy.visit('/wallet');
  cy.get('[data-testid="amount-input"]').type(amount.toString());
  cy.get('[data-testid="add-funds-button"]').click();
});

Cypress.Commands.add('applyDiscountCode', (code) => {
  cy.get('[data-testid="discount-code-input"]').type(code);
  cy.get('[data-testid="apply-discount-button"]').click();
});

// Blog commands
Cypress.Commands.add('createBlogPost', (postData) => {
  cy.visit('/admin/blog');
  cy.get('[data-testid="create-post-button"]').click();
  cy.fillForm(postData);
  cy.get('[data-testid="save-post-button"]').click();
});

Cypress.Commands.add('addComment', (comment) => {
  cy.get('[data-testid="comment-input"]').type(comment);
  cy.get('[data-testid="submit-comment-button"]').click();
});

// Support ticket commands
Cypress.Commands.add('createTicket', (ticketData) => {
  cy.visit('/support');
  cy.get('[data-testid="create-ticket-button"]').click();
  cy.fillForm(ticketData);
  cy.get('[data-testid="submit-ticket-button"]').click();
});

Cypress.Commands.add('replyToTicket', (ticketId, reply) => {
  cy.visit(`/support/${ticketId}`);
  cy.get('[data-testid="reply-input"]').type(reply);
  cy.get('[data-testid="send-reply-button"]').click();
});

// Custom assertions
Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.window().its('localStorage.token').should('exist');
  cy.get('[data-testid="user-menu"]').should('be.visible');
});

Cypress.Commands.add('shouldBeLoggedOut', () => {
  cy.window().its('localStorage.token').should('not.exist');
  cy.url().should('include', '/auth/login');
});

Cypress.Commands.add('shouldHaveRole', (role) => {
  cy.window().its('localStorage.user').then(user => {
    expect(JSON.parse(user).role).to.equal(role);
  });
});

// API commands
Cypress.Commands.add('apiLogin', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password }
  }).then(response => {
    window.localStorage.setItem('token', response.body.data.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.data.user));
  });
});

Cypress.Commands.add('apiCreateUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/register`,
    body: userData
  });
});

Cypress.Commands.add('apiCreateExam', (examData, token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/admin/exams`,
    headers: { Authorization: `Bearer ${token}` },
    body: examData
  });
});
