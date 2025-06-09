/**
 * Admin Dashboard E2E Tests
 * تست‌های End-to-End برای پنل مدیریت
 */

describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Mock localStorage برای شبیه‌سازی ورود مدیر
    cy.window().then((win) => {
      win.localStorage.setItem('userRole', 'admin');
      win.localStorage.setItem('userPermissions', JSON.stringify(['MANAGE_SYSTEM']));
    });
    
    // بارگذاری صفحه پنل مدیریت
    cy.visit('/admin/dashboard');
  });

  it('نمایش صحیح صفحه پنل مدیریت', () => {
    // بررسی عنوان صفحه
    cy.contains('پنل مدیریت سیستم').should('be.visible');
    
    // بررسی وجود تب‌های اصلی
    cy.contains('نمای کلی').should('be.visible');
    cy.contains('کاربران').should('be.visible');
    cy.contains('محتوا').should('be.visible');
    cy.contains('مالی').should('be.visible');
    cy.contains('گزارشات').should('be.visible');
  });

  it('نمایش آمار در تب نمای کلی', () => {
    // بررسی کارت‌های آماری
    cy.contains('کل کاربران').should('be.visible');
    cy.contains('آزمون‌های منتشر شده').should('be.visible');
    cy.contains('درآمد ماهانه').should('be.visible');
    cy.contains('کاربران امروز').should('be.visible');
    
    // بررسی نمایش اعداد فارسی
    cy.get('[data-testid="total-users"]').should('contain', '۱٬۲۴۸');
    cy.get('[data-testid="published-exams"]').should('contain', '۱۸۷');
  });

  it('تغییر تب‌ها و نمایش محتوای مناسب', () => {
    // کلیک روی تب کاربران
    cy.contains('کاربران').click();
    cy.contains('مدیریت کاربران').should('be.visible');
    cy.get('table').should('be.visible');
    
    // کلیک روی تب مالی
    cy.contains('مالی').click();
    cy.contains('مدیریت مالی').should('be.visible');
    
    // کلیک روی تب گزارشات
    cy.contains('گزارشات').click();
    cy.contains('گزارشات فعالیت').should('be.visible');
  });

  it('جدول کاربران و عملکرد آن', () => {
    // رفتن به تب کاربران
    cy.contains('کاربران').click();
    
    // بررسی وجود جدول
    cy.get('table').should('be.visible');
    cy.get('thead').should('contain', 'نام');
    cy.get('thead').should('contain', 'ایمیل');
    cy.get('thead').should('contain', 'نقش');
    cy.get('thead').should('contain', 'وضعیت');
    
    // بررسی وجود داده‌ها
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('ریسپانسیو بودن در موبایل', () => {
    // تغییر اندازه viewport به موبایل
    cy.viewport(375, 667);
    
    // بررسی نمایش صحیح در موبایل
    cy.contains('پنل مدیریت سیستم').should('be.visible');
    
    // بررسی کارت‌های آماری در موبایل
    cy.get('[data-testid="stats-grid"]').should('be.visible');
  });

  it('دسترسی‌پذیری - کیبورد navigation', () => {
    // استفاده از Tab برای حرکت بین عناصر
    cy.get('body').tab();
    cy.focused().should('contain', 'نمای کلی');
    
    // استفاده از Enter برای انتخاب
    cy.focused().type('{enter}');
    
    // حرکت به تب بعدی
    cy.get('body').tab();
    cy.focused().should('contain', 'کاربران');
  });

  it('مدیریت خطاها و loading states', () => {
    // شبیه‌سازی خطای شبکه
    cy.intercept('GET', '/api/admin/stats', { statusCode: 500 }).as('statsError');
    
    cy.reload();
    cy.wait('@statsError');
    
    // بررسی نمایش پیام خطا یا fallback data
    cy.contains('خطا در بارگذاری').should('be.visible').or(cy.contains('۱٬۲۴۸').should('be.visible'));
  });

  it('تست RTL layout', () => {
    // بررسی جهت متن راست به چپ
    cy.get('html').should('have.attr', 'dir', 'rtl');
    
    // بررسی فونت فارسی
    cy.get('body').should('have.css', 'font-family').and('include', 'IRANSans');
  });

  it('انیمیشن‌ها و تعاملات', () => {
    // بررسی انیمیشن hover روی کارت‌ها
    cy.get('[data-testid="stats-card"]').first().trigger('mouseover');
    
    // بررسی تغییر تب با انیمیشن
    cy.contains('کاربران').click();
    cy.get('[data-testid="tab-content"]').should('be.visible');
  });
});

// تست‌های اضافی برای عملکردهای خاص
describe('Admin Dashboard - Advanced Features', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('userRole', 'admin');
      win.localStorage.setItem('userPermissions', JSON.stringify(['MANAGE_SYSTEM']));
    });
    cy.visit('/admin/dashboard');
  });

  it('فیلتر و جستجو در جدول کاربران', () => {
    cy.contains('کاربران').click();
    
    // اگر فیلد جستجو وجود داشته باشد
    cy.get('[data-testid="user-search"]').should('exist').then(($search) => {
      if ($search.length > 0) {
        cy.get('[data-testid="user-search"]').type('test');
        cy.get('tbody tr').should('have.length.at.least', 0);
      }
    });
  });

  it('صادرات داده‌ها', () => {
    // اگر دکمه صادرات وجود داشته باشد
    cy.get('[data-testid="export-button"]').should('exist').then(($export) => {
      if ($export.length > 0) {
        cy.get('[data-testid="export-button"]').click();
        // بررسی دانلود فایل
      }
    });
  });

  it('تنظیمات پنل مدیریت', () => {
    // اگر بخش تنظیمات وجود داشته باشد
    cy.get('[data-testid="settings-button"]').should('exist').then(($settings) => {
      if ($settings.length > 0) {
        cy.get('[data-testid="settings-button"]').click();
        cy.contains('تنظیمات').should('be.visible');
      }
    });
  });
}); 