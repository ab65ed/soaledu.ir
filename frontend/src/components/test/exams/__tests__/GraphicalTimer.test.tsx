import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GraphicalTimer } from '../GraphicalTimer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    circle: ({ children, ...props }: React.ComponentProps<'circle'>) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe('GraphicalTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders timer with correct initial time', () => {
    render(<GraphicalTimer totalTime={3600} timeRemaining={3600} />);
    
    expect(screen.getByText('01:00:00')).toBeInTheDocument();
    expect(screen.getByText('%۱۰۰')).toBeInTheDocument();
  });

  it('calls onTimeUp when timer reaches zero', () => {
    const onTimeUp = jest.fn();
    render(<GraphicalTimer totalTime={100} timeRemaining={0} onTimeUp={onTimeUp} />);
    
    expect(onTimeUp).toHaveBeenCalled();
  });

  it('shows warning state correctly', () => {
    render(<GraphicalTimer totalTime={100} timeRemaining={25} isWarning={true} />);
    
    const container = screen.getByText('00:25').closest('div');
    expect(container).toHaveClass('text-amber-600');
  });

  it('shows critical state correctly', () => {
    render(<GraphicalTimer totalTime={100} timeRemaining={10} isCritical={true} />);
    
    const container = screen.getByText('00:10').closest('div');
    expect(container).toHaveClass('text-red-600');
  });

  it('formats time correctly for hours', () => {
    render(<GraphicalTimer totalTime={3661} timeRemaining={3661} />);
    
    expect(screen.getByText('01:01:01')).toBeInTheDocument();
  });

  it('formats time correctly for minutes only', () => {
    render(<GraphicalTimer totalTime={125} timeRemaining={125} />);
    
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('shows correct progress percentage', () => {
    render(<GraphicalTimer totalTime={100} timeRemaining={50} />);
    
    expect(screen.getByText('%۵۰')).toBeInTheDocument();
  });

  it('handles zero time remaining', () => {
    render(<GraphicalTimer totalTime={100} timeRemaining={0} />);
    
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('%۰')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GraphicalTimer 
        totalTime={100} 
        timeRemaining={50} 
        className="custom-class" 
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calculates progress correctly', () => {
    const { rerender } = render(
      <GraphicalTimer totalTime={100} timeRemaining={75} />
    );
    
    expect(screen.getByText('%۷۵')).toBeInTheDocument();
    
    rerender(<GraphicalTimer totalTime={100} timeRemaining={25} />);
    expect(screen.getByText('%۲۵')).toBeInTheDocument();
  });

  it('handles edge case of time remaining greater than total time', () => {
    render(<GraphicalTimer totalTime={100} timeRemaining={150} />);
    
    // Should cap at 100%
    expect(screen.getByText('%۱۰۰')).toBeInTheDocument();
  });

  it('renders without crashing when mounted', () => {
    const { container } = render(
      <GraphicalTimer totalTime={100} timeRemaining={50} />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies correct background colors for different states', () => {
    const { rerender, container } = render(
      <GraphicalTimer totalTime={100} timeRemaining={50} />
    );
    
    // Normal state
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
    
    // Warning state
    rerender(
      <GraphicalTimer totalTime={100} timeRemaining={25} isWarning={true} />
    );
    expect(container.querySelector('.bg-amber-50')).toBeInTheDocument();
    
    // Critical state
    rerender(
      <GraphicalTimer totalTime={100} timeRemaining={10} isCritical={true} />
    );
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
  });
}); 