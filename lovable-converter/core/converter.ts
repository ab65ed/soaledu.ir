/**
 * Lovable to Next.js Converter - Core Engine
 * موتور اصلی تبدیل کدهای Lovable به Next.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { ConversionConfig, defaultConfig, colorMappings, tailwindMappings, defaultAnimations, atomicLevels } from '../config';
import { ComponentAnalyzer } from './analyzer';
import { CodeGenerator } from './generator';
import { TestGenerator } from './test-generator';
import { PerformanceOptimizer } from './performance-optimizer';
import { BuildManager } from './build-manager';

export interface ConversionResult {
  success: boolean;
  files: GeneratedFile[];
  errors: ConversionError[];
  warnings: string[];
  performance: PerformanceMetrics;
  buildResult?: BuildResult;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'hook' | 'service' | 'store' | 'type' | 'test';
  atomicLevel?: 'atoms' | 'molecules' | 'organisms';
}

export interface ConversionError {
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface PerformanceMetrics {
  conversionTime: number;
  filesProcessed: number;
  linesOfCode: number;
  bundleSize?: number;
  optimizations: string[];
}

export interface BuildResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  performance: {
    buildTime: number;
    bundleSize: number;
    chunks: ChunkInfo[];
  };
}

export interface ChunkInfo {
  name: string;
  size: number;
  gzipSize: number;
}

export class LovableConverter {
  private config: ConversionConfig;
  private analyzer: ComponentAnalyzer;
  private generator: CodeGenerator;
  private testGenerator: TestGenerator;
  private optimizer: PerformanceOptimizer;
  private buildManager: BuildManager;

  constructor(config: Partial<ConversionConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.analyzer = new ComponentAnalyzer(this.config);
    this.generator = new CodeGenerator(this.config);
    this.testGenerator = new TestGenerator(this.config);
    this.optimizer = new PerformanceOptimizer(this.config);
    this.buildManager = new BuildManager(this.config);
  }

  /**
   * تبدیل کد Lovable به Next.js
   */
  async convert(lovableCode: string, componentName?: string): Promise<ConversionResult> {
    const startTime = Date.now();
    const result: ConversionResult = {
      success: false,
      files: [],
      errors: [],
      warnings: [],
      performance: {
        conversionTime: 0,
        filesProcessed: 0,
        linesOfCode: 0,
        optimizations: [],
      },
    };

    try {
      console.log('🎨 شروع تبدیل کد Lovable به Next.js...');

      // 1. تجزیه و تحلیل کد
      console.log('🔍 تجزیه و تحلیل کد...');
      const analysis = await this.analyzer.analyze(lovableCode, componentName);
      
      if (analysis.errors.length > 0) {
        result.errors.push(...analysis.errors);
        result.warnings.push('خطاهایی در تجزیه کد یافت شد');
      }

      // 2. تولید کدهای Next.js
      console.log('⚙️ تولید کدهای Next.js...');
      const generatedFiles = await this.generator.generate(analysis);
      result.files.push(...generatedFiles);

      // 3. تولید تست‌ها
      if (this.config.testing.generateTests) {
        console.log('🧪 تولید تست‌ها...');
        const testFiles = await this.testGenerator.generate(analysis, generatedFiles);
        result.files.push(...testFiles);
      }

      // 4. بهینه‌سازی Performance
      console.log('🚀 بهینه‌سازی Performance...');
      const optimizedFiles = await this.optimizer.optimize(result.files);
      result.files = optimizedFiles;
      result.performance.optimizations = this.optimizer.getAppliedOptimizations();

      // 5. نوشتن فایل‌ها
      console.log('📝 نوشتن فایل‌ها...');
      await this.writeFiles(result.files);

      // 6. اجرای تست‌ها و بیلد
      if (this.config.build.autoTest || this.config.build.autoBuild) {
        console.log('🔨 اجرای تست و بیلد...');
        result.buildResult = await this.buildManager.buildAndTest();
        
        if (!result.buildResult.success) {
          result.errors.push({
            file: 'build',
            line: 0,
            message: 'خطا در بیلد پروژه',
            severity: 'error',
          });
        }
      }

      // 7. محاسبه متریک‌های نهایی
      result.performance.conversionTime = Date.now() - startTime;
      result.performance.filesProcessed = result.files.length;
      result.performance.linesOfCode = this.calculateLinesOfCode(result.files);
      result.performance.bundleSize = result.buildResult?.performance.bundleSize;

      result.success = result.errors.length === 0;

      console.log('✅ تبدیل با موفقیت انجام شد!');
      this.printSummary(result);

    } catch (error) {
      console.error('❌ خطا در تبدیل:', error);
      result.errors.push({
        file: 'converter',
        line: 0,
        message: error instanceof Error ? error.message : 'خطای نامشخص',
        severity: 'error',
      });
    }

    return result;
  }

  /**
   * تبدیل کلاس‌های Tailwind
   */
  private convertTailwindClasses(className: string): string {
    let convertedClass = className;

    // تبدیل رنگ‌ها
    Object.entries(colorMappings).forEach(([lovable, nextjs]) => {
      convertedClass = convertedClass.replace(new RegExp(lovable, 'g'), nextjs);
    });

    // تبدیل کلاس‌های Tailwind
    Object.entries(tailwindMappings).forEach(([lovable, nextjs]) => {
      convertedClass = convertedClass.replace(new RegExp(lovable, 'g'), nextjs);
    });

    // اضافه کردن فونت فارسی
    if (!convertedClass.includes('font-iran-sans')) {
      convertedClass += ' font-iran-sans';
    }

    return convertedClass;
  }

  /**
   * تبدیل imports
   */
  private convertImports(code: string): string {
    return code
      // React Router به Next.js
      .replace(/import.*from ['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';")
      .replace(/useNavigate/g, 'useRouter')
      .replace(/navigate\(/g, 'router.push(')
      
      // متغیرهای محیطی
      .replace(/import\.meta\.env\.VITE_/g, 'process.env.NEXT_PUBLIC_')
      
      // تصاویر
      .replace(/import\s+(\w+)\s+from\s+['"]\.\.\/assets\/([^'"]+)['"];?/g, 
        "import $1 from '../../../public/images/$2';")
      
      // اضافه کردن 'use client' برای کامپوننت‌های تعاملی
      .replace(/^(import.*react.*)/m, "'use client';\n\n$1");
  }

  /**
   * تبدیل JSX Elements
   */
  private convertJSXElements(code: string): string {
    return code
      // تبدیل img به Image
      .replace(/<img\s+([^>]*?)src=\{([^}]+)\}([^>]*?)>/g, 
        '<Image src={$2} width={500} height={300} $1 $3>')
      
      // اضافه کردن alt برای تصاویر
      .replace(/<Image\s+([^>]*?)(?!.*alt=)([^>]*?)>/g, 
        '<Image alt="تصویر" $1 $2>')
      
      // تبدیل کلاس‌ها
      .replace(/className=['"]([^'"]+)['"]/g, (match, classes) => {
        const convertedClasses = this.convertTailwindClasses(classes);
        return `className="${convertedClasses}"`;
      });
  }

  /**
   * اضافه کردن انیمیشن‌های Framer Motion
   */
  private addFramerMotionAnimations(code: string, componentName: string): string {
    if (!this.config.animation.framerMotion) return code;

    const animationType = this.getAnimationTypeForComponent(componentName);
    const animation = defaultAnimations[animationType] || defaultAnimations.fadeIn;

    // اضافه کردن import
    if (!code.includes("import { motion }")) {
      code = code.replace(/^(import.*react.*)/m, "$1\nimport { motion } from 'framer-motion';");
    }

    // تبدیل div اصلی به motion.div
    code = code.replace(
      /return\s*\(\s*<div/,
      `return (\n    <motion.div\n      initial={${JSON.stringify(animation.initial)}}\n      animate={${JSON.stringify(animation.animate)}}\n      transition={${JSON.stringify(animation.transition)}}`
    );

    code = code.replace(/<\/div>\s*\);?\s*$/, '</motion.div>\n  );\n');

    return code;
  }

  /**
   * تعیین نوع انیمیشن بر اساس نام کامپوننت
   */
  private getAnimationTypeForComponent(componentName: string): keyof typeof defaultAnimations {
    const name = componentName.toLowerCase();
    
    if (name.includes('modal') || name.includes('popup')) return 'scale';
    if (name.includes('card') || name.includes('item')) return 'slideUp';
    if (name.includes('header') || name.includes('nav')) return 'slideDown';
    if (name.includes('sidebar')) return 'slideRight';
    if (name.includes('button')) return 'bounce';
    
    return 'fadeIn';
  }

  /**
   * تعیین سطح Atomic Design
   */
  private determineAtomicLevel(componentName: string): 'atoms' | 'molecules' | 'organisms' {
    const name = componentName.toLowerCase();
    
    if (atomicLevels.atoms.some(atom => name.includes(atom.toLowerCase()))) {
      return 'atoms';
    }
    
    if (atomicLevels.molecules.some(molecule => name.includes(molecule.toLowerCase()))) {
      return 'molecules';
    }
    
    return 'organisms';
  }

  /**
   * نوشتن فایل‌ها در سیستم
   */
  private async writeFiles(files: GeneratedFile[]): Promise<void> {
    for (const file of files) {
      const fullPath = path.join(process.cwd(), file.path);
      const dir = path.dirname(fullPath);
      
      // ایجاد پوشه در صورت عدم وجود
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // نوشتن فایل
      fs.writeFileSync(fullPath, file.content, 'utf8');
      console.log(`✅ فایل ایجاد شد: ${file.path}`);
    }
  }

  /**
   * محاسبه تعداد خطوط کد
   */
  private calculateLinesOfCode(files: GeneratedFile[]): number {
    return files.reduce((total, file) => {
      return total + file.content.split('\n').length;
    }, 0);
  }

  /**
   * چاپ خلاصه نتایج
   */
  private printSummary(result: ConversionResult): void {
    console.log('\n📊 خلاصه تبدیل:');
    console.log(`✅ وضعیت: ${result.success ? 'موفق' : 'ناموفق'}`);
    console.log(`📁 فایل‌های تولید شده: ${result.files.length}`);
    console.log(`⏱️ زمان تبدیل: ${result.performance.conversionTime}ms`);
    console.log(`📝 خطوط کد: ${result.performance.linesOfCode}`);
    
    if (result.performance.bundleSize) {
      console.log(`📦 اندازه Bundle: ${(result.performance.bundleSize / 1024).toFixed(2)}KB`);
    }
    
    if (result.errors.length > 0) {
      console.log(`❌ خطاها: ${result.errors.length}`);
      result.errors.forEach(error => {
        console.log(`   - ${error.file}:${error.line} ${error.message}`);
      });
    }
    
    if (result.warnings.length > 0) {
      console.log(`⚠️ هشدارها: ${result.warnings.length}`);
      result.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
    }
    
    if (result.performance.optimizations.length > 0) {
      console.log(`🚀 بهینه‌سازی‌های اعمال شده:`);
      result.performance.optimizations.forEach(opt => {
        console.log(`   - ${opt}`);
      });
    }
    
    console.log('\n🎉 تبدیل کامل شد!');
  }

  /**
   * پاک‌سازی فایل‌های موقت
   */
  async cleanup(): Promise<void> {
    const tempDir = this.config.files.tempDir;
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('🧹 فایل‌های موقت پاک شدند');
    }
  }
}

export default LovableConverter; 