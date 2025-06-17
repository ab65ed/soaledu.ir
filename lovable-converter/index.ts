/**
 * Lovable to Next.js Converter
 * ماژول تبدیل کدهای Lovable به Next.js
 * 
 * @version 1.0.0
 * @author SoalEdu Team
 */

// Core exports
export { LovableConverter } from './core/converter';
export { ComponentAnalyzer } from './core/analyzer';
export { CodeGenerator } from './core/generator';
export { TestGenerator } from './core/test-generator';
export { PerformanceOptimizer } from './core/performance-optimizer';
export { BuildManager } from './core/build-manager';

// Configuration exports
export { 
  defaultConfig, 
  colorMappings, 
  tailwindMappings, 
  defaultAnimations, 
  atomicLevels 
} from './config';

// Type exports
export type {
  ConversionConfig,
  ConversionResult,
  GeneratedFile,
  ConversionError,
  PerformanceMetrics,
  BuildResult,
  ChunkInfo,
} from './core/converter';

export type {
  ComponentAnalysis,
  ImportInfo,
  PropInfo,
  StateInfo,
  HookInfo,
} from './core/analyzer';

// CLI export
export { default as LovableCLI } from './cli';

/**
 * تابع کمکی برای تبدیل سریع
 * Quick conversion helper function
 */
export async function quickConvert(
  lovableCode: string, 
  componentName?: string,
  options?: Partial<ConversionConfig>
) {
  const { LovableConverter } = await import('./core/converter');
  const { defaultConfig } = await import('./config');
  
  const config = { ...defaultConfig, ...options };
  const converter = new LovableConverter(config);
  
  try {
    const result = await converter.convert(lovableCode, componentName);
    await converter.cleanup();
    return result;
  } catch (error) {
    await converter.cleanup();
    throw error;
  }
}

/**
 * تابع کمکی برای تجزیه کد Lovable
 * Helper function for analyzing Lovable code
 */
export async function analyzeCode(lovableCode: string, componentName?: string) {
  const { ComponentAnalyzer } = await import('./core/analyzer');
  const { defaultConfig } = await import('./config');
  
  const analyzer = new ComponentAnalyzer(defaultConfig);
  return await analyzer.analyze(lovableCode, componentName);
}

/**
 * تابع کمکی برای بهینه‌سازی کد
 * Helper function for optimizing code
 */
export async function optimizeCode(files: GeneratedFile[], options?: Partial<ConversionConfig>) {
  const { PerformanceOptimizer } = await import('./core/performance-optimizer');
  const { defaultConfig } = await import('./config');
  
  const config = { ...defaultConfig, ...options };
  const optimizer = new PerformanceOptimizer(config);
  
  return await optimizer.optimize(files);
}

// Default export
export default LovableConverter; 