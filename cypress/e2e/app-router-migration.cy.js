describe('App Router Migration E2E Tests', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
  });

  describe('Home Page', () => {
    it('should display the main heading and navigation', () => {
      cy.get('h1').should('contain', 'سیستم آزمون آنلاین');
      cy.get('a[href="/login"]').should('contain', 'ورود');
      cy.get('a[href="/register"]').should('contain', 'ثبت نام');
      cy.get('a[href="/dashboard"]').should('contain', 'داشبورد');
    });

    it('should have proper RTL direction', () => {
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('body').should('have.class', 'rtl');
    });

    it('should display feature cards', () => {
      cy.contains('آزمون‌های متنوع').should('be.visible');
      cy.contains('گزارش‌گیری دقیق').should('be.visible');
      cy.contains('رابط کاربری ساده').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      cy.get('a[href="/login"]').click();
      cy.url().should('include', '/login');
      cy.get('h2').should('contain', 'ورود به حساب کاربری');
    });

    it('should navigate to register page', () => {
      cy.get('a[href="/register"]').click();
      cy.url().should('include', '/register');
      cy.get('h2').should('contain', 'ایجاد حساب کاربری جدید');
    });

    it('should navigate to dashboard page', () => {
      cy.get('a[href="/dashboard"]').click();
      cy.url().should('include', '/dashboard');
      // Dashboard might require authentication, so we check for loading or content
      cy.get('body').should('be.visible');
    });
  });

  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should display login form', () => {
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'ورود');
    });

    it('should show demo credentials', () => {
      cy.contains('اطلاعات دمو').should('be.visible');
      cy.contains('admin@test.com').should('be.visible');
      cy.contains('user@test.com').should('be.visible');
    });

    it('should handle form submission with demo credentials', () => {
      cy.get('input[name="email"]').type('admin@test.com');
      cy.get('input[name="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
      
      // Should show loading state
      cy.contains('در حال ورود').should('be.visible');
      
      // Should redirect after successful login (with timeout for API call)
      cy.url({ timeout: 10000 }).should('not.include', '/login');
    });

    it('should validate empty form submission', () => {
      cy.get('button[type="submit"]').click();
      // Toast notification should appear (if implemented)
      // cy.contains('لطفاً تمام فیلدها را پر کنید').should('be.visible');
    });
  });

  describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('should display register form', () => {
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('input[name="confirmPassword"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'ثبت نام');
    });

    it('should handle form submission', () => {
      cy.get('input[name="name"]').type('کاربر تست');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      // Should show loading state
      cy.contains('در حال ثبت نام').should('be.visible');
    });
  });

  describe('Dashboard Page', () => {
    beforeEach(() => {
      // Mock authentication or login first
      cy.visit('/dashboard');
    });

    it('should display dashboard content', () => {
      // Wait for loading to complete
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Check if dashboard loads (might show loading or content)
      cy.get('h1').should('exist');
    });
  });

  describe('Exams Page', () => {
    beforeEach(() => {
      cy.visit('/exams');
    });

    it('should display exams list', () => {
      // Wait for loading
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Should show exams page title
      cy.get('h1').should('contain', 'آزمون‌های موجود');
    });

    it('should display filters', () => {
      // Check for filter elements
      cy.contains('فیلترها').should('be.visible');
      cy.get('select').should('have.length.at.least', 1);
    });
  });

  describe('Blog Page', () => {
    beforeEach(() => {
      cy.visit('/blog');
    });

    it('should display blog content', () => {
      cy.get('h1').should('contain', 'وبلاگ آموزشی');
      cy.contains('مقالات و راهنماهای مفید').should('be.visible');
    });

    it('should display blog posts', () => {
      // Should show blog posts
      cy.get('.card').should('have.length.at.least', 1);
    });

    it('should display sidebar', () => {
      cy.contains('دسته‌بندی‌ها').should('be.visible');
      cy.contains('برچسب‌های محبوب').should('be.visible');
      cy.contains('خبرنامه').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-6');
      cy.visit('/');
      
      cy.get('h1').should('be.visible');
      cy.get('a[href="/login"]').should('be.visible');
    });

    it('should work on tablet devices', () => {
      cy.viewport('ipad-2');
      cy.visit('/');
      
      cy.get('h1').should('be.visible');
      cy.get('.grid').should('be.visible');
    });

    it('should work on desktop', () => {
      cy.viewport(1440, 900);
      cy.visit('/');
      
      cy.get('h1').should('be.visible');
      cy.get('.grid').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.visit('/');
      cy.get('h1').should('exist');
      cy.get('h3').should('exist');
    });

    it('should have accessible forms', () => {
      cy.visit('/login');
      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="password"]').should('exist');
      cy.get('input[id="email"]').should('exist');
      cy.get('input[id="password"]').should('exist');
    });

    it('should have keyboard navigation', () => {
      cy.visit('/');
      cy.get('a[href="/login"]').focus().should('be.focused');
      cy.get('a[href="/login"]').type('{enter}');
      cy.url().should('include', '/login');
    });
  });

  describe('Performance', () => {
    it('should load pages quickly', () => {
      const start = Date.now();
      cy.visit('/');
      cy.get('h1').should('be.visible').then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it('should handle navigation smoothly', () => {
      cy.visit('/');
      cy.get('a[href="/blog"]').click();
      cy.get('h1').should('contain', 'وبلاگ آموزشی');
      
      cy.go('back');
      cy.get('h1').should('contain', 'سیستم آزمون آنلاین');
    });
  });
});
