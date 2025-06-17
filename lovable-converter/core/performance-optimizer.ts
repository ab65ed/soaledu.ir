/**
 * Performance Optimizer - بهینه‌ساز عملکرد
 */

import { ConversionConfig } from '../config';
import { GeneratedFile } from './converter';

export class PerformanceOptimizer {
  private config: ConversionConfig;
  private appliedOptimizations: string[] = [];

  constructor(config: ConversionConfig) {
    this.config = config;
  }

  async optimize(files: GeneratedFile[]): Promise<GeneratedFile[]> {
    this.appliedOptimizations = [];
    const optimizedFiles = [...files];

    for (let i = 0; i < optimizedFiles.length; i++) {
      optimizedFiles[i] = await this.optimizeFile(optimizedFiles[i]);
    }

    return optimizedFiles;
  }

  private async optimizeFile(file: GeneratedFile): Promise<GeneratedFile> {
    let optimizedContent = file.content;

    if (file.type === 'component') {
      optimizedContent = this.optimizeComponent(optimizedContent);
    } else if (file.type === 'hook') {
      optimizedContent = this.optimizeHook(optimizedContent);
    } else if (file.type === 'service') {
      optimizedContent = this.optimizeService(optimizedContent);
    }

    return {
      ...file,
      content: optimizedContent,
    };
  }

  private optimizeComponent(content: string): string {
    let optimized = content;

    // 1. اضافه کردن React.memo
    if (this.config.performance.memoization && !content.includes('React.memo')) {
      optimized = this.addReactMemo(optimized);
      this.appliedOptimizations.push('React.memo added');
    }

    // 2. بهینه‌سازی event handlers با useCallback
    optimized = this.optimizeEventHandlers(optimized);

    // 3. بهینه‌سازی محاسبات با useMemo
    optimized = this.optimizeComputations(optimized);

    // 4. اضافه کردن lazy loading برای تصاویر
    if (this.config.performance.imageOptimization) {
      optimized = this.optimizeImages(optimized);
      this.appliedOptimizations.push('Image optimization added');
    }

    // 5. اضافه کردن dynamic imports
    if (this.config.performance.codeSplitting) {
      optimized = this.addDynamicImports(optimized);
    }

    return optimized;
  }

  private optimizeHook(content: string): string {
    let optimized = content;

    // 1. بهینه‌سازی dependencies در useCallback و useMemo
    optimized = this.optimizeDependencies(optimized);

    // 2. اضافه کردن debouncing برای API calls
    optimized = this.addDebouncing(optimized);

    // 3. بهینه‌سازی React Query cache
    optimized = this.optimizeReactQueryCache(optimized);

    return optimized;
  }

  private optimizeService(content: string): string {
    let optimized = content;

    // 1. اضافه کردن request caching
    optimized = this.addRequestCaching(optimized);

    // 2. اضافه کردن retry logic
    optimized = this.addRetryLogic(optimized);

    // 3. بهینه‌سازی error handling
    optimized = this.optimizeErrorHandling(optimized);

    return optimized;
  }

  private addReactMemo(content: string): string {
    // اگر کامپوننت قبلاً memo نشده باشد
    if (!content.includes('React.memo')) {
      // پیدا کردن export const ComponentName
      const exportMatch = content.match(/export const (\w+): React\.FC<[^>]+> = \(([^)]+)\) => \{/);
      if (exportMatch) {
        const componentName = exportMatch[1];
        
        // اضافه کردن React.memo
        content = content.replace(
          new RegExp(`export const ${componentName}: React\\.FC<[^>]+> = \\(`),
          `export const ${componentName}: React.FC<${componentName}Props> = React.memo((`
        );
        
        // اضافه کردن پرانتز بسته
        content = content.replace(
          new RegExp(`\\}\\);\\s*${componentName}\\.displayName`),
          `});\n\n${componentName}.displayName`
        );
      }
    }
    
    return content;
  }

  private optimizeEventHandlers(content: string): string {
    // پیدا کردن event handlers که useCallback ندارند
    const handlerRegex = /const (handle\w+) = (\([^)]*\)) => \{([^}]+)\}/g;
    
    return content.replace(handlerRegex, (match, handlerName, params, body) => {
      // اگر قبلاً useCallback نداشته باشد
      if (!match.includes('useCallback')) {
        // استخراج dependencies از body
        const dependencies = this.extractDependencies(body);
        const depsArray = dependencies.length > 0 ? `[${dependencies.join(', ')}]` : '[]';
        
        this.appliedOptimizations.push(`useCallback added to ${handlerName}`);
        
        return `const ${handlerName} = React.useCallback(${params} => {${body}}, ${depsArray})`;
      }
      return match;
    });
  }

  private optimizeComputations(content: string): string {
    // پیدا کردن محاسبات که می‌توانند useMemo شوند
    const computationRegex = /const (\w+) = ([^;]+\.filter\([^;]+|[^;]+\.map\([^;]+|[^;]+\.reduce\([^;]+);/g;
    
    return content.replace(computationRegex, (match, varName, computation) => {
      // اگر قبلاً useMemo نداشته باشد
      if (!match.includes('useMemo')) {
        // استخراج dependencies
        const dependencies = this.extractDependencies(computation);
        const depsArray = dependencies.length > 0 ? `[${dependencies.join(', ')}]` : '[]';
        
        this.appliedOptimizations.push(`useMemo added to ${varName}`);
        
        return `const ${varName} = React.useMemo(() => ${computation}, ${depsArray});`;
      }
      return match;
    });
  }

  private optimizeImages(content: string): string {
    // بهینه‌سازی تگ‌های Image
    return content.replace(
      /<Image\s+([^>]*?)>/g,
      (match, attributes) => {
        if (!attributes.includes('loading=')) {
          attributes += ' loading="lazy"';
        }
        if (!attributes.includes('placeholder=')) {
          attributes += ' placeholder="blur"';
        }
        return `<Image ${attributes}>`;
      }
    );
  }

  private addDynamicImports(content: string): string {
    // اضافه کردن dynamic import برای کامپوننت‌های سنگین
    if (content.includes('HeavyComponent') || content.includes('Chart') || content.includes('Modal')) {
      if (!content.includes('dynamic')) {
        content = content.replace(
          /^(import.*react.*)/m,
          "$1\nimport dynamic from 'next/dynamic';"
        );
        
        this.appliedOptimizations.push('Dynamic imports added');
      }
    }
    
    return content;
  }

  private optimizeDependencies(content: string): string {
    // بهینه‌سازی dependency arrays در hooks
    return content.replace(
      /(useCallback|useMemo)\(([^,]+),\s*\[([^\]]*)\]/g,
      (match, hookName, callback, deps) => {
        // حذف dependencies تکراری
        const uniqueDeps = [...new Set(deps.split(',').map(d => d.trim()).filter(d => d))];
        return `${hookName}(${callback}, [${uniqueDeps.join(', ')}]`;
      }
    );
  }

  private addDebouncing(content: string): string {
    // اضافه کردن debouncing برای search و filter
    if (content.includes('search') || content.includes('filter')) {
      if (!content.includes('useDebounce')) {
        content = content.replace(
          /^(import.*react.*)/m,
          "$1\nimport { useDebounce } from '@/hooks/useDebounce';"
        );
        
        // اضافه کردن debounced value
        content = content.replace(
          /const \[searchQuery, setSearchQuery\] = useState\([^)]*\);/,
          `const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);`
        );
        
        this.appliedOptimizations.push('Debouncing added for search');
      }
    }
    
    return content;
  }

  private optimizeReactQueryCache(content: string): string {
    // بهینه‌سازی تنظیمات cache در React Query
    return content.replace(
      /useQuery\(\{([^}]+)\}\)/g,
      (match, options) => {
        // اضافه کردن cache optimizations اگر وجود نداشته باشند
        if (!options.includes('staleTime')) {
          options += ',\n    staleTime: 5 * 60 * 1000, // 5 minutes';
        }
        if (!options.includes('cacheTime')) {
          options += ',\n    cacheTime: 10 * 60 * 1000, // 10 minutes';
        }
        if (!options.includes('refetchOnWindowFocus')) {
          options += ',\n    refetchOnWindowFocus: false';
        }
        
        this.appliedOptimizations.push('React Query cache optimized');
        
        return `useQuery({${options}})`;
      }
    );
  }

  private addRequestCaching(content: string): string {
    // اضافه کردن caching برای HTTP requests
    if (content.includes('class') && content.includes('Service')) {
      if (!content.includes('cache')) {
        // اضافه کردن cache property
        content = content.replace(
          /class \w+Service \{/,
          `class $&
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes`
        );
        
        // اضافه کردن cache logic در request method
        content = content.replace(
          /private async request<T>\(/,
          `private getCacheKey(endpoint: string, options: RequestInit): string {
    return \`\${endpoint}-\${JSON.stringify(options)}\`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private async request<T>(`
        );
        
        this.appliedOptimizations.push('Request caching added');
      }
    }
    
    return content;
  }

  private addRetryLogic(content: string): string {
    // اضافه کردن retry logic برای failed requests
    if (content.includes('fetch(') && !content.includes('retry')) {
      content = content.replace(
        /try \{[\s\S]*?const response = await fetch\([^)]+\);/,
        `try {
      let response;
      let retries = 3;
      
      while (retries > 0) {
        try {
          response = await fetch(url, config);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
        }
      }`
      );
      
      this.appliedOptimizations.push('Retry logic added');
    }
    
    return content;
  }

  private optimizeErrorHandling(content: string): string {
    // بهینه‌سازی error handling
    return content.replace(
      /catch \(error\) \{[\s\S]*?\}/g,
      `catch (error) {
      console.error(\`API Error (\${url}):\`, error);
      
      // Enhanced error handling
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('خطای اتصال به شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('خطای نامشخص در درخواست API');
    }`
    );
  }

  private extractDependencies(code: string): string[] {
    const dependencies: string[] = [];
    
    // استخراج متغیرهایی که در کد استفاده می‌شوند
    const variableRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    let match;
    
    while ((match = variableRegex.exec(code)) !== null) {
      const variable = match[1];
      
      // فیلتر کردن کلمات کلیدی و توابع built-in
      if (!this.isBuiltInOrKeyword(variable) && !dependencies.includes(variable)) {
        dependencies.push(variable);
      }
    }
    
    return dependencies;
  }

  private isBuiltInOrKeyword(word: string): boolean {
    const builtIns = [
      'console', 'window', 'document', 'localStorage', 'sessionStorage',
      'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
      'fetch', 'Promise', 'Array', 'Object', 'String', 'Number', 'Boolean',
      'Date', 'Math', 'JSON', 'Error', 'RegExp',
      'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
      'function', 'return', 'var', 'let', 'const', 'class', 'extends',
      'import', 'export', 'default', 'from', 'as', 'try', 'catch', 'finally',
      'throw', 'new', 'this', 'super', 'typeof', 'instanceof', 'in', 'of',
      'true', 'false', 'null', 'undefined', 'void'
    ];
    
    return builtIns.includes(word);
  }

  getAppliedOptimizations(): string[] {
    return this.appliedOptimizations;
  }
}

export default PerformanceOptimizer; 