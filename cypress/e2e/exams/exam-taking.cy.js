describe('Exam Taking Flow', () => {
  beforeEach(() => {
    // Login as student
    cy.login();
    
    // Mock exam data
    cy.intercept('GET', '/api/v1/exams/*', { fixture: 'exam.json' }).as('getExam');
    cy.intercept('POST', '/api/v1/exams/*/start', {
      statusCode: 200,
      body: { success: true, data: { sessionId: 'test-session-123' } }
    }).as('startExam');
    cy.intercept('POST', '/api/v1/exams/*/submit', {
      statusCode: 200,
      body: { 
        success: true, 
        data: { 
          score: 85, 
          passed: true, 
          correctAnswers: 8, 
          totalQuestions: 10 
        } 
      }
    }).as('submitExam');
  });

  it('should display exam details before starting', () => {
    cy.visit('/exams/507f1f77bcf86cd799439012');
    cy.wait('@getExam');
    
    // Check exam information
    cy.shouldContainText('[data-testid="exam-title"]', 'Sample Programming Exam');
    cy.shouldContainText('[data-testid="exam-description"]', 'A comprehensive exam covering basic programming concepts');
    cy.shouldContainText('[data-testid="exam-duration"]', '۶۰ دقیقه');
    cy.shouldContainText('[data-testid="exam-questions"]', '۱۰ سوال');
    cy.shouldContainText('[data-testid="exam-passing-score"]', '۷۰%');
    
    // Check pricing
    cy.shouldContainText('[data-testid="exam-price"]', '۵۰,۰۰۰ تومان');
    
    // Check start button
    cy.get('[data-testid="start-exam-button"]').should('be.visible');
  });

  it('should start exam successfully', () => {
    cy.visit('/exams/507f1f77bcf86cd799439012');
    cy.wait('@getExam');
    
    cy.get('[data-testid="start-exam-button"]').click();
    cy.wait('@startExam');
    
    // Should navigate to exam session
    cy.url().should('include', '/exams/507f1f77bcf86cd799439012/session');
    
    // Should show exam interface
    cy.get('[data-testid="exam-timer"]').should('be.visible');
    cy.get('[data-testid="question-counter"]').should('be.visible');
    cy.get('[data-testid="current-question"]').should('be.visible');
  });

  it('should display questions correctly', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Check first question
    cy.shouldContainText('[data-testid="question-text"]', 'What is the output of console.log(typeof null)?');
    cy.get('[data-testid="question-options"]').should('be.visible');
    cy.get('[data-testid="option-0"]').should('contain.text', 'null');
    cy.get('[data-testid="option-1"]').should('contain.text', 'object');
    cy.get('[data-testid="option-2"]').should('contain.text', 'undefined');
    cy.get('[data-testid="option-3"]').should('contain.text', 'string');
    
    // Check question counter
    cy.shouldContainText('[data-testid="question-counter"]', '۱ از ۱۰');
  });

  it('should allow answering questions', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Answer first question
    cy.get('[data-testid="option-1"]').click();
    cy.get('[data-testid="option-1"]').should('have.class', 'selected');
    
    // Navigate to next question
    cy.get('[data-testid="next-question"]').click();
    cy.shouldContainText('[data-testid="question-counter"]', '۲ از ۱۰');
    
    // Answer second question
    cy.get('[data-testid="option-0"]').click();
    
    // Navigate back to first question
    cy.get('[data-testid="previous-question"]').click();
    cy.shouldContainText('[data-testid="question-counter"]', '۱ از ۱۰');
    
    // Should remember previous answer
    cy.get('[data-testid="option-1"]').should('have.class', 'selected');
  });

  it('should show timer countdown', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Check timer is visible and counting down
    cy.get('[data-testid="exam-timer"]').should('be.visible');
    cy.get('[data-testid="timer-minutes"]').should('contain.text', '59');
    
    // Wait a bit and check timer decreased
    cy.wait(1000);
    cy.get('[data-testid="timer-seconds"]').should('not.contain.text', '00');
  });

  it('should show progress indicator', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Check initial progress
    cy.get('[data-testid="progress-bar"]').should('be.visible');
    cy.get('[data-testid="progress-percentage"]').should('contain.text', '0%');
    
    // Answer a question
    cy.get('[data-testid="option-1"]').click();
    cy.get('[data-testid="progress-percentage"]').should('contain.text', '10%');
    
    // Navigate to next question and answer
    cy.get('[data-testid="next-question"]').click();
    cy.get('[data-testid="option-0"]').click();
    cy.get('[data-testid="progress-percentage"]').should('contain.text', '20%');
  });

  it('should allow navigation between questions', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Test next button
    cy.get('[data-testid="next-question"]').click();
    cy.shouldContainText('[data-testid="question-counter"]', '۲ از ۱۰');
    
    // Test previous button
    cy.get('[data-testid="previous-question"]').click();
    cy.shouldContainText('[data-testid="question-counter"]', '۱ از ۱۰');
    
    // Test question navigation menu
    cy.get('[data-testid="question-nav"]').should('be.visible');
    cy.get('[data-testid="question-nav-3"]').click();
    cy.shouldContainText('[data-testid="question-counter"]', '۳ از ۱۰');
  });

  it('should show question status in navigation', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Initially all questions should be unanswered
    cy.get('[data-testid="question-nav-1"]').should('have.class', 'unanswered');
    cy.get('[data-testid="question-nav-2"]').should('have.class', 'unanswered');
    
    // Answer current question
    cy.get('[data-testid="option-1"]').click();
    cy.get('[data-testid="question-nav-1"]').should('have.class', 'answered');
    
    // Navigate to next question
    cy.get('[data-testid="next-question"]').click();
    cy.get('[data-testid="question-nav-2"]').should('have.class', 'current');
  });

  it('should submit exam successfully', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Answer some questions
    cy.get('[data-testid="option-1"]').click();
    cy.get('[data-testid="next-question"]').click();
    cy.get('[data-testid="option-0"]').click();
    
    // Submit exam
    cy.get('[data-testid="submit-exam-button"]').click();
    
    // Confirm submission
    cy.get('[data-testid="submit-confirmation-modal"]').should('be.visible');
    cy.shouldContainText('[data-testid="submit-warning"]', 'آیا از ارسال آزمون اطمینان دارید؟');
    cy.get('[data-testid="confirm-submit"]').click();
    
    cy.wait('@submitExam');
    
    // Should navigate to results page
    cy.url().should('include', '/exams/507f1f77bcf86cd799439012/results');
  });

  it('should show exam results', () => {
    // Mock exam results
    cy.intercept('GET', '/api/v1/exams/*/results/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          score: 85,
          passed: true,
          correctAnswers: 8,
          totalQuestions: 10,
          timeSpent: 45,
          answers: [
            { questionId: '507f1f77bcf86cd799439013', selectedOption: 1, isCorrect: true },
            { questionId: '507f1f77bcf86cd799439014', selectedOption: 0, isCorrect: true }
          ]
        }
      }
    }).as('getResults');
    
    cy.visit('/exams/507f1f77bcf86cd799439012/results/test-session-123');
    cy.wait('@getResults');
    
    // Check results display
    cy.shouldContainText('[data-testid="exam-score"]', '۸۵%');
    cy.shouldContainText('[data-testid="exam-status"]', 'قبول');
    cy.shouldContainText('[data-testid="correct-answers"]', '۸ از ۱۰');
    cy.shouldContainText('[data-testid="time-spent"]', '۴۵ دقیقه');
    
    // Check pass/fail indicator
    cy.get('[data-testid="pass-indicator"]').should('have.class', 'passed');
  });

  it('should handle exam timeout', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Mock timer expiry
    cy.window().then((win) => {
      win.dispatchEvent(new CustomEvent('examTimeout'));
    });
    
    // Should show timeout modal
    cy.get('[data-testid="timeout-modal"]').should('be.visible');
    cy.shouldContainText('[data-testid="timeout-message"]', 'زمان آزمون به پایان رسید');
    
    // Should auto-submit
    cy.wait('@submitExam');
    cy.url().should('include', '/results');
  });

  it('should save answers automatically', () => {
    cy.intercept('POST', '/api/v1/exams/*/save-answer', {
      statusCode: 200,
      body: { success: true }
    }).as('saveAnswer');
    
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Answer a question
    cy.get('[data-testid="option-1"]').click();
    
    // Should auto-save
    cy.wait('@saveAnswer');
  });

  it('should work on mobile devices', () => {
    cy.setMobileViewport();
    
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Check mobile layout
    cy.get('[data-testid="exam-interface"]').should('be.visible');
    cy.get('[data-testid="question-text"]').should('be.visible');
    cy.get('[data-testid="question-options"]').should('be.visible');
    
    // Test touch interactions
    cy.get('[data-testid="option-1"]').click();
    cy.get('[data-testid="option-1"]').should('have.class', 'selected');
    
    // Test mobile navigation
    cy.get('[data-testid="mobile-nav-toggle"]').click();
    cy.get('[data-testid="question-nav"]').should('be.visible');
  });

  it('should handle network interruptions', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Simulate network error
    cy.intercept('POST', '/api/v1/exams/*/save-answer', {
      statusCode: 500,
      body: { success: false, message: 'Network error' }
    }).as('saveAnswerError');
    
    // Answer a question
    cy.get('[data-testid="option-1"]').click();
    
    cy.wait('@saveAnswerError');
    
    // Should show error message
    cy.shouldShowErrorMessage('خطا در ذخیره پاسخ');
    
    // Should retry automatically
    cy.intercept('POST', '/api/v1/exams/*/save-answer', {
      statusCode: 200,
      body: { success: true }
    }).as('saveAnswerRetry');
    
    cy.wait('@saveAnswerRetry');
    cy.shouldShowSuccessMessage('پاسخ ذخیره شد');
  });

  it('should prevent cheating attempts', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    // Test tab switching detection
    cy.window().then((win) => {
      win.dispatchEvent(new Event('blur'));
    });
    
    cy.get('[data-testid="warning-modal"]').should('be.visible');
    cy.shouldContainText('[data-testid="warning-message"]', 'تغییر تب تشخیص داده شد');
    
    // Test right-click prevention
    cy.get('[data-testid="question-text"]').rightclick();
    // Context menu should not appear
    
    // Test copy prevention
    cy.get('[data-testid="question-text"]').type('{ctrl+c}');
    // Copy should be prevented
  });

  it('should check accessibility during exam', () => {
    cy.startExam('507f1f77bcf86cd799439012');
    
    cy.checkA11y('[data-testid="exam-interface"]');
    
    // Check keyboard navigation
    cy.get('[data-testid="option-0"]').focus();
    cy.focused().type(' '); // Space to select
    cy.get('[data-testid="option-0"]').should('have.class', 'selected');
    
    // Check ARIA labels
    cy.get('[data-testid="exam-timer"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="progress-bar"]').should('have.attr', 'aria-valuenow');
  });
});
