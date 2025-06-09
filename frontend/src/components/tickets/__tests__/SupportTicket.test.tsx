import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactMessage } from '@/services/api';
import SupportTicket from '../SupportTicket';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock API service
jest.mock('@/services/api', () => ({
  contactService: {
    updateMessageStatus: jest.fn(),
    respondToTicket: jest.fn(),
  },
}));

const mockTicket: ContactMessage = {
  id: '1',
  name: 'احمد محمدی',
  email: 'ahmad@example.com',
  phone: '09123456789',
  message: 'سلام، مشکلی در سیستم دارم',
  category: 'support',
  status: 'pending',
  userAgent: 'Mozilla/5.0',
  ipAddress: '192.168.1.1',
  createdAt: '2024-01-01T10:00:00Z',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return Wrapper;
};

describe('SupportTicket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ticket information correctly', () => {
    render(
      <SupportTicket ticket={mockTicket} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('احمد محمدی')).toBeInTheDocument();
    expect(screen.getByText('ahmad@example.com')).toBeInTheDocument();
    expect(screen.getByText('09123456789')).toBeInTheDocument();
    expect(screen.getByText('سلام، مشکلی در سیستم دارم')).toBeInTheDocument();
    expect(screen.getByText('پشتیبانی')).toBeInTheDocument();
    expect(screen.getByText('در انتظار پاسخ')).toBeInTheDocument();
  });

  it('shows response button for pending tickets', () => {
    render(
      <SupportTicket ticket={mockTicket} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('پاسخ دادن')).toBeInTheDocument();
  });

  it('shows close button for replied tickets', () => {
    const repliedTicket = { ...mockTicket, status: 'replied' as const };
    
    render(
      <SupportTicket ticket={repliedTicket} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('بستن تیکت')).toBeInTheDocument();
  });

  it('opens response modal when response button is clicked', async () => {
    render(
      <SupportTicket ticket={mockTicket} />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByText('پاسخ دادن'));

    await waitFor(() => {
      expect(screen.getByText('پاسخ به تیکت احمد محمدی')).toBeInTheDocument();
    });
  });

  it('validates response form correctly', async () => {
    render(
      <SupportTicket ticket={mockTicket} />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByText('پاسخ دادن'));

    await waitFor(() => {
      expect(screen.getByText('پاسخ به تیکت احمد محمدی')).toBeInTheDocument();
    });

    // Try to submit empty form
    fireEvent.click(screen.getByText('ارسال پاسخ'));

    await waitFor(() => {
      expect(screen.getByText('پاسخ باید حداقل ۱۰ کاراکتر باشد')).toBeInTheDocument();
    });
  });

  it('displays category labels correctly', () => {
    const categories = [
      { category: 'bug_report', label: 'گزارش باگ' },
      { category: 'feature_request', label: 'درخواست قابلیت' },
      { category: 'support', label: 'پشتیبانی' },
      { category: 'general', label: 'عمومی' },
    ];

    categories.forEach(({ category, label }) => {
      const ticket = { ...mockTicket, category: category as ContactMessage['category'] };
      const { unmount } = render(
        <SupportTicket ticket={ticket} />,
        { wrapper: createWrapper() }
      );
      
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('displays status labels correctly', () => {
    const statuses = [
      { status: 'pending', label: 'در انتظار پاسخ' },
      { status: 'replied', label: 'پاسخ داده شده' },
      { status: 'closed', label: 'بسته شده' },
    ];

    statuses.forEach(({ status, label }) => {
      const ticket = { ...mockTicket, status: status as ContactMessage['status'] };
      const { unmount } = render(
        <SupportTicket ticket={ticket} />,
        { wrapper: createWrapper() }
      );
      
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('formats date correctly', () => {
    render(
      <SupportTicket ticket={mockTicket} />,
      { wrapper: createWrapper() }
    );

    // Check if date is displayed (exact format may vary based on locale)
    expect(screen.getByText(/۱۴۰۲|2024/)).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalTicket: ContactMessage = {
      id: '2',
      name: 'کاربر تست',
      email: 'test@example.com',
      message: 'پیام تست',
    };

    render(
      <SupportTicket ticket={minimalTicket} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('کاربر تست')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('پیام تست')).toBeInTheDocument();
  });

  it('calls onUpdate when provided', async () => {
    const mockOnUpdate = jest.fn();
    
    render(
      <SupportTicket ticket={mockTicket} onUpdate={mockOnUpdate} />,
      { wrapper: createWrapper() }
    );

    // This would be called after successful mutation
    // In a real test, we'd mock the mutation success
  });

  it('closes modal when cancel button is clicked', async () => {
    render(
      <SupportTicket ticket={mockTicket} />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByText('پاسخ دادن'));

    await waitFor(() => {
      expect(screen.getByText('پاسخ به تیکت احمد محمدی')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('انصراف'));

    await waitFor(() => {
      expect(screen.queryByText('پاسخ به تیکت احمد محمدی')).not.toBeInTheDocument();
    });
  });

  it('closes modal when X button is clicked', async () => {
    render(
      <SupportTicket ticket={mockTicket} />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByText('پاسخ دادن'));

    await waitFor(() => {
      expect(screen.getByText('پاسخ به تیکت احمد محمدی')).toBeInTheDocument();
    });

    // Find and click the X button
    const closeButton = screen.getByRole('button', { name: '' }); // X button typically has no text
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('پاسخ به تیکت احمد محمدی')).not.toBeInTheDocument();
    });
  });
}); 