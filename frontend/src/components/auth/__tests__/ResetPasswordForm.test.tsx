/**
 * تست‌های Jest برای کامپوننت ResetPasswordForm
 * شامل تست‌های واحد و یکپارچگی
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/api';
import ResetPasswordForm from '../ResetPasswordForm';

// Mock کردن dependencies
jest.mock('next/navigation');
jest.mock('@/services/api');

const mockRouter = {
  push: jest.fn(),
};

const mockSearchParams = {
  get: jest.fn(),
};

describe('ResetPasswordForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue('valid-token-123');
    // پاک کردن localStorage
    localStorage.clear();
  });

  describe('نمایش اولیه', () => {
    it('باید فرم را با توکن معتبر نمایش دهد', () => {
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('تعیین رمز عبور جدید')).toBeInTheDocument();
      expect(screen.getByLabelText('رمز عبور جدید')).toBeInTheDocument();
      expect(screen.getByLabelText('تکرار رمز عبور')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /تغییر رمز عبور/ })).toBeInTheDocument();
    });

    it('باید پیام خطا را با توکن نامعتبر نمایش دهد', () => {
      render(<ResetPasswordForm token="" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('لینک بازیابی رمز عبور نامعتبر یا منقضی شده است')).toBeInTheDocument();
    });

    it('باید نشانگر قدرت رمز عبور را نمایش دهد', () => {
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('قدرت رمز عبور')).toBeInTheDocument();
      expect(screen.getByText('ضعیف')).toBeInTheDocument();
    });
  });

  describe('اعتبارسنجی رمز عبور', () => {
    it('باید رمز عبور کوتاه را رد کند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      
      await user.type(passwordInput, 'short');
      await user.tab(); // trigger onBlur
      
      await waitFor(() => {
        expect(screen.getByText('رمز عبور باید حداقل ۱۲ کاراکتر باشد')).toBeInTheDocument();
      });
    });

    it('باید رمز عبور بدون کاراکتر خاص را رد کند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      
      await user.type(passwordInput, 'SimplePassword123');
      await user.tab(); // trigger onBlur
      
      await waitFor(() => {
        expect(screen.getByText('رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد')).toBeInTheDocument();
      });
    });

    it('باید عدم تطابق رمزها را تشخیص دهد', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور');
      
      await user.type(passwordInput, 'StrongPassword123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');
      await user.tab(); // trigger onBlur
      
      await waitFor(() => {
        expect(screen.getByText('رمزهای عبور مطابقت ندارند')).toBeInTheDocument();
      });
    });

    it('باید رمز عبور معتبر را قبول کند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور');
      
      await user.type(passwordInput, 'StrongPassword123!');
      await user.type(confirmPasswordInput, 'StrongPassword123!');
      
      // بررسی عدم وجود پیام خطا
      await waitFor(() => {
        expect(screen.queryByText('رمز عبور باید حداقل ۱۲ کاراکتر باشد')).not.toBeInTheDocument();
        expect(screen.queryByText('رمزهای عبور مطابقت ندارند')).not.toBeInTheDocument();
      });
    });
  });

  describe('نشانگر قدرت رمز عبور', () => {
    it('باید قدرت رمز عبور ضعیف را نشان دهد', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      await user.type(passwordInput, 'weak');
      
      await waitFor(() => {
        expect(screen.getByText('ضعیف')).toBeInTheDocument();
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '25');
      });
    });

    it('باید قدرت رمز عبور قوی را نشان دهد', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      await user.type(passwordInput, 'VeryStrongPassword123!@#');
      
      await waitFor(() => {
        expect(screen.getByText('قوی')).toBeInTheDocument();
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '100');
      });
    });

    it('باید چک‌لیست الزامات را نمایش دهد', () => {
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('حداقل ۱۲ کاراکتر')).toBeInTheDocument();
      expect(screen.getByText('حروف بزرگ و کوچک')).toBeInTheDocument();
      expect(screen.getByText('عدد')).toBeInTheDocument();
      expect(screen.getByText('کاراکتر خاص')).toBeInTheDocument();
    });
  });

  describe('ارسال فرم', () => {
    it('باید فرم را با موفقیت ارسال کند', async () => {
      const user = userEvent.setup();
      
      // Mock کردن API response
      (authService.resetPassword as jest.Mock).mockResolvedValue({
        success: true,
        message: 'رمز عبور تغییر کرد',
      });

      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // پر کردن فرم
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور');
      
      await user.type(passwordInput, 'StrongPassword123!');
      await user.type(confirmPasswordInput, 'StrongPassword123!');
      
      // ارسال فرم
      await user.click(screen.getByRole('button', { name: /تغییر رمز عبور/ }));
      
      await waitFor(() => {
        expect(authService.resetPassword).toHaveBeenCalledWith({
          token: 'valid-token',
          password: 'StrongPassword123!',
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('باید خطای API را مدیریت کند', async () => {
      const user = userEvent.setup();
      
      // Mock کردن خطای API
      (authService.resetPassword as jest.Mock).mockRejectedValue(
        new Error('توکن منقضی شده است')
      );

      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // پر کردن فرم
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور');
      
      await user.type(passwordInput, 'StrongPassword123!');
      await user.type(confirmPasswordInput, 'StrongPassword123!');
      
      // ارسال فرم
      await user.click(screen.getByRole('button', { name: /تغییر رمز عبور/ }));
      
      await waitFor(() => {
        expect(screen.getByText('توکن منقضی شده است')).toBeInTheDocument();
      });
    });

    it('باید rate limiting را اعمال کند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // پر کردن فرم
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور');
      const submitButton = screen.getByRole('button', { name: /تغییر رمز عبور/ });
      
      await user.type(passwordInput, 'StrongPassword123!');
      await user.type(confirmPasswordInput, 'StrongPassword123!');
      
      // کلیک اول
      await user.click(submitButton);
      
      // کلیک دوباره بلافاصله
      await user.click(submitButton);
      
      // دکمه باید غیرفعال باشد
      expect(submitButton).toBeDisabled();
    });
  });

  describe('عملکرد UI', () => {
    it('باید نمایش/مخفی کردن رمز عبور کار کند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      const toggleButtons = screen.getAllByRole('button', { name: '' });
      const toggleButton = toggleButtons[0]; // اولین دکمه toggle
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('باید حالت loading را نمایش دهد', async () => {
      const user = userEvent.setup();
      
      // Mock کردن API با تاخیر
      (authService.resetPassword as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // پر کردن فرم
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور');
      
      await user.type(passwordInput, 'StrongPassword123!');
      await user.type(confirmPasswordInput, 'StrongPassword123!');
      
      // ارسال فرم
      await user.click(screen.getByRole('button', { name: /تغییر رمز عبور/ }));
      
      // بررسی loading state
      expect(screen.getByRole('button', { name: /تغییر رمز عبور/ })).toBeDisabled();
    });

    it('باید دکمه انصراف کار کند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      await user.click(screen.getByRole('button', { name: /انصراف/ }));
      
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('دسترسی‌پذیری', () => {
    it('باید label های مناسب داشته باشد', () => {
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText('رمز عبور جدید')).toBeInTheDocument();
      expect(screen.getByLabelText('تکرار رمز عبور')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /تغییر رمز عبور/ })).toBeInTheDocument();
    });

    it('باید پیام‌های خطا در دسترس باشند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      await user.type(passwordInput, 'short');
      await user.tab();
      
      await waitFor(() => {
        const errorMessage = screen.getByText('رمز عبور باید حداقل ۱۲ کاراکتر باشد');
        expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('باید کیبورد navigation کار کند', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      // شروع از اولین input
      const passwordInput = screen.getByLabelText('رمز عبور جدید');
      passwordInput.focus();
      
      expect(passwordInput).toHaveFocus();
      
      // حرکت با Tab
      await user.tab();
      const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور');
      expect(confirmPasswordInput).toHaveFocus();
      
      await user.tab();
      const submitButton = screen.getByRole('button', { name: /تغییر رمز عبور/ });
      expect(submitButton).toHaveFocus();
    });
  });

  describe('نکات امنیتی', () => {
    it('باید نکات امنیتی را نمایش دهد', () => {
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('نکات امنیتی')).toBeInTheDocument();
      expect(screen.getByText(/رمز عبور جدید را در مکان امنی ذخیره کنید/)).toBeInTheDocument();
    });

    it('باید الزامات رمز عبور را نمایش دهد', () => {
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('الزامات رمز عبور')).toBeInTheDocument();
      expect(screen.getByText('حداقل ۱۲ کاراکتر')).toBeInTheDocument();
    });

    it('باید هشدار امنیتی را نمایش دهد', () => {
      render(<ResetPasswordForm token="valid-token" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
      
      expect(screen.getByText(/در صورت مشکوک بودن این درخواست/)).toBeInTheDocument();
    });
  });
});