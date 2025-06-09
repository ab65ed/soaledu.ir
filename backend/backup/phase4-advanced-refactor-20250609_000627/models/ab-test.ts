/**
 * A/B Test Models
 * 
 * Model definitions for A/B testing including experiments, variants, and results
 */

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  percentage: number; // درصد ترافیک اختصاص یافته
  config: Record<string, any>; // تنظیمات variant
  isControl: boolean; // آیا این variant کنترل است
}

export interface ABTestMetric {
  name: string;
  type: 'conversion' | 'numeric' | 'duration' | 'boolean';
  description: string;
  goal: 'maximize' | 'minimize';
}

export interface ABTestParticipant {
  userId: string;
  variantId: string;
  assignedAt: Date;
  hasConverted: boolean;
  metrics: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  targetType: 'form' | 'dashboard' | 'flashcard' | 'exam';
  targetPath: string; // مسیر صفحه هدف
  variants: ABTestVariant[];
  metrics: ABTestMetric[];
  participants: ABTestParticipant[];
  startDate: Date;
  endDate?: Date;
  minSampleSize: number;
  confidenceLevel: number; // 90, 95, 99
  statisticalSignificance?: boolean;
  winner?: string; // variantId
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  participantsCount: number;
  conversions: number;
  conversionRate: number;
  metrics: Record<string, {
    mean: number;
    variance: number;
    standardDeviation: number;
  }>;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  pValue?: number;
  isStatisticallySignificant: boolean;
}

export interface ABTestSummary {
  test: ABTest;
  results: ABTestResult[];
  recommendation: {
    winner: string;
    confidence: number;
    improvement: number;
    reason: string;
  };
  duration: number; // روزها
  totalParticipants: number;
}

// توابع کمکی
export class ABTestUtils {
  static assignVariant(test: ABTest, userId: string): string {
    // الگوریتم تخصیص بر اساس hash کاربر
    const hash = this.hashString(userId + test.id);
    const randomValue = hash % 100;
    
    let cumulative = 0;
    for (const variant of test.variants) {
      cumulative += variant.percentage;
      if (randomValue < cumulative) {
        return variant.id;
      }
    }
    
    // fallback به variant کنترل
    return test.variants.find(v => v.isControl)?.id || test.variants[0].id;
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  static calculateStatisticalSignificance(
    controlConversions: number,
    controlTotal: number,
    testConversions: number,
    testTotal: number
  ): { pValue: number; isSignificant: boolean; confidenceLevel: number } {
    const p1 = controlConversions / controlTotal;
    const p2 = testConversions / testTotal;
    
    const pooledP = (controlConversions + testConversions) / (controlTotal + testTotal);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/controlTotal + 1/testTotal));
    
    const z = Math.abs(p2 - p1) / se;
    const pValue = 2 * (1 - this.standardNormalCDF(z));
    
    return {
      pValue,
      isSignificant: pValue < 0.05,
      confidenceLevel: (1 - pValue) * 100
    };
  }

  private static standardNormalCDF(z: number): number {
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }

  private static erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}
