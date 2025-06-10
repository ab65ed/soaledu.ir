/**
 * E2E تست برای صفحه ایجاد درس-آزمون
 * Test: فرم 5 مرحله‌ای، انتخاب سوالات، و ارسال نظرسنجی
 */

describe('Course Exam Creation E2E Tests', () => {
  beforeEach(() => {
    // ویزیت صفحه course-exam
    cy.visit('/course-exam');
    
    // انتظار تا صفحه بارگذاری شود
    cy.contains('ایجاد درس-آزمون جدید').should('be.visible');
  });

  it('should complete the full course exam creation flow', () => {
    // مرحله 1: انتخاب نوع درس
    cy.contains('نوع درس را انتخاب کنید').should('be.visible');
    cy.get('input[value="math"]').click();
    cy.contains('بعدی').click();

    // مرحله 2: انتخاب مقطع
    cy.contains('مقطع تحصیلی را انتخاب کنید').should('be.visible');
    cy.get('input[value="high"]').click();
    cy.contains('بعدی').click();

    // مرحله 3: انتخاب گروه
    cy.contains('گروه آموزشی را انتخاب کنید').should('be.visible');
    cy.get('input[value="math-physics"]').click();
    cy.contains('بعدی').click();

    // مرحله 4: وارد کردن جزئیات
    cy.contains('جزئیات درس-آزمون').should('be.visible');
    
    // پر کردن فیلدها
    cy.get('input[name="title"]').type('آزمون ریاضی پایه دهم - فصل اول');
    cy.get('textarea[name="description"]').type('آزمون جامع ریاضی برای فصل اول دهم که شامل حد و پیوستگی می‌باشد');
    cy.get('input[name="price"]').clear().type('50');
    cy.get('select[name="difficulty"]').select('medium');
    cy.get('input[name="estimatedTime"]').clear().type('90');
    
    cy.contains('بعدی').click();

    // مرحله 5: انتخاب سوالات
    cy.contains('انتخاب سوالات').should('be.visible');
    
    // انتظار تا سوالات بارگذاری شوند
    cy.get('[data-testid="question-item"]', { timeout: 10000 }).should('have.length.at.least', 1);
    
    // انتخاب چند سوال
    cy.get('[data-testid="question-item"]').first().click();
    cy.get('[data-testid="question-item"]').eq(1).click();
    
    // بررسی شمارنده
    cy.contains('2 از').should('be.visible');
    
    // ارسال فرم
    cy.contains('ایجاد درس-آزمون').click();

    // بررسی پیام موفقیت
    cy.contains('درس-آزمون با موفقیت ایجاد شد!', { timeout: 10000 }).should('be.visible');
  });

  it('should validate required fields in each step', () => {
    // مرحله 1: بدون انتخاب نوع درس
    cy.contains('بعدی').click();
    cy.contains('نوع درس الزامی است').should('be.visible');

    // انتخاب نوع درس و ادامه
    cy.get('input[value="math"]').click();
    cy.contains('بعدی').click();

    // مرحله 2: بدون انتخاب مقطع
    cy.contains('بعدی').click();
    cy.contains('مقطع الزامی است').should('be.visible');

    // انتخاب مقطع و ادامه
    cy.get('input[value="high"]').click();
    cy.contains('بعدی').click();

    // مرحله 3: بدون انتخاب گروه
    cy.contains('بعدی').click();
    cy.contains('گروه الزامی است').should('be.visible');

    // انتخاب گروه و ادامه
    cy.get('input[value="math-physics"]').click();
    cy.contains('بعدی').click();

    // مرحله 4: بدون پر کردن فیلدهای الزامی
    cy.contains('بعدی').click();
    cy.contains('عنوان باید حداقل 3 کاراکتر باشد').should('be.visible');
    cy.contains('توضیحات باید حداقل 10 کاراکتر باشد').should('be.visible');
  });

  it('should navigate back and forth between steps', () => {
    // مرحله 1
    cy.get('input[value="math"]').click();
    cy.contains('بعدی').click();

    // مرحله 2
    cy.get('input[value="high"]').click();
    cy.contains('بعدی').click();

    // مرحله 3
    cy.get('input[value="math-physics"]').click();
    cy.contains('بعدی').click();

    // برگشت به مرحله 3
    cy.contains('قبلی').click();
    cy.contains('گروه آموزشی را انتخاب کنید').should('be.visible');

    // برگشت به مرحله 2
    cy.contains('قبلی').click();
    cy.contains('مقطع تحصیلی را انتخاب کنید').should('be.visible');

    // برگشت به مرحله 1
    cy.contains('قبلی').click();
    cy.contains('نوع درس را انتخاب کنید').should('be.visible');

    // بررسی که دکمه قبل در مرحله اول غیرفعال است
    cy.contains('قبلی').should('be.disabled');
  });

  it('should test accessibility and RTL layout', () => {
    // بررسی جهت RTL
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('body').should('have.css', 'direction', 'rtl');

    // بررسی focus management
    cy.get('input[value="math"]').focus();
    cy.focused().should('have.value', 'math');

    // بررسی keyboard navigation
    cy.get('body').type('{tab}');
    cy.focused().should('exist');
  });
}); 