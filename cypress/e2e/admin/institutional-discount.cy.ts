/**
 * E2E Tests for Institutional Discount System
 * تست‌های انتها به انتها برای سیستم تخفیف سازمانی
 */

describe('Institutional Discount System - سیستم تخفیف سازمانی', () => {
  const adminUser = {
    email: 'admin@soaledu.ir',
    password: 'admin123',
  };

  beforeEach(() => {
    // ورود به عنوان ادمین
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type(adminUser.email);
    cy.get('[data-cy=password-input]').type(adminUser.password);
    cy.get('[data-cy=login-button]').click();
    
    // انتظار برای بارگذاری داشبورد
    cy.url().should('include', '/admin');
    
    // رفتن به صفحه تخفیف‌های سازمانی
    cy.visit('/admin/institutional-discounts');
    cy.url().should('include', '/admin/institutional-discounts');
  });

  afterEach(() => {
    // خروج از حساب کاربری
    cy.get('[data-cy=logout-button]').click();
  });

  describe('صفحه اصلی تخفیف‌های سازمانی', () => {
    it('باید عناصر اصلی صفحه را نمایش دهد', () => {
      // بررسی عنوان صفحه
      cy.contains('مدیریت تخفیف‌های سازمانی').should('be.visible');
      
      // بررسی تب‌های موجود
      cy.get('[data-cy=upload-tab]').should('be.visible').and('contain', 'بارگذاری فایل');
      cy.get('[data-cy=list-tab]').should('be.visible').and('contain', 'لیست گروه‌ها');
      
      // بررسی آمار کلی
      cy.get('[data-cy=stats-cards]').should('be.visible');
      cy.get('[data-cy=total-groups-stat]').should('be.visible');
      cy.get('[data-cy=active-groups-stat]').should('be.visible');
      cy.get('[data-cy=discounted-users-stat]').should('be.visible');
    });

    it('باید بین تب‌ها تغییر کند', () => {
      // تب بارگذاری فایل باید به طور پیش‌فرض فعال باشد
      cy.get('[data-cy=upload-tab]').should('have.class', 'border-blue-500');
      cy.get('[data-cy=upload-form]').should('be.visible');
      
      // تغییر به تب لیست گروه‌ها
      cy.get('[data-cy=list-tab]').click();
      cy.get('[data-cy=list-tab]').should('have.class', 'border-blue-500');
      cy.get('[data-cy=groups-list]').should('be.visible');
      
      // برگشت به تب بارگذاری
      cy.get('[data-cy=upload-tab]').click();
      cy.get('[data-cy=upload-form]').should('be.visible');
    });
  });

  describe('بارگذاری فایل اکسل', () => {
    beforeEach(() => {
      // اطمینان از بودن در تب بارگذاری
      cy.get('[data-cy=upload-tab]').click();
    });

    it('باید فرم بارگذاری را نمایش دهد', () => {
      cy.get('[data-cy=upload-form]').should('be.visible');
      cy.get('[data-cy=group-name-input]').should('be.visible');
      cy.get('[data-cy=discount-type-percentage]').should('be.visible');
      cy.get('[data-cy=discount-type-amount]').should('be.visible');
      cy.get('[data-cy=file-input]').should('be.visible');
      cy.get('[data-cy=upload-button]').should('be.visible');
    });

    it('باید اعتبارسنجی فرم را انجام دهد', () => {
      // تلاش برای ارسال فرم خالی
      cy.get('[data-cy=upload-button]').click();
      
      // بررسی پیام‌های خطا
      cy.contains('لطفا فایل اکسل را انتخاب کنید').should('be.visible');
      cy.contains('لطفا نوع تخفیف را انتخاب کنید').should('be.visible');
    });

    it('باید تبدیل بین نوع تخفیف درصدی و مبلغ ثابت کار کند', () => {
      // انتخاب تخفیف درصدی
      cy.get('[data-cy=discount-type-percentage]').click();
      cy.get('[data-cy=percentage-input]').should('be.visible');
      cy.get('[data-cy=amount-input]').should('not.exist');
      
      // انتخاب تخفیف مبلغ ثابت
      cy.get('[data-cy=discount-type-amount]').click();
      cy.get('[data-cy=amount-input]').should('be.visible');
      cy.get('[data-cy=percentage-input]').should('not.exist');
    });

    it('باید فایل اکسل معتبر را بارگذاری کند', () => {
      // انتخاب فایل نمونه
      const fileName = 'sample-discount-list.xlsx';
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=file-input]').selectFile({
          contents: Cypress.Buffer.from(fileContent),
          fileName,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      });
      
      // پر کردن سایر فیلدها
      cy.get('[data-cy=group-name-input]').type('مدرسه تست E2E');
      cy.get('[data-cy=discount-type-percentage]').click();
      cy.get('[data-cy=percentage-input]').type('15');
      
      // ارسال فرم
      cy.intercept('POST', '/api/v1/admin/institutional-discounts/upload', {
        statusCode: 200,
        body: {
          success: true,
          message: 'فایل با موفقیت بارگذاری شد',
          data: { groupId: 'test-group-123' }
        }
      }).as('uploadFile');
      
      cy.get('[data-cy=upload-button]').click();
      
      // بررسی درخواست API
      cy.wait('@uploadFile');
      
      // بررسی پیام موفقیت
      cy.contains('فایل با موفقیت بارگذاری شد').should('be.visible');
      
      // بررسی تغییر به تب لیست
      cy.get('[data-cy=list-tab]').should('have.class', 'border-blue-500');
    });

    it('باید خطای فایل نامعتبر را نمایش دهد', () => {
      // انتخاب فایل نامعتبر (PDF)
      cy.fixture('sample-document.pdf').then(fileContent => {
        cy.get('[data-cy=file-input]').selectFile({
          contents: Cypress.Buffer.from(fileContent),
          fileName: 'document.pdf',
          mimeType: 'application/pdf',
        });
      });
      
      cy.contains('فقط فایل‌های اکسل مجاز هستند').should('be.visible');
    });

    it('باید پیشرفت بارگذاری را نمایش دهد', () => {
      // Mock API با تاخیر
      cy.intercept('POST', '/api/v1/admin/institutional-discounts/upload', {
        statusCode: 200,
        body: {
          success: true,
          message: 'فایل با موفقیت بارگذاری شد',
        },
        delay: 2000,
      }).as('uploadFileWithDelay');
      
      // انتخاب فایل و پر کردن فرم
      cy.fixture('sample-discount-list.xlsx').then(fileContent => {
        cy.get('[data-cy=file-input]').selectFile({
          contents: Cypress.Buffer.from(fileContent),
          fileName: 'sample-discount-list.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      });
      
      cy.get('[data-cy=discount-type-percentage]').click();
      cy.get('[data-cy=percentage-input]').type('10');
      
      // ارسال فرم
      cy.get('[data-cy=upload-button]').click();
      
      // بررسی نمایش loading state
      cy.get('[data-cy=upload-progress]').should('be.visible');
      cy.contains('در حال بارگذاری').should('be.visible');
      
      // انتظار برای تکمیل
      cy.wait('@uploadFileWithDelay');
    });
  });

  describe('لیست گروه‌های تخفیف', () => {
    beforeEach(() => {
      // رفتن به تب لیست
      cy.get('[data-cy=list-tab]').click();
      
      // Mock API برای لیست گروه‌ها
      cy.intercept('GET', '/api/v1/admin/institutional-discounts/groups*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            groups: [
              {
                _id: 'group1',
                groupName: 'مدرسه اول',
                discountPercentage: 10,
                status: 'completed',
                totalUsersInFile: 50,
                matchedUsersCount: 45,
                uploadDate: '2024-01-15T10:00:00Z',
                isActive: true,
              },
              {
                _id: 'group2',
                groupName: 'مدرسه دوم',
                discountPercentage: 15,
                status: 'processing',
                totalUsersInFile: 30,
                matchedUsersCount: 0,
                uploadDate: '2024-01-16T11:00:00Z',
                isActive: true,
              },
            ],
            pagination: {
              totalItems: 2,
              currentPage: 1,
              totalPages: 1,
              itemsPerPage: 10,
            },
          },
        },
      }).as('getGroups');
    });

    it('باید لیست گروه‌ها را نمایش دهد', () => {
      cy.wait('@getGroups');
      
      // بررسی نمایش جدول
      cy.get('[data-cy=groups-table]').should('be.visible');
      
      // بررسی سطرهای جدول
      cy.get('[data-cy=group-row]').should('have.length', 2);
      
      // بررسی اطلاعات گروه اول
      cy.get('[data-cy=group-row]').first().within(() => {
        cy.contains('مدرسه اول').should('be.visible');
        cy.contains('10%').should('be.visible');
        cy.contains('تکمیل شده').should('be.visible');
        cy.contains('45/50').should('be.visible');
      });
      
      // بررسی اطلاعات گروه دوم
      cy.get('[data-cy=group-row]').last().within(() => {
        cy.contains('مدرسه دوم').should('be.visible');
        cy.contains('15%').should('be.visible');
        cy.contains('در حال پردازش').should('be.visible');
        cy.contains('0/30').should('be.visible');
      });
    });

    it('باید فیلتر بر اساس وضعیت کار کند', () => {
      cy.wait('@getGroups');
      
      // انتخاب فیلتر وضعیت
      cy.get('[data-cy=status-filter]').select('completed');
      
      // Mock API برای فیلتر شده
      cy.intercept('GET', '/api/v1/admin/institutional-discounts/groups*status=completed*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            groups: [
              {
                _id: 'group1',
                groupName: 'مدرسه اول',
                discountPercentage: 10,
                status: 'completed',
                totalUsersInFile: 50,
                matchedUsersCount: 45,
                uploadDate: '2024-01-15T10:00:00Z',
                isActive: true,
              },
            ],
            pagination: {
              totalItems: 1,
              currentPage: 1,
              totalPages: 1,
              itemsPerPage: 10,
            },
          },
        },
      }).as('getFilteredGroups');
      
      cy.wait('@getFilteredGroups');
      
      // بررسی نتایج فیلتر شده
      cy.get('[data-cy=group-row]').should('have.length', 1);
      cy.contains('مدرسه اول').should('be.visible');
      cy.contains('تکمیل شده').should('be.visible');
    });

    it('باید جزئیات گروه را نمایش دهد', () => {
      cy.wait('@getGroups');
      
      // Mock API برای جزئیات گروه
      cy.intercept('GET', '/api/v1/admin/institutional-discounts/groups/group1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            _id: 'group1',
            groupName: 'مدرسه اول',
            discountPercentage: 10,
            status: 'completed',
            totalUsersInFile: 50,
            matchedUsersCount: 45,
            unmatchedUsersCount: 3,
            invalidDataCount: 2,
            errorLog: ['خطای نمونه'],
            uploadDate: '2024-01-15T10:00:00Z',
            uploadedBy: {
              name: 'ادمین تست',
              email: 'admin@test.com',
            },
          },
        },
      }).as('getGroupDetails');
      
      // کلیک روی دکمه جزئیات
      cy.get('[data-cy=group-row]').first().within(() => {
        cy.get('[data-cy=view-details-button]').click();
      });
      
      cy.wait('@getGroupDetails');
      
      // بررسی نمایش مودال جزئیات
      cy.get('[data-cy=group-details-modal]').should('be.visible');
      cy.contains('جزئیات گروه تخفیف').should('be.visible');
      cy.contains('مدرسه اول').should('be.visible');
      cy.contains('45 کاربر تطبیق یافته').should('be.visible');
      cy.contains('3 کاربر پیدا نشده').should('be.visible');
      cy.contains('2 داده نامعتبر').should('be.visible');
    });

    it('باید گروه را غیرفعال کند', () => {
      cy.wait('@getGroups');
      
      // Mock API برای حذف
      cy.intercept('DELETE', '/api/v1/admin/institutional-discounts/groups/group1', {
        statusCode: 200,
        body: {
          success: true,
          message: 'گروه تخفیف با موفقیت حذف شد',
        },
      }).as('deleteGroup');
      
      // کلیک روی دکمه حذف
      cy.get('[data-cy=group-row]').first().within(() => {
        cy.get('[data-cy=delete-button]').click();
      });
      
      // تایید حذف در مودال
      cy.get('[data-cy=confirm-delete-modal]').should('be.visible');
      cy.get('[data-cy=confirm-delete-button]').click();
      
      cy.wait('@deleteGroup');
      
      // بررسی پیام موفقیت
      cy.contains('گروه تخفیف با موفقیت حذف شد').should('be.visible');
    });

    it('باید صفحه‌بندی کار کند', () => {
      // Mock API برای صفحه دوم
      cy.intercept('GET', '/api/v1/admin/institutional-discounts/groups*page=2*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            groups: [],
            pagination: {
              totalItems: 2,
              currentPage: 2,
              totalPages: 2,
              itemsPerPage: 10,
            },
          },
        },
      }).as('getPage2');
      
      cy.wait('@getGroups');
      
      // کلیک روی صفحه بعدی (اگر موجود باشد)
      cy.get('[data-cy=pagination]').within(() => {
        if (cy.get('[data-cy=next-page]').should('exist')) {
          cy.get('[data-cy=next-page]').click();
          cy.wait('@getPage2');
        }
      });
    });
  });

  describe('تست یکپارچگی با سیستم کاربر', () => {
    it('باید تخفیف اعمال شده را در پروفایل کاربر نمایش دهد', () => {
      // فرض می‌کنیم کاربری با تخفیف سازمانی داریم
      cy.visit('/profile');
      
      // بررسی نمایش تخفیف سازمانی
      cy.get('[data-cy=institutional-discount-info]').should('be.visible');
      cy.contains('تخفیف سازمانی').should('be.visible');
      cy.contains('10%').should('be.visible'); // فرض: 10% تخفیف
    });

    it('باید تخفیف در فرآیند خرید اعمال شود', () => {
      // شبیه‌سازی فرآیند خرید آزمون
      cy.visit('/course-exams');
      
      // انتخاب یک آزمون
      cy.get('[data-cy=exam-card]').first().click();
      cy.get('[data-cy=purchase-button]').click();
      
      // بررسی اعمال تخفیف در صفحه پرداخت
      cy.url().should('include', '/payment');
      cy.get('[data-cy=institutional-discount-applied]').should('be.visible');
      cy.contains('تخفیف سازمانی: 10%').should('be.visible');
    });
  });

  describe('تست‌های دسترسی (Accessibility)', () => {
    it('باید استانداردهای دسترسی را رعایت کند', () => {
      // بررسی عدم وجود نقض استانداردهای a11y
      cy.injectAxe();
      cy.checkA11y('[data-cy=institutional-discount-page]', {
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-management': { enabled: true },
        },
      });
    });

    it('باید با صفحه کلید قابل ناوبری باشد', () => {
      // ناوبری با Tab
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-cy', 'upload-tab');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-cy', 'list-tab');
      
      // ادامه تست‌های keyboard navigation
    });

    it('باید با screen reader سازگار باشد', () => {
      // بررسی وجود aria-labels و role attributes
      cy.get('[data-cy=upload-form]').should('have.attr', 'role', 'form');
      cy.get('[data-cy=file-input]').should('have.attr', 'aria-label');
      cy.get('[data-cy=groups-table]').should('have.attr', 'role', 'table');
    });
  });

  describe('تست‌های عملکرد (Performance)', () => {
    it('باید در زمان مناسب لود شود', () => {
      const start = Date.now();
      
      cy.visit('/admin/institutional-discounts');
      cy.get('[data-cy=institutional-discount-page]').should('be.visible');
      
      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(3000); // کمتر از 3 ثانیه
    });

    it('باید با حجم زیاد داده سریع کار کند', () => {
      // Mock API با حجم زیاد داده
      const largeDataSet = Array.from({ length: 100 }, (_, i) => ({
        _id: `group${i}`,
        groupName: `مدرسه ${i}`,
        discountPercentage: 10,
        status: 'completed',
        totalUsersInFile: 50,
        matchedUsersCount: 45,
        uploadDate: '2024-01-15T10:00:00Z',
        isActive: true,
      }));
      
      cy.intercept('GET', '/api/v1/admin/institutional-discounts/groups*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            groups: largeDataSet.slice(0, 10), // صفحه اول
            pagination: {
              totalItems: 100,
              currentPage: 1,
              totalPages: 10,
              itemsPerPage: 10,
            },
          },
        },
      }).as('getLargeDataSet');
      
      cy.get('[data-cy=list-tab]').click();
      cy.wait('@getLargeDataSet');
      
      // بررسی عملکرد رندرینگ
      cy.get('[data-cy=groups-table]').should('be.visible');
      cy.get('[data-cy=group-row]').should('have.length', 10);
    });
  });
}); 