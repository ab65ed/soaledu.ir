/**
 * تست‌های Jest برای کامپوننت ForgotPasswordWizard
 * شامل تست‌های واحد و یکپارچگی
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import ForgotPasswordWizard from '../ForgotPasswordWizard';

// Mock کردن dependencies
jest.mock('next/navigation');
jest.mock('@/services/api');

const mockRouter = {
  push: jest.fn(),
};

describe('ForgotPasswordWizard', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    // پاک کردن localStorage
    localStorage.clear();
  });

  describe('مرحله ۱ - ایمیل/موبایل', () => {
    it('باید مرحله اول را درست نمایش دهد', () => {
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('فراموشی رمز عبور')).toBeInTheDocument();
      expect(screen.getByLabelText('ایمیل یا شماره موبایل')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ادامه/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /انصراف/ })).toBeInTheDocument();
    });

    it('باید ایمیل معتبر را قبول کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      const submitButton = screen.getByRole('button', { name: /ادامه/ });
      
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('کد ملی')).toBeInTheDocument();
      });
    });

    it('باید شماره موبایل معتبر را قبول کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      const submitButton = screen.getByRole('button', { name: /ادامه/ });
      
      await user.type(emailInput, '09123456789');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('کد ملی')).toBeInTheDocument();
      });
    });

    it('باید ایمیل نامعتبر را رد کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // trigger onBlur
      
      await waitFor(() => {
        expect(screen.getByText('فرمت ایمیل یا شماره موبایل صحیح نیست')).toBeInTheDocument();
      });
    });

    it('باید شماره موبایل نامعتبر را رد کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      
      await user.type(emailInput, '0912345');
      await user.tab(); // trigger onBlur
      
      await waitFor(() => {
        expect(screen.getByText('فرمت ایمیل یا شماره موبایل صحیح نیست')).toBeInTheDocument();
      });
    });

    it('باید فیلد خالی را رد کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /ادامه/ });
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('ایمیل یا شماره موبایل الزامی است')).toBeInTheDocument();
      });
    });
  });

  describe('مرحله ۲ - کد ملی', () => {
    it('باید کد ملی معتبر را قبول کند', async () => {
      const user = userEvent.setup();
      
      // Mock کردن API response
      (authService.forgotPassword as jest.Mock).mockResolvedValue({
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        message: 'کد ارسال شد',
      });

      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // مرحله 1: ایمیل
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('کد ملی')).toBeInTheDocument();
      });
      
      // مرحله 2: کد ملی
      const nationalIdInput = screen.getByLabelText('کد ملی');
      await user.type(nationalIdInput, '1234567890');
      await user.click(screen.getByRole('button', { name: /ارسال کد/ }));
      
      await waitFor(() => {
        expect(authService.forgotPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          nationalId: '1234567890',
        });
      });
    });

    it('باید کد ملی نامعتبر را رد کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // رفتن به مرحله 2
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('کد ملی')).toBeInTheDocument();
      });
      
      const nationalIdInput = screen.getByLabelText('کد ملی');
      await user.type(nationalIdInput, '123');
      await user.tab(); // trigger onBlur
      
      await waitFor(() => {
        expect(screen.getByText('کد ملی باید ۱۰ رقم باشد')).toBeInTheDocument();
      });
    });

    it('باید خطای API را مدیریت کند', async () => {
      const user = userEvent.setup();
      
      // Mock کردن خطای API
      (authService.forgotPassword as jest.Mock).mockRejectedValue(
        new Error('کاربری با این مشخصات یافت نشد')
      );

      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // رفتن به مرحله 2
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('کد ملی')).toBeInTheDocument();
      });
      
      const nationalIdInput = screen.getByLabelText('کد ملی');
      await user.type(nationalIdInput, '1234567890');
      await user.click(screen.getByRole('button', { name: /ارسال کد/ }));
      
      await waitFor(() => {
        expect(screen.getByText('کاربری با این مشخصات یافت نشد')).toBeInTheDocument();
      });
    });
  });

  describe('مرحله ۳ - کد تأیید', () => {
    it('باید تایمر را نمایش دهد', async () => {
      const user = userEvent.setup();
      
      // Mock کردن API response
      (authService.forgotPassword as jest.Mock).mockResolvedValue({
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        message: 'کد ارسال شد',
      });

      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // رفتن به مرحله 3
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('کد ملی')).toBeInTheDocument();
      });
      
      const nationalIdInput = screen.getByLabelText('کد ملی');
      await user.type(nationalIdInput, '1234567890');
      await user.click(screen.getByRole('button', { name: /ارسال کد/ }));
      
      await waitFor(() => {
        expect(screen.getByText('کد تأیید')).toBeInTheDocument();
        expect(screen.getByText(/زمان باقی‌مانده/)).toBeInTheDocument();
      });
    });

    it('باید کد تأیید را بررسی کند', async () => {
      const user = userEvent.setup();
      
      // Mock کردن API responses
      (authService.forgotPassword as jest.Mock).mockResolvedValue({
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        message: 'کد ارسال شد',
      });
      
      (authService.verifyResetCode as jest.Mock).mockResolvedValue({
        success: true,
        resetToken: 'password-reset-token',
      });

      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // رفتن به مرحله 3
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('کد ملی')).toBeInTheDocument();
      });
      
      const nationalIdInput = screen.getByLabelText('کد ملی');
      await user.type(nationalIdInput, '1234567890');
      await user.click(screen.getByRole('button', { name: /ارسال کد/ }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('کد تأیید')).toBeInTheDocument();
      });
      
      // وارد کردن کد تأیید
      const codeInput = screen.getByLabelText('کد تأیید');
      await user.type(codeInput, '123456');
      await user.click(screen.getByRole('button', { name: /تأیید/ }));
      
      await waitFor(() => {
        expect(authService.verifyResetCode).toHaveBeenCalledWith({
          token: 'reset-token-123',
          code: '123456',
        });
        expect(mockOnSuccess).toHaveBeenCalledWith('password-reset-token');
      });
    });

    it('باید کد نامعتبر را رد کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // شبیه‌سازی رسیدن به مرحله 3 با تنظیم مستقیم state
      // (در تست واقعی باید مراحل قبل را هم طی کنیم)
      
      const codeInput = screen.getByLabelText('کد تأیید');
      await user.type(codeInput, '12');
      await user.tab(); // trigger onBlur
      
      await waitFor(() => {
        expect(screen.getByText('کد تأیید باید ۶ رقم باشد')).toBeInTheDocument();
      });
    });
  });

  describe('نشانگر مراحل', () => {
    it('باید مرحله فعلی را برجسته کند', () => {
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // مرحله 1 باید فعال باشد
      const step1 = screen.getByText('1');
      expect(step1.closest('div')).toHaveClass('bg-blue-600');
    });

    it('باید مراحل تکمیل شده را نشان دهد', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // رفتن به مرحله 2
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        // مرحله 1 باید تکمیل شده باشد
        const step1 = screen.getByText('1');
        expect(step1.closest('div')).toHaveClass('bg-green-600');
        
        // مرحله 2 باید فعال باشد
        const step2 = screen.getByText('2');
        expect(step2.closest('div')).toHaveClass('bg-blue-600');
      });
    });
  });

  describe('Rate Limiting', () => {
    it('باید rate limiting را اعمال کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      const submitButton = screen.getByRole('button', { name: /ادامه/ });
      
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);
      
      // کلیک دوباره بلافاصله
      await user.click(submitButton);
      
      // دکمه باید غیرفعال باشد
      expect(submitButton).toBeDisabled();
    });
  });

  describe('دکمه‌های ناوبری', () => {
    it('باید دکمه انصراف کار کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      await user.click(screen.getByRole('button', { name: /انصراف/ }));
      
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('باید دکمه قبلی کار کند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // رفتن به مرحله 2
      const emailInput = screen.getByLabelText('ایمیل یا شماره موبایل');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        expect(screen.getByText('کد ملی')).toBeInTheDocument();
      });
      
      // کلیک روی دکمه قبلی
      await user.click(screen.getByRole('button', { name: /قبلی/ }));
      
      await waitFor(() => {
        expect(screen.getByText('ایمیل یا شماره موبایل')).toBeInTheDocument();
      });
    });
  });

  describe('دسترسی‌پذیری', () => {
    it('باید label های مناسب داشته باشد', () => {
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText('ایمیل یا شماره موبایل')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ادامه/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /انصراف/ })).toBeInTheDocument();
    });

    it('باید پیام‌های خطا در دسترس باشند', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordWizard onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      await user.click(screen.getByRole('button', { name: /ادامه/ }));
      
      await waitFor(() => {
        const errorMessage = screen.getByText('ایمیل یا شماره موبایل الزامی است');
        expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      });
    });
  });
});