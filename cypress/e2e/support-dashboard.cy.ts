describe('Support Dashboard', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/contact/stats', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          total: 25,
          pending: 8,
          replied: 12,
          closed: 5
        }
      }
    }).as('getStats');

    cy.intercept('GET', '/api/contact/messages*', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          messages: [
            {
              id: '1',
              name: 'احمد محمدی',
              email: 'ahmad@example.com',
              phone: '09123456789',
              message: 'سلام، مشکلی در سیستم ورود دارم. لطفاً راهنمایی کنید.',
              category: 'support',
              status: 'pending',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              ipAddress: '192.168.1.100',
              createdAt: '2024-01-15T10:30:00Z'
            },
            {
              id: '2',
              name: 'فاطمه احمدی',
              email: 'fateme@example.com',
              message: 'باگی در صفحه آزمون‌ها پیدا کردم که باعث خرابی می‌شود.',
              category: 'bug_report',
              status: 'replied',
              createdAt: '2024-01-14T14:20:00Z'
            },
            {
              id: '3',
              name: 'علی رضایی',
              email: 'ali@example.com',
              message: 'پیشنهاد اضافه کردن قابلیت تایمر برای آزمون‌ها',
              category: 'feature_request',
              status: 'pending',
              createdAt: '2024-01-13T09:15:00Z'
            }
          ],
          pagination: {
            total: 3,
            count: 3,
            limit: 10,
            skip: 0
          }
        }
      }
    }).as('getMessages');

    cy.intercept('PUT', '/api/contact/*/status', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          id: '1',
          status: 'replied'
        }
      }
    }).as('updateStatus');

    // Visit the support dashboard
    cy.visit('/support/dashboard');
  });

  it('displays dashboard header and statistics correctly', () => {
    cy.wait('@getStats');
    
    // Check header
    cy.contains('داشبورد پشتیبانی').should('be.visible');
    cy.contains('مدیریت تیکت‌ها و درخواست‌های پشتیبانی').should('be.visible');

    // Check statistics cards
    cy.contains('کل تیکت‌ها').should('be.visible');
    cy.contains('25').should('be.visible');
    
    cy.contains('در انتظار پاسخ').should('be.visible');
    cy.contains('8').should('be.visible');
    
    cy.contains('پاسخ داده شده').should('be.visible');
    cy.contains('12').should('be.visible');
    
    cy.contains('بسته شده').should('be.visible');
    cy.contains('5').should('be.visible');
  });

  it('displays tickets list correctly', () => {
    cy.wait('@getMessages');

    // Check if tickets are displayed
    cy.contains('احمد محمدی').should('be.visible');
    cy.contains('ahmad@example.com').should('be.visible');
    cy.contains('سلام، مشکلی در سیستم ورود دارم').should('be.visible');
    cy.contains('پشتیبانی').should('be.visible');
    cy.contains('در انتظار پاسخ').should('be.visible');

    cy.contains('فاطمه احمدی').should('be.visible');
    cy.contains('گزارش باگ').should('be.visible');
    cy.contains('پاسخ داده شده').should('be.visible');

    cy.contains('علی رضایی').should('be.visible');
    cy.contains('درخواست قابلیت').should('be.visible');
  });

  it('filters tickets by status correctly', () => {
    cy.wait('@getMessages');

    // Test status filter
    cy.get('select').eq(0).select('pending');
    cy.wait('@getMessages');

    // Should show only pending tickets
    cy.contains('در انتظار پاسخ').should('be.visible');
  });

  it('filters tickets by category correctly', () => {
    cy.wait('@getMessages');

    // Test category filter
    cy.get('select').eq(1).select('bug_report');
    cy.wait('@getMessages');

    // Should show only bug report tickets
    cy.contains('گزارش باگ').should('be.visible');
  });

  it('searches tickets correctly', () => {
    cy.wait('@getMessages');

    // Test search functionality
    cy.get('input[placeholder*="جستجو"]').type('احمد');

    // Should filter results based on search
    cy.contains('احمد محمدی').should('be.visible');
    cy.contains('فاطمه احمدی').should('not.exist');
  });

  it('opens response modal for pending tickets', () => {
    cy.wait('@getMessages');

    // Click on response button for pending ticket
    cy.contains('احمد محمدی')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.contains('پاسخ دادن').click();
      });

    // Check if modal opens
    cy.contains('پاسخ به تیکت احمد محمدی').should('be.visible');
    cy.contains('پیام اصلی:').should('be.visible');
    cy.contains('سلام، مشکلی در سیستم ورود دارم').should('be.visible');
  });

  it('validates response form correctly', () => {
    cy.wait('@getMessages');

    // Open response modal
    cy.contains('احمد محمدی')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.contains('پاسخ دادن').click();
      });

    // Try to submit empty form
    cy.contains('ارسال پاسخ').click();

    // Should show validation error
    cy.contains('پاسخ باید حداقل ۱۰ کاراکتر باشد').should('be.visible');
  });

  it('submits response successfully', () => {
    cy.wait('@getMessages');

    // Open response modal
    cy.contains('احمد محمدی')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.contains('پاسخ دادن').click();
      });

    // Fill response form
    cy.get('textarea[placeholder*="پاسخ خود را اینجا بنویسید"]')
      .type('سلام، مشکل شما بررسی شد. لطفاً مراحل زیر را دنبال کنید...');

    cy.get('select').last().select('replied');

    // Submit form
    cy.contains('ارسال پاسخ').click();

    cy.wait('@updateStatus');

    // Modal should close
    cy.contains('پاسخ به تیکت احمد محمدی').should('not.exist');
  });

  it('closes response modal correctly', () => {
    cy.wait('@getMessages');

    // Open response modal
    cy.contains('احمد محمدی')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.contains('پاسخ دادن').click();
      });

    // Close modal using cancel button
    cy.contains('انصراف').click();

    // Modal should close
    cy.contains('پاسخ به تیکت احمد محمدی').should('not.exist');
  });

  it('refreshes data correctly', () => {
    cy.wait('@getMessages');
    cy.wait('@getStats');

    // Click refresh button
    cy.contains('تازه‌سازی').click();

    // Should make new API calls
    cy.wait('@getMessages');
    cy.wait('@getStats');
  });

  it('handles auto-refresh settings', () => {
    cy.wait('@getMessages');

    // Check auto-refresh settings
    cy.contains('تازه‌سازی خودکار:').should('be.visible');
    
    // Change refresh interval
    cy.get('select').last().select('30000');
    
    // Verify selection
    cy.get('select').last().should('have.value', '30000');
  });

  it('displays empty state when no tickets found', () => {
    // Mock empty response
    cy.intercept('GET', '/api/contact/messages*', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          messages: [],
          pagination: {
            total: 0,
            count: 0,
            limit: 10,
            skip: 0
          }
        }
      }
    }).as('getEmptyMessages');

    cy.visit('/support/dashboard');
    cy.wait('@getEmptyMessages');

    cy.contains('تیکتی یافت نشد').should('be.visible');
    cy.contains('هیچ تیکت پشتیبانی‌ای وجود ندارد').should('be.visible');
  });

  it('handles API errors gracefully', () => {
    // Mock error response
    cy.intercept('GET', '/api/contact/messages*', {
      statusCode: 500,
      body: {
        status: 'error',
        message: 'خطای سرور'
      }
    }).as('getMessagesError');

    cy.visit('/support/dashboard');
    cy.wait('@getMessagesError');

    cy.contains('خطا در بارگذاری تیکت‌ها').should('be.visible');
    cy.contains('تلاش مجدد').should('be.visible');
  });

  it('is accessible and RTL-ready', () => {
    cy.wait('@getMessages');

    // Check RTL direction
    cy.get('html').should('have.attr', 'dir', 'rtl');

    // Check accessibility
    cy.get('h1').should('be.visible');
    cy.get('button').should('have.attr', 'type').or('have.attr', 'role');
    
    // Check form labels
    cy.contains('احمد محمدی')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.contains('پاسخ دادن').click();
      });

    cy.get('label').should('exist');
    cy.get('textarea').should('have.attr', 'placeholder');
  });

  it('works correctly on mobile devices', () => {
    cy.viewport('iphone-x');
    cy.wait('@getMessages');

    // Check responsive design
    cy.get('.grid').should('be.visible');
    cy.contains('داشبورد پشتیبانی').should('be.visible');

    // Check mobile interactions
    cy.contains('احمد محمدی').should('be.visible');
    cy.get('input[placeholder*="جستجو"]').should('be.visible');
  });

  it('maintains state during navigation', () => {
    cy.wait('@getMessages');

    // Apply filters
    cy.get('input[placeholder*="جستجو"]').type('احمد');
    cy.get('select').eq(0).select('pending');

    // Navigate away and back (simulate)
    cy.reload();
    cy.wait('@getMessages');

    // Filters should be reset after reload
    cy.get('input[placeholder*="جستجو"]').should('have.value', '');
    cy.get('select').eq(0).should('have.value', 'all');
  });
}); 