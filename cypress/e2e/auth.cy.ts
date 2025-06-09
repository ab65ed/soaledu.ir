/**
 * تست‌های E2E احراز هویت - Authentication E2E Tests
 * شامل جریان کامل ورود، خروج، و هدایت به داشبورد
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // پاک کردن localStorage قبل از هر تست
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });

    it('should display login form correctly', () => {
      // بررسی عناصر صفحه ورود
      cy.get('h2').should('contain', 'ورود به حساب کاربری');
      cy.get('input[type="text"]').should('have.attr', 'placeholder').and('include', 'example@domain.com');
      cy.get('input[type="password"]').should('have.attr', 'placeholder').and('include', 'حداقل ۱۲ کاراکتر');
      cy.get('button[type="submit"]').should('contain', 'ورود');
      cy.get('a[href="/auth/register"]').should('contain', 'ثبت‌نام کنید');
    });

    it('should show validation errors for empty fields', () => {
      // کلیک روی دکمه ورود بدون پر کردن فیلدها
      cy.get('button[type="submit"]').click();
      
      // بررسی نمایش خطاهای اعتبارسنجی
      cy.contains('ایمیل یا شماره موبایل الزامی است').should('be.visible');
    });

    it('should show validation error for invalid email format', () => {
      // وارد کردن ایمیل نامعتبر
      cy.get('input[type="text"]').type('invalid-email');
      cy.get('input[type="password"]').click(); // تغییر فوکوس
      
      // بررسی نمایش خطای اعتبارسنجی
      cy.contains('فرمت ایمیل یا شماره موبایل صحیح نیست').should('be.visible');
    });

    it('should show validation error for weak password', () => {
      // وارد کردن رمز عبور ضعیف
      cy.get('input[type="text"]').type('test@example.com');
      cy.get('input[type="password"]').type('weak');
      cy.get('input[type="text"]').click(); // تغییر فوکوس
      
      // بررسی نمایش خطای اعتبارسنجی
      cy.contains('رمز عبور باید حداقل ۱۲ کاراکتر باشد').should('be.visible');
    });

    it('should toggle password visibility', () => {
      const password = 'StrongPassword123!';
      
      // وارد کردن رمز عبور
      cy.get('input[type="password"]').type(password);
      
      // کلیک روی دکمه نمایش رمز عبور
      cy.get('input[type="password"]').parent().find('button').click();
      
      // بررسی تغییر نوع input به text
      cy.get('input[type="text"]').should('have.value', password);
      
      // کلیک مجدد برای مخفی کردن
      cy.get('input[type="text"]').parent().find('button').click();
      
      // بررسی تغییر نوع input به password
      cy.get('input[type="password"]').should('have.value', password);
    });

    it('should handle successful login and redirect to dashboard', () => {
      // Mock API response
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          status: 'success',
          data: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'learner',
            },
            token: 'mock-jwt-token',
          },
        },
      }).as('loginRequest');

      // پر کردن فرم ورود
      cy.get('input[type="text"]').type('test@example.com');
      cy.get('input[type="password"]').type('StrongPassword123!');
      
      // ارسال فرم
      cy.get('button[type="submit"]').click();
      
      // بررسی ارسال درخواست
      cy.wait('@loginRequest');
      
      // بررسی هدایت به داشبورد
      cy.url().should('include', '/learner');
    });

    it('should handle login error', () => {
      // Mock API error response
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: {
          status: 'error',
          message: 'Invalid credentials',
        },
      }).as('loginError');

      // پر کردن فرم ورود
      cy.get('input[type="text"]').type('test@example.com');
      cy.get('input[type="password"]').type('WrongPassword123!');
      
      // ارسال فرم
      cy.get('button[type="submit"]').click();
      
      // بررسی ارسال درخواست
      cy.wait('@loginError');
      
      // بررسی نمایش پیام خطا
      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should accept Iranian mobile number', () => {
      // وارد کردن شماره موبایل ایرانی
      cy.get('input[type="text"]').type('09123456789');
      cy.get('input[type="password"]').click(); // تغییر فوکوس
      
      // بررسی عدم نمایش خطای اعتبارسنجی
      cy.contains('فرمت ایمیل یا شماره موبایل صحیح نیست').should('not.exist');
    });

    it('should redirect authenticated user to dashboard', () => {
      // شبیه‌سازی کاربر لاگین شده
      cy.window().then((win) => {
        win.localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
            token: 'mock-token',
            isAuthenticated: true,
          },
        }));
      });

      // بازدید از صفحه ورود
      cy.visit('/auth/login');
      
      // بررسی هدایت به داشبورد
      cy.url().should('include', '/admin');
    });
  });

  describe('Logout Page', () => {
    beforeEach(() => {
      // شبیه‌سازی کاربر لاگین شده
      cy.window().then((win) => {
        win.localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'learner' },
            token: 'mock-token',
            isAuthenticated: true,
          },
        }));
      });
      
      cy.visit('/auth/logout');
    });

    it('should display logout confirmation page', () => {
      // بررسی عناصر صفحه خروج
      cy.get('h2').should('contain', 'خروج از حساب کاربری');
      cy.contains('Test User').should('be.visible');
      cy.get('button').contains('خروج از حساب').should('be.visible');
      cy.get('button').contains('انصراف').should('be.visible');
    });

    it('should open confirmation modal when logout button is clicked', () => {
      // کلیک روی دکمه خروج
      cy.get('button').contains('خروج از حساب').click();
      
      // بررسی نمایش مودال تأیید
      cy.contains('تأیید خروج').should('be.visible');
      cy.contains('آیا مطمئن هستید').should('be.visible');
      cy.get('button').contains('بله، خارج شو').should('be.visible');
    });

    it('should close modal when cancel is clicked', () => {
      // باز کردن مودال
      cy.get('button').contains('خروج از حساب').click();
      cy.contains('تأیید خروج').should('be.visible');
      
      // کلیک روی انصراف
      cy.get('button').contains('انصراف').click();
      
      // بررسی بسته شدن مودال
      cy.contains('تأیید خروج').should('not.exist');
    });

    it('should handle successful logout', () => {
      // Mock API response
      cy.intercept('POST', '/api/auth/logout', {
        statusCode: 200,
        body: { status: 'success' },
      }).as('logoutRequest');

      // باز کردن مودال و تأیید خروج
      cy.get('button').contains('خروج از حساب').click();
      cy.get('button').contains('بله، خارج شو').click();
      
      // بررسی ارسال درخواست (اختیاری)
      // cy.wait('@logoutRequest');
      
      // بررسی هدایت به صفحه ورود
      cy.url().should('include', '/auth/login');
      
      // بررسی پاک شدن localStorage
      cy.window().then((win) => {
        const authData = win.localStorage.getItem('auth-storage');
        expect(authData).to.be.null;
      });
    });

    it('should handle back button click', () => {
      // کلیک روی دکمه انصراف (بازگشت)
      cy.get('button').contains('انصراف').click();
      
      // بررسی بازگشت به صفحه قبل (در اینجا صفحه اصلی)
      cy.url().should('not.include', '/auth/logout');
    });

    it('should redirect unauthenticated user to login', () => {
      // پاک کردن اطلاعات احراز هویت
      cy.clearLocalStorage();
      
      // بازدید از صفحه خروج
      cy.visit('/auth/logout');
      
      // بررسی هدایت به صفحه ورود
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Authentication Flow Integration', () => {
    it('should complete full login-logout cycle', () => {
      // Mock login API
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          status: 'success',
          data: {
            user: {
              id: '1',
              name: 'Integration Test User',
              email: 'integration@example.com',
              role: 'expert',
            },
            token: 'integration-test-token',
          },
        },
      }).as('loginRequest');

      // Mock logout API
      cy.intercept('POST', '/api/auth/logout', {
        statusCode: 200,
        body: { status: 'success' },
      }).as('logoutRequest');

      // مرحله 1: ورود
      cy.visit('/auth/login');
      cy.get('input[type="text"]').type('integration@example.com');
      cy.get('input[type="password"]').type('IntegrationTest123!');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginRequest');
      cy.url().should('include', '/expert');

      // مرحله 2: رفتن به صفحه خروج
      cy.visit('/auth/logout');
      cy.contains('Integration Test User').should('be.visible');

      // مرحله 3: خروج
      cy.get('button').contains('خروج از حساب').click();
      cy.get('button').contains('بله، خارج شو').click();
      
      // بررسی هدایت به صفحه ورود
      cy.url().should('include', '/auth/login');
    });
  });

  describe('RTL and Accessibility', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });

    it('should support RTL layout', () => {
      // بررسی جهت متن
      cy.get('body').should('have.css', 'direction', 'rtl');
      
      // بررسی فونت فارسی
      cy.get('body').should('have.css', 'font-family').and('include', 'IRANSans');
    });

    it('should be keyboard accessible', () => {
      // ناوبری با کیبورد
      cy.get('input[type="text"]').focus();
      cy.focused().should('have.attr', 'type', 'text');
      
      cy.tab();
      cy.focused().should('have.attr', 'type', 'password');
      
      cy.tab();
      cy.focused().should('have.attr', 'type', 'checkbox');
      
      cy.tab();
      cy.focused().should('contain', 'رمز عبور را فراموش کرده‌اید؟');
      
      cy.tab();
      cy.focused().should('have.attr', 'type', 'submit');
    });

    it('should have proper ARIA labels', () => {
      // بررسی وجود label برای input ها
      cy.get('input[type="text"]').should('have.attr', 'id');
      cy.get('label[for]').should('exist');
      
      // بررسی دسترسی‌پذیری دکمه‌ها
      cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled');
    });
  });

  describe('Performance and Loading States', () => {
    it('should show loading state during login', () => {
      // Mock slow API response
      cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply((res) => {
          res.delay(2000);
          res.send({
            statusCode: 200,
            body: {
              status: 'success',
              data: {
                user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'learner' },
                token: 'test-token',
              },
            },
          });
        });
      }).as('slowLogin');

      cy.visit('/auth/login');
      cy.get('input[type="text"]').type('test@example.com');
      cy.get('input[type="password"]').type('StrongPassword123!');
      cy.get('button[type="submit"]').click();
      
      // بررسی نمایش وضعیت loading
      cy.contains('در حال ورود...').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');
      
      cy.wait('@slowLogin');
    });

    it('should handle network errors gracefully', () => {
      // Mock network error
      cy.intercept('POST', '/api/auth/login', { forceNetworkError: true }).as('networkError');

      cy.visit('/auth/login');
      cy.get('input[type="text"]').type('test@example.com');
      cy.get('input[type="password"]').type('StrongPassword123!');
      cy.get('button[type="submit"]').click();
      
      // بررسی نمایش پیام خطا
      cy.contains('خطای غیرمنتظره‌ای رخ داد').should('be.visible');
    });
  });
}); 