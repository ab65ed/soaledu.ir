/**
 * Lovable Converter Configuration
 * تنظیمات ماژول تبدیل Lovable به Next.js
 */

import { theme } from '../frontend/src/utils/theme';

export interface ConversionConfig {
  // تنظیمات کلی
  general: {
    projectName: string;
    version: string;
    rtlSupport: boolean;
    persianSupport: boolean;
    strictMode: boolean;
  };
  
  // تنظیمات فایل‌ها
  files: {
    inputDir: string;
    outputDir: string;
    tempDir: string;
    backupDir: string;
    extensions: string[];
  };
  
  // تنظیمات کامپوننت‌ها
  components: {
    atomicDesign: boolean;
    memoization: boolean;
    forwardRef: boolean;
    displayName: boolean;
    propTypes: boolean;
    defaultProps: boolean;
  };
  
  // تنظیمات Performance
  performance: {
    lazyLoading: boolean;
    codeSplitting: boolean;
    memoization: boolean;
    virtualization: boolean;
    imageOptimization: boolean;
    bundleAnalysis: boolean;
  };
  
  // تنظیمات State Management
  stateManagement: {
    zustand: boolean;
    reactQuery: boolean;
    optimisticUpdates: boolean;
    errorBoundaries: boolean;
    loadingStates: boolean;
    cacheStrategies: CacheStrategy[];
  };
  
  // تنظیمات Theme
  theme: {
    useProjectTheme: boolean;
    colorMapping: boolean;
    responsiveDesign: boolean;
    darkMode: boolean;
    customProperties: boolean;
  };
  
  // تنظیمات Testing
  testing: {
    generateTests: boolean;
    testFramework: 'jest' | 'vitest';
    coverageThreshold: number;
    e2eTests: boolean;
    accessibilityTests: boolean;
  };
  
  // تنظیمات API
  api: {
    generateServices: boolean;
    generateHooks: boolean;
    generateTypes: boolean;
    errorHandling: boolean;
    retryLogic: boolean;
    caching: boolean;
  };
  
  // تنظیمات Animation
  animation: {
    framerMotion: boolean;
    presetAnimations: boolean;
    performanceMode: boolean;
    reducedMotion: boolean;
  };
  
  // تنظیمات Build
  build: {
    autoTest: boolean;
    autoBuild: boolean;
    performanceCheck: boolean;
    bundleSize: boolean;
    lighthouse: boolean;
  };
}

export interface CacheStrategy {
  name: string;
  staleTime: number;
  cacheTime: number;
  refetchInterval?: number;
  refetchOnWindowFocus: boolean;
  retry: number;
}

// پیکربندی پیش‌فرض
export const defaultConfig: ConversionConfig = {
  general: {
    projectName: 'SoalEdu.ir',
    version: '1.0.0',
    rtlSupport: true,
    persianSupport: true,
    strictMode: true,
  },
  
  files: {
    inputDir: './lovable-input',
    outputDir: './frontend/src',
    tempDir: './lovable-temp',
    backupDir: './lovable-backup',
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'],
  },
  
  components: {
    atomicDesign: true,
    memoization: true,
    forwardRef: true,
    displayName: true,
    propTypes: false, // استفاده از TypeScript
    defaultProps: true,
  },
  
  performance: {
    lazyLoading: true,
    codeSplitting: true,
    memoization: true,
    virtualization: true,
    imageOptimization: true,
    bundleAnalysis: true,
  },
  
  stateManagement: {
    zustand: true,
    reactQuery: true,
    optimisticUpdates: true,
    errorBoundaries: true,
    loadingStates: true,
    cacheStrategies: [
      {
        name: 'default',
        staleTime: 5 * 60 * 1000, // 5 دقیقه
        cacheTime: 10 * 60 * 1000, // 10 دقیقه
        refetchOnWindowFocus: false,
        retry: 3,
      },
      {
        name: 'realtime',
        staleTime: 0,
        cacheTime: 1 * 60 * 1000, // 1 دقیقه
        refetchInterval: 30 * 1000, // 30 ثانیه
        refetchOnWindowFocus: true,
        retry: 5,
      },
      {
        name: 'static',
        staleTime: 60 * 60 * 1000, // 1 ساعت
        cacheTime: 24 * 60 * 60 * 1000, // 24 ساعت
        refetchOnWindowFocus: false,
        retry: 1,
      },
    ],
  },
  
  theme: {
    useProjectTheme: true,
    colorMapping: true,
    responsiveDesign: true,
    darkMode: false,
    customProperties: true,
  },
  
  testing: {
    generateTests: true,
    testFramework: 'jest',
    coverageThreshold: 80,
    e2eTests: true,
    accessibilityTests: true,
  },
  
  api: {
    generateServices: true,
    generateHooks: true,
    generateTypes: true,
    errorHandling: true,
    retryLogic: true,
    caching: true,
  },
  
  animation: {
    framerMotion: true,
    presetAnimations: true,
    performanceMode: true,
    reducedMotion: true,
  },
  
  build: {
    autoTest: true,
    autoBuild: true,
    performanceCheck: true,
    bundleSize: true,
    lighthouse: false, // برای محیط production
  },
};

// تنظیمات تبدیل رنگ‌ها
export const colorMappings = {
  // رنگ‌های پایه Lovable به رنگ‌های پروژه
  'bg-white': 'bg-white',
  'bg-gray-50': 'bg-gray-50',
  'bg-gray-100': 'bg-gray-100',
  'bg-gray-200': 'bg-gray-200',
  'bg-gray-300': 'bg-gray-300',
  'bg-gray-400': 'bg-gray-400',
  'bg-gray-500': 'bg-gray-500',
  'bg-gray-600': 'bg-gray-600',
  'bg-gray-700': 'bg-gray-700',
  'bg-gray-800': 'bg-gray-800',
  'bg-gray-900': 'bg-gray-900',
  'bg-black': 'bg-black',
  
  // رنگ‌های اصلی
  'bg-blue-50': 'bg-secondary-50',
  'bg-blue-100': 'bg-secondary-100',
  'bg-blue-200': 'bg-secondary-200',
  'bg-blue-300': 'bg-secondary-300',
  'bg-blue-400': 'bg-secondary-400',
  'bg-blue-500': 'bg-secondary-500',
  'bg-blue-600': 'bg-secondary-600',
  'bg-blue-700': 'bg-secondary-700',
  'bg-blue-800': 'bg-secondary-800',
  'bg-blue-900': 'bg-secondary-900',
  
  'bg-indigo-50': 'bg-secondary-50',
  'bg-indigo-100': 'bg-secondary-100',
  'bg-indigo-200': 'bg-secondary-200',
  'bg-indigo-300': 'bg-secondary-300',
  'bg-indigo-400': 'bg-secondary-400',
  'bg-indigo-500': 'bg-secondary-500',
  'bg-indigo-600': 'bg-secondary-600',
  'bg-indigo-700': 'bg-secondary-700',
  'bg-indigo-800': 'bg-secondary-800',
  'bg-indigo-900': 'bg-secondary-900',
  
  'bg-purple-50': 'bg-accent-50',
  'bg-purple-100': 'bg-accent-100',
  'bg-purple-200': 'bg-accent-200',
  'bg-purple-300': 'bg-accent-300',
  'bg-purple-400': 'bg-accent-400',
  'bg-purple-500': 'bg-accent-500',
  'bg-purple-600': 'bg-accent-600',
  'bg-purple-700': 'bg-accent-700',
  'bg-purple-800': 'bg-accent-800',
  'bg-purple-900': 'bg-accent-900',
  
  'bg-green-50': 'bg-primary-50',
  'bg-green-100': 'bg-primary-100',
  'bg-green-200': 'bg-primary-200',
  'bg-green-300': 'bg-primary-300',
  'bg-green-400': 'bg-primary-400',
  'bg-green-500': 'bg-primary-500',
  'bg-green-600': 'bg-primary-600',
  'bg-green-700': 'bg-primary-700',
  'bg-green-800': 'bg-primary-800',
  'bg-green-900': 'bg-primary-900',
  
  'bg-yellow-50': 'bg-quaternary-50',
  'bg-yellow-100': 'bg-quaternary-100',
  'bg-yellow-200': 'bg-quaternary-200',
  'bg-yellow-300': 'bg-quaternary-300',
  'bg-yellow-400': 'bg-quaternary-400',
  'bg-yellow-500': 'bg-quaternary-500',
  'bg-yellow-600': 'bg-quaternary-600',
  'bg-yellow-700': 'bg-quaternary-700',
  'bg-yellow-800': 'bg-quaternary-800',
  'bg-yellow-900': 'bg-quaternary-900',
  
  'bg-orange-50': 'bg-quaternary-50',
  'bg-orange-100': 'bg-quaternary-100',
  'bg-orange-200': 'bg-quaternary-200',
  'bg-orange-300': 'bg-quaternary-300',
  'bg-orange-400': 'bg-quaternary-400',
  'bg-orange-500': 'bg-quaternary-500',
  'bg-orange-600': 'bg-quaternary-600',
  'bg-orange-700': 'bg-quaternary-700',
  'bg-orange-800': 'bg-quaternary-800',
  'bg-orange-900': 'bg-quaternary-900',
};

// تنظیمات کلاس‌های Tailwind
export const tailwindMappings = {
  // متن
  'text-blue-': 'text-secondary-',
  'text-indigo-': 'text-secondary-',
  'text-purple-': 'text-accent-',
  'text-green-': 'text-primary-',
  'text-yellow-': 'text-quaternary-',
  'text-orange-': 'text-quaternary-',
  
  // border
  'border-blue-': 'border-secondary-',
  'border-indigo-': 'border-secondary-',
  'border-purple-': 'border-accent-',
  'border-green-': 'border-primary-',
  'border-yellow-': 'border-quaternary-',
  'border-orange-': 'border-quaternary-',
  
  // ring
  'ring-blue-': 'ring-secondary-',
  'ring-indigo-': 'ring-secondary-',
  'ring-purple-': 'ring-accent-',
  'ring-green-': 'ring-primary-',
  'ring-yellow-': 'ring-quaternary-',
  'ring-orange-': 'ring-quaternary-',
  
  // hover states
  'hover:bg-blue-': 'hover:bg-secondary-',
  'hover:bg-indigo-': 'hover:bg-secondary-',
  'hover:bg-purple-': 'hover:bg-accent-',
  'hover:bg-green-': 'hover:bg-primary-',
  'hover:bg-yellow-': 'hover:bg-quaternary-',
  'hover:bg-orange-': 'hover:bg-quaternary-',
  
  'hover:text-blue-': 'hover:text-secondary-',
  'hover:text-indigo-': 'hover:text-secondary-',
  'hover:text-purple-': 'hover:text-accent-',
  'hover:text-green-': 'hover:text-primary-',
  'hover:text-yellow-': 'hover:text-quaternary-',
  'hover:text-orange-': 'hover:text-quaternary-',
};

// تنظیمات انیمیشن‌های پیش‌فرض
export const defaultAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.8,
      ease: [0.68, -0.55, 0.265, 1.55],
    },
  },
};

// تنظیمات Atomic Design
export const atomicLevels = {
  atoms: [
    'Button',
    'Input',
    'Label',
    'Icon',
    'Avatar',
    'Badge',
    'Spinner',
    'Divider',
    'Image',
    'Link',
  ],
  
  molecules: [
    'SearchBox',
    'FormField',
    'Card',
    'Modal',
    'Dropdown',
    'Pagination',
    'Breadcrumb',
    'Toast',
    'Tooltip',
    'Progress',
  ],
  
  organisms: [
    'Header',
    'Footer',
    'Sidebar',
    'Navigation',
    'Form',
    'Table',
    'Gallery',
    'Chart',
    'Calendar',
    'Dashboard',
  ],
};

// تنظیمات TypeScript
export const typeScriptConfig = {
  strict: true,
  noImplicitAny: true,
  noImplicitReturns: true,
  noImplicitThis: true,
  noUnusedLocals: false, // برای development
  noUnusedParameters: false, // برای development
  exactOptionalPropertyTypes: true,
  noUncheckedIndexedAccess: true,
};

// تنظیمات ESLint
export const eslintRules = {
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': 'warn',
  'prefer-const': 'error',
  'react/jsx-no-undef': 'error',
  'react/display-name': 'off',
  'react-hooks/exhaustive-deps': 'warn',
  '@next/next/no-html-link-for-pages': 'off',
};

export { theme };
export default defaultConfig; 