/**
 * A/B Test Models
 *
 * Model definitions for A/B testing including experiments, variants, and results
 */
export interface ABTestVariant {
    id: string;
    name: string;
    description: string;
    percentage: number;
    config: Record<string, any>;
    isControl: boolean;
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
    targetPath: string;
    variants: ABTestVariant[];
    metrics: ABTestMetric[];
    participants: ABTestParticipant[];
    startDate: Date;
    endDate?: Date;
    minSampleSize: number;
    confidenceLevel: number;
    statisticalSignificance?: boolean;
    winner?: string;
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
    duration: number;
    totalParticipants: number;
}
export declare class ABTestUtils {
    static assignVariant(test: ABTest, userId: string): string;
    private static hashString;
    static calculateStatisticalSignificance(controlConversions: number, controlTotal: number, testConversions: number, testTotal: number): {
        pValue: number;
        isSignificant: boolean;
        confidenceLevel: number;
    };
    private static standardNormalCDF;
    private static erf;
}
