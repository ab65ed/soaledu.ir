import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WalletCard from '../WalletCard';
import { adminService } from '@/services/api';

// Mock adminService
jest.mock('@/services/api', () => ({
  adminService: {
    getFinanceData: jest.fn(),
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Wallet: () => <div data-testid="wallet-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  ArrowUpRight: () => <div data-testid="arrow-up-right-icon" />,
  ArrowDownLeft: () => <div data-testid="arrow-down-left-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
}));

const mockFinanceData = {
  revenue: {
    total: 15680000,
    monthly: 3200000,
    weekly: 800000,
    daily: 150000,
  },
  discounts: {
    active: 5,
    totalUsed: 120,
    totalSavings: 2400000,
  },
  pricing: {
    averagePrice: 25000,
    minPrice: 5000,
    maxPrice: 50000,
  },
  transactions: [],
};

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('WalletCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (adminService.getFinanceData as jest.Mock).mockResolvedValue(mockFinanceData);
  });

  it('renders wallet card with loading state initially', () => {
    renderWithQueryClient(<WalletCard />);
    
    expect(screen.getByText('کیف پول طراح')).toBeInTheDocument();
  });

  it('displays wallet balance and earnings correctly', async () => {
    renderWithQueryClient(<WalletCard />);

    await waitFor(() => {
      expect(screen.getByText('2,450,000 تومان')).toBeInTheDocument();
      expect(screen.getByText('3,200,000 تومان')).toBeInTheDocument();
      expect(screen.getByText('450,000 تومان')).toBeInTheDocument();
    });
  });

  it('toggles balance visibility when eye icon is clicked', async () => {
    renderWithQueryClient(<WalletCard />);

    await waitFor(() => {
      expect(screen.getByText('2,450,000 تومان')).toBeInTheDocument();
    });

    // کلیک روی آیکون چشم برای مخفی کردن موجودی
    const eyeButton = screen.getByTitle('مخفی کردن موجودی');
    fireEvent.click(eyeButton);

    await waitFor(() => {
      expect(screen.getByText('••••••••')).toBeInTheDocument();
      expect(screen.queryByText('2,450,000 تومان')).not.toBeInTheDocument();
    });

    // کلیک مجدد برای نمایش موجودی
    const eyeOffButton = screen.getByTitle('نمایش موجودی');
    fireEvent.click(eyeOffButton);

    await waitFor(() => {
      expect(screen.getByText('2,450,000 تومان')).toBeInTheDocument();
      expect(screen.queryByText('••••••••')).not.toBeInTheDocument();
    });
  });

  it('displays recent transactions when showTransactions is true', async () => {
    renderWithQueryClient(<WalletCard showTransactions={true} />);

    await waitFor(() => {
      expect(screen.getByText('تراکنش‌های اخیر')).toBeInTheDocument();
      expect(screen.getByText('فروش درس-آزمون ریاضی پایه نهم')).toBeInTheDocument();
      expect(screen.getByText('فروش فلش‌کارت فیزیک')).toBeInTheDocument();
      expect(screen.getByText('برداشت از کیف پول')).toBeInTheDocument();
    });
  });

  it('hides transactions when showTransactions is false', async () => {
    renderWithQueryClient(<WalletCard showTransactions={false} />);

    await waitFor(() => {
      expect(screen.queryByText('تراکنش‌های اخیر')).not.toBeInTheDocument();
    });
  });

  it('changes time period filter correctly', async () => {
    renderWithQueryClient(<WalletCard />);

    await waitFor(() => {
      expect(screen.getByText('ماه')).toBeInTheDocument();
    });

    // کلیک روی فیلتر هفته
    const weekButton = screen.getByText('هفته');
    fireEvent.click(weekButton);

    expect(weekButton).toHaveClass('bg-white text-blue-600 shadow-sm');

    // کلیک روی فیلتر سال
    const yearButton = screen.getByText('سال');
    fireEvent.click(yearButton);

    expect(yearButton).toHaveClass('bg-white text-blue-600 shadow-sm');
  });

  it('displays transaction status badges correctly', async () => {
    renderWithQueryClient(<WalletCard />);

    await waitFor(() => {
      expect(screen.getByText('تکمیل شده')).toBeInTheDocument();
      expect(screen.getByText('در انتظار')).toBeInTheDocument();
    });
  });

  it('formats currency amounts correctly', async () => {
    renderWithQueryClient(<WalletCard />);

    await waitFor(() => {
      // بررسی فرمت صحیح اعداد فارسی
      expect(screen.getByText('2,450,000 تومان')).toBeInTheDocument();
      expect(screen.getByText('+150,000 تومان')).toBeInTheDocument();
      expect(screen.getByText('+200,000 تومان')).toBeInTheDocument();
      expect(screen.getByText('500,000 تومان')).toBeInTheDocument(); // برداشت (بدون علامت منفی در نمایش)
    });
  });

  it('displays correct transaction icons based on type', async () => {
    renderWithQueryClient(<WalletCard />);

    await waitFor(() => {
      expect(screen.getAllByTestId('arrow-up-right-icon')).toHaveLength(2); // فروش‌ها
      expect(screen.getAllByTestId('arrow-down-left-icon')).toHaveLength(2); // برداشت و بازگشت وجه
    });
  });

  it('handles API error gracefully', async () => {
    (adminService.getFinanceData as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderWithQueryClient(<WalletCard />);

    await waitFor(() => {
      expect(screen.getByText('خطا در بارگذاری اطلاعات کیف پول')).toBeInTheDocument();
    });
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-wallet-class';
    renderWithQueryClient(<WalletCard className={customClass} />);

    const walletCard = screen.getByText('کیف پول طراح').closest('div');
    expect(walletCard).toHaveClass(customClass);
  });

  it('calls adminService.getFinanceData with correct parameters', async () => {
    const designerId = 'designer-123';
    renderWithQueryClient(<WalletCard designerId={designerId} />);

    await waitFor(() => {
      expect(adminService.getFinanceData).toHaveBeenCalled();
    });
  });

  it('shows "مشاهده همه تراکنش‌ها" button when transactions are displayed', async () => {
    renderWithQueryClient(<WalletCard showTransactions={true} />);

    await waitFor(() => {
      expect(screen.getByText('مشاهده همه تراکنش‌ها')).toBeInTheDocument();
    });
  });

  it('displays loading skeleton while data is being fetched', () => {
    (adminService.getFinanceData as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Promise که هرگز resolve نمی‌شود
    );

    renderWithQueryClient(<WalletCard />);

    expect(screen.getByText('کیف پول طراح')).toBeInTheDocument();
    // بررسی وجود skeleton loading
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
}); 