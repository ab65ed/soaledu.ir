/**
 * تست‌های کامپوننت فرم ورود - LoginForm Tests
 * شامل تست‌های unit و integration
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/authStore';
import { authService } from '@/services/api';
import LoginForm from '../LoginForm';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/stores/authStore');
jest.mock('@/services/api');

const mockRouter = {
  push: jest.fn(),
};

const mockAuth = {
  login: jest.fn(),
  setLoading: jest.fn(),
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  // تست رندر اولیه
  it('should render login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText('ایمیل یا شماره موبایل')).toBeInTheDocument();
    expect(screen.getByLabelText('رمز عبور')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ورود' })).toBeInTheDocument();
    expect(screen.getByText('مرا به خاطر بسپار')).toBeInTheDocument();
    expect(screen.getByText('رمز عبور را فراموش کرده‌اید؟')).toBeInTheDocument();
  });

  // تست اعتبارسنجی ایمیل
  describe('Email validation', () => {
    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.click(emailInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('ایمیل یا شماره موبایل الزامی است')).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'invalid-email');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('فرمت ایمیل یا شماره موبایل صحیح نیست')).toBeInTheDocument();
      });
    });

    it('should accept valid email', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('فرمت ایمیل یا شماره موبایل صحیح نیست')).not.toBeInTheDocument();
      });
    });

    it('should accept valid Iranian mobile number', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, '09123456789');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('فرمت ایمیل یا شماره موبایل صحیح نیست')).not.toBeInTheDocument();
      });
    });
  });

  // تست اعتبارسنجی رمز عبور
  describe('Password validation', () => {
    it('should show error for short password', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const passwordInput = screen.getByLabelText('رمز عبور');
      await user.type(passwordInput, 'short');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('رمز عبور باید حداقل ۱۲ کاراکتر باشد')).toBeInTheDocument();
      });
    });

    it('should show error for weak password', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const passwordInput = screen.getByLabelText('رمز عبور');
      await user.type(passwordInput, 'weakpassword123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد')).toBeInTheDocument();
      });
    });

    it('should accept strong password', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const passwordInput = screen.getByLabelText('رمز عبور');
      await user.type(passwordInput, 'StrongPassword123!');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد')).not.toBeInTheDocument();
      });
    });
  });

  // تست نمایش/مخفی کردن رمز عبور
  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText('رمز عبور');
    const toggleButton = screen.getByRole('button', { name: '' }); // دکمه نمایش رمز عبور
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // تست ارسال موفق فرم
  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com', role: 'learner' };
    const mockToken = 'test-token';
    
    (authService.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });
    
    render(<LoginForm />);
    
    // پر کردن فرم
    await user.type(screen.getByLabelText('ایمیل یا شماره موبایل'), 'test@example.com');
    await user.type(screen.getByLabelText('رمز عبور'), 'StrongPassword123!');
    
    // ارسال فرم
    await user.click(screen.getByRole('button', { name: 'ورود' }));
    
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'StrongPassword123!',
      });
      expect(mockAuth.login).toHaveBeenCalledWith(mockUser, mockToken);
      expect(mockRouter.push).toHaveBeenCalledWith('/learner');
    });
  });

  // تست خطای ورود
  it('should handle login error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    
    // پاک کردن localStorage برای جلوگیری از rate limiting
    localStorage.clear();
    
    (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    render(<LoginForm />);
    
    // پر کردن فرم
    await user.type(screen.getByLabelText('ایمیل یا شماره موبایل'), 'test@example.com');
    await user.type(screen.getByLabelText('رمز عبور'), 'StrongPassword123!');
    
    // ارسال فرم
    await user.click(screen.getByRole('button', { name: 'ورود' }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockAuth.setLoading).toHaveBeenCalledWith(false);
    }, { timeout: 3000 });
  });

  // تست Rate Limiting
  it('should handle rate limiting', async () => {
    const user = userEvent.setup();
    
    // تنظیم localStorage برای شبیه‌سازی rate limiting
    const now = Date.now();
    localStorage.setItem('lastLoginAttempt', (now - 5000).toString()); // 5 ثانیه پیش
    
    render(<LoginForm />);
    
    // پر کردن فرم
    await user.type(screen.getByLabelText('ایمیل یا شماره موبایل'), 'test@example.com');
    await user.type(screen.getByLabelText('رمز عبور'), 'StrongPassword123!');
    
    // ارسال فرم
    await user.click(screen.getByRole('button', { name: 'ورود' }));
    
    await waitFor(() => {
      expect(screen.getByText('لطفاً کمی صبر کنید و دوباره تلاش کنید')).toBeInTheDocument();
    });
    
    // پاک کردن localStorage برای تست‌های بعدی
    localStorage.clear();
  });

  // تست دسترسی‌پذیری
  it('should be accessible', () => {
    render(<LoginForm />);
    
    // بررسی وجود label برای input ها
    expect(screen.getByLabelText('ایمیل یا شماره موبایل')).toBeInTheDocument();
    expect(screen.getByLabelText('رمز عبور')).toBeInTheDocument();
    
    // بررسی وجود placeholder های مناسب
    expect(screen.getByPlaceholderText('example@domain.com یا 09123456789')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('حداقل ۱۲ کاراکتر')).toBeInTheDocument();
  });

  // تست انیمیشن‌ها
  it('should render with animations', () => {
    render(<LoginForm />);
    
    // بررسی وجود کامپوننت‌های motion
    const motionElements = document.querySelectorAll('[style*="transform"]');
    expect(motionElements.length).toBeGreaterThan(0);
  });
}); 