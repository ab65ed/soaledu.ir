"use strict";
/**
 * Pricing Utils Tests
 * تست‌های توابع کمکی قیمت‌گذاری
 */
Object.defineProperty(exports, "__esModule", { value: true });
const pricing_utils_1 = require("../../../controllers/finance/pricing-utils");
const types_1 = require("../../../controllers/finance/types");
describe('Pricing Utils', () => {
    describe('calculateExamPrice', () => {
        it('should calculate correct price for 10-20 questions', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(15, 'regular', false, 0);
            expect(result.basePrice).toBe(types_1.PRICING_CONFIG.BASE_PRICES['10-20']);
            expect(result.priceCategory).toBe('10-20');
            expect(result.questionCount).toBe(15);
            expect(result.itemType).toBe('exam');
            expect(result.discounts).toHaveLength(0);
            expect(result.finalPrice).toBe(types_1.PRICING_CONFIG.BASE_PRICES['10-20']);
        });
        it('should calculate correct price for 21-30 questions', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(25, 'regular', false, 0);
            expect(result.basePrice).toBe(types_1.PRICING_CONFIG.BASE_PRICES['21-30']);
            expect(result.priceCategory).toBe('21-30');
            expect(result.questionCount).toBe(25);
        });
        it('should calculate correct price for 31-50 questions', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(40, 'regular', false, 0);
            expect(result.basePrice).toBe(types_1.PRICING_CONFIG.BASE_PRICES['31-50']);
            expect(result.priceCategory).toBe('31-50');
            expect(result.questionCount).toBe(40);
        });
        it('should apply first time purchase discount', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(20, 'regular', true, 0);
            expect(result.discounts).toHaveLength(1);
            expect(result.discounts[0].type).toBe('first_time');
            expect(result.discounts[0].percentage).toBe(types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME * 100);
            const expectedDiscount = result.basePrice * types_1.PRICING_CONFIG.DISCOUNTS.FIRST_TIME;
            expect(result.discounts[0].amount).toBe(expectedDiscount);
            expect(result.totalDiscount).toBe(expectedDiscount);
        });
        it('should apply student discount', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(20, 'student', false, 0);
            expect(result.discounts).toHaveLength(1);
            expect(result.discounts[0].type).toBe('student');
            expect(result.discounts[0].percentage).toBe(types_1.PRICING_CONFIG.DISCOUNTS.STUDENT * 100);
        });
        it('should apply bulk purchase discount', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(20, 'regular', false, 5);
            expect(result.discounts).toHaveLength(1);
            expect(result.discounts[0].type).toBe('bulk_purchase');
            expect(result.discounts[0].percentage).toBe(types_1.PRICING_CONFIG.DISCOUNTS.BULK_PURCHASE * 100);
        });
        it('should apply multiple discounts', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(20, 'student', true, 5);
            expect(result.discounts).toHaveLength(3);
            const discountTypes = result.discounts.map(d => d.type);
            expect(discountTypes).toContain('first_time');
            expect(discountTypes).toContain('student');
            expect(discountTypes).toContain('bulk_purchase');
        });
        it('should respect minimum price limit', async () => {
            // Test with very high discounts that would go below minimum
            const result = await (0, pricing_utils_1.calculateExamPrice)(10, 'student', true, 5);
            expect(result.finalPrice).toBeGreaterThanOrEqual(types_1.PRICING_CONFIG.MIN_PRICE);
        });
        it('should respect maximum price limit', async () => {
            const result = await (0, pricing_utils_1.calculateExamPrice)(50, 'regular', false, 0);
            expect(result.finalPrice).toBeLessThanOrEqual(types_1.PRICING_CONFIG.MAX_PRICE);
        });
    });
    describe('calculateSingleFlashcardPrice', () => {
        it('should calculate correct base price', async () => {
            const basePrice = 300;
            const result = await (0, pricing_utils_1.calculateSingleFlashcardPrice)(basePrice, 'regular', false);
            expect(result.basePrice).toBe(basePrice);
            expect(result.itemType).toBe('flashcard');
            expect(result.discounts).toHaveLength(0);
            expect(result.finalPrice).toBe(basePrice);
        });
        it('should use default price when not provided', async () => {
            const result = await (0, pricing_utils_1.calculateSingleFlashcardPrice)();
            expect(result.basePrice).toBe(types_1.PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT);
        });
        it('should apply first time purchase discount', async () => {
            const result = await (0, pricing_utils_1.calculateSingleFlashcardPrice)(200, 'regular', true);
            expect(result.discounts).toHaveLength(1);
            expect(result.discounts[0].type).toBe('first_time');
        });
        it('should apply student discount', async () => {
            const result = await (0, pricing_utils_1.calculateSingleFlashcardPrice)(200, 'student', false);
            expect(result.discounts).toHaveLength(1);
            expect(result.discounts[0].type).toBe('student');
        });
        it('should respect flashcard price limits', async () => {
            // Test minimum
            const resultMin = await (0, pricing_utils_1.calculateSingleFlashcardPrice)(50, 'student', true);
            expect(resultMin.finalPrice).toBeGreaterThanOrEqual(types_1.PRICING_CONFIG.FLASHCARD_PRICES.MIN);
            // Test maximum
            const resultMax = await (0, pricing_utils_1.calculateSingleFlashcardPrice)(600, 'regular', false);
            expect(resultMax.finalPrice).toBeLessThanOrEqual(types_1.PRICING_CONFIG.FLASHCARD_PRICES.MAX);
        });
    });
    describe('calculateFlashcardBulkPrice', () => {
        const mockFlashcards = [
            { get: jest.fn().mockReturnValue(200) },
            { get: jest.fn().mockReturnValue(250) },
            { get: jest.fn().mockReturnValue(300) }
        ];
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('should calculate total base price correctly', async () => {
            const result = await (0, pricing_utils_1.calculateFlashcardBulkPrice)(mockFlashcards, 'regular', false);
            expect(result.basePrice).toBe(750); // 200 + 250 + 300
            expect(result.flashcardCount).toBe(3);
            expect(result.itemType).toBe('flashcard');
        });
        it('should use default price for flashcards without price', async () => {
            const mockFlashcardsNoPrice = [
                { get: jest.fn().mockReturnValue(null) },
                { get: jest.fn().mockReturnValue(undefined) }
            ];
            const result = await (0, pricing_utils_1.calculateFlashcardBulkPrice)(mockFlashcardsNoPrice, 'regular', false);
            expect(result.basePrice).toBe(types_1.PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT * 2);
        });
        it('should apply bulk discount for 10+ flashcards', async () => {
            const manyFlashcards = Array(12).fill({ get: jest.fn().mockReturnValue(200) });
            const result = await (0, pricing_utils_1.calculateFlashcardBulkPrice)(manyFlashcards, 'regular', false);
            expect(result.discounts.some(d => d.type === 'flashcard_bulk')).toBe(true);
            expect(result.flashcardCount).toBe(12);
        });
        it('should not apply bulk discount for less than 10 flashcards', async () => {
            const result = await (0, pricing_utils_1.calculateFlashcardBulkPrice)(mockFlashcards, 'regular', false);
            expect(result.discounts.some(d => d.type === 'flashcard_bulk')).toBe(false);
        });
        it('should apply multiple discounts correctly', async () => {
            const manyFlashcards = Array(15).fill({ get: jest.fn().mockReturnValue(200) });
            const result = await (0, pricing_utils_1.calculateFlashcardBulkPrice)(manyFlashcards, 'student', true);
            expect(result.discounts).toHaveLength(3);
            const discountTypes = result.discounts.map(d => d.type);
            expect(discountTypes).toContain('first_time');
            expect(discountTypes).toContain('student');
            expect(discountTypes).toContain('flashcard_bulk');
        });
    });
});
//# sourceMappingURL=pricing-utils.test.js.map