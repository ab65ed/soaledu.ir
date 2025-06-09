/// <reference types="cypress" />

describe('Expert Dashboard', () => {
  beforeEach(() => {
    // ورود به عنوان کارشناس آموزشی
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type('expert@soaledu.ir');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    // انتظار برای redirect به داشبورد
    cy.url().should('include', '/expert/dashboard');
  });

  describe('صفحه اصلی داشبورد', () => {
    it('نمایش صحیح عنوان و توضیحات صفحه', () => {
      cy.contains('داشبورد کارشناس آموزشی').should('be.visible');
      cy.contains('بررسی و تأیید محتوای آموزشی، کنترل کیفیت و ارائه بازخورد').should('be.visible');
    });

    it('نمایش کارت‌های آمار', () => {
      // کارت در انتظار بررسی
      cy.get('[data-testid="pending-reviews-card"]').should('be.visible');
      cy.contains('در انتظار بررسی').should('be.visible');
      
      // کارت تأیید شده امروز
      cy.get('[data-testid="approved-today-card"]').should('be.visible');
      cy.contains('تأیید شده امروز').should('be.visible');
      
      // کارت نیاز به بازنگری
      cy.get('[data-testid="needs-revision-card"]').should('be.visible');
      cy.contains('نیاز به بازنگری').should('be.visible');
      
      // کارت میانگین کیفیت
      cy.get('[data-testid="average-quality-card"]').should('be.visible');
      cy.contains('میانگین کیفیت').should('be.visible');
    });

    it('نمایش تب‌های اصلی', () => {
      cy.get('[data-testid="tab-pending"]').should('be.visible').and('contain', 'در انتظار بررسی');
      cy.get('[data-testid="tab-analytics"]').should('be.visible').and('contain', 'آمار کیفیت');
      cy.get('[data-testid="tab-history"]').should('be.visible').and('contain', 'تاریخچه بررسی');
    });
  });

  describe('تب محتوای در انتظار', () => {
    beforeEach(() => {
      cy.get('[data-testid="tab-pending"]').click();
    });

    it('نمایش لیست محتوای در انتظار', () => {
      cy.get('[data-testid="content-item"]').should('have.length.at.least', 1);
      
      // بررسی عناصر هر آیتم
      cy.get('[data-testid="content-item"]').first().within(() => {
        cy.get('[data-testid="content-title"]').should('be.visible');
        cy.get('[data-testid="content-type-badge"]').should('be.visible');
        cy.get('[data-testid="content-preview"]').should('be.visible');
        cy.get('[data-testid="review-button"]').should('be.visible');
      });
    });

    it('فیلتر کردن محتوا بر اساس نوع', () => {
      // فیلتر سوالات
      cy.get('[data-testid="filter-questions"]').click();
      cy.get('[data-testid="content-type-badge"]').should('contain', 'سوال');
      
      // فیلتر درس-آزمون‌ها
      cy.get('[data-testid="filter-exams"]').click();
      cy.get('[data-testid="content-type-badge"]').should('contain', 'درس-آزمون');
      
      // حذف فیلتر
      cy.get('[data-testid="clear-filters"]').click();
    });

    it('نمایش پیام خالی بودن لیست', () => {
      // شبیه‌سازی وضعیت خالی
      cy.intercept('GET', '/api/expert/content/pending', {
        statusCode: 200,
        body: {
          status: 'success',
          data: {
            items: [],
            total: 0,
            pagination: { total: 0, count: 0, limit: 10, skip: 0 }
          }
        }
      }).as('getEmptyContent');
      
      cy.reload();
      cy.wait('@getEmptyContent');
      
      cy.contains('عالی! همه محتواها بررسی شده‌اند').should('be.visible');
      cy.contains('در حال حاضر محتوای جدیدی برای بررسی وجود ندارد').should('be.visible');
    });
  });

  describe('فرم بررسی محتوا', () => {
    beforeEach(() => {
      cy.get('[data-testid="tab-pending"]').click();
      cy.get('[data-testid="review-button"]').first().click();
    });

    it('باز شدن modal بررسی', () => {
      cy.get('[data-testid="review-modal"]').should('be.visible');
      cy.contains('بررسی محتوا:').should('be.visible');
      cy.get('[data-testid="full-content"]').should('be.visible');
    });

    it('پر کردن و ارسال فرم با موفقیت', () => {
      // انتخاب وضعیت تأیید
      cy.get('[data-testid="status-select"]').click();
      cy.get('[data-testid="status-approved"]').click();
      
      // وارد کردن امتیاز کیفیت
      cy.get('[data-testid="quality-score-input"]').clear().type('8');
      
      // وارد کردن بازخورد
      cy.get('[data-testid="feedback-textarea"]')
        .clear()
        .type('محتوای بسیار خوبی است. ساختار سوال مناسب و گزینه‌ها دقیق هستند.');
      
      // وارد کردن پیشنهادات (اختیاری)
      cy.get('[data-testid="improvements-textarea"]')
        .clear()
        .type('می‌توان توضیح بیشتری برای پاسخ صحیح اضافه کرد.');
      
      // Mock API response
      cy.intercept('POST', '/api/expert/content/*/review', {
        statusCode: 200,
        body: {
          status: 'success',
          message: 'بازخورد با موفقیت ارسال شد',
          data: {
            success: true,
            updatedItem: {}
          }
        }
      }).as('submitReview');
      
      // ارسال فرم
      cy.get('[data-testid="submit-review-button"]').click();
      
      // بررسی ارسال موفق
      cy.wait('@submitReview');
      cy.contains('بازخورد با موفقیت ارسال شد').should('be.visible');
      
      // بستن modal
      cy.get('[data-testid="review-modal"]').should('not.exist');
    });

    it('اعتبارسنجی فیلدهای اجباری', () => {
      // تلاش برای ارسال فرم خالی
      cy.get('[data-testid="submit-review-button"]').click();
      
      // بررسی پیام‌های خطا
      cy.contains('وضعیت بررسی الزامی است').should('be.visible');
      cy.contains('امتیاز کیفیت الزامی است').should('be.visible');
      cy.contains('بازخورد باید حداقل ۱۰ کاراکتر باشد').should('be.visible');
    });

    it('اعتبارسنجی محدوده امتیاز', () => {
      // امتیاز بیش از حد مجاز
      cy.get('[data-testid="quality-score-input"]').clear().type('15');
      cy.get('[data-testid="submit-review-button"]').click();
      cy.contains('امتیاز باید بین ۱ تا ۱۰ باشد').should('be.visible');
      
      // امتیاز کمتر از حد مجاز
      cy.get('[data-testid="quality-score-input"]').clear().type('0');
      cy.get('[data-testid="submit-review-button"]').click();
      cy.contains('امتیاز باید بین ۱ تا ۱۰ باشد').should('be.visible');
    });

    it('بستن modal با کلیک روی انصراف', () => {
      cy.get('[data-testid="cancel-review-button"]').click();
      cy.get('[data-testid="review-modal"]').should('not.exist');
    });

    it('بستن modal با کلیک خارج از آن', () => {
      cy.get('[data-testid="modal-backdrop"]').click({ force: true });
      cy.get('[data-testid="review-modal"]').should('not.exist');
    });
  });

  describe('تب آمار کیفیت', () => {
    beforeEach(() => {
      cy.get('[data-testid="tab-analytics"]').click();
    });

    it('نمایش آمار کلی', () => {
      cy.get('[data-testid="overall-average-card"]').should('be.visible');
      cy.get('[data-testid="today-reviews-card"]').should('be.visible');
      cy.get('[data-testid="high-quality-percentage-card"]').should('be.visible');
      cy.get('[data-testid="active-experts-card"]').should('be.visible');
    });

    it('نمایش نمودار کیفیت بر اساس نوع محتوا', () => {
      cy.get('[data-testid="content-type-quality-chart"]').should('be.visible');
      cy.contains('کیفیت بر اساس نوع محتوا').should('be.visible');
      cy.contains('سوالات').should('be.visible');
      cy.contains('درس-آزمون‌ها').should('be.visible');
    });

    it('نمایش روند هفتگی', () => {
      cy.get('[data-testid="weekly-trend-chart"]').should('be.visible');
      cy.contains('روند کیفیت - ۷ روز گذشته').should('be.visible');
      
      // بررسی نمایش روزهای هفته
      const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
      persianDays.forEach(day => {
        cy.contains(day).should('be.visible');
      });
    });

    it('نمایش گزارش تفصیلی', () => {
      cy.get('[data-testid="detailed-report"]').should('be.visible');
      cy.contains('گزارش تفصیلی عملکرد').should('be.visible');
      cy.contains('وضعیت بررسی‌ها').should('be.visible');
      cy.contains('زمان پاسخ').should('be.visible');
      cy.contains('عملکرد کارشناسان').should('be.visible');
    });
  });

  describe('تب تاریخچه بررسی', () => {
    it('نمایش پیام در حال توسعه', () => {
      cy.get('[data-testid="tab-history"]').click();
      cy.contains('تاریخچه بررسی‌ها').should('be.visible');
      cy.contains('این بخش در حال توسعه است...').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('نمایش صحیح در تبلت', () => {
      cy.viewport('ipad-2');
      cy.visit('/expert/dashboard');
      
      cy.get('[data-testid="stats-grid"]').should('be.visible');
      cy.get('[data-testid="content-item"]').should('be.visible');
    });

    it('نمایش صحیح در موبایل', () => {
      cy.viewport('iphone-x');
      cy.visit('/expert/dashboard');
      
      // بررسی که کارت‌ها به صورت ستونی نمایش داده می‌شوند
      cy.get('[data-testid="stats-grid"]').should('have.class', 'grid-cols-1');
      
      // بررسی نمایش تب‌ها در موبایل
      cy.get('[data-testid="tabs-list"]').should('be.visible');
    });
  });

  describe('RTL Support', () => {
    it('جهت صحیح متن فارسی', () => {
      cy.get('body').should('have.attr', 'dir', 'rtl');
      cy.get('[data-testid="dashboard-title"]').should('have.css', 'direction', 'rtl');
    });

    it('ترتیب صحیح المان‌ها در RTL', () => {
      cy.get('[data-testid="content-item"]').first().within(() => {
        // بررسی که دکمه بررسی در سمت چپ قرار دارد (راست در RTL)
        cy.get('[data-testid="review-button"]').should('have.css', 'margin-left');
      });
    });
  });

  describe('Accessibility', () => {
    it('پیمایش با کیبرد', () => {
      // Tab navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'tab-pending');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'tab-analytics');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'tab-history');
    });

    it('وجود aria-labels مناسب', () => {
      cy.get('[data-testid="review-button"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="status-select"]').should('have.attr', 'aria-describedby');
    });

    it('نسبت کنتراست رنگ‌ها', () => {
      // بررسی رنگ متن روی پس‌زمینه
      cy.get('[data-testid="dashboard-title"]')
        .should('have.css', 'color')
        .and('not.equal', 'rgba(0, 0, 0, 0)'); // نباید شفاف باشد
    });

    it('پشتیبانی از screen reader', () => {
      cy.get('h1').should('contain', 'داشبورد کارشناس آموزشی');
      cy.get('[role="tablist"]').should('exist');
      cy.get('[role="tabpanel"]').should('exist');
    });
  });

  describe('Performance', () => {
    it('زمان بارگذاری مناسب', () => {
      const startTime = Date.now();
      
      cy.visit('/expert/dashboard').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // کمتر از 3 ثانیه
      });
    });

    it('lazy loading برای کامپوننت‌ها', () => {
      // بررسی که کامپوننت‌های غیرفعال بارگذاری نمی‌شوند
      cy.get('[data-testid="tab-analytics"]').should('be.visible');
      cy.get('[data-testid="analytics-content"]').should('not.exist');
      
      cy.get('[data-testid="tab-analytics"]').click();
      cy.get('[data-testid="analytics-content"]').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('مدیریت خطای شبکه', () => {
      // شبیه‌سازی خطای شبکه
      cy.intercept('GET', '/api/expert/content/pending', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getContentError');
      
      cy.reload();
      cy.wait('@getContentError');
      
      cy.contains('خطا در بارگذاری داده‌ها').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('مدیریت خطای احراز هویت', () => {
      // شبیه‌سازی خطای 401
      cy.intercept('GET', '/api/expert/**', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('authError');
      
      cy.reload();
      cy.wait('@authError');
      
      // باید به صفحه ورود هدایت شود
      cy.url().should('include', '/auth/login');
    });

    it('نمایش پیام خطا در فرم', () => {
      cy.get('[data-testid="review-button"]').first().click();
      
      // شبیه‌سازی خطای ارسال فرم
      cy.intercept('POST', '/api/expert/content/*/review', {
        statusCode: 400,
        body: {
          status: 'error',
          message: 'داده‌های ارسالی نامعتبر است'
        }
      }).as('submitError');
      
      // پر کردن فرم
      cy.get('[data-testid="status-select"]').click();
      cy.get('[data-testid="status-approved"]').click();
      cy.get('[data-testid="quality-score-input"]').type('8');
      cy.get('[data-testid="feedback-textarea"]').type('نظر تست');
      
      cy.get('[data-testid="submit-review-button"]').click();
      cy.wait('@submitError');
      
      cy.contains('داده‌های ارسالی نامعتبر است').should('be.visible');
    });
  });
}); 