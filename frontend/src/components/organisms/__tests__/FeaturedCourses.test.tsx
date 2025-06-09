/**
 * FeaturedCourses Component Tests
 * تست‌های کامپوننت درس-آزمون‌های محبوب
 */

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeaturedCourses from '../FeaturedCourses';

// Mock API service
jest.mock('../../../services/api', () => ({
  courseExamService: {
    getPopularCourseExams: jest.fn(),
  },
}));

import * as apiModule from '../../../services/api';
const mockGetPopularCourseExams = apiModule.courseExamService.getPopularCourseExams as jest.MockedFunction<typeof apiModule.courseExamService.getPopularCourseExams>;

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

// Mock Button component
jest.mock('../../atoms/Button', () => {
  const MockButton = ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
  MockButton.displayName = 'MockButton';
  return MockButton;
});

// Mock Card component
jest.mock('../../atoms/Card', () => {
  const MockCard = ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div {...props}>
      {children}
    </div>
  );
  MockCard.displayName = 'MockCard';
  return MockCard;
});

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockCourseExams = [
  {
    id: '1',
    title: 'آزمون ریاضی پایه دهم',
    description: 'آزمون جامع ریاضی برای دانش‌آموزان پایه دهم',
    courseType: 'ریاضی',
    grade: 'دهم',
    difficulty: 'medium',
    questionCount: 25,
    estimatedTime: 90,
    price: 50000,
    tags: ['ریاضی', 'دهم'],
    isPublished: true,
    isDraft: false,
    totalSales: 150,
    revenue: 7500000,
    authorId: 'author1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    group: 'علوم ریاضی',
  },
];

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('FeaturedCourses Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('رندر صحیح عنوان و توضیحات', () => {
    mockGetPopularCourseExams.mockResolvedValue(mockCourseExams);
    
    renderWithQueryClient(<FeaturedCourses />);
    
    expect(screen.getByText('درس-آزمون‌های محبوب')).toBeInTheDocument();
    expect(screen.getByText(/آزمون‌های پرطرفدار و محبوب کاربران/)).toBeInTheDocument();
  });

  it('نمایش skeleton loading در حالت بارگذاری', () => {
    mockGetPopularCourseExams.mockImplementation(
      () => new Promise(() => {}) // Promise که resolve نمی‌شود
    );
    
    renderWithQueryClient(<FeaturedCourses />);
    
    // بررسی وجود skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(6);
  });

  it('نمایش درس-آزمون‌ها پس از بارگذاری موفق', async () => {
    mockGetPopularCourseExams.mockResolvedValue(mockCourseExams);
    
    renderWithQueryClient(<FeaturedCourses />);
    
    await waitFor(() => {
      expect(screen.getByText('آزمون ریاضی پایه دهم')).toBeInTheDocument();
    });
  });
}); 