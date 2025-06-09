import { render, screen } from '@testing-library/react';
import QualityAnalytics from '../QualityAnalytics';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
  },
}));

// Test data
const mockStats = {
  overall_average: 8.5,
  approved_today: 15,
  needs_revision: 3,
  average_quality: 85,
  today_reviews: 25,
  today_trend: 12,
  high_quality_percentage: 78,
  active_experts: 8,
  content_type_quality: [
    {
      type: 'question',
      average: 8.2,
      count: 150,
      improvement: 5,
    },
    {
      type: 'course-exam',
      average: 8.8,
      count: 45,
      improvement: -2,
    },
  ],
  weekly_trend: [
    { day_name: 'شنبه', average: 8.1 },
    { day_name: 'یکشنبه', average: 8.3 },
    { day_name: 'دوشنبه', average: 8.5 },
    { day_name: 'سه‌شنبه', average: 8.2 },
    { day_name: 'چهارشنبه', average: 8.7 },
    { day_name: 'پنج‌شنبه', average: 8.4 },
    { day_name: 'جمعه', average: 8.6 },
  ],
  status_breakdown: {
    approved: 120,
    needs_revision: 15,
    rejected: 8,
  },
  response_time: {
    average: 2.5,
    min: 0.5,
    max: 8,
  },
  top_expert: {
    name: 'دکتر علی احمدی',
    score: 9.2,
  },
  expert_performance: {
    daily_average: 12,
  },
  satisfaction_rate: 92,
};

describe('QualityAnalytics Component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      stats: mockStats,
      isLoading: false,
      ...props,
    };

    return render(<QualityAnalytics {...defaultProps} />);
  };

  describe('Rendering', () => {
    test('نمایش آمار کلی کیفیت', () => {
      renderComponent();

      expect(screen.getByText('8.5/10')).toBeInTheDocument();
      expect(screen.getByText('میانگین کیفیت کلی')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument(); // تأیید شده امروز
      expect(screen.getByText('3')).toBeInTheDocument(); // نیاز به بازنگری
      expect(screen.getByText('78%')).toBeInTheDocument(); // محتوای باکیفیت
      expect(screen.getByText('8')).toBeInTheDocument(); // کارشناسان فعال
    });

    test('نمایش حالت loading', () => {
      renderComponent({ isLoading: true });

      const loadingCards = document.querySelectorAll('.animate-pulse');
      expect(loadingCards.length).toBeGreaterThan(0);
    });

    test('نمایش روند امروز', () => {
      renderComponent();

      expect(screen.getByText('25')).toBeInTheDocument(); // بررسی‌های امروز
      expect(screen.getByText('12% نسبت به دیروز')).toBeInTheDocument();
    });

    test('نمایش آمار کیفیت بر اساس نوع محتوا', () => {
      renderComponent();

      expect(screen.getByText('سوالات')).toBeInTheDocument();
      expect(screen.getByText('درس-آزمون‌ها')).toBeInTheDocument();
      expect(screen.getByText('8.2/10')).toBeInTheDocument();
      expect(screen.getByText('8.8/10')).toBeInTheDocument();
      expect(screen.getByText('150 مورد')).toBeInTheDocument();
      expect(screen.getByText('45 مورد')).toBeInTheDocument();
    });

    test('نمایش روند هفتگی', () => {
      renderComponent();

      expect(screen.getByText('روند کیفیت - ۷ روز گذشته')).toBeInTheDocument();
      expect(screen.getByText('شنبه')).toBeInTheDocument();
      expect(screen.getByText('یکشنبه')).toBeInTheDocument();
      expect(screen.getByText('دوشنبه')).toBeInTheDocument();
      expect(screen.getByText('8.1/10')).toBeInTheDocument();
      expect(screen.getByText('8.7/10')).toBeInTheDocument();
    });
  });

  describe('Detailed Statistics', () => {
    test('نمایش وضعیت بررسی‌ها', () => {
      renderComponent();

      expect(screen.getByText('وضعیت بررسی‌ها')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument(); // تأیید شده
      expect(screen.getByText('15')).toBeInTheDocument(); // نیاز به بازنگری
      expect(screen.getByText('8')).toBeInTheDocument(); // رد شده
    });

    test('نمایش زمان پاسخ', () => {
      renderComponent();

      expect(screen.getByText('زمان پاسخ')).toBeInTheDocument();
      expect(screen.getByText('2.5 ساعت')).toBeInTheDocument(); // میانگین
      expect(screen.getByText('0.5 ساعت')).toBeInTheDocument(); // کمترین
      expect(screen.getByText('8 ساعت')).toBeInTheDocument(); // بیشترین
    });

    test('نمایش عملکرد کارشناسان', () => {
      renderComponent();

      expect(screen.getByText('عملکرد کارشناسان')).toBeInTheDocument();
      expect(screen.getByText('دکتر علی احمدی')).toBeInTheDocument();
      expect(screen.getByText('12 مورد')).toBeInTheDocument(); // میانگین روزانه
      expect(screen.getByText('92%')).toBeInTheDocument(); // نرخ رضایت
    });
  });

  describe('Progress Bars and Charts', () => {
    test('وجود Progress Bar ها', () => {
      renderComponent();

      const progressBars = document.querySelectorAll('[role="progressbar"]');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    test('محاسبه درست مقادیر Progress Bar', () => {
      renderComponent();

      // میانگین کیفیت کلی: 8.5/10 = 85%
      const overallProgress = document.querySelector('[aria-valuenow="85"]');
      expect(overallProgress).toBeInTheDocument();

      // محتوای باکیفیت: 78%
      const qualityProgress = document.querySelector('[aria-valuenow="78"]');
      expect(qualityProgress).toBeInTheDocument();
    });
  });

  describe('Data Validation', () => {
    test('مدیریت داده‌های null/undefined', () => {
      renderComponent({ stats: null });

      // بررسی که کامپوننت crash نمی‌کند
      expect(screen.getByText('0/10')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('مدیریت آرایه‌های خالی', () => {
      const emptyStats = {
        ...mockStats,
        content_type_quality: [],
        weekly_trend: [],
      };

      renderComponent({ stats: emptyStats });

      // بررسی که کامپوننت عادی کار می‌کند
      expect(screen.getByText('8.5/10')).toBeInTheDocument();
    });

    test('مدیریت مقادیر منفی در trend', () => {
      const negativeStats = {
        ...mockStats,
        today_trend: -5,
      };

      renderComponent({ stats: negativeStats });

      expect(screen.getByText('5% نسبت به دیروز')).toBeInTheDocument();
      expect(screen.getByText('5%').closest('span')).toHaveClass('text-red-600');
    });
  });

  describe('Badge Colors', () => {
    test('رنگ صحیح badge ها بر اساس امتیاز', () => {
      renderComponent();

      // امتیاز 8.2 (بالا) - default
      const highScoreBadge = screen.getByText('8.2/10').closest('.badge');
      expect(highScoreBadge).toHaveClass('badge-default');

      // امتیاز 8.8 (بالا) - default
      const veryHighScoreBadge = screen.getByText('8.8/10').closest('.badge');
      expect(veryHighScoreBadge).toHaveClass('badge-default');
    });

    test('رنگ badge برای امتیازات متوسط', () => {
      const mediumStats = {
        ...mockStats,
        content_type_quality: [
          {
            type: 'question',
            average: 6.5, // متوسط
            count: 150,
            improvement: 5,
          },
        ],
      };

      renderComponent({ stats: mediumStats });

      const mediumBadge = screen.getByText('6.5/10').closest('.badge');
      expect(mediumBadge).toHaveClass('badge-secondary');
    });

    test('رنگ badge برای امتیازات پایین', () => {
      const lowStats = {
        ...mockStats,
        content_type_quality: [
          {
            type: 'question',
            average: 4.2, // پایین
            count: 150,
            improvement: 5,
          },
        ],
      };

      renderComponent({ stats: lowStats });

      const lowBadge = screen.getByText('4.2/10').closest('.badge');
      expect(lowBadge).toHaveClass('badge-destructive');
    });
  });

  describe('Accessibility', () => {
    test('وجود heading های مناسب', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // بررسی وجود heading اصلی
      expect(screen.getByText('کیفیت بر اساس نوع محتوا')).toBeInTheDocument();
      expect(screen.getByText('روند کیفیت - ۷ روز گذشته')).toBeInTheDocument();
    });

    test('مقادیر aria برای progress bar ها', () => {
      renderComponent();

      const progressBars = document.querySelectorAll('[role="progressbar"]');
      progressBars.forEach(bar => {
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
      });
    });
  });

  describe('Persian/RTL Support', () => {
    test('نمایش صحیح اعداد فارسی', () => {
      renderComponent();

      // بررسی نمایش اعداد فارسی در UI
      const persianNumbers = screen.getAllByText(/\d+/);
      expect(persianNumbers.length).toBeGreaterThan(0);
    });

    test('نمایش صحیح نام روزهای هفته', () => {
      renderComponent();

      const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
      persianDays.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });
  });
}); 