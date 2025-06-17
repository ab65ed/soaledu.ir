#!/usr/bin/env node

/**
 * Cleanup Script for Lovable Converter
 * اسکریپت پاک‌سازی ماژول تبدیل Lovable
 */

import * as fs from 'fs';
import * as path from 'path';

interface CleanupOptions {
  removeAll?: boolean;
  keepPrompt?: boolean;
  keepConfig?: boolean;
  verbose?: boolean;
}

class LovableCleanup {
  private options: CleanupOptions;
  private rootPath: string;

  constructor(options: CleanupOptions = {}) {
    this.options = {
      removeAll: false,
      keepPrompt: true,
      keepConfig: false,
      verbose: false,
      ...options,
    };
    
    this.rootPath = process.cwd();
  }

  async cleanup(): Promise<void> {
    console.log('🧹 شروع پاک‌سازی ماژول Lovable Converter...\n');

    try {
      const converterPath = path.join(this.rootPath, 'lovable-converter');
      
      if (!fs.existsSync(converterPath)) {
        console.log('ℹ️ ماژول Lovable Converter یافت نشد.');
        return;
      }

      if (this.options.removeAll) {
        await this.removeDirectory(converterPath);
        console.log('✅ تمام فایل‌های ماژول پاک شدند.');
        return;
      }

      // پاک‌سازی انتخابی
      await this.selectiveCleanup(converterPath);

      console.log('\n✅ پاک‌سازی با موفقیت انجام شد!');
      
    } catch (error) {
      console.error('❌ خطا در پاک‌سازی:', error);
      process.exit(1);
    }
  }

  private async selectiveCleanup(converterPath: string): Promise<void> {
    const itemsToRemove = [
      'node_modules',
      'dist',
      'core',
      'cli.ts',
      'index.ts',
      'package.json',
      'tsconfig.json',
      'cleanup.ts',
    ];

    // فایل‌هایی که ممکن است کاربر بخواهد نگه دارد
    if (!this.options.keepPrompt) {
      itemsToRemove.push('prompt-template.md');
    }

    if (!this.options.keepConfig) {
      itemsToRemove.push('config.ts');
    }

    for (const item of itemsToRemove) {
      const itemPath = path.join(converterPath, item);
      
      if (fs.existsSync(itemPath)) {
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          await this.removeDirectory(itemPath);
          this.log(`🗂️ پوشه حذف شد: ${item}`);
        } else {
          fs.unlinkSync(itemPath);
          this.log(`📄 فایل حذف شد: ${item}`);
        }
      }
    }

    // اگر پوشه خالی شد، آن را هم حذف کن
    const remainingItems = fs.readdirSync(converterPath);
    if (remainingItems.length === 0) {
      fs.rmdirSync(converterPath);
      console.log('🗂️ پوشه اصلی converter حذف شد.');
    } else {
      console.log(`ℹ️ فایل‌های باقی‌مانده: ${remainingItems.join(', ')}`);
    }
  }

  private async removeDirectory(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        await this.removeDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    }

    fs.rmdirSync(dirPath);
  }

  private log(message: string): void {
    if (this.options.verbose) {
      console.log(message);
    }
  }

  static async interactive(): Promise<void> {
    console.log('🎨 Lovable Converter Cleanup Tool');
    console.log('==================================\n');

    // در محیط واقعی، می‌توانید از readline استفاده کنید
    // برای سادگی، از arguments استفاده می‌کنیم
    const args = process.argv.slice(2);
    
    const options: CleanupOptions = {
      removeAll: args.includes('--all'),
      keepPrompt: !args.includes('--remove-prompt'),
      keepConfig: args.includes('--keep-config'),
      verbose: args.includes('--verbose'),
    };

    if (args.includes('--help')) {
      console.log(`
استفاده:
  node cleanup.ts [options]

گزینه‌ها:
  --all                 حذف کامل تمام فایل‌ها
  --remove-prompt       حذف فایل prompt-template.md
  --keep-config         نگه داشتن فایل config.ts
  --verbose             نمایش جزئیات عملیات
  --help               نمایش این راهنما

مثال‌ها:
  # پاک‌سازی معمولی (نگه داشتن prompt)
  node cleanup.ts

  # حذف کامل
  node cleanup.ts --all

  # پاک‌سازی با حذف prompt
  node cleanup.ts --remove-prompt

  # نگه داشتن config
  node cleanup.ts --keep-config --verbose
`);
      return;
    }

    const cleanup = new LovableCleanup(options);
    await cleanup.cleanup();

    console.log('\n💡 نکته: در آینده می‌توانید دوباره ماژول را از repository دانلود کنید.');
  }
}

// اجرای اسکریپت
if (require.main === module) {
  LovableCleanup.interactive().catch(error => {
    console.error('❌ خطا در cleanup:', error);
    process.exit(1);
  });
}

export default LovableCleanup; 