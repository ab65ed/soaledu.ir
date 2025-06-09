"use strict";
/**
 * A/B Test Models
 *
 * Model definitions for A/B testing including experiments, variants, and results
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABTestUtils = void 0;
// توابع کمکی
class ABTestUtils {
    static assignVariant(test, userId) {
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
    static hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    static calculateStatisticalSignificance(controlConversions, controlTotal, testConversions, testTotal) {
        const p1 = controlConversions / controlTotal;
        const p2 = testConversions / testTotal;
        const pooledP = (controlConversions + testConversions) / (controlTotal + testTotal);
        const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / controlTotal + 1 / testTotal));
        const z = Math.abs(p2 - p1) / se;
        const pValue = 2 * (1 - this.standardNormalCDF(z));
        return {
            pValue,
            isSignificant: pValue < 0.05,
            confidenceLevel: (1 - pValue) * 100
        };
    }
    static standardNormalCDF(z) {
        return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
    }
    static erf(x) {
        // Approximation of error function
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y;
    }
}
exports.ABTestUtils = ABTestUtils;
//# sourceMappingURL=ab-test.js.map