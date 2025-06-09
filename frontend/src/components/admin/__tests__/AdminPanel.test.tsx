import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminPanel } from '../AdminPanel';
import { adminService } from '@/services/api';

// Mock the admin service
jest.mock('@/services/api', () => ({
  adminService: {
    getAdminStats: jest.fn(),
    getUsers: jest.fn(),
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { children: React.ReactNode }) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the child components
jest.mock('../FinanceTab', () => ({
  FinanceTab: () => <div>مدیریت مالی</div>,
}));

jest.mock('../ActivityLogViewer', () => ({
  ActivityLogViewer: () => <div>لاگ‌های فعالیت</div>,
}));

const mockAdminStats = {
  users: {
    total: 1248,
    active: 892,
    newThisMonth: 156,
    students: 1089,
    teachers: 145,
    admins: 14
  },
  courseExams: {
    total: 234,
    published: 187,
    drafts: 47,
    totalSales: 3456
  },
  questions: {
    total: 5678,
    published: 4234,
    drafts: 1444
  },
  finance: {
    totalRevenue: 245670000,
    monthlyRevenue: 28900000,
    avgOrderValue: 125000,
    pendingPayments: 12
  },
  activity: {
    totalLogins: 8934,
    activeToday: 234,
    averageSessionTime: 1845
  }
};

const mockUsers = {
  users: [
    {
      id: '1',
      name: 'علی احمدی',
      email: 'ali@example.com',
      role: 'student',
      isActive: true,
      lastLogin: '2024-01-15T10:30:00Z',
      registeredAt: '2024-01-01T09:00:00Z'
    },
    {
      id: '2',
      name: 'مریم محمدی',
      email: 'maryam@example.com',
      role: 'teacher',
      isActive: true,
      lastLogin: '2024-01-15T11:15:00Z',
      registeredAt: '2023-12-15T14:30:00Z'
    }
  ],
  pagination: {
    total: 2,
    count: 2,
    limit: 10,
    skip: 0
  }
};

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('AdminPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (adminService.getAdminStats as jest.Mock).mockResolvedValue(mockAdminStats);
    (adminService.getUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('renders admin panel with loading state initially', () => {
    renderWithQueryClient(<AdminPanel />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders admin stats after loading', async () => {
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('کل کاربران')).toBeInTheDocument();
      expect(screen.getByText('۱٬۲۴۸')).toBeInTheDocument();
      expect(screen.getByText('آزمون‌های منتشر شده')).toBeInTheDocument();
      expect(screen.getByText('۱۸۷')).toBeInTheDocument();
    });
  });

  it('switches between tabs correctly', async () => {
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('کل کاربران')).toBeInTheDocument();
    });

    // Click on users tab
    const usersTab = screen.getByText('کاربران');
    fireEvent.click(usersTab);

    await waitFor(() => {
      expect(screen.getByText('مدیریت کاربران')).toBeInTheDocument();
    });
  });

  it('displays users table when users tab is active', async () => {
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('کل کاربران')).toBeInTheDocument();
    });

    // Click on users tab
    const usersTab = screen.getByText('کاربران');
    fireEvent.click(usersTab);

    await waitFor(() => {
      expect(screen.getByText('علی احمدی')).toBeInTheDocument();
      expect(screen.getByText('ali@example.com')).toBeInTheDocument();
      expect(screen.getByText('مریم محمدی')).toBeInTheDocument();
      expect(screen.getByText('maryam@example.com')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (adminService.getAdminStats as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('کل کاربران')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch admin stats, using mock data:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('displays finance tab content', async () => {
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('کل کاربران')).toBeInTheDocument();
    });

    // Click on finance tab
    const financeTab = screen.getByText('مالی');
    fireEvent.click(financeTab);

    await waitFor(() => {
      expect(screen.getByText('مدیریت مالی')).toBeInTheDocument();
    });
  });

  it('displays logs tab content', async () => {
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('کل کاربران')).toBeInTheDocument();
    });

    // Click on logs tab
    const logsTab = screen.getByText('لاگ‌ها');
    fireEvent.click(logsTab);

    await waitFor(() => {
      expect(screen.getByText('لاگ‌های فعالیت')).toBeInTheDocument();
    });
  });

  it('formats time correctly', async () => {
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText(/میانگین جلسه:/)).toBeInTheDocument();
      expect(screen.getByText(/30 دقیقه/)).toBeInTheDocument();
    });
  });

  it('formats numbers in Persian locale', async () => {
    renderWithQueryClient(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('۱٬۲۴۸')).toBeInTheDocument(); // Total users
      expect(screen.getByText('۱۸۷')).toBeInTheDocument(); // Published exams
      expect(screen.getByText('۲۸٬۹۰۰٬۰۰۰')).toBeInTheDocument(); // Monthly revenue
    });
  });
}); 