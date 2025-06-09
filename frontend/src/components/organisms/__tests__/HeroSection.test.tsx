/**
 * HeroSection Component Tests
 * تست‌های کامپوننت بخش اصلی
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HeroSection from '../HeroSection';

// Mock framer-motion برای تست‌ها
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
  },
}));

// Mock Button component
jest.mock('../../atoms/Button', () => {
  const MockButton = ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
  MockButton.displayName = 'MockButton';
  return MockButton;
});

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// تابع کمکی برای render با QueryClient
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('HeroSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('رندر صحیح محتوای اصلی', () => {
    renderWithQueryClient(<HeroSection />);
    
    // بررسی عنوان اصلی
    expect(screen.getByText(/سامانه جامع/)).toBeInTheDocument();
    expect(screen.getByText(/آزمون‌های آنلاین/)).toBeInTheDocument();
    
    // بررسی توضیحات
    expect(screen.getByText(/پلتفرم پیشرفته برای ایجاد، مدیریت و شرکت در آزمون‌های آنلاین/)).toBeInTheDocument();
    
    // بررسی دکمه‌های CTA
    expect(screen.getByText('شروع آزمون')).toBeInTheDocument();
    expect(screen.getByText('تماس با ما')).toBeInTheDocument();
  });

  it('نمایش ویژگی‌های کلیدی', () => {
    renderWithQueryClient(<HeroSection />);
    
    expect(screen.getByText('آزمون‌سازی آسان')).toBeInTheDocument();
    expect(screen.getByText('نتایج فوری')).toBeInTheDocument();
    expect(screen.getByText('گزارش‌گیری هوشمند')).toBeInTheDocument();
  });

  it('نمایش آمار سایت', () => {
    renderWithQueryClient(<HeroSection />);
    
    expect(screen.getByText('۱۲۰۰+')).toBeInTheDocument();
    expect(screen.getByText('کاربر فعال')).toBeInTheDocument();
    expect(screen.getByText('۵۰۰+')).toBeInTheDocument();
    expect(screen.getByText('آزمون برگزار شده')).toBeInTheDocument();
    expect(screen.getByText('۹۸%')).toBeInTheDocument();
    expect(screen.getByText('رضایت کاربران')).toBeInTheDocument();
  });

  describe('CTA Button Functionality', () => {
    it('هدایت کاربر مهمان به صفحه ثبت‌نام', () => {
      // Mock window.location.href
      delete (window as unknown as { location: unknown }).location;
      window.location = { href: '' } as Location;
      
      mockLocalStorage.getItem.mockReturnValue(null);
      
      renderWithQueryClient(<HeroSection />);
      
      const ctaButton = screen.getByText('شروع آزمون');
      fireEvent.click(ctaButton);
      
      expect(window.location.href).toBe('/auth/register');
    });

    it('هدایت کاربر Student به داشبورد learner', () => {
      delete (window as unknown as { location: unknown }).location;
      window.location = { href: '' } as Location;
      
      mockLocalStorage.getItem.mockReturnValue('student');
      
      renderWithQueryClient(<HeroSection />);
      
      const ctaButton = screen.getByText('شروع آزمون');
      fireEvent.click(ctaButton);
      
      expect(window.location.href).toBe('/learner/dashboard');
    });

    it('هدایت کاربر Admin به داشبورد admin', () => {
      delete (window as unknown as { location: unknown }).location;
      window.location = { href: '' } as Location;
      
      mockLocalStorage.getItem.mockReturnValue('admin');
      
      renderWithQueryClient(<HeroSection />);
      
      const ctaButton = screen.getByText('شروع آزمون');
      fireEvent.click(ctaButton);
      
      expect(window.location.href).toBe('/admin/dashboard');
    });

    it('هدایت کاربر Designer به داشبورد designer', () => {
      delete (window as unknown as { location: unknown }).location;
      window.location = { href: '' } as Location;
      
      mockLocalStorage.getItem.mockReturnValue('designer');
      
      renderWithQueryClient(<HeroSection />);
      
      const ctaButton = screen.getByText('شروع آزمون');
      fireEvent.click(ctaButton);
      
      expect(window.location.href).toBe('/designer/dashboard');
    });

    it('هدایت کاربر Expert به داشبورد expert', () => {
      delete (window as unknown as { location: unknown }).location;
      window.location = { href: '' } as Location;
      
      mockLocalStorage.getItem.mockReturnValue('expert');
      
      renderWithQueryClient(<HeroSection />);
      
      const ctaButton = screen.getByText('شروع آزمون');
      fireEvent.click(ctaButton);
      
      expect(window.location.href).toBe('/expert/dashboard');
    });
  });

  it('لینک تماس با ما به صفحه contact هدایت می‌کند', () => {
    renderWithQueryClient(<HeroSection />);
    
    const contactLink = screen.getByText('تماس با ما').closest('a');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('دسترسی‌پذیری - وجود aria-label برای SVG ها', () => {
    renderWithQueryClient(<HeroSection />);
    
    // بررسی وجود SVG های آیکون
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('ریسپانسیو بودن - کلاس‌های responsive', () => {
    renderWithQueryClient(<HeroSection />);
    
    const heroSection = screen.getByRole('main');
    expect(heroSection).toHaveClass('relative');
    
    // بررسی grid responsive
    const featuresGrid = document.querySelector('.grid-cols-1.sm\\:grid-cols-3');
    expect(featuresGrid).toBeInTheDocument();
  });
}); 