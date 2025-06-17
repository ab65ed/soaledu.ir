/**
 * Build Manager - مدیر بیلد و تست
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { ConversionConfig } from '../config';
import { BuildResult, ChunkInfo } from './converter';

const execAsync = promisify(exec);

export class BuildManager {
  private config: ConversionConfig;

  constructor(config: ConversionConfig) {
    this.config = config;
  }

  async buildAndTest(): Promise<BuildResult> {
    const result: BuildResult = {
      success: false,
      errors: [],
      warnings: [],
      performance: {
        buildTime: 0,
        bundleSize: 0,
        chunks: [],
      },
    };

    try {
      console.log('🧪 اجرای تست‌ها...');
      
      // 1. اجرای تست‌ها
      if (this.config.build.autoTest) {
        const testResult = await this.runTests();
        if (!testResult.success) {
          result.errors.push(...testResult.errors);
          result.warnings.push(...testResult.warnings);
        }
      }

      // 2. بیلد پروژه
      if (this.config.build.autoBuild) {
        console.log('🔨 بیلد پروژه...');
        const buildResult = await this.buildProject();
        
        result.performance.buildTime = buildResult.buildTime;
        result.performance.bundleSize = buildResult.bundleSize;
        result.performance.chunks = buildResult.chunks;
        
        if (!buildResult.success) {
          result.errors.push(...buildResult.errors);
        }
      }

      // 3. بررسی Performance
      if (this.config.build.performanceCheck) {
        console.log('📊 بررسی Performance...');
        const perfResult = await this.checkPerformance();
        result.warnings.push(...perfResult.warnings);
      }

      // 4. تجزیه Bundle Size
      if (this.config.build.bundleSize) {
        console.log('📦 تجزیه Bundle Size...');
        const bundleAnalysis = await this.analyzeBundleSize();
        result.performance.chunks = bundleAnalysis.chunks;
      }

      result.success = result.errors.length === 0;

    } catch (error) {
      console.error('❌ خطا در بیلد:', error);
      result.errors.push(error instanceof Error ? error.message : 'خطای نامشخص');
    }

    return result;
  }

  private async runTests(): Promise<{ success: boolean; errors: string[]; warnings: string[] }> {
    const result = { success: false, errors: [] as string[], warnings: [] as string[] };

    try {
      // اجرای Jest tests
      const { stdout, stderr } = await execAsync('cd frontend && npm run test -- --watchAll=false --coverage');
      
      console.log('✅ تست‌ها با موفقیت اجرا شدند');
      
      // بررسی coverage threshold
      if (this.config.testing.coverageThreshold > 0) {
        const coverageMatch = stdout.match(/All files[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*(\d+\.?\d*)/);
        if (coverageMatch) {
          const coverage = parseFloat(coverageMatch[1]);
          if (coverage < this.config.testing.coverageThreshold) {
            result.warnings.push(`Coverage ${coverage}% کمتر از حد مطلوب ${this.config.testing.coverageThreshold}%`);
          }
        }
      }
      
      result.success = true;
      
    } catch (error: any) {
      console.error('❌ خطا در اجرای تست‌ها:', error.message);
      result.errors.push(`Test execution failed: ${error.message}`);
      
      // تجزیه خطاهای Jest
      if (error.stdout) {
        const failedTests = this.parseJestErrors(error.stdout);
        result.errors.push(...failedTests);
      }
    }

    return result;
  }

  private async buildProject(): Promise<{
    success: boolean;
    errors: string[];
    buildTime: number;
    bundleSize: number;
    chunks: ChunkInfo[];
  }> {
    const startTime = Date.now();
    const result = {
      success: false,
      errors: [] as string[],
      buildTime: 0,
      bundleSize: 0,
      chunks: [] as ChunkInfo[],
    };

    try {
      // بیلد Next.js
      const { stdout, stderr } = await execAsync('cd frontend && npm run build');
      
      result.buildTime = Date.now() - startTime;
      result.success = true;
      
      console.log('✅ بیلد با موفقیت انجام شد');
      
      // استخراج اطلاعات bundle size از خروجی Next.js
      const bundleInfo = this.parseBuildOutput(stdout);
      result.bundleSize = bundleInfo.totalSize;
      result.chunks = bundleInfo.chunks;
      
    } catch (error: any) {
      console.error('❌ خطا در بیلد:', error.message);
      result.buildTime = Date.now() - startTime;
      result.errors.push(`Build failed: ${error.message}`);
      
      // تجزیه خطاهای TypeScript/ESLint
      if (error.stdout || error.stderr) {
        const buildErrors = this.parseBuildErrors(error.stdout + error.stderr);
        result.errors.push(...buildErrors);
      }
    }

    return result;
  }

  private async checkPerformance(): Promise<{ warnings: string[] }> {
    const warnings: string[] = [];

    try {
      // بررسی اندازه فایل‌های static
      const { stdout } = await execAsync('cd frontend && find .next/static -name "*.js" -exec wc -c {} + | tail -1');
      const totalSize = parseInt(stdout.trim().split(/\s+/)[0]);
      
      // هشدار برای bundle size بزرگ
      if (totalSize > 1024 * 1024) { // 1MB
        warnings.push(`Bundle size بزرگ: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      }
      
      // بررسی تعداد chunks
      const { stdout: chunkCount } = await execAsync('cd frontend && find .next/static -name "*.js" | wc -l');
      const chunks = parseInt(chunkCount.trim());
      
      if (chunks > 50) {
        warnings.push(`تعداد chunks زیاد: ${chunks}`);
      }
      
    } catch (error) {
      console.warn('⚠️ نتوانستیم performance را بررسی کنیم:', error);
    }

    return { warnings };
  }

  private async analyzeBundleSize(): Promise<{ chunks: ChunkInfo[] }> {
    const chunks: ChunkInfo[] = [];

    try {
      // تجزیه bundle با webpack-bundle-analyzer
      if (this.config.performance.bundleAnalysis) {
        const { stdout } = await execAsync('cd frontend && npx webpack-bundle-analyzer .next/static/chunks/*.js --mode json');
        
        // پردازش خروجی JSON
        try {
          const analysis = JSON.parse(stdout);
          // تبدیل به format مورد نظر
          // این بخش بسته به format خروجی webpack-bundle-analyzer تنظیم می‌شود
        } catch (parseError) {
          console.warn('⚠️ نتوانستیم bundle analysis را parse کنیم');
        }
      }
      
      // روش ساده: لیست فایل‌ها و اندازه‌شان
      const { stdout } = await execAsync('cd frontend && find .next/static -name "*.js" -exec ls -la {} \\; | awk \'{print $5 " " $9}\'');
      
      const lines = stdout.trim().split('\n');
      lines.forEach(line => {
        const [size, name] = line.split(' ');
        if (size && name) {
          chunks.push({
            name: name.split('/').pop() || name,
            size: parseInt(size),
            gzipSize: Math.floor(parseInt(size) * 0.3), // تخمین gzip
          });
        }
      });
      
    } catch (error) {
      console.warn('⚠️ نتوانستیم bundle size را تجزیه کنیم:', error);
    }

    return { chunks };
  }

  private parseJestErrors(output: string): string[] {
    const errors: string[] = [];
    
    // پیدا کردن خطوهای شامل FAIL
    const failLines = output.split('\n').filter(line => line.includes('FAIL'));
    failLines.forEach(line => {
      errors.push(line.trim());
    });
    
    // پیدا کردن خطاهای detailed
    const errorSections = output.split('● ').slice(1);
    errorSections.forEach(section => {
      const firstLine = section.split('\n')[0];
      if (firstLine) {
        errors.push(`● ${firstLine}`);
      }
    });
    
    return errors;
  }

  private parseBuildErrors(output: string): string[] {
    const errors: string[] = [];
    
    // خطاهای TypeScript
    const tsErrors = output.match(/error TS\d+: .+/g);
    if (tsErrors) {
      errors.push(...tsErrors);
    }
    
    // خطاهای ESLint
    const eslintErrors = output.match(/\d+:\d+\s+error\s+.+/g);
    if (eslintErrors) {
      errors.push(...eslintErrors);
    }
    
    // خطاهای Next.js
    const nextErrors = output.match(/Error: .+/g);
    if (nextErrors) {
      errors.push(...nextErrors);
    }
    
    return errors;
  }

  private parseBuildOutput(output: string): { totalSize: number; chunks: ChunkInfo[] } {
    const chunks: ChunkInfo[] = [];
    let totalSize = 0;
    
    try {
      // پیدا کردن جدول bundle size در خروجی Next.js
      const lines = output.split('\n');
      let inBundleSection = false;
      
      lines.forEach(line => {
        if (line.includes('Route (pages)') || line.includes('Size')) {
          inBundleSection = true;
          return;
        }
        
        if (inBundleSection && line.includes('kB')) {
          // استخراج اطلاعات chunk
          const sizeMatch = line.match(/(\d+(?:\.\d+)?)\s*kB/g);
          if (sizeMatch) {
            const sizes = sizeMatch.map(s => parseFloat(s.replace(/[^\d.]/g, '')));
            const chunkSize = sizes[0] * 1024; // تبدیل kB به byte
            
            chunks.push({
              name: line.trim().split(/\s+/)[0] || 'unknown',
              size: chunkSize,
              gzipSize: sizes[1] ? sizes[1] * 1024 : chunkSize * 0.3,
            });
            
            totalSize += chunkSize;
          }
        }
      });
      
    } catch (error) {
      console.warn('⚠️ نتوانستیم خروجی build را parse کنیم:', error);
    }
    
    return { totalSize, chunks };
  }
}

export default BuildManager; 