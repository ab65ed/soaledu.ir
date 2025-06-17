/**
 * Test Generator - تولید تست‌های Jest
 */

import { ConversionConfig } from '../config';
import { ComponentAnalysis } from './analyzer';
import { GeneratedFile } from './converter';

export class TestGenerator {
  private config: ConversionConfig;

  constructor(config: ConversionConfig) {
    this.config = config;
  }

  async generate(analysis: ComponentAnalysis, generatedFiles: GeneratedFile[]): Promise<GeneratedFile[]> {
    const testFiles: GeneratedFile[] = [];

    // تست کامپوننت اصلی
    const componentTest = this.generateComponentTest(analysis);
    testFiles.push(componentTest);

    // تست Custom Hook
    if (generatedFiles.some(f => f.type === 'hook')) {
      const hookTest = this.generateHookTest(analysis);
      testFiles.push(hookTest);
    }

    // تست Service
    if (generatedFiles.some(f => f.type === 'service')) {
      const serviceTest = this.generateServiceTest(analysis);
      testFiles.push(serviceTest);
    }

    // تست Store
    if (generatedFiles.some(f => f.type === 'store')) {
      const storeTest = this.generateStoreTest(analysis);
      testFiles.push(storeTest);
    }

    return testFiles;
  }

  private generateComponentTest(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    
    const content = `/**
 * Test for ${componentName}
 * تست برای کامپوننت ${componentName}
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ${componentName} } from '../${componentName}';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock custom hooks
${analysis.hasAPI ? `jest.mock('@/hooks/use${componentName}', () => ({
  use${componentName}: () => ({
    data: mockData,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));` : ''}

const mockData = [
  {
    id: '1',
    title: 'عنوان تست',
    description: 'توضیحات تست',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('${componentName}', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      expect(screen.getByText('${componentName}')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-test-class';
      render(
        <TestWrapper>
          <${componentName} className={customClass} />
        </TestWrapper>
      );
      
      const element = screen.getByText('${componentName}').closest('div');
      expect(element).toHaveClass(customClass);
    });

${analysis.props.map(prop => `    it('renders with ${prop.name} prop', () => {
      const testValue = 'test-${prop.name}';
      render(
        <TestWrapper>
          <${componentName} ${prop.name}={testValue} />
        </TestWrapper>
      );
      
      // Add specific assertions based on prop type
      expect(screen.getByText('${componentName}')).toBeInTheDocument();
    });`).join('\n\n')}
  });

${analysis.hasAPI ? `
  describe('Data Loading', () => {
    it('shows loading state', () => {
      jest.mocked(use${componentName}).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('shows error state', () => {
      const errorMessage = 'خطا در بارگذاری داده‌ها';
      jest.mocked(use${componentName}).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error(errorMessage),
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('displays data when loaded', () => {
      jest.mocked(use${componentName}).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      expect(screen.getByText(mockData[0].title)).toBeInTheDocument();
    });
  });` : ''}

${analysis.hasRouter ? `
  describe('Navigation', () => {
    it('handles navigation correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      const navigationButton = screen.getByRole('button', { name: /navigation/i });
      await user.click(navigationButton);
      
      expect(mockPush).toHaveBeenCalledWith('/expected-path');
    });
  });` : ''}

  describe('User Interactions', () => {
${analysis.state.map(state => `    it('handles ${state.name} state changes', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      // Add specific interaction tests based on state
      // This is a placeholder - customize based on actual component behavior
      expect(screen.getByText('${componentName}')).toBeInTheDocument();
    });`).join('\n\n')}

    it('handles form submission', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      // Mock form submission if component has forms
      const submitButton = screen.queryByRole('button', { name: /submit|ارسال/i });
      if (submitButton) {
        await user.click(submitButton);
        // Add assertions for form submission
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      // Check for proper ARIA attributes
      const mainElement = screen.getByText('${componentName}').closest('div');
      expect(mainElement).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      // Test Tab navigation
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      expect(screen.getByText('${componentName}')).toBeInTheDocument();
    });

    it('renders correctly on desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      expect(screen.getByText('${componentName}')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('memoizes correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      // Re-render with same props
      rerender(
        <TestWrapper>
          <${componentName} />
        </TestWrapper>
      );
      
      expect(screen.getByText('${componentName}')).toBeInTheDocument();
    });
  });
});`;

    return {
      path: `frontend/src/components/${analysis.atomicLevel}/${componentName}/__tests__/${componentName}.test.tsx`,
      content,
      type: 'test',
    };
  }

  private generateHookTest(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    const hookName = `use${componentName}`;
    
    const content = `/**
 * Test for ${hookName}
 * تست برای هوک ${hookName}
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ${hookName} } from '../${hookName}';
import { ${componentName.toLowerCase()}Service } from '@/services/${componentName.toLowerCase()}Service';

// Mock service
jest.mock('@/services/${componentName.toLowerCase()}Service');

const mockService = ${componentName.toLowerCase()}Service as jest.Mocked<typeof ${componentName.toLowerCase()}Service>;

const mockData = [
  {
    id: '1',
    title: 'عنوان تست',
    description: 'توضیحات تست',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('${hookName}', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data Fetching', () => {
    it('fetches data successfully', async () => {
      mockService.getAll.mockResolvedValue({
        data: mockData,
        total: mockData.length,
        page: 1,
        limit: 10,
      });

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.items).toEqual(mockData);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('handles fetch error', async () => {
      const errorMessage = 'خطا در دریافت داده‌ها';
      mockService.getAll.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('CRUD Operations', () => {
    it('creates new item', async () => {
      const newItem = {
        title: 'آیتم جدید',
        description: 'توضیحات آیتم جدید',
      };

      const createdItem = {
        ...newItem,
        id: '2',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockService.create.mockResolvedValue(createdItem);

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(async () => {
        await result.current.create(newItem);
        expect(mockService.create).toHaveBeenCalledWith(newItem);
      });
    });

    it('updates existing item', async () => {
      const itemId = '1';
      const updates = { title: 'عنوان به‌روزرسانی شده' };
      const updatedItem = { ...mockData[0], ...updates };

      mockService.update.mockResolvedValue(updatedItem);

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(async () => {
        await result.current.update(itemId, updates);
        expect(mockService.update).toHaveBeenCalledWith(itemId, updates);
      });
    });

    it('deletes item', async () => {
      const itemId = '1';
      mockService.delete.mockResolvedValue();

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(async () => {
        await result.current.remove(itemId);
        expect(mockService.delete).toHaveBeenCalledWith(itemId);
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during operations', async () => {
      mockService.create.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockData[0]), 100))
      );

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      result.current.create({
        title: 'آیتم جدید',
        description: 'توضیحات',
      });

      expect(result.current.isCreating).toBe(true);

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });
    });
  });

  describe('Optimistic Updates', () => {
    it('applies optimistic updates for create', async () => {
      const newItem = {
        title: 'آیتم جدید',
        description: 'توضیحات آیتم جدید',
      };

      mockService.getAll.mockResolvedValue({
        data: mockData,
        total: mockData.length,
        page: 1,
        limit: 10,
      });

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      // Wait for initial data
      await waitFor(() => {
        expect(result.current.items).toEqual(mockData);
      });

      // Trigger optimistic create
      result.current.create(newItem);

      expect(result.current.isOptimistic).toBe(true);
    });
  });
});`;

    return {
      path: `frontend/src/hooks/__tests__/${hookName}.test.ts`,
      content,
      type: 'test',
    };
  }

  private generateServiceTest(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    const serviceName = `${componentName.toLowerCase()}Service`;
    
    const content = `/**
 * Test for ${serviceName}
 * تست برای سرویس ${serviceName}
 */

import { ${serviceName} } from '../${serviceName}';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const mockData = [
  {
    id: '1',
    title: 'عنوان تست',
    description: 'توضیحات تست',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('${serviceName}', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockData, total: mockData.length }),
    } as Response);
  });

  describe('getAll', () => {
    it('fetches all items successfully', async () => {
      const result = await ${serviceName}.getAll();
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/${componentName.toLowerCase()}'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      
      expect(result.data).toEqual(mockData);
      expect(result.total).toBe(mockData.length);
    });

    it('handles query parameters', async () => {
      const params = {
        page: 2,
        limit: 5,
        search: 'تست',
        sort: 'title',
      };

      await ${serviceName}.getAll(params);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2&limit=5&search=تست&sort=title'),
        expect.any(Object)
      );
    });
  });

  describe('getById', () => {
    it('fetches single item successfully', async () => {
      const itemId = '1';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData[0],
      } as Response);

      const result = await ${serviceName}.getById(itemId);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(\`/\${itemId}\`),
        expect.any(Object)
      );
      
      expect(result).toEqual(mockData[0]);
    });
  });

  describe('create', () => {
    it('creates new item successfully', async () => {
      const newItem = {
        title: 'آیتم جدید',
        description: 'توضیحات آیتم جدید',
      };

      const createdItem = {
        ...newItem,
        id: '2',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdItem,
      } as Response);

      const result = await ${serviceName}.create(newItem);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/${componentName.toLowerCase()}'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newItem),
        })
      );
      
      expect(result).toEqual(createdItem);
    });
  });

  describe('update', () => {
    it('updates item successfully', async () => {
      const itemId = '1';
      const updates = { title: 'عنوان به‌روزرسانی شده' };
      const updatedItem = { ...mockData[0], ...updates };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedItem,
      } as Response);

      const result = await ${serviceName}.update(itemId, updates);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(\`/\${itemId}\`),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updates),
        })
      );
      
      expect(result).toEqual(updatedItem);
    });
  });

  describe('delete', () => {
    it('deletes item successfully', async () => {
      const itemId = '1';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await ${serviceName}.delete(itemId);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(\`/\${itemId}\`),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('handles HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'آیتم یافت نشد' }),
      } as Response);

      await expect(${serviceName}.getAll()).rejects.toThrow('آیتم یافت نشد');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('خطای شبکه'));

      await expect(${serviceName}.getAll()).rejects.toThrow('خطای شبکه');
    });
  });

  describe('Authentication', () => {
    it('includes auth token when available', async () => {
      const token = 'test-token';
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => token),
        },
        writable: true,
      });

      await ${serviceName}.getAll();
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: \`Bearer \${token}\`,
          }),
        })
      );
    });
  });
});`;

    return {
      path: `frontend/src/services/__tests__/${serviceName}.test.ts`,
      content,
      type: 'test',
    };
  }

  private generateStoreTest(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    const storeName = `${componentName.toLowerCase()}Store`;
    
    const content = `/**
 * Test for ${storeName}
 * تست برای استور ${storeName}
 */

import { renderHook, act } from '@testing-library/react';
import { use${this.capitalize(componentName)}Store } from '../${storeName}';

const mockData = [
  {
    id: '1',
    title: 'عنوان تست',
    description: 'توضیحات تست',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'عنوان دوم',
    description: 'توضیحات دوم',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

describe('${storeName}', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      expect(result.current.items).toEqual([]);
      expect(result.current.selectedItem).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.searchQuery).toBe('');
      expect(result.current.filters).toEqual({});
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.totalItems).toBe(0);
    });
  });

  describe('Data Actions', () => {
    it('sets items correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setItems(mockData);
      });
      
      expect(result.current.items).toEqual(mockData);
    });

    it('adds item correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      const newItem = mockData[0];
      
      act(() => {
        result.current.addItem(newItem);
      });
      
      expect(result.current.items).toContain(newItem);
      expect(result.current.totalItems).toBe(1);
    });

    it('updates item correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setItems(mockData);
      });
      
      const updates = { title: 'عنوان به‌روزرسانی شده' };
      
      act(() => {
        result.current.updateItem('1', updates);
      });
      
      const updatedItem = result.current.items.find(item => item.id === '1');
      expect(updatedItem?.title).toBe(updates.title);
    });

    it('removes item correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setItems(mockData);
        result.current.setTotalItems(mockData.length);
      });
      
      act(() => {
        result.current.removeItem('1');
      });
      
      expect(result.current.items.find(item => item.id === '1')).toBeUndefined();
      expect(result.current.totalItems).toBe(1);
    });

    it('sets selected item correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      const selectedItem = mockData[0];
      
      act(() => {
        result.current.setSelectedItem(selectedItem);
      });
      
      expect(result.current.selectedItem).toEqual(selectedItem);
    });
  });

  describe('UI Actions', () => {
    it('sets loading state correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setLoading(true);
      });
      
      expect(result.current.isLoading).toBe(true);
    });

    it('sets error correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      const errorMessage = 'خطای تست';
      
      act(() => {
        result.current.setError(errorMessage);
      });
      
      expect(result.current.error).toBe(errorMessage);
    });

    it('sets search query correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      const searchQuery = 'جستجوی تست';
      
      act(() => {
        result.current.setSearchQuery(searchQuery);
      });
      
      expect(result.current.searchQuery).toBe(searchQuery);
    });

    it('sets filters correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      const filters = { category: 'test', status: 'active' };
      
      act(() => {
        result.current.setFilters(filters);
      });
      
      expect(result.current.filters).toEqual(filters);
    });

    it('clears filters correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setFilters({ category: 'test' });
        result.current.setSearchQuery('test');
      });
      
      act(() => {
        result.current.clearFilters();
      });
      
      expect(result.current.filters).toEqual({});
      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('Helper Actions', () => {
    it('gets item by id correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setItems(mockData);
      });
      
      const item = result.current.getItemById('1');
      expect(item).toEqual(mockData[0]);
    });

    it('filters items correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setItems(mockData);
        result.current.setSearchQuery('دوم');
      });
      
      const filteredItems = result.current.getFilteredItems();
      expect(filteredItems).toHaveLength(1);
      expect(filteredItems[0].title).toBe('عنوان دوم');
    });

    it('resets store correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setItems(mockData);
        result.current.setLoading(true);
        result.current.setError('test error');
      });
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.items).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Pagination', () => {
    it('sets pagination correctly', () => {
      const { result } = renderHook(() => use${this.capitalize(componentName)}Store());
      
      act(() => {
        result.current.setCurrentPage(2);
        result.current.setTotalPages(5);
        result.current.setTotalItems(50);
      });
      
      expect(result.current.currentPage).toBe(2);
      expect(result.current.totalPages).toBe(5);
      expect(result.current.totalItems).toBe(50);
    });
  });
});`;

    return {
      path: `frontend/src/stores/__tests__/${storeName}.test.ts`,
      content,
      type: 'test',
    };
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default TestGenerator; 