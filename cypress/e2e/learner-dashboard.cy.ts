/**
 * تست‌های E2E برای داشبورد فراگیر
 * E2E Tests for Learner Dashboard
 */

describe('داشبورد فراگیر', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/learner/overview', {
      fixture: 'learner-overview.json'
    }).as('getLearnerOverview');

    // ورود به عنوان فراگیر
    cy.login('learner');
    cy.visit('/learner/dashboard');
  });

  describe('بارگذاری صفحه', () => {
    it('نمایش صحیح loader در حین بارگذاری', () => {
      // تاخیر در پاسخ API
      cy.intercept('GET', '/api/learner/overview', {
        delay: 2000,
        fixture: 'learner-overview.json'
      }).as('getSlowLearnerOverview');

      cy.visit('/learner/dashboard');

      // بررسی نمایش loader
      cy.get('[role="progressbar"]').should('be.visible');
      cy.contains('در حال بارگذاری داشبورد...').should('be.visible');

      // انتظار برای بارگذاری کامل
      cy.wait('@getSlowLearnerOverview');
      cy.get('[role="progressbar"]').should('not.exist');
    });

    it('نمایش خطا در صورت شکست API', () => {
      cy.intercept('GET', '/api/learner/overview', {
        statusCode: 500,
        body: { message: 'خطای سرور' }
      }).as('getErrorOverview');

      cy.visit('/learner/dashboard');

      cy.wait('@getErrorOverview');
      cy.contains('خطا در بارگذاری').should('be.visible');
      cy.contains('لطفاً دوباره تلاش کنید').should('be.visible');
    });
  });

  describe('محتوای داشبورد', () => {
    it('نمایش عنوان و توضیحات صفحه', () => {
      cy.wait('@getLearnerOverview');

      cy.get('h1').should('contain.text', 'داشبورد فراگیر');
      cy.contains('مشاهده آزمون‌ها، پیشرفت و عملکرد خود').should('be.visible');
    });

    it('نمایش کارت کیف پول', () => {
      cy.wait('@getLearnerOverview');

      // بررسی وجود کارت کیف پول
      cy.contains('کیف پول').should('be.visible');
      cy.contains('موجودی شما').should('be.visible');
      
      // بررسی نمایش موجودی
      cy.contains('تومان').should('be.visible');
      
      // بررسی پاداش‌ها
      cy.contains('پاداش‌های شما').should('be.visible');
    });

    it('نمایش آمار پیشرفت', () => {
      cy.wait('@getLearnerOverview');

      cy.contains('آمار پیشرفت').should('be.visible');
      cy.contains('عملکرد کلی شما در آزمون‌ها').should('be.visible');
      cy.contains('میانگین نمرات').should('be.visible');
      cy.contains('نقاط قوت').should('be.visible');
      cy.contains('نیاز به تمرین').should('be.visible');
    });

    it('نمایش آمار سریع', () => {
      cy.wait('@getLearnerOverview');

      // بررسی آزمون‌های انجام شده
      cy.contains('آزمون انجام شده').should('be.visible');
      
      // بررسی ساعت مطالعه
      cy.contains('ساعت مطالعه').should('be.visible');
      
      // بررسی میانگین نمره
      cy.contains('میانگین نمره').should('be.visible');
      
      // بررسی پاداش دریافتی
      cy.contains('پاداش دریافتی').should('be.visible');
    });

    it('نمایش تاریخچه آزمون‌ها', () => {
      cy.wait('@getLearnerOverview');

      cy.contains('تاریخچه آزمون‌ها').should('be.visible');
      
      // بررسی جدول آزمون‌ها
      cy.get('table').should('be.visible');
      cy.contains('آزمون').should('be.visible');
      cy.contains('وضعیت').should('be.visible');
      cy.contains('نمره').should('be.visible');
      cy.contains('تاریخ').should('be.visible');
    });

    it('نمایش فعالیت‌های اخیر', () => {
      cy.wait('@getLearnerOverview');

      cy.contains('فعالیت‌های اخیر').should('be.visible');
    });

    it('نمایش آزمون‌های پیشنهادی', () => {
      cy.wait('@getLearnerOverview');

      cy.contains('آزمون‌های پیشنهادی').should('be.visible');
      cy.contains('بر اساس عملکرد و علاقه‌مندی‌های شما').should('be.visible');
    });
  });

  describe('تعامل کاربر', () => {
    it('جستجو در تاریخچه آزمون‌ها', () => {
      cy.wait('@getLearnerOverview');

      // استفاده از جستجو
      cy.get('input[placeholder*="جستجو در آزمون‌ها"]').type('ریاضی');
      
      // بررسی فیلتر شدن نتایج
      cy.get('table tbody tr').should('have.length.lessThan', 10);
    });

    it('فیلتر کردن آزمون‌ها بر اساس وضعیت', () => {
      cy.wait('@getLearnerOverview');

      // انتخاب فیلتر وضعیت
      cy.get('select').eq(0).select('completed');
      
      // بررسی فیلتر شدن نتایج
      cy.contains('تکمیل شده').should('be.visible');
    });

    it('مرتب‌سازی آزمون‌ها بر اساس نمره', () => {
      cy.wait('@getLearnerOverview');

      // کلیک روی ستون نمره برای مرتب‌سازی
      cy.contains('th', 'نمره').click();
      
      // بررسی تغییر ترتیب
      cy.get('table tbody tr').first().should('contain', 'نمره');
    });

    it('باز و بسته کردن جزئیات آزمون', () => {
      cy.wait('@getLearnerOverview');

      // کلیک روی دکمه بیشتر
      cy.contains('button', 'بیشتر').first().click();
      
      // بررسی نمایش جزئیات
      cy.contains('زمان صرف شده:').should('be.visible');
      cy.contains('پاسخ صحیح:').should('be.visible');
      
      // کلیک روی دکمه کمتر
      cy.contains('button', 'کمتر').first().click();
      
      // بررسی مخفی شدن جزئیات
      cy.contains('زمان صرف شده:').should('not.be.visible');
    });

    it('کلیک روی دکمه‌های عمل در پیشنهادها', () => {
      cy.wait('@getLearnerOverview');

      // کلیک روی دکمه خرید/شروع آزمون
      cy.get('[data-testid="exam-card"]').first().within(() => {
        cy.get('button').contains(/خرید|شروع/).click();
      });
      
      // بررسی navigation یا modal
      cy.url().should('include', '/exam/');
    });
  });

  describe('ریسپانسیو بودن', () => {
    it('نمایش صحیح در موبایل', () => {
      cy.viewport('iphone-x');
      cy.wait('@getLearnerOverview');

      // بررسی استایل موبایل
      cy.get('.grid').should('have.class', 'grid-cols-1');
      
      // بررسی منوی همبرگری (در صورت وجود)
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
    });

    it('نمایش صحیح در تبلت', () => {
      cy.viewport('ipad-2');
      cy.wait('@getLearnerOverview');

      // بررسی layout تبلت
      cy.get('.grid').should('have.class', 'md:grid-cols-2');
    });

    it('نمایش صحیح در دسکتاپ', () => {
      cy.viewport(1920, 1080);
      cy.wait('@getLearnerOverview');

      // بررسی layout دسکتاپ
      cy.get('.grid').should('have.class', 'lg:grid-cols-3');
    });
  });

  describe('دسترسی‌پذیری (Accessibility)', () => {
    it('بررسی keyboard navigation', () => {
      cy.wait('@getLearnerOverview');

      // Tab navigation
      cy.get('body').tab();
      cy.focused().should('be.visible');
      
      // Enter/Space برای activation
      cy.focused().type('{enter}');
    });

    it('بررسی ARIA labels', () => {
      cy.wait('@getLearnerOverview');

      // بررسی progressbar
      cy.get('[role="progressbar"]').should('have.attr', 'aria-label');
      
      // بررسی headings
      cy.get('h1').should('have.text', 'داشبورد فراگیر');
      cy.get('h2, h3, h4, h5, h6').should('exist');
    });

    it('بررسی contrast و readability', () => {
      cy.wait('@getLearnerOverview');

      // بررسی contrast ratio
      cy.get('h1').should('have.css', 'color').and('not.equal', 'rgb(128, 128, 128)');
      
      // بررسی font size
      cy.get('p').should('have.css', 'font-size').and('not.equal', '10px');
    });

    it('بررسی screen reader compatibility', () => {
      cy.wait('@getLearnerOverview');

      // بررسی semantic HTML
      cy.get('main').should('exist');
      cy.get('nav').should('exist');
      cy.get('section').should('exist');
      
      // بررسی table headers
      cy.get('th').should('have.attr', 'scope');
    });
  });

  describe('RTL Support', () => {
    it('بررسی جهت متن راست به چپ', () => {
      cy.wait('@getLearnerOverview');

      // بررسی dir attribute
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('[class*="rtl"]').should('exist');
      
      // بررسی positioning
      cy.get('.text-right').should('exist');
    });

    it('بررسی عناصر UI در RTL', () => {
      cy.wait('@getLearnerOverview');

      // بررسی icons positioning
      cy.get('[data-testid="icon-right"]').should('have.class', 'mr-2');
      cy.get('[data-testid="icon-left"]').should('have.class', 'ml-2');
    });
  });

  describe('Performance', () => {
    it('بررسی سرعت بارگذاری', () => {
      const start = Date.now();
      
      cy.visit('/learner/dashboard');
      cy.wait('@getLearnerOverview');
      
      cy.then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(3000); // کمتر از 3 ثانیه
      });
    });

    it('بررسی lazy loading', () => {
      cy.wait('@getLearnerOverview');

      // بررسی skeleton loading
      cy.get('.animate-pulse').should('not.exist');
      
      // بررسی progressive loading
      cy.get('[data-testid="learner-overview"]').should('be.visible');
    });
  });
}); 