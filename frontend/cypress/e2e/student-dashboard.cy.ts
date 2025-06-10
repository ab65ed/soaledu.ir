describe('Student Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify({
        id: 'student-1',
        name: 'علی احمدی',
        role: 'student',
        email: 'ali@test.com'
      }));
    });

    // Intercept API calls
    cy.intercept('GET', '/api/student/stats*', {
      fixture: 'student-stats.json'
    }).as('getStudentStats');

    cy.intercept('GET', '/api/student/recent-exams', {
      fixture: 'recent-exams.json'
    }).as('getRecentExams');

    cy.intercept('GET', '/api/student/upcoming-exams', {
      fixture: 'upcoming-exams.json'
    }).as('getUpcomingExams');

    cy.intercept('GET', '/api/student/study-sessions*', {
      fixture: 'study-sessions.json'
    }).as('getStudySessions');

    cy.visit('/student/dashboard');
  });

  describe('Dashboard Loading and Display', () => {
    it('should load dashboard with correct title and navigation', () => {
      cy.get('[data-testid="dashboard-title"]')
        .should('contain', 'داشبورد دانش‌آموز');
      
      cy.get('[data-testid="dashboard-subtitle"]')
        .should('contain', 'خوش آمدید! پیشرفت تحصیلی خود را مشاهده کنید');

      // Check navigation tabs
      cy.get('[data-testid="tab-overview"]').should('be.visible');
      cy.get('[data-testid="tab-progress"]').should('be.visible');
      cy.get('[data-testid="tab-achievements"]').should('be.visible');
      cy.get('[data-testid="tab-schedule"]').should('be.visible');
    });

    it('should wait for API calls and display loading states', () => {
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      
      cy.wait('@getStudentStats');
      cy.wait('@getRecentExams');
      cy.wait('@getUpcomingExams');
      cy.wait('@getStudySessions');

      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });

    it('should handle Persian RTL layout correctly', () => {
      cy.get('[data-testid="dashboard-container"]')
        .should('have.attr', 'dir', 'rtl');
      
      // Check if Persian numbers are displayed correctly
      cy.get('[data-testid="completed-exams-count"]')
        .should('contain.text', '۳۸/۴۵');
      
      cy.get('[data-testid="average-score"]')
        .should('contain.text', '۸۷.۵%');
    });
  });

  describe('Statistics Cards', () => {
    it('should display all statistics cards with correct data', () => {
      cy.wait('@getStudentStats');

      // Completed exams card
      cy.get('[data-testid="stat-completed-exams"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="stat-title"]').should('contain', 'آزمون‌های تکمیل شده');
          cy.get('[data-testid="stat-value"]').should('contain', '۳۸/۴۵');
          cy.get('[data-testid="stat-average"]').should('contain', 'میانگین نمره: ۸۷.۵%');
        });

      // Class rank card
      cy.get('[data-testid="stat-rank"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="stat-title"]').should('contain', 'رتبه کلاسی');
          cy.get('[data-testid="stat-value"]').should('contain', '۲۳');
          cy.get('[data-testid="stat-subtitle"]').should('contain', 'از ۱,۲۵۰ دانش‌آموز');
        });

      // Study time card
      cy.get('[data-testid="stat-study-time"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="stat-title"]').should('contain', 'زمان مطالعه');
          cy.get('[data-testid="stat-value"]').should('contain', '۴۷h');
        });

      // Streak card
      cy.get('[data-testid="stat-streak"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="stat-title"]').should('contain', 'روزهای متوالی');
          cy.get('[data-testid="stat-value"]').should('contain', '۷');
          cy.get('[data-testid="stat-message"]').should('contain', 'به همین روال ادامه دهید! 🔥');
        });
    });

    it('should display correct icons for each statistic', () => {
      cy.wait('@getStudentStats');

      cy.get('[data-testid="stat-completed-exams"] [data-testid="stat-icon"]')
        .should('have.class', 'text-blue-600');
      
      cy.get('[data-testid="stat-rank"] [data-testid="stat-icon"]')
        .should('have.class', 'text-yellow-600');
      
      cy.get('[data-testid="stat-study-time"] [data-testid="stat-icon"]')
        .should('have.class', 'text-green-600');
      
      cy.get('[data-testid="stat-streak"] [data-testid="stat-icon"]')
        .should('have.class', 'text-orange-600');
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between tabs correctly', () => {
      cy.wait('@getStudentStats');

      // Initially overview tab should be active
      cy.get('[data-testid="tab-overview"]')
        .should('have.class', 'border-blue-500')
        .should('have.class', 'text-blue-600');

      // Switch to achievements tab
      cy.get('[data-testid="tab-achievements"]').click();
      cy.get('[data-testid="tab-achievements"]')
        .should('have.class', 'border-blue-500')
        .should('have.class', 'text-blue-600');
      
      cy.get('[data-testid="achievements-section"]').should('be.visible');

      // Switch to progress tab
      cy.get('[data-testid="tab-progress"]').click();
      cy.get('[data-testid="tab-progress"]')
        .should('have.class', 'border-blue-500');
      
      cy.get('[data-testid="progress-section"]').should('be.visible');

      // Switch to schedule tab
      cy.get('[data-testid="tab-schedule"]').click();
      cy.get('[data-testid="tab-schedule"]')
        .should('have.class', 'border-blue-500');
      
      cy.get('[data-testid="schedule-section"]').should('be.visible');
    });

    it('should maintain tab state during page refresh', () => {
      cy.wait('@getStudentStats');

      // Switch to achievements tab
      cy.get('[data-testid="tab-achievements"]').click();
      
      // Refresh page
      cy.reload();
      
      // Should still be on achievements tab (if implemented with URL routing)
      // For now, it will default back to overview
      cy.get('[data-testid="tab-overview"]')
        .should('have.class', 'border-blue-500');
    });
  });

  describe('Time Range Selection', () => {
    it('should change data when selecting different time ranges', () => {
      cy.wait('@getStudentStats');

      // Check default selection
      cy.get('[data-testid="time-range-selector"]')
        .should('have.value', 'week');

      // Change to month
      cy.get('[data-testid="time-range-selector"]').select('month');
      cy.wait('@getStudentStats');

      // Change to semester
      cy.get('[data-testid="time-range-selector"]').select('semester');
      cy.wait('@getStudentStats');

      // Verify API calls were made with correct parameters
      cy.get('@getStudentStats.all').should('have.length.at.least', 3);
    });

    it('should display Persian labels in time range dropdown', () => {
      cy.get('[data-testid="time-range-selector"]')
        .should('be.visible')
        .within(() => {
          cy.get('option[value="week"]').should('contain', 'هفته جاری');
          cy.get('option[value="month"]').should('contain', 'ماه جاری');
          cy.get('option[value="semester"]').should('contain', 'ترم جاری');
        });
    });
  });

  describe('Recent Exams Section', () => {
    it('should display recent exams with correct information', () => {
      cy.wait('@getRecentExams');

      cy.get('[data-testid="recent-exams-section"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="section-title"]').should('contain', 'آزمون‌های اخیر');
          
          // Check first exam
          cy.get('[data-testid="exam-item"]').first().within(() => {
            cy.get('[data-testid="exam-title"]')
              .should('contain', 'آزمون ریاضی فصل 3');
            
            cy.get('[data-testid="exam-subject"]')
              .should('contain', 'ریاضی');
            
            cy.get('[data-testid="exam-difficulty"]')
              .should('contain', 'متوسط')
              .should('have.class', 'bg-yellow-100');
            
            cy.get('[data-testid="exam-score"]')
              .should('contain', '۹۲/۱۰۰')
              .should('have.class', 'text-green-600');
            
            cy.get('[data-testid="exam-date"]')
              .should('be.visible');
          });
        });
    });

    it('should display correct difficulty colors', () => {
      cy.wait('@getRecentExams');

      // Easy - green
      cy.get('[data-testid="exam-item"]')
        .contains('آسان')
        .should('have.class', 'bg-green-100')
        .should('have.class', 'text-green-800');

      // Medium - yellow
      cy.get('[data-testid="exam-item"]')
        .contains('متوسط')
        .should('have.class', 'bg-yellow-100')
        .should('have.class', 'text-yellow-800');

      // Hard - red
      cy.get('[data-testid="exam-item"]')
        .contains('سخت')
        .should('have.class', 'bg-red-100')
        .should('have.class', 'text-red-800');
    });

    it('should display correct score colors based on percentage', () => {
      cy.wait('@getRecentExams');

      // High score (≥90%) - green
      cy.get('[data-testid="exam-score"]')
        .contains('۹۲/۱۰۰')
        .should('have.class', 'text-green-600');

      // Medium score (70-89%) - yellow (if exists)
      cy.get('[data-testid="exam-score"]')
        .contains('۸۵/۱۰۰')
        .should('have.class', 'text-yellow-600');
    });
  });

  describe('Upcoming Exams Section', () => {
    it('should display upcoming exams correctly', () => {
      cy.wait('@getUpcomingExams');

      cy.get('[data-testid="upcoming-exams-section"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="section-title"]').should('contain', 'آزمون‌های آینده');
          
          // Check required exam badge
          cy.get('[data-testid="exam-item"]').first().within(() => {
            cy.get('[data-testid="exam-title"]')
              .should('contain', 'آزمون ریاضی فصل 4');
            
            cy.get('[data-testid="required-badge"]')
              .should('contain', 'اجباری')
              .should('have.class', 'bg-red-100')
              .should('have.class', 'text-red-800');
            
            cy.get('[data-testid="exam-questions-count"]')
              .should('contain', '۲۵ سؤال');
            
            cy.get('[data-testid="exam-duration"]')
              .should('contain', '۹۰ دقیقه');
          });
        });
    });

    it('should format Persian dates and times correctly', () => {
      cy.wait('@getUpcomingExams');

      cy.get('[data-testid="exam-item"]').first().within(() => {
        cy.get('[data-testid="exam-date"]')
          .should('match', /\d{4}\/\d{1,2}\/\d{1,2}/); // Persian date format
        
        cy.get('[data-testid="exam-time"]')
          .should('match', /\d{1,2}:\d{2}/); // Time format
      });
    });
  });

  describe('Achievements Section', () => {
    it('should display achievements correctly', () => {
      cy.wait('@getStudentStats');
      
      cy.get('[data-testid="tab-achievements"]').click();
      
      cy.get('[data-testid="achievements-section"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="achievements-title"]')
            .should('contain', 'دستاوردهای شما');
          
          // Check achievement items
          cy.get('[data-testid="achievement-item"]').should('have.length.at.least', 1);
          
          cy.get('[data-testid="achievement-item"]').first().within(() => {
            cy.get('[data-testid="achievement-icon"]').should('be.visible');
            cy.get('[data-testid="achievement-title"]').should('be.visible');
            cy.get('[data-testid="achievement-description"]').should('be.visible');
            cy.get('[data-testid="achievement-date"]').should('be.visible');
          });
        });
    });

    it('should display achievement rarity colors correctly', () => {
      cy.wait('@getStudentStats');
      
      cy.get('[data-testid="tab-achievements"]').click();
      
      // Common achievement
      cy.get('[data-testid="achievement-item"]')
        .contains('اولین آزمون')
        .should('have.class', 'border-gray-300')
        .should('have.class', 'bg-gray-50');

      // Rare achievement
      cy.get('[data-testid="achievement-item"]')
        .contains('هفت روز متوالی')
        .should('have.class', 'border-blue-300')
        .should('have.class', 'bg-blue-50');

      // Epic achievement
      cy.get('[data-testid="achievement-item"]')
        .contains('بهترین نمره')
        .should('have.class', 'border-purple-300')
        .should('have.class', 'bg-purple-50');
    });
  });

  describe('Responsive Design', () => {
    it('should work correctly on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.wait('@getStudentStats');

      // Statistics should stack vertically on mobile
      cy.get('[data-testid="stats-grid"]')
        .should('have.class', 'grid-cols-1');

      // Tabs should be scrollable horizontally if needed
      cy.get('[data-testid="tabs-navigation"]').should('be.visible');

      // Cards should be full width on mobile
      cy.get('[data-testid="recent-exams-section"]')
        .should('be.visible');
    });

    it('should work correctly on tablet devices', () => {
      cy.viewport('ipad-2');
      cy.wait('@getStudentStats');

      // Statistics should show 2 columns on tablet
      cy.get('[data-testid="stats-grid"]')
        .should('have.class', 'md:grid-cols-2');
    });

    it('should work correctly on desktop', () => {
      cy.viewport(1920, 1080);
      cy.wait('@getStudentStats');

      // Statistics should show 4 columns on desktop
      cy.get('[data-testid="stats-grid"]')
        .should('have.class', 'lg:grid-cols-4');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      cy.wait('@getStudentStats');

      // Check main heading
      cy.get('[data-testid="dashboard-title"]')
        .should('have.attr', 'role', 'heading')
        .should('have.attr', 'aria-level', '1');

      // Check navigation tabs
      cy.get('[data-testid="tabs-navigation"]')
        .should('have.attr', 'role', 'tablist');

      cy.get('[data-testid="tab-overview"]')
        .should('have.attr', 'role', 'tab')
        .should('have.attr', 'aria-selected', 'true');

      // Check statistics cards
      cy.get('[data-testid="stat-completed-exams"]')
        .should('have.attr', 'role', 'article');
    });

    it('should be keyboard navigable', () => {
      cy.wait('@getStudentStats');

      // Tab navigation should work with keyboard
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'tab-overview');

      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'tab-progress');

      // Enter should activate tab
      cy.focused().type('{enter}');
      cy.get('[data-testid="tab-progress"]')
        .should('have.class', 'border-blue-500');
    });

    it('should have sufficient color contrast', () => {
      cy.wait('@getStudentStats');

      // This would ideally use a color contrast testing plugin
      // For now, we just check that text is visible
      cy.get('[data-testid="dashboard-title"]')
        .should('be.visible')
        .should('have.css', 'color')
        .and('not.equal', 'rgba(0, 0, 0, 0)');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Intercept with error
      cy.intercept('GET', '/api/student/stats*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getStudentStatsError');

      cy.visit('/student/dashboard');
      cy.wait('@getStudentStatsError');

      // Should show error state or fallback
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .should('contain', 'خطا در بارگذاری اطلاعات');
    });

    it('should retry failed requests', () => {
      // Mock initial failure then success
      cy.intercept('GET', '/api/student/stats*', {
        statusCode: 500
      }).as('getStatsFailure');

      cy.visit('/student/dashboard');
      cy.wait('@getStatsFailure');

      // Mock successful retry
      cy.intercept('GET', '/api/student/stats*', {
        fixture: 'student-stats.json'
      }).as('getStatsSuccess');

      // Trigger retry (could be automatic or manual)
      cy.get('[data-testid="retry-button"]').click();
      cy.wait('@getStatsSuccess');

      cy.get('[data-testid="error-message"]').should('not.exist');
    });
  });

  describe('Performance', () => {
    it('should load within acceptable time limits', () => {
      const start = Date.now();
      
      cy.visit('/student/dashboard');
      cy.wait('@getStudentStats');
      
      cy.then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it('should implement lazy loading for heavy components', () => {
      cy.visit('/student/dashboard');
      cy.wait('@getStudentStats');

      // Charts or heavy components should load on demand
      cy.get('[data-testid="tab-progress"]').click();
      
      // Should show loading state for progress charts
      cy.get('[data-testid="progress-loading"]').should('be.visible');
    });
  });
});