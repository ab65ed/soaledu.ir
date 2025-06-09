"use strict";
/**
 * Finance Pricing Controller
 * کنترلر قیمت‌گذاری مالی
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingController = void 0;
const zod_1 = require("zod");
const node_1 = __importDefault(require("parse/node"));
const types_1 = require("./types");
const pricing_utils_1 = require("./pricing-utils");
// Validation schemas
const calculatePriceSchema = zod_1.z.object({
    examId: zod_1.z.string().optional(),
    questionCount: zod_1.z.number().min(10).max(50),
    userType: zod_1.z.string().default('regular'),
    isFirstPurchase: zod_1.z.boolean().default(false),
    bulkCount: zod_1.z.number().default(0)
});
const calculateFlashcardPriceSchema = zod_1.z.object({
    flashcardIds: zod_1.z.array(zod_1.z.string()).min(1),
    userType: zod_1.z.string().default('regular'),
    isFirstPurchase: zod_1.z.boolean().default(false)
});
class PricingController {
    /**
     * Calculate exam pricing
     * POST /api/finance/calculate-price
     */
    static async calculatePrice(req, res) {
        try {
            const validatedData = calculatePriceSchema.parse(req.body);
            const { examId, questionCount, userType, isFirstPurchase, bulkCount } = validatedData;
            const pricing = await (0, pricing_utils_1.calculateExamPrice)(questionCount, userType, isFirstPurchase, bulkCount);
            res.json({
                status: 'success',
                data: pricing
            });
        }
        catch (error) {
            console.error('Error calculating price:', error);
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'داده‌های ورودی نامعتبر',
                    errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                statusCode: 500,
                message: 'خطا در محاسبه قیمت',
                errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
            });
        }
    }
    /**
     * Calculate flashcard pricing
     * POST /api/finance/calculate-flashcard-price
     */
    static async calculateFlashcardPrice(req, res) {
        try {
            const validatedData = calculateFlashcardPriceSchema.parse(req.body);
            const { flashcardIds, userType, isFirstPurchase } = validatedData;
            // Get flashcard details
            const query = new node_1.default.Query('Flashcard');
            query.containedIn('objectId', flashcardIds);
            const flashcards = await query.find();
            if (flashcards.length === 0) {
                res.status(404).json({
                    status: 'error',
                    statusCode: 404,
                    message: 'فلش‌کارتی یافت نشد'
                });
                return;
            }
            const pricing = await (0, pricing_utils_1.calculateFlashcardBulkPrice)(flashcards, userType, isFirstPurchase);
            res.json({
                status: 'success',
                data: pricing
            });
        }
        catch (error) {
            console.error('Error calculating flashcard price:', error);
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'داده‌های ورودی نامعتبر',
                    errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                statusCode: 500,
                message: 'خطا در محاسبه قیمت فلش‌کارت',
                errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
            });
        }
    }
    /**
     * Get flashcard price by ID
     * GET /api/finance/flashcard-price/:flashcardId
     */
    static async getFlashcardPrice(req, res) {
        try {
            const { flashcardId } = req.params;
            const query = new node_1.default.Query('Flashcard');
            const flashcard = await query.get(flashcardId);
            if (!flashcard) {
                res.status(404).json({
                    status: 'error',
                    statusCode: 404,
                    message: 'فلش‌کارت یافت نشد'
                });
                return;
            }
            // Check user purchase history for discounts
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(req.user?.id);
            const userType = user?.get('userType') || 'regular';
            const purchaseHistory = user?.get('purchaseHistory') || [];
            const isFirstPurchase = purchaseHistory.length === 0;
            const pricing = await (0, pricing_utils_1.calculateSingleFlashcardPrice)(flashcard.get('price') || types_1.PRICING_CONFIG.FLASHCARD_PRICES.DEFAULT, userType, isFirstPurchase);
            res.json({
                status: 'success',
                data: {
                    flashcardId,
                    flashcardTitle: flashcard.get('question'),
                    pricing
                }
            });
        }
        catch (error) {
            console.error('Error getting flashcard price:', error);
            res.status(500).json({
                status: 'error',
                statusCode: 500,
                message: 'خطا در دریافت قیمت فلش‌کارت',
                errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
            });
        }
    }
    /**
     * Get exam price by exam ID
     * GET /api/finance/exam-price/:examId
     */
    static async getExamPrice(req, res) {
        try {
            const { examId } = req.params;
            const TestExam = node_1.default.Object.extend('TestExam');
            const query = new node_1.default.Query(TestExam);
            const exam = await query.get(examId);
            if (!exam) {
                res.status(404).json({
                    status: 'error',
                    statusCode: 404,
                    message: 'آزمون یافت نشد'
                });
                return;
            }
            const configuration = exam.get('configuration');
            const questionCount = configuration?.totalQuestions || 40;
            // Check user purchase history for discounts
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(req.user?.id);
            const userType = user?.get('userType') || 'regular';
            const purchaseHistory = user?.get('purchaseHistory') || [];
            const isFirstPurchase = purchaseHistory.length === 0;
            const pricing = await (0, pricing_utils_1.calculateExamPrice)(questionCount, userType, isFirstPurchase);
            res.json({
                status: 'success',
                data: {
                    examId,
                    examTitle: exam.get('title'),
                    questionCount,
                    pricing
                }
            });
        }
        catch (error) {
            console.error('Error getting exam price:', error);
            res.status(500).json({
                status: 'error',
                statusCode: 500,
                message: 'خطا در دریافت قیمت آزمون',
                errors: error instanceof Error ? [{ field: 'server', message: error.message }] : []
            });
        }
    }
}
exports.PricingController = PricingController;
//# sourceMappingURL=pricing.js.map