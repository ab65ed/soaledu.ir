export interface ComponentDependency {
  name: string;
  path: string;
  type: 'component' | 'hook' | 'util' | 'service' | 'type';
  isExternal: boolean;
  atomicLevel: 'atom' | 'molecule' | 'organism' | 'template' | 'page';
  imports: string[];
}

export interface DependencyGraph {
  components: Map<string, ComponentDependency>;
  dependencies: Map<string, string[]>;
  buildOrder: string[];
  cycles: string[][];
}

export class DependencyResolver {
  private graph: DependencyGraph;
  
  constructor() {
    this.graph = {
      components: new Map(),
      dependencies: new Map(),
      buildOrder: [],
      cycles: []
    };
  }

  /**
   * تجزیه و تحلیل وابستگی‌های یک کامپوننت
   */
  analyzeDependencies(componentCode: string, componentName: string): ComponentDependency[] {
    const dependencies: ComponentDependency[] = [];
    
    // استخراج import statements
    const importRegex = /import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(componentCode)) !== null) {
      const importPath = match[1];
      const importStatement = match[0];
      
      // تشخیص نوع import
      const dependency = this.classifyImport(importPath, importStatement);
      if (dependency) {
        dependencies.push(dependency);
      }
    }
    
    return dependencies;
  }

  /**
   * طبقه‌بندی نوع import
   */
  private classifyImport(importPath: string, importStatement: string): ComponentDependency | null {
    // External libraries
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      return {
        name: this.extractComponentName(importPath),
        path: importPath,
        type: this.getExternalType(importPath),
        isExternal: true,
        atomicLevel: 'atom',
        imports: [importStatement]
      };
    }

    // Internal components
    const componentName = this.extractComponentName(importPath);
    const atomicLevel = this.determineAtomicLevel(componentName, importPath);
    
    return {
      name: componentName,
      path: importPath,
      type: this.getInternalType(importPath),
      isExternal: false,
      atomicLevel,
      imports: [importStatement]
    };
  }

  /**
   * تعیین سطح Atomic Design
   */
  private determineAtomicLevel(componentName: string, path: string): 'atom' | 'molecule' | 'organism' | 'template' | 'page' {
    // بر اساس مسیر
    if (path.includes('/atoms/')) return 'atom';
    if (path.includes('/molecules/')) return 'molecule';
    if (path.includes('/organisms/')) return 'organism';
    if (path.includes('/templates/')) return 'template';
    if (path.includes('/pages/')) return 'page';
    
    // بر اساس نام کامپوننت
    const atomicKeywords = {
      atom: ['Button', 'Input', 'Label', 'Icon', 'Badge', 'Avatar', 'Spinner'],
      molecule: ['Card', 'Form', 'Modal', 'Dropdown', 'Tooltip', 'Alert'],
      organism: ['Header', 'Footer', 'Sidebar', 'Navigation', 'Table', 'List'],
      template: ['Layout', 'Page', 'Template', 'Container'],
      page: ['Dashboard', 'Profile', 'Settings', 'Home']
    };
    
    for (const [level, keywords] of Object.entries(atomicKeywords)) {
      if (keywords.some(keyword => componentName.includes(keyword))) {
        return level as any;
      }
    }
    
    return 'molecule'; // default
  }

  /**
   * ساخت گراف وابستگی
   */
  buildDependencyGraph(components: Map<string, string>): DependencyGraph {
    this.graph = {
      components: new Map(),
      dependencies: new Map(),
      buildOrder: [],
      cycles: []
    };

    // تجزیه تمام کامپوننت‌ها
    for (const [name, code] of components) {
      const deps = this.analyzeDependencies(code, name);
      
      // ذخیره کامپوننت
      this.graph.components.set(name, {
        name,
        path: `./components/${this.getComponentPath(name)}`,
        type: 'component',
        isExternal: false,
        atomicLevel: this.determineAtomicLevel(name, ''),
        imports: deps.map(d => d.imports).flat()
      });
      
      // ذخیره وابستگی‌ها
      const internalDeps = deps
        .filter(d => !d.isExternal)
        .map(d => d.name);
      this.graph.dependencies.set(name, internalDeps);
    }

    // تشخیص چرخه‌های وابستگی
    this.detectCycles();
    
    // محاسبه ترتیب ساخت
    this.calculateBuildOrder();
    
    return this.graph;
  }

  /**
   * تشخیص چرخه‌های وابستگی
   */
  private detectCycles(): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (node: string, path: string[]): void => {
      if (recursionStack.has(node)) {
        // چرخه پیدا شد
        const cycleStart = path.indexOf(node);
        cycles.push(path.slice(cycleStart).concat(node));
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const dependencies = this.graph.dependencies.get(node) || [];
      for (const dep of dependencies) {
        dfs(dep, [...path]);
      }

      recursionStack.delete(node);
      path.pop();
    };

    for (const component of this.graph.components.keys()) {
      if (!visited.has(component)) {
        dfs(component, []);
      }
    }

    this.graph.cycles = cycles;
  }

  /**
   * محاسبه ترتیب ساخت (Topological Sort)
   */
  private calculateBuildOrder(): void {
    const inDegree = new Map<string, number>();
    const queue: string[] = [];
    const result: string[] = [];

    // محاسبه in-degree
    for (const component of this.graph.components.keys()) {
      inDegree.set(component, 0);
    }

    for (const [component, deps] of this.graph.dependencies) {
      for (const dep of deps) {
        if (this.graph.components.has(dep)) {
          inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
        }
      }
    }

    // پیدا کردن نودهای بدون وابستگی
    for (const [component, degree] of inDegree) {
      if (degree === 0) {
        queue.push(component);
      }
    }

    // Topological sort
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const dependencies = this.graph.dependencies.get(current) || [];
      for (const dep of dependencies) {
        if (this.graph.components.has(dep)) {
          const newDegree = (inDegree.get(dep) || 0) - 1;
          inDegree.set(dep, newDegree);
          
          if (newDegree === 0) {
            queue.push(dep);
          }
        }
      }
    }

    // ترتیب بر اساس Atomic Design
    const atomicOrder = ['atom', 'molecule', 'organism', 'template', 'page'];
    result.sort((a, b) => {
      const levelA = this.graph.components.get(a)?.atomicLevel || 'molecule';
      const levelB = this.graph.components.get(b)?.atomicLevel || 'molecule';
      
      const indexA = atomicOrder.indexOf(levelA);
      const indexB = atomicOrder.indexOf(levelB);
      
      return indexA - indexB;
    });

    this.graph.buildOrder = result;
  }

  /**
   * تولید استراتژی تبدیل
   */
  generateConversionStrategy(components: Map<string, string>): ConversionStrategy {
    const graph = this.buildDependencyGraph(components);
    
    return {
      phases: this.createConversionPhases(graph),
      dependencies: graph,
      warnings: this.generateWarnings(graph),
      recommendations: this.generateRecommendations(graph)
    };
  }

  /**
   * ایجاد فازهای تبدیل
   */
  private createConversionPhases(graph: DependencyGraph): ConversionPhase[] {
    const phases: ConversionPhase[] = [];
    const atomicLevels = ['atom', 'molecule', 'organism', 'template', 'page'];
    
    for (const level of atomicLevels) {
      const components = Array.from(graph.components.values())
        .filter(comp => comp.atomicLevel === level)
        .map(comp => comp.name);
      
      if (components.length > 0) {
        phases.push({
          name: `Phase ${phases.length + 1}: ${level.charAt(0).toUpperCase() + level.slice(1)}s`,
          level: level as any,
          components,
          order: this.getPhaseOrder(components, graph),
          estimatedTime: this.estimateConversionTime(components, level as any)
        });
      }
    }
    
    return phases;
  }

  private getPhaseOrder(components: string[], graph: DependencyGraph): string[] {
    return components.sort((a, b) => {
      const orderA = graph.buildOrder.indexOf(a);
      const orderB = graph.buildOrder.indexOf(b);
      return orderA - orderB;
    });
  }

  private estimateConversionTime(components: string[], level: string): number {
    const baseTime = {
      atom: 5,      // 5 دقیقه
      molecule: 15,  // 15 دقیقه  
      organism: 30,  // 30 دقیقه
      template: 45,  // 45 دقیقه
      page: 60      // 60 دقیقه
    };
    
    return components.length * (baseTime[level as keyof typeof baseTime] || 15);
  }

  private generateWarnings(graph: DependencyGraph): string[] {
    const warnings: string[] = [];
    
    // هشدار چرخه‌های وابستگی
    if (graph.cycles.length > 0) {
      warnings.push(`⚠️ ${graph.cycles.length} circular dependency detected!`);
      graph.cycles.forEach((cycle, index) => {
        warnings.push(`   Cycle ${index + 1}: ${cycle.join(' → ')}`);
      });
    }
    
    // هشدار کامپوننت‌های پیچیده
    const complexComponents = Array.from(graph.components.values())
      .filter(comp => {
        const deps = graph.dependencies.get(comp.name) || [];
        return deps.length > 5;
      });
    
    if (complexComponents.length > 0) {
      warnings.push(`⚠️ ${complexComponents.length} components with high complexity detected`);
    }
    
    return warnings;
  }

  private generateRecommendations(graph: DependencyGraph): string[] {
    const recommendations: string[] = [];
    
    recommendations.push('📋 Conversion Strategy:');
    recommendations.push('1. Start with atoms (basic components)');
    recommendations.push('2. Move to molecules (composite components)');
    recommendations.push('3. Build organisms (complex sections)');
    recommendations.push('4. Create templates (page layouts)');
    recommendations.push('5. Finish with pages (full pages)');
    recommendations.push('');
    recommendations.push('💡 Tips:');
    recommendations.push('• Test each phase before moving to next');
    recommendations.push('• Keep original Lovable code as reference');
    recommendations.push('• Use TypeScript strict mode');
    recommendations.push('• Add proper error boundaries');
    
    return recommendations;
  }

  // Helper methods
  private extractComponentName(path: string): string {
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace(/\.(tsx?|jsx?)$/, '');
  }

  private getExternalType(path: string): 'component' | 'hook' | 'util' | 'service' | 'type' {
    if (path.includes('react') || path.includes('next')) return 'component';
    if (path.startsWith('use') || path.includes('hook')) return 'hook';
    if (path.includes('service') || path.includes('api')) return 'service';
    if (path.includes('type') || path.includes('interface')) return 'type';
    return 'util';
  }

  private getInternalType(path: string): 'component' | 'hook' | 'util' | 'service' | 'type' {
    if (path.includes('/hooks/')) return 'hook';
    if (path.includes('/services/')) return 'service';
    if (path.includes('/types/')) return 'type';
    if (path.includes('/utils/')) return 'util';
    return 'component';
  }

  private getComponentPath(name: string): string {
    const level = this.determineAtomicLevel(name, '');
    return `${level}s/${name}/${name}.tsx`;
  }
}

export interface ConversionStrategy {
  phases: ConversionPhase[];
  dependencies: DependencyGraph;
  warnings: string[];
  recommendations: string[];
}

export interface ConversionPhase {
  name: string;
  level: 'atom' | 'molecule' | 'organism' | 'template' | 'page';
  components: string[];
  order: string[];
  estimatedTime: number; // minutes
}