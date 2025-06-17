/**
 * Component Analyzer - تجزیه و تحلیل کامپوننت‌های Lovable
 */

import { ConversionConfig } from '../config';
import { ConversionError } from './converter';

export interface ComponentAnalysis {
  componentName: string;
  componentType: 'functional' | 'class';
  atomicLevel: 'atoms' | 'molecules' | 'organisms';
  imports: ImportInfo[];
  props: PropInfo[];
  state: StateInfo[];
  hooks: HookInfo[];
  dependencies: string[];
  hasRouter: boolean;
  hasImages: boolean;
  hasAnimations: boolean;
  hasAPI: boolean;
  tailwindClasses: string[];
  errors: ConversionError[];
  warnings: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface ImportInfo {
  name: string;
  source: string;
  type: 'default' | 'named' | 'namespace';
}

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
}

export interface StateInfo {
  name: string;
  type: string;
  initialValue?: string;
}

export interface HookInfo {
  name: string;
  type: 'useState' | 'useEffect' | 'useCallback' | 'useMemo' | 'custom';
  dependencies?: string[];
}

export class ComponentAnalyzer {
  private config: ConversionConfig;

  constructor(config: ConversionConfig) {
    this.config = config;
  }

  async analyze(code: string, componentName?: string): Promise<ComponentAnalysis> {
    const analysis: ComponentAnalysis = {
      componentName: componentName || this.extractComponentName(code),
      componentType: this.detectComponentType(code),
      atomicLevel: 'molecules',
      imports: this.extractImports(code),
      props: this.extractProps(code),
      state: this.extractState(code),
      hooks: this.extractHooks(code),
      dependencies: [],
      hasRouter: this.hasRouterUsage(code),
      hasImages: this.hasImageUsage(code),
      hasAnimations: this.hasAnimationUsage(code),
      hasAPI: this.hasAPIUsage(code),
      tailwindClasses: this.extractTailwindClasses(code),
      errors: [],
      warnings: [],
      complexity: 'medium',
    };

    // تعیین سطح Atomic Design
    analysis.atomicLevel = this.determineAtomicLevel(analysis.componentName);

    // تعیین پیچیدگی
    analysis.complexity = this.calculateComplexity(analysis);

    // بررسی خطاها و هشدارها
    this.validateComponent(code, analysis);

    return analysis;
  }

  private extractComponentName(code: string): string {
    // استخراج نام کامپوننت از تعریف function یا const
    const functionMatch = code.match(/(?:function|const)\s+(\w+)/);
    if (functionMatch) {
      return functionMatch[1];
    }

    // استخراج از export default
    const exportMatch = code.match(/export\s+default\s+(\w+)/);
    if (exportMatch) {
      return exportMatch[1];
    }

    return 'UnknownComponent';
  }

  private detectComponentType(code: string): 'functional' | 'class' {
    return code.includes('class ') && code.includes('extends') ? 'class' : 'functional';
  }

  private extractImports(code: string): ImportInfo[] {
    const imports: ImportInfo[] = [];
    const importRegex = /import\s+(.+?)\s+from\s+['"](.+?)['"];?/g;
    let match;

    while ((match = importRegex.exec(code)) !== null) {
      const importClause = match[1].trim();
      const source = match[2];

      if (importClause.startsWith('{') && importClause.endsWith('}')) {
        // Named imports
        const namedImports = importClause.slice(1, -1).split(',').map(s => s.trim());
        namedImports.forEach(name => {
          imports.push({
            name: name.replace(/\s+as\s+\w+/, ''),
            source,
            type: 'named',
          });
        });
      } else if (importClause.includes('*')) {
        // Namespace import
        const nameMatch = importClause.match(/\*\s+as\s+(\w+)/);
        if (nameMatch) {
          imports.push({
            name: nameMatch[1],
            source,
            type: 'namespace',
          });
        }
      } else {
        // Default import
        imports.push({
          name: importClause.split(',')[0].trim(),
          source,
          type: 'default',
        });
      }
    }

    return imports;
  }

  private extractProps(code: string): PropInfo[] {
    const props: PropInfo[] = [];
    
    // استخراج props از تعریف function
    const propsMatch = code.match(/\(\s*\{\s*([^}]+)\s*\}/);
    if (propsMatch) {
      const propsString = propsMatch[1];
      const propNames = propsString.split(',').map(p => p.trim());
      
      propNames.forEach(prop => {
        const [name, defaultValue] = prop.split('=').map(s => s.trim());
        props.push({
          name: name.replace(/[?:]/g, ''),
          type: 'any', // TypeScript analysis needed for exact type
          required: !prop.includes('?') && !prop.includes('='),
          defaultValue: defaultValue,
        });
      });
    }

    return props;
  }

  private extractState(code: string): StateInfo[] {
    const state: StateInfo[] = [];
    const useStateRegex = /const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\(([^)]*)\)/g;
    let match;

    while ((match = useStateRegex.exec(code)) !== null) {
      state.push({
        name: match[1],
        type: 'any', // Type inference needed
        initialValue: match[2] || 'undefined',
      });
    }

    return state;
  }

  private extractHooks(code: string): HookInfo[] {
    const hooks: HookInfo[] = [];
    
    // useState
    const useStateMatches = code.match(/useState\(/g);
    if (useStateMatches) {
      hooks.push({
        name: 'useState',
        type: 'useState',
      });
    }

    // useEffect
    const useEffectMatches = code.match(/useEffect\(/g);
    if (useEffectMatches) {
      hooks.push({
        name: 'useEffect',
        type: 'useEffect',
      });
    }

    // useCallback
    const useCallbackMatches = code.match(/useCallback\(/g);
    if (useCallbackMatches) {
      hooks.push({
        name: 'useCallback',
        type: 'useCallback',
      });
    }

    // useMemo
    const useMemoMatches = code.match(/useMemo\(/g);
    if (useMemoMatches) {
      hooks.push({
        name: 'useMemo',
        type: 'useMemo',
      });
    }

    return hooks;
  }

  private hasRouterUsage(code: string): boolean {
    return code.includes('useNavigate') || 
           code.includes('useRouter') || 
           code.includes('navigate(') ||
           code.includes('router.push');
  }

  private hasImageUsage(code: string): boolean {
    return code.includes('<img') || 
           code.includes('<Image') ||
           code.includes('.jpg') ||
           code.includes('.png') ||
           code.includes('.svg');
  }

  private hasAnimationUsage(code: string): boolean {
    return code.includes('framer-motion') ||
           code.includes('motion.') ||
           code.includes('animate') ||
           code.includes('transition');
  }

  private hasAPIUsage(code: string): boolean {
    return code.includes('fetch(') ||
           code.includes('axios') ||
           code.includes('useQuery') ||
           code.includes('useMutation') ||
           code.includes('api.');
  }

  private extractTailwindClasses(code: string): string[] {
    const classes: string[] = [];
    const classRegex = /className=['"]([^'"]+)['"]/g;
    let match;

    while ((match = classRegex.exec(code)) !== null) {
      const classNames = match[1].split(' ').filter(c => c.trim());
      classes.push(...classNames);
    }

    return [...new Set(classes)]; // Remove duplicates
  }

  private determineAtomicLevel(componentName: string): 'atoms' | 'molecules' | 'organisms' {
    const name = componentName.toLowerCase();
    
    const atoms = ['button', 'input', 'label', 'icon', 'avatar', 'badge', 'spinner'];
    const molecules = ['card', 'modal', 'dropdown', 'searchbox', 'formfield'];
    
    if (atoms.some(atom => name.includes(atom))) {
      return 'atoms';
    }
    
    if (molecules.some(molecule => name.includes(molecule))) {
      return 'molecules';
    }
    
    return 'organisms';
  }

  private calculateComplexity(analysis: ComponentAnalysis): 'low' | 'medium' | 'high' {
    let score = 0;
    
    // Props complexity
    score += analysis.props.length * 1;
    
    // State complexity
    score += analysis.state.length * 2;
    
    // Hooks complexity
    score += analysis.hooks.length * 1.5;
    
    // Feature complexity
    if (analysis.hasRouter) score += 2;
    if (analysis.hasImages) score += 1;
    if (analysis.hasAnimations) score += 3;
    if (analysis.hasAPI) score += 4;
    
    if (score < 5) return 'low';
    if (score < 15) return 'medium';
    return 'high';
  }

  private validateComponent(code: string, analysis: ComponentAnalysis): void {
    // بررسی استفاده از React بدون import
    if (code.includes('React.') && !analysis.imports.some(imp => imp.name === 'React')) {
      analysis.warnings.push('استفاده از React بدون import');
    }

    // بررسی استفاده از hooks خارج از کامپوننت
    if (analysis.hooks.length > 0 && analysis.componentType === 'class') {
      analysis.errors.push({
        file: 'component',
        line: 0,
        message: 'استفاده از hooks در class component',
        severity: 'error',
      });
    }

    // بررسی props غیر استفاده شده
    analysis.props.forEach(prop => {
      if (!code.includes(prop.name)) {
        analysis.warnings.push(`prop استفاده نشده: ${prop.name}`);
      }
    });

    // بررسی state غیر استفاده شده
    analysis.state.forEach(state => {
      if (!code.includes(state.name)) {
        analysis.warnings.push(`state استفاده نشده: ${state.name}`);
      }
    });
  }
}

export default ComponentAnalyzer; 