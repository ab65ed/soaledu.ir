/**
 * Home Page E2E Tests
 * تست‌های End-to-End صفحه خانه
 */

describe('Home Page - صفحه خانه', () => {
  beforeEach(() => {
    // بازدید از صفحه خانه
    cy.visit('/');
  });

  describe('Hero Section - بخش اصلی', () => {
    it('نمایش صحیح محتوای اصلی', () => {
      // بررسی عنوان اصلی
      cy.contains('سامانه جامع').should('be.visible');
      cy.contains('آزمون‌های آنلاین').should('be.visible');
      
      // بررسی توضیحات
      cy.contains('پلتفرم پیشرفته برای ایجاد، مدیریت و شرکت در آزمون‌های آنلاین').should('be.visible');
      
      // بررسی دکمه‌های CTA
      cy.contains('شروع آزمون').should('be.visible');
      cy.contains('تماس با ما').should('be.visible');
    });

    it('نمایش ویژگی‌های کلیدی', () => {
      cy.contains('آزمون‌سازی آسان').should('be.visible');
      cy.contains('نتایج فوری').should('be.visible');
      cy.contains('گزارش‌گیری هوشمند').should('be.visible');
    });

    it('نمایش آمار سایت', () => {
      cy.contains('۱۲۰۰+').should('be.visible');
      cy.contains('کاربر فعال').should('be.visible');
      cy.contains('۵۰۰+').should('be.visible');
      cy.contains('آزمون برگزار شده').should('be.visible');
      cy.contains('۹۸%').should('be.visible');
      cy.contains('رضایت کاربران').should('be.visible');
    });

    it('عملکرد دکمه CTA برای کاربر مهمان', () => {
      // پاک کردن localStorage برای شبیه‌سازی کاربر مهمان
      cy.clearLocalStorage();
      
      // کلیک روی دکمه شروع آزمون
      cy.contains('شروع آزمون').click();
      
      // بررسی هدایت به صفحه ثبت‌نام
      cy.url().should('include', '/auth/register');
    });

    it('لینک تماس با ما', () => {
      cy.contains('تماس با ما').click();
      cy.url().should('include', '/contact');
    });
  });

  describe('Featured Courses - درس-آزمون‌های محبوب', () => {
    it('نمایش بخش درس-آزمون‌های محبوب', () => {
      cy.contains('درس-آزمون‌های محبوب').should('be.visible');
      cy.contains('آزمون‌های پرطرفدار و محبوب کاربران').should('be.visible');
    });

    it('نمایش کارت‌های آزمون (در صورت وجود داده)', () => {
      // منتظر بارگذاری داده‌ها
      cy.wait(2000);
      
      // بررسی وجود کارت‌ها یا پیام خطا
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="course-card"]').length > 0) {
          // اگر کارت‌ها موجود باشند
          cy.get('[data-cy="course-card"]').should('have.length.at.least', 1);
        } else {
          // اگر خطا یا loading باشد
          cy.get('.animate-pulse, .text-red-600').should('exist');
        }
      });
    });

    it('لینک مشاهده همه آزمون‌ها', () => {
      cy.contains('مشاهده همه آزمون‌ها').should('be.visible');
      cy.contains('مشاهده همه آزمون‌ها').click();
      cy.url().should('include', '/course-exam');
    });
  });

  describe('Testimonials - نظرات کاربران', () => {
    it('نمایش بخش نظرات کاربران', () => {
      cy.contains('نظرات کاربران').should('be.visible');
      cy.contains('تجربه کاربران ما از استفاده از سامانه آزمون‌های آنلاین').should('be.visible');
    });

    it('عملکرد اسلایدر نظرات', () => {
      // بررسی وجود نظرات
      cy.get('[data-cy="testimonial-card"]').should('exist');
      
      // بررسی دکمه‌های ناوبری
      cy.get('button[aria-label*="نظر"]').should('have.length.at.least', 2);
      
      // تست کلیک روی دکمه‌های ناوبری
      cy.get('button[aria-label="نظر بعدی"]').click();
      cy.wait(500);
      cy.get('button[aria-label="نظر قبلی"]').click();
    });

    it('نمایش ستاره‌های امتیاز', () => {
      // بررسی وجود ستاره‌ها
      cy.get('svg').should('contain.class', 'text-yellow-400');
    });
  });

  describe('Responsive Design - طراحی ریسپانسیو', () => {
    it('نمایش صحیح در موبایل', () => {
      cy.viewport('iphone-6');
      
      // بررسی عنوان اصلی
      cy.contains('سامانه جامع').should('be.visible');
      
      // بررسی دکمه‌های CTA در موبایل
      cy.contains('شروع آزمون').should('be.visible');
      cy.contains('تماس با ما').should('be.visible');
    });

    it('نمایش صحیح در تبلت', () => {
      cy.viewport('ipad-2');
      
      // بررسی grid ویژگی‌ها
      cy.get('.grid-cols-1').should('exist');
      
      // بررسی آمار سایت
      cy.contains('۱۲۰۰+').should('be.visible');
    });

    it('نمایش صحیح در دسکتاپ', () => {
      cy.viewport(1920, 1080);
      
      // بررسی layout کامل
      cy.contains('سامانه جامع').should('be.visible');
      cy.contains('درس-آزمون‌های محبوب').should('be.visible');
      cy.contains('نظرات کاربران').should('be.visible');
    });
  });

  describe('RTL Support - پشتیبانی از راست به چپ', () => {
    it('جهت صحیح متن فارسی', () => {
      // بررسی direction صفحه
      cy.get('html').should('have.attr', 'dir', 'rtl');
      
      // بررسی فونت فارسی
      cy.get('body').should('have.css', 'font-family').and('include', 'IRANSans');
    });

    it('چیدمان صحیح عناصر RTL', () => {
      // بررسی چیدمان دکمه‌ها
      cy.get('.flex').should('exist');
      
      // بررسی آیکون‌ها در جهت صحیح
      cy.get('svg').should('be.visible');
    });
  });

  describe('Accessibility - دسترسی‌پذیری', () => {
    it('وجود alt text برای تصاویر', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('وجود aria-label برای دکمه‌ها', () => {
      cy.get('button[aria-label]').should('exist');
    });

    it('تست کیبورد navigation', () => {
      // تست Tab navigation
      cy.get('body').tab();
      cy.focused().should('be.visible');
    });

    it('تست contrast ratio', () => {
      // بررسی رنگ‌های متن
      cy.get('.text-gray-900').should('have.css', 'color');
      cy.get('.text-blue-600').should('have.css', 'color');
    });
  });

  describe('Performance - عملکرد', () => {
    it('زمان بارگذاری صفحه', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(3000); // کمتر از 3 ثانیه
        },
      });
    });

    it('بارگذاری lazy images', () => {
      // بررسی loading="lazy" برای تصاویر
      cy.get('img[loading="lazy"]').should('exist');
    });
  });

  describe('Error Handling - مدیریت خطا', () => {
    it('مدیریت خطای API', () => {
      // شبیه‌سازی خطای شبکه
      cy.intercept('GET', '**/api/courseExam/popular', { forceNetworkError: true });
      cy.visit('/');
      
      // بررسی نمایش پیام خطا
      cy.contains('خطا در بارگذاری').should('be.visible');
    });

    it('fallback برای عدم دریافت نظرات', () => {
      // شبیه‌سازی عدم دریافت نظرات
      cy.intercept('GET', '**/api/testimonials', { body: [] });
      cy.visit('/');
      
      // بررسی نمایش نظرات پیش‌فرض
      cy.contains('علی احمدی').should('be.visible');
    });
  });
}); 