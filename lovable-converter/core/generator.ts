/**
 * Code Generator - تولید کدهای Next.js
 */

import { ConversionConfig } from '../config';
import { ComponentAnalysis } from './analyzer';
import { GeneratedFile } from './converter';

export class CodeGenerator {
  private config: ConversionConfig;

  constructor(config: ConversionConfig) {
    this.config = config;
  }

  async generate(analysis: ComponentAnalysis): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // تولید کامپوننت اصلی
    const componentFile = this.generateComponent(analysis);
    files.push(componentFile);

    // تولید Types
    if (this.config.api.generateTypes) {
      const typesFile = this.generateTypes(analysis);
      files.push(typesFile);
    }

    // تولید Custom Hook
    if (this.config.api.generateHooks && analysis.complexity !== 'low') {
      const hookFile = this.generateCustomHook(analysis);
      files.push(hookFile);
    }

    // تولید Service
    if (this.config.api.generateServices && analysis.hasAPI) {
      const serviceFile = this.generateService(analysis);
      files.push(serviceFile);
    }

    // تولید Zustand Store
    if (this.config.stateManagement.zustand && analysis.state.length > 0) {
      const storeFile = this.generateZustandStore(analysis);
      files.push(storeFile);
    }

    return files;
  }

  private generateComponent(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    const atomicLevel = analysis.atomicLevel;
    
    const content = `'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
${analysis.hasImages ? "import Image from 'next/image';" : ''}
${analysis.hasRouter ? "import { useRouter } from 'next/navigation';" : ''}
${analysis.hasAPI ? `import { use${componentName} } from '@/hooks/use${componentName}';` : ''}

interface ${componentName}Props {
  className?: string;
${analysis.props.map(prop => `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`).join('\n')}
}

export const ${componentName}: React.FC<${componentName}Props> = React.memo(({
  className,
${analysis.props.map(prop => `  ${prop.name}${prop.defaultValue ? ` = ${prop.defaultValue}` : ''}`).join(',\n')}
}) => {
${analysis.hasRouter ? '  const router = useRouter();' : ''}
${analysis.hasAPI ? `  const { data, isLoading, error } = use${componentName}();` : ''}

${analysis.state.map(state => `  const [${state.name}, set${this.capitalize(state.name)}] = React.useState(${state.initialValue || 'undefined'});`).join('\n')}

${this.generateEventHandlers(analysis)}

  return (
    <motion.div
      className={cn(
        "font-iran-sans",
        // استایل‌های پایه کامپوننت
        ${this.generateBaseStyles(analysis)},
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* محتوای کامپوننت */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ${componentName}
        </h2>
        
        {/* نمایش loading state */}
        ${analysis.hasAPI ? `
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        {/* نمایش error state */}
        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-4">
            خطا در بارگذاری داده‌ها
          </div>
        )}
        
        {/* نمایش داده‌ها */}
        {data && (
          <div className="space-y-4">
            {/* محتوای اصلی */}
          </div>
        )}` : `
        {/* محتوای استاتیک */}
        <div className="space-y-4">
          <p className="text-gray-600">
            محتوای کامپوننت ${componentName}
          </p>
        </div>`}
      </div>
    </motion.div>
  );
});

${componentName}.displayName = '${componentName}';

export default ${componentName};`;

    return {
      path: `frontend/src/components/${atomicLevel}/${componentName}/${componentName}.tsx`,
      content,
      type: 'component',
      atomicLevel,
    };
  }

  private generateTypes(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    
    const content = `/**
 * Types for ${componentName}
 * انواع داده‌های مربوط به ${componentName}
 */

export interface ${componentName}Props {
  className?: string;
${analysis.props.map(prop => `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`).join('\n')}
}

${analysis.state.length > 0 ? `
export interface ${componentName}State {
${analysis.state.map(state => `  ${state.name}: ${state.type};`).join('\n')}
}` : ''}

${analysis.hasAPI ? `
export interface ${componentName}Data {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ${componentName}Response {
  data: ${componentName}Data[];
  total: number;
  page: number;
  limit: number;
}

export interface ${componentName}Error {
  message: string;
  code: string;
  details?: any;
}` : ''}

export default ${componentName}Props;`;

    return {
      path: `frontend/src/types/${componentName.toLowerCase()}.ts`,
      content,
      type: 'type',
    };
  }

  private generateCustomHook(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    const hookName = `use${componentName}`;
    
    const content = `/**
 * Custom Hook for ${componentName}
 * هوک سفارشی برای ${componentName}
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ${componentName}Data, ${componentName}Response } from '@/types/${componentName.toLowerCase()}';
import { ${componentName.toLowerCase()}Service } from '@/services/${componentName.toLowerCase()}Service';

export interface Use${componentName}Options {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

export const ${hookName} = (options: Use${componentName}Options = {}) => {
  const queryClient = useQueryClient();
  const [isOptimistic, setIsOptimistic] = useState(false);

  // Query برای دریافت داده‌ها
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['${componentName.toLowerCase()}'],
    queryFn: ${componentName.toLowerCase()}Service.getAll,
    enabled: options.enabled ?? true,
    refetchInterval: options.refetchInterval ?? 30000,
    staleTime: options.staleTime ?? 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  // Mutation برای ایجاد
  const createMutation = useMutation({
    mutationFn: ${componentName.toLowerCase()}Service.create,
    onMutate: async (newItem) => {
      setIsOptimistic(true);
      await queryClient.cancelQueries({ queryKey: ['${componentName.toLowerCase()}'] });
      
      const previousData = queryClient.getQueryData(['${componentName.toLowerCase()}']);
      
      // Optimistic update
      queryClient.setQueryData(['${componentName.toLowerCase()}'], (old: ${componentName}Response | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: [...old.data, { ...newItem, id: Date.now().toString() }],
          total: old.total + 1,
        };
      });
      
      return { previousData };
    },
    onError: (err, newItem, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['${componentName.toLowerCase()}'], context.previousData);
      }
    },
    onSettled: () => {
      setIsOptimistic(false);
      queryClient.invalidateQueries({ queryKey: ['${componentName.toLowerCase()}'] });
    },
  });

  // Mutation برای ویرایش
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<${componentName}Data> }) =>
      ${componentName.toLowerCase()}Service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${componentName.toLowerCase()}'] });
    },
  });

  // Mutation برای حذف
  const deleteMutation = useMutation({
    mutationFn: ${componentName.toLowerCase()}Service.delete,
    onMutate: async (id) => {
      setIsOptimistic(true);
      await queryClient.cancelQueries({ queryKey: ['${componentName.toLowerCase()}'] });
      
      const previousData = queryClient.getQueryData(['${componentName.toLowerCase()}']);
      
      // Optimistic update
      queryClient.setQueryData(['${componentName.toLowerCase()}'], (old: ${componentName}Response | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter(item => item.id !== id),
          total: old.total - 1,
        };
      });
      
      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['${componentName.toLowerCase()}'], context.previousData);
      }
    },
    onSettled: () => {
      setIsOptimistic(false);
      queryClient.invalidateQueries({ queryKey: ['${componentName.toLowerCase()}'] });
    },
  });

  // Helper functions
  const create = useCallback((data: Omit<${componentName}Data, 'id' | 'createdAt' | 'updatedAt'>) => {
    return createMutation.mutateAsync(data);
  }, [createMutation]);

  const update = useCallback((id: string, data: Partial<${componentName}Data>) => {
    return updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const remove = useCallback((id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  // Memoized values
  const items = useMemo(() => data?.data || [], [data]);
  const total = useMemo(() => data?.total || 0, [data]);
  const isAnyLoading = useMemo(() => 
    isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    [isLoading, createMutation.isPending, updateMutation.isPending, deleteMutation.isPending]
  );

  return {
    // Data
    items,
    total,
    
    // States
    isLoading: isAnyLoading,
    isOptimistic,
    error,
    
    // Actions
    create,
    update,
    remove,
    refetch,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Mutation errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};

export default ${hookName};`;

    return {
      path: `frontend/src/hooks/${hookName}.ts`,
      content,
      type: 'hook',
    };
  }

  private generateService(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    const serviceName = `${componentName.toLowerCase()}Service`;
    
    const content = `/**
 * Service for ${componentName}
 * سرویس API برای ${componentName}
 */

import { ${componentName}Data, ${componentName}Response } from '@/types/${componentName.toLowerCase()}';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ${this.capitalize(serviceName)} {
  private baseUrl = \`\${API_BASE_URL}/${componentName.toLowerCase()}\`;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // اضافه کردن token در صورت وجود
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: \`Bearer \${token}\`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || \`HTTP error! status: \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(\`API Error (\${url}):\`, error);
      throw error;
    }
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<${componentName}Response> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sort) searchParams.append('sort', params.sort);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? \`?\${queryString}\` : '';
    
    return this.request<${componentName}Response>(endpoint);
  }

  async getById(id: string): Promise<${componentName}Data> {
    return this.request<${componentName}Data>(\`/\${id}\`);
  }

  async create(data: Omit<${componentName}Data, 'id' | 'createdAt' | 'updatedAt'>): Promise<${componentName}Data> {
    return this.request<${componentName}Data>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<${componentName}Data>): Promise<${componentName}Data> {
    return this.request<${componentName}Data>(\`/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    return this.request<void>(\`/\${id}\`, {
      method: 'DELETE',
    });
  }

  async search(query: string): Promise<${componentName}Data[]> {
    return this.request<${componentName}Data[]>(\`/search?q=\${encodeURIComponent(query)}\`);
  }
}

export const ${serviceName} = new ${this.capitalize(serviceName)}();
export default ${serviceName};`;

    return {
      path: `frontend/src/services/${serviceName}.ts`,
      content,
      type: 'service',
    };
  }

  private generateZustandStore(analysis: ComponentAnalysis): GeneratedFile {
    const componentName = analysis.componentName;
    const storeName = `${componentName.toLowerCase()}Store`;
    
    const content = `/**
 * Zustand Store for ${componentName}
 * استور Zustand برای ${componentName}
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ${componentName}Data } from '@/types/${componentName.toLowerCase()}';

interface ${componentName}State {
  // Data
  items: ${componentName}Data[];
  selectedItem: ${componentName}Data | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: Record<string, any>;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Actions
  setItems: (items: ${componentName}Data[]) => void;
  addItem: (item: ${componentName}Data) => void;
  updateItem: (id: string, updates: Partial<${componentName}Data>) => void;
  removeItem: (id: string) => void;
  setSelectedItem: (item: ${componentName}Data | null) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
  
  // Pagination Actions
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setTotalItems: (total: number) => void;
  
  // Helper Actions
  getItemById: (id: string) => ${componentName}Data | undefined;
  getFilteredItems: () => ${componentName}Data[];
  reset: () => void;
}

const initialState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
};

export const use${this.capitalize(componentName)}Store = create<${componentName}State>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Data Actions
      setItems: (items) => set({ items }),
      
      addItem: (item) => set((state) => ({
        items: [item, ...state.items],
        totalItems: state.totalItems + 1,
      })),
      
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ),
        selectedItem: state.selectedItem?.id === id 
          ? { ...state.selectedItem, ...updates }
          : state.selectedItem,
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
        selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
        totalItems: Math.max(0, state.totalItems - 1),
      })),
      
      setSelectedItem: (item) => set({ selectedItem: item }),

      // UI Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {}, searchQuery: '' }),

      // Pagination Actions
      setCurrentPage: (currentPage) => set({ currentPage }),
      setTotalPages: (totalPages) => set({ totalPages }),
      setTotalItems: (totalItems) => set({ totalItems }),

      // Helper Actions
      getItemById: (id) => {
        const { items } = get();
        return items.find(item => item.id === id);
      },
      
      getFilteredItems: () => {
        const { items, searchQuery, filters } = get();
        let filtered = items;

        // اعمال جستجو
        if (searchQuery) {
          filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }

        // اعمال فیلترها
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            filtered = filtered.filter(item => {
              const itemValue = (item as any)[key];
              if (Array.isArray(value)) {
                return value.includes(itemValue);
              }
              return itemValue === value;
            });
          }
        });

        return filtered;
      },
      
      reset: () => set(initialState),
    }),
    {
      name: '${storeName}',
      partialize: (state) => ({
        items: state.items,
        selectedItem: state.selectedItem,
        filters: state.filters,
        currentPage: state.currentPage,
      }),
    }
  )
);

// Selector hooks برای بهینه‌سازی re-renders
export const use${componentName}Items = () => use${this.capitalize(componentName)}Store((state) => state.items);
export const use${componentName}Loading = () => use${this.capitalize(componentName)}Store((state) => state.isLoading);
export const use${componentName}Error = () => use${this.capitalize(componentName)}Store((state) => state.error);
export const use${componentName}Selected = () => use${this.capitalize(componentName)}Store((state) => state.selectedItem);
export const use${componentName}Search = () => use${this.capitalize(componentName)}Store((state) => ({
  searchQuery: state.searchQuery,
  setSearchQuery: state.setSearchQuery,
}));

export default use${this.capitalize(componentName)}Store;`;

    return {
      path: `frontend/src/stores/${storeName}.ts`,
      content,
      type: 'store',
    };
  }

  private generateEventHandlers(analysis: ComponentAnalysis): string {
    const handlers = [];
    
    if (analysis.hasRouter) {
      handlers.push(`  const handleNavigation = React.useCallback((path: string) => {
    router.push(path);
  }, [router]);`);
    }

    if (analysis.state.some(s => s.name.includes('modal') || s.name.includes('open'))) {
      handlers.push(`  const handleToggleModal = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);`);
    }

    return handlers.join('\n\n');
  }

  private generateBaseStyles(analysis: ComponentAnalysis): string {
    const styles = ['"bg-white rounded-lg shadow-sm border border-gray-200"'];
    
    if (analysis.atomicLevel === 'atoms') {
      styles.push('"inline-flex items-center justify-center"');
    } else if (analysis.atomicLevel === 'molecules') {
      styles.push('"p-4"');
    } else {
      styles.push('"p-6"');
    }

    return styles.join(',\n        ');
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default CodeGenerator; 