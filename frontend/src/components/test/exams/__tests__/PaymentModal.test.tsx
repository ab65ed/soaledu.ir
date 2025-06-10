import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaymentModal } from '../PaymentModal';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const mockExam = {
  id: '1',
  title: 'آزمون ریاضی پایه دهم',
  questionsCount: 20,
  timeLimit: 90,
  difficulty: 'متوسط',
};

const defaultProps = {
  exam: mockExam,
  onClose: jest.fn(),
  onSuccess: jest.fn(),
};

describe('PaymentModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with exam information', () => {
    render(<PaymentModal {...defaultProps} />);
    
    expect(screen.getByText('خرید آزمون تستی')).toBeInTheDocument();
    expect(screen.getByText('آزمون ریاضی پایه دهم')).toBeInTheDocument();
    expect(screen.getByText('90 دقیقه')).toBeInTheDocument();
    expect(screen.getByText('20 سوال')).toBeInTheDocument();
  });

  it('shows difficulty distribution correctly', () => {
    render(<PaymentModal {...defaultProps} />);
    
    expect(screen.getByText('توزیع سختی سوالات:')).toBeInTheDocument();
    expect(screen.getByText('آسان: 4 سوال')).toBeInTheDocument();
    expect(screen.getByText('متوسط: 6 سوال')).toBeInTheDocument();
    expect(screen.getByText('سخت: 10 سوال')).toBeInTheDocument();
  });

  it('calculates and displays price correctly', () => {
    render(<PaymentModal {...defaultProps} />);
    
    // Price should be calculated as (880/100) * 20 = 176
    expect(screen.getByText('۱۷۶ تومان')).toBeInTheDocument();
    expect(screen.getByText('۹ تومان/سوال')).toBeInTheDocument();
  });

  it('allows payment method selection', () => {
    render(<PaymentModal {...defaultProps} />);
    
    const cardButton = screen.getByText('کارت بانکی').closest('button');
    const walletButton = screen.getByText('کیف پول').closest('button');
    
    expect(cardButton).toHaveClass('border-green-500');
    expect(walletButton).toHaveClass('border-gray-200');
    
    fireEvent.click(walletButton!);
    
    expect(walletButton).toHaveClass('border-green-500');
  });

  it('handles payment process', async () => {
    const onSuccess = jest.fn();
    render(<PaymentModal {...defaultProps} onSuccess={onSuccess} />);
    
    const payButton = screen.getByRole('button', { name: /پرداخت ۱۷۶ تومان/ });
    fireEvent.click(payButton);
    
    expect(screen.getByText('در حال پردازش...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('closes modal when close button is clicked', () => {
    const onClose = jest.fn();
    render(<PaymentModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('بستن');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('closes modal when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(<PaymentModal {...defaultProps} onClose={onClose} />);
    
    // Click on the backdrop (the outermost div with fixed positioning)
    const backdrop = document.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop!);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('prevents modal close when content is clicked', () => {
    const onClose = jest.fn();
    render(<PaymentModal {...defaultProps} onClose={onClose} />);
    
    const modalContent = screen.getByText('خرید آزمون تستی').closest('div');
    fireEvent.click(modalContent!);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows payment methods correctly', () => {
    render(<PaymentModal {...defaultProps} />);
    
    expect(screen.getByText('روش پرداخت')).toBeInTheDocument();
    expect(screen.getByText('کارت بانکی')).toBeInTheDocument();
    expect(screen.getByText('پرداخت آنلاین')).toBeInTheDocument();
    expect(screen.getByText('کیف پول')).toBeInTheDocument();
    expect(screen.getByText('پرداخت سریع')).toBeInTheDocument();
  });

  it('disables payment button during processing', async () => {
    render(<PaymentModal {...defaultProps} />);
    
    const payButton = screen.getByRole('button', { name: /پرداخت ۱۷۶ تومان/ });
    fireEvent.click(payButton);
    
    expect(payButton).toBeDisabled();
    expect(screen.getByText('در حال پردازش...')).toBeInTheDocument();
  });

  it('handles different exam sizes correctly', () => {
    const largeExam = {
      ...mockExam,
      questionsCount: 100,
    };
    
    render(<PaymentModal {...defaultProps} exam={largeExam} />);
    
    // Should show correct distribution for 100 questions
    expect(screen.getByText('آسان: 20 سوال')).toBeInTheDocument();
    expect(screen.getByText('متوسط: 30 سوال')).toBeInTheDocument();
    expect(screen.getByText('سخت: 50 سوال')).toBeInTheDocument();
    
    // Price should be 880 toman for 100 questions
    expect(screen.getByText('۸۸۰ تومان')).toBeInTheDocument();
  });
}); 