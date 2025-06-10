import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ExamQuestions } from '../ExamQuestions';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const mockQuestions = [
  {
    id: '1',
    text: 'سوال اول ریاضی',
    options: ['گزینه الف', 'گزینه ب', 'گزینه ج', 'گزینه د'],
    difficulty: 'easy' as const,
    subject: 'math',
    chapter: 'جبر',
    estimatedTime: 2,
  },
  {
    id: '2',
    text: 'سوال دوم ریاضی',
    options: ['گزینه الف', 'گزینه ب', 'گزینه ج', 'گزینه د'],
    difficulty: 'medium' as const,
    subject: 'math',
    chapter: 'هندسه',
    estimatedTime: 3,
  },
  {
    id: '3',
    text: 'سوال سوم ریاضی',
    options: ['گزینه الف', 'گزینه ب', 'گزینه ج', 'گزینه د'],
    difficulty: 'hard' as const,
    subject: 'math',
    chapter: 'آمار',
    estimatedTime: 5,
  },
];

const defaultProps = {
  questions: mockQuestions,
  currentQuestionIndex: 0,
  answers: { '1': 0, '2': 1 },
  onAnswerSelect: jest.fn(),
  onQuestionChange: jest.fn(),
  isSubmitting: false,
};

describe('ExamQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders current question correctly', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    expect(screen.getByText('سوال اول ریاضی')).toBeInTheDocument();
    expect(screen.getByText('آسان')).toBeInTheDocument();
    expect(screen.getByText('جبر')).toBeInTheDocument();
    expect(screen.getByText(/زمان تخمینی: ۲ دقیقه/)).toBeInTheDocument();
  });

  it('shows progress correctly', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    expect(screen.getByText(/سوال ۱ از ۳/)).toBeInTheDocument();
    expect(screen.getByText(/۳۳٪ تکمیل شده/)).toBeInTheDocument();
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '33');
  });

  it('displays all question options', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    mockQuestions[0].options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('calls onAnswerSelect when option is clicked', () => {
    const onAnswerSelect = jest.fn();
    render(<ExamQuestions {...defaultProps} onAnswerSelect={onAnswerSelect} />);
    
    const optionInputs = screen.getAllByRole('radio');
    fireEvent.click(optionInputs[1]); // Click second option
    
    expect(onAnswerSelect).toHaveBeenCalledWith('1', 1);
  });

  it('shows selected answer', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    const optionInputs = screen.getAllByRole('radio');
    expect(optionInputs[0]).toBeChecked(); // First option should be checked
  });

  it('calls onQuestionChange when navigation buttons are clicked', () => {
    const onQuestionChange = jest.fn();
    render(<ExamQuestions {...defaultProps} onQuestionChange={onQuestionChange} />);
    
    const nextButton = screen.getByLabelText('سوال بعدی');
    fireEvent.click(nextButton);
    
    expect(onQuestionChange).toHaveBeenCalledWith(1);
  });

  it('disables previous button on first question', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    const prevButton = screen.getByLabelText('سوال قبلی');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last question', () => {
    render(<ExamQuestions {...defaultProps} currentQuestionIndex={2} />);
    
    const nextButton = screen.getByLabelText('سوال بعدی');
    expect(nextButton).toBeDisabled();
  });

  it('highlights answered questions in overview', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    const questionButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent === '۱' || btn.textContent === '۲' || btn.textContent === '۳'
    );
    
    // Question 1 is current (blue), Question 2 is answered (green), Question 3 is unanswered (gray)
    expect(questionButtons[0]).toHaveClass('bg-blue-600');
    expect(questionButtons[1]).toHaveClass('bg-green-100');
    expect(questionButtons[2]).toHaveClass('bg-gray-100');
  });

  it('calls onQuestionChange when question overview button is clicked', () => {
    const onQuestionChange = jest.fn();
    render(<ExamQuestions {...defaultProps} onQuestionChange={onQuestionChange} />);
    
    const questionButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent === '۲'
    );
    fireEvent.click(questionButtons[0]);
    
    expect(onQuestionChange).toHaveBeenCalledWith(1);
  });

  it('disables interactions when submitting', () => {
    render(<ExamQuestions {...defaultProps} isSubmitting={true} />);
    
    const optionInputs = screen.getAllByRole('radio');
    const nextButton = screen.getByLabelText('سوال بعدی');
    const questionButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent === '۲'
    );
    
    expect(optionInputs[0]).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(questionButtons[0]).toBeDisabled();
  });

  it('shows difficulty colors correctly', () => {
    render(<ExamQuestions {...defaultProps} currentQuestionIndex={1} />);
    
    const difficultyText = screen.getByText('متوسط');
    expect(difficultyText).toHaveClass('text-yellow-600');
  });

  it('handles empty questions gracefully', () => {
    render(<ExamQuestions {...defaultProps} questions={[]} />);
    
    expect(screen.getByText('سوالی یافت نشد')).toBeInTheDocument();
  });

  it('converts numbers to Persian correctly', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    expect(screen.getByText(/سوال ۱ از ۳/)).toBeInTheDocument();
    expect(screen.getByText(/۳۳٪ تکمیل شده/)).toBeInTheDocument();
    expect(screen.getByText(/زمان تخمینی: ۲ دقیقه/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ExamQuestions {...defaultProps} />);
    
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-labelledby', 'question-1');
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '33');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });
}); 