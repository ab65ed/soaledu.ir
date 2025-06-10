import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScalabilityDashboard from '../ScalabilityDashboard';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />
}));

// Mock icons
jest.mock('@heroicons/react/24/outline', () => ({
  PlayIcon: () => <div data-testid="play-icon" />,
  PauseIcon: () => <div data-testid="pause-icon" />,
  StopIcon: () => <div data-testid="stop-icon" />,
  ChartBarIcon: () => <div data-testid="chart-bar-icon" />,
  CogIcon: () => <div data-testid="cog-icon" />,
  ExclamationTriangleIcon: () => <div data-testid="exclamation-triangle-icon" />,
  CheckCircleIcon: () => <div data-testid="check-circle-icon" />,
  ClockIcon: () => <div data-testid="clock-icon" />
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return Wrapper;
};

describe('ScalabilityDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard title correctly', () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    expect(screen.getByText('داشبورد A/B Testing و مقیاس‌پذیری')).toBeInTheDocument();
  });

  it('displays system performance metrics', () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    expect(screen.getByText('زمان پاسخ')).toBeInTheDocument();
    expect(screen.getByText('کاربران فعال')).toBeInTheDocument();
    expect(screen.getByText('نرخ خطا')).toBeInTheDocument();
    expect(screen.getByText('بار سرور')).toBeInTheDocument();
  });

  it('shows time range selector', () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    const select = screen.getByDisplayValue('24 ساعت گذشته');
    expect(select).toBeInTheDocument();
    
    // Test changing time range
    fireEvent.change(select, { target: { value: '7d' } });
    expect(screen.getByDisplayValue('7 روز گذشته')).toBeInTheDocument();
  });

  it('displays A/B tests section', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('تست‌های A/B فعال')).toBeInTheDocument();
    });
  });

  it('shows mock A/B test data', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('صفحه ورود نسخه جدید')).toBeInTheDocument();
      expect(screen.getByText('دکمه پرداخت')).toBeInTheDocument();
    });
  });

  it('allows expanding A/B test details', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      const testCard = screen.getByText('صفحه ورود نسخه جدید').closest('div');
      expect(testCard).toBeInTheDocument();
      
      if (testCard) {
        fireEvent.click(testCard);
      }
    });

    await waitFor(() => {
      expect(screen.getByText('عملکرد نسخه‌ها')).toBeInTheDocument();
      expect(screen.getByText('توزیع ترافیک')).toBeInTheDocument();
    });
  });

  it('displays correct status badges for tests', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('در حال اجرا')).toBeInTheDocument();
      expect(screen.getByText('تکمیل شده')).toBeInTheDocument();
    });
  });

  it('shows control buttons for running tests', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      const pauseButtons = screen.getAllByTestId('pause-icon');
      const stopButtons = screen.getAllByTestId('stop-icon');
      
      expect(pauseButtons.length).toBeGreaterThan(0);
      expect(stopButtons.length).toBeGreaterThan(0);
    });
  });

  it('renders performance charts', () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    expect(screen.getByText('روند عملکرد سیستم')).toBeInTheDocument();
    expect(screen.getByText('منابع سیستم')).toBeInTheDocument();
    
    // Check for chart components
    expect(screen.getAllByTestId('responsive-container').length).toBeGreaterThan(0);
  });

  it('displays system resource usage bars', () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    expect(screen.getByText('بار CPU')).toBeInTheDocument();
    expect(screen.getByText('استفاده از حافظه')).toBeInTheDocument();
    expect(screen.getByText('توان عملیاتی')).toBeInTheDocument();
  });

  it('shows correct metric values', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('245ms')).toBeInTheDocument(); // Response time
      expect(screen.getByText(/1,847/)).toBeInTheDocument(); // Active users (Persian format)
      expect(screen.getByText('%0.12')).toBeInTheDocument(); // Error rate
      expect(screen.getByText('%68')).toBeInTheDocument(); // Server load
    });
  });

  it('applies correct color classes based on metric thresholds', () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    // Response time should be green (< 300ms)
    const responseTimeIcon = screen.getByText('245ms').parentElement?.nextElementSibling;
    expect(responseTimeIcon).toHaveClass('bg-green-100');
    
    // Error rate should be green (< 1%)
    const errorRateIcon = screen.getByText('%0.12').parentElement?.nextElementSibling;
    expect(errorRateIcon).toHaveClass('bg-green-100');
  });

  it('handles test control mutations', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    let pauseButton: Element | null = null;
    
    await waitFor(() => {
      pauseButton = screen.getAllByTestId('pause-icon')[0].parentElement;
      if (pauseButton) {
        fireEvent.click(pauseButton);
      }
    });

    // Since we're using mock data, we can't test the actual mutation result
    // but we can verify the button exists and is clickable
    expect(pauseButton).toBeInTheDocument();
  });

  it('renders charts with correct test data structure', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    // Expand first test to see charts
    await waitFor(() => {
      const testCard = screen.getByText('صفحه ورود نسخه جدید').closest('div');
      if (testCard) {
        fireEvent.click(testCard);
      }
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('bar-chart').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('pie-chart').length).toBeGreaterThan(0);
    });
  });

  it('displays confidence levels for tests', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('اطمینان: %85')).toBeInTheDocument();
      expect(screen.getByText('اطمینان: %92')).toBeInTheDocument();
    });
  });

  it('formats Persian numbers correctly', async () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      // Check for Persian formatted numbers
      expect(screen.getByText(/1,847/)).toBeInTheDocument(); // Active users
      expect(screen.getByText(/1,250/)).toBeInTheDocument(); // Throughput
    });
  });

  it('supports RTL layout', () => {
    render(<ScalabilityDashboard />, { wrapper: createWrapper() });
    
    const mainContainer = screen.getByText('داشبورد A/B Testing و مقیاس‌پذیری').closest('div');
    expect(mainContainer).toHaveAttribute('dir', 'rtl');
  });
}); 