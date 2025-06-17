#!/usr/bin/env node

/**
 * Lovable to Next.js Converter CLI
 * CLI برای تبدیل کدهای Lovable به Next.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { LovableConverter } from './core/converter';
import { defaultConfig } from './config';

interface CLIOptions {
  input?: string;
  output?: string;
  component?: string;
  config?: string;
  test?: boolean;
  build?: boolean;
  verbose?: boolean;
  help?: boolean;
}

class LovableCLI {
  private options: CLIOptions = {};

  constructor() {
    this.parseArguments();
  }

  private parseArguments(): void {
    const args = process.argv.slice(2);
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '-i':
        case '--input':
          this.options.input = nextArg;
          i++;
          break;
        case '-o':
        case '--output':
          this.options.output = nextArg;
          i++;
          break;
        case '-c':
        case '--component':
          this.options.component = nextArg;
          i++;
          break;
        case '--config':
          this.options.config = nextArg;
          i++;
          break;
        case '-t':
        case '--test':
          this.options.test = true;
          break;
        case '-b':
        case '--build':
          this.options.build = true;
          break;
        case '-v':
        case '--verbose':
          this.options.verbose = true;
          break;
        case '-h':
        case '--help':
          this.options.help = true;
          break;
        default:
          if (!arg.startsWith('-')) {
            // اگر فایل input مشخص نشده باشد، اولین argument را به عنوان input در نظر بگیر
            if (!this.options.input) {
              this.options.input = arg;
            }
          }
          break;
      }
    }
  }

  async run(): Promise<void> {
    if (this.options.help) {
      this.showHelp();
      return;
    }

    console.log('🎨 Lovable to Next.js Converter');
    console.log('================================\n');

    try {
      // بارگذاری config
      const config = await this.loadConfig();
      
      // بارگذاری کد Lovable
      const lovableCode = await this.loadLovableCode();
      
      if (!lovableCode) {
        console.error('❌ کد Lovable یافت نشد. لطفاً فایل input را مشخص کنید.');
        process.exit(1);
      }

      // ایجاد converter
      const converter = new LovableConverter(config);
      
      console.log('🚀 شروع تبدیل...\n');
      
      // تبدیل کد
      const result = await converter.convert(lovableCode, this.options.component);
      
      if (result.success) {
        console.log('✅ تبدیل با موفقیت انجام شد!\n');
        this.printResults(result);
      } else {
        console.error('❌ تبدیل با خطا مواجه شد:\n');
        result.errors.forEach(error => {
          console.error(`  - ${error.file}:${error.line} ${error.message}`);
        });
        process.exit(1);
      }

      // پاک‌سازی
      await converter.cleanup();
      
    } catch (error) {
      console.error('❌ خطای غیرمنتظره:', error);
      process.exit(1);
    }
  }

  private async loadConfig(): Promise<any> {
    let config = { ...defaultConfig };

    // اعمال تنظیمات CLI
    if (this.options.test !== undefined) {
      config.build.autoTest = this.options.test;
    }
    
    if (this.options.build !== undefined) {
      config.build.autoBuild = this.options.build;
    }

    // بارگذاری config file در صورت وجود
    if (this.options.config) {
      try {
        const configPath = path.resolve(this.options.config);
        const configFile = await fs.promises.readFile(configPath, 'utf8');
        const userConfig = JSON.parse(configFile);
        config = { ...config, ...userConfig };
        
        console.log(`📋 Config بارگذاری شد: ${configPath}`);
      } catch (error) {
        console.warn(`⚠️ نتوانستیم config file را بارگذاری کنیم: ${this.options.config}`);
      }
    }

    return config;
  }

  private async loadLovableCode(): Promise<string | null> {
    // اگر input مشخص شده باشد، از فایل بخوان
    if (this.options.input) {
      try {
        const inputPath = path.resolve(this.options.input);
        const code = await fs.promises.readFile(inputPath, 'utf8');
        console.log(`📁 کد Lovable بارگذاری شد: ${inputPath}`);
        return code;
      } catch (error) {
        console.error(`❌ نتوانستیم فایل input را بخوانیم: ${this.options.input}`);
        return null;
      }
    }

    // اگر input مشخص نشده، از stdin بخوان
    if (process.stdin.isTTY) {
      console.log('💡 لطفاً کد Lovable خود را وارد کنید (Ctrl+D برای پایان):');
    }

    try {
      const chunks: Buffer[] = [];
      
      return new Promise((resolve, reject) => {
        process.stdin.on('data', (chunk) => {
          chunks.push(chunk);
        });

        process.stdin.on('end', () => {
          const code = Buffer.concat(chunks).toString('utf8').trim();
          resolve(code || null);
        });

        process.stdin.on('error', reject);
        
        // Timeout برای جلوگیری از منتظر ماندن بی‌نهایت
        setTimeout(() => {
          resolve(null);
        }, 5000);
      });
    } catch (error) {
      console.error('❌ خطا در خواندن از stdin:', error);
      return null;
    }
  }

  private printResults(result: any): void {
    console.log('📊 نتایج تبدیل:');
    console.log(`  📁 فایل‌های تولید شده: ${result.files.length}`);
    console.log(`  ⏱️ زمان تبدیل: ${result.performance.conversionTime}ms`);
    console.log(`  📝 خطوط کد: ${result.performance.linesOfCode}`);
    
    if (result.performance.bundleSize) {
      console.log(`  📦 اندازه Bundle: ${(result.performance.bundleSize / 1024).toFixed(2)}KB`);
    }

    console.log('\n📁 فایل‌های ایجاد شده:');
    result.files.forEach((file: any) => {
      const icon = this.getFileIcon(file.type);
      console.log(`  ${icon} ${file.path}`);
    });

    if (result.performance.optimizations.length > 0) {
      console.log('\n🚀 بهینه‌سازی‌های اعمال شده:');
      result.performance.optimizations.forEach((opt: string) => {
        console.log(`  ✅ ${opt}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️ هشدارها:');
      result.warnings.forEach((warning: string) => {
        console.log(`  - ${warning}`);
      });
    }

    if (result.buildResult) {
      console.log('\n🔨 نتایج Build:');
      console.log(`  ✅ وضعیت: ${result.buildResult.success ? 'موفق' : 'ناموفق'}`);
      console.log(`  ⏱️ زمان Build: ${result.buildResult.performance.buildTime}ms`);
      
      if (result.buildResult.performance.bundleSize) {
        console.log(`  📦 Bundle Size: ${(result.buildResult.performance.bundleSize / 1024).toFixed(2)}KB`);
      }
    }
  }

  private getFileIcon(type: string): string {
    const icons = {
      component: '🧩',
      hook: '🪝',
      service: '🔧',
      store: '🗄️',
      type: '📝',
      test: '🧪',
    };
    
    return icons[type as keyof typeof icons] || '📄';
  }

  private showHelp(): void {
    console.log(`
🎨 Lovable to Next.js Converter

استفاده:
  lovable-converter [options] [input-file]

گزینه‌ها:
  -i, --input <file>       فایل ورودی حاوی کد Lovable
  -o, --output <dir>       پوشه خروجی (پیش‌فرض: frontend/src)
  -c, --component <name>   نام کامپوننت (در صورت عدم تشخیص خودکار)
  --config <file>          فایل تنظیمات JSON
  -t, --test              اجرای تست‌ها پس از تبدیل
  -b, --build             بیلد پروژه پس از تبدیل
  -v, --verbose           نمایش جزئیات بیشتر
  -h, --help              نمایش این راهنما

مثال‌ها:
  # تبدیل از فایل
  lovable-converter -i component.jsx -c MyComponent

  # تبدیل با تست و بیلد
  lovable-converter -i component.jsx -t -b

  # تبدیل از stdin
  cat component.jsx | lovable-converter

  # استفاده از config file
  lovable-converter -i component.jsx --config config.json

تنظیمات:
  فایل config.json می‌تواند شامل تنظیمات زیر باشد:
  {
    "performance": {
      "memoization": true,
      "codeSplitting": true
    },
    "testing": {
      "generateTests": true,
      "coverageThreshold": 80
    },
    "build": {
      "autoTest": true,
      "autoBuild": false
    }
  }

برای اطلاعات بیشتر:
  https://github.com/your-repo/lovable-converter
`);
  }
}

// اجرای CLI
if (require.main === module) {
  const cli = new LovableCLI();
  cli.run().catch(error => {
    console.error('❌ خطای CLI:', error);
    process.exit(1);
  });
}

export default LovableCLI; 