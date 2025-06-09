/**
 * تست‌های کامپوننت دکمه خروج - LogoutButton Tests
 * شامل تست‌های مودال، انیمیشن و عملکرد
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/authStore';
import { authService } from '@/services/api';
import LogoutButton from '../LogoutButton';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/stores/authStore');
jest.mock('@/services/api');

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

const mockAuth = {
  logout: jest.fn(),
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'learner',
  },
};

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  // تست رندر اولیه
  it('should render logout buttons correctly', () => {
    render(<LogoutButton />);
    
    expect(screen.getByText('خروج از حساب')).toBeInTheDocument();
    expect(screen.getByText('انصراف')).toBeInTheDocument();
  });

  // تست باز کردن مودال
  it('should open confirmation modal when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
      expect(screen.getByText(/آیا مطمئن هستید که می‌خواهید از حساب کاربری/)).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('بله، خارج شو')).toBeInTheDocument();
    });
  });

  // تست بستن مودال با کلیک روی انصراف
  it('should close modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // بستن مودال (انتخاب دکمه انصراف در مودال)
    const cancelButtons = screen.getAllByText('انصراف');
    const modalCancelButton = cancelButtons.find(button => 
      button.closest('.fixed.inset-0')
    );
    await user.click(modalCancelButton!);
    
    await waitFor(() => {
      expect(screen.queryByText('تأیید خروج')).not.toBeInTheDocument();
    });
  });

  // تست بستن مودال با کلیک روی X
  it('should close modal when X button is clicked', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // بستن مودال با X
    const xButton = screen.getByRole('button', { name: '' }); // دکمه X
    await user.click(xButton);
    
    await waitFor(() => {
      expect(screen.queryByText('تأیید خروج')).not.toBeInTheDocument();
    });
  });

  // تست بستن مودال با کلیک روی backdrop
  it('should close modal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // کلیک روی backdrop
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      await user.click(backdrop);
      
      await waitFor(() => {
        expect(screen.queryByText('تأیید خروج')).not.toBeInTheDocument();
      });
    }
  });

  // تست عملکرد موفق خروج
  it('should handle successful logout', async () => {
    const user = userEvent.setup();
    (authService.logout as jest.Mock).mockResolvedValue(undefined);
    
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // تأیید خروج
    const confirmButton = screen.getByText('بله، خارج شو');
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(mockAuth.logout).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    });
  });

  // تست خطا در خروج
  it('should handle logout error gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (authService.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));
    
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // تأیید خروج
    const confirmButton = screen.getByText('بله، خارج شو');
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('خطا در خروج:', expect.any(Error));
      expect(mockAuth.logout).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    });
    
    consoleErrorSpy.mockRestore();
  });

  // تست وضعیت loading در حین خروج
  it('should show loading state during logout', async () => {
    const user = userEvent.setup();
    
    // شبیه‌سازی تأخیر در API
    (authService.logout as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // تأیید خروج
    const confirmButton = screen.getByText('بله، خارج شو');
    await user.click(confirmButton);
    
    // بررسی وضعیت loading
    await waitFor(() => {
      expect(screen.getByText('در حال خروج...')).toBeInTheDocument();
    });
  });

  // تست غیرفعال شدن دکمه‌ها در حین loading
  it('should disable buttons during logout', async () => {
    const user = userEvent.setup();
    
    // شبیه‌سازی تأخیر در API
    (authService.logout as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // تأیید خروج
    const confirmButton = screen.getByText('بله، خارج شو');
    await user.click(confirmButton);
    
    // بررسی غیرفعال بودن دکمه‌ها
    await waitFor(() => {
      expect(screen.getByText('در حال خروج...')).toBeDisabled();
      const cancelButtons = screen.getAllByText('انصراف');
      const modalCancelButton = cancelButtons.find(button => 
        button.closest('.fixed.inset-0')
      );
      expect(modalCancelButton).toBeDisabled();
    });
  });

  // تست دکمه بازگشت
  it('should handle back button click', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    
    const backButton = screen.getByText('انصراف');
    await user.click(backButton);
    
    expect(mockRouter.back).toHaveBeenCalled();
  });

  // تست دسترسی‌پذیری
  it('should be accessible', () => {
    render(<LogoutButton />);
    
    // بررسی وجود دکمه‌های قابل دسترسی
    expect(screen.getByRole('button', { name: 'خروج از حساب' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'انصراف' })).toBeInTheDocument();
  });

  // تست انیمیشن‌های مودال
  it('should render modal with animations', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      // بررسی وجود کامپوننت‌های motion در مودال
      const motionElements = document.querySelectorAll('[style*="transform"], [style*="opacity"]');
      expect(motionElements.length).toBeGreaterThan(0);
    });
  });

  // تست عدم بستن مودال هنگام loading
  it('should not close modal during logout process', async () => {
    const user = userEvent.setup();
    
    // شبیه‌سازی تأخیر در API
    (authService.logout as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(<LogoutButton />);
    
    // باز کردن مودال
    const logoutButton = screen.getByText('خروج از حساب');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('تأیید خروج')).toBeInTheDocument();
    });
    
    // شروع فرآیند خروج
    const confirmButton = screen.getByText('بله، خارج شو');
    await user.click(confirmButton);
    
    // سعی در بستن مودال (نباید بسته شود)
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      await user.click(backdrop);
      
      // مودال همچنان باز است
      expect(screen.getByText('در حال خروج...')).toBeInTheDocument();
    }
  });
}); 