"use strict";
/**
 * Grades Routes
 * مسیرهای مقاطع تحصیلی
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseExamValidation_1 = require("../validations/courseExamValidation");
const router = (0, express_1.Router)();
/**
 * GET /api/v1/grades
 * دریافت لیست کامل مقاطع تحصیلی با عناوین و توضیحات فارسی
 */
router.get('/', (req, res) => {
    try {
        const gradesList = courseExamValidation_1.GRADES.map(grade => ({
            value: grade,
            label: courseExamValidation_1.GRADE_LABELS[grade],
            description: getGradeDescription(grade),
            ageRange: getGradeAgeRange(grade),
            duration: getGradeDuration(grade),
            nextLevel: getNextLevel(grade)
        }));
        res.status(200).json({
            success: true,
            message: 'لیست مقاطع تحصیلی با موفقیت دریافت شد',
            data: {
                grades: gradesList,
                total: gradesList.length
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت لیست مقاطع تحصیلی',
            error: error instanceof Error ? error.message : 'خطای نامشخص'
        });
    }
});
/**
 * GET /api/v1/grades/categories
 * دریافت مقاطع تحصیلی به تفکیک دسته‌بندی
 */
router.get('/categories', (req, res) => {
    try {
        const categories = {
            'school-levels': {
                name: 'مقاطع مدرسه‌ای',
                description: 'مقاطع تحصیلی آموزش‌وپرورش',
                grades: courseExamValidation_1.GRADES.filter(grade => ['elementary', 'middle-school', 'high-school'].includes(grade)).map(grade => ({
                    value: grade,
                    label: courseExamValidation_1.GRADE_LABELS[grade],
                    description: getGradeDescription(grade)
                }))
            },
            'university-levels': {
                name: 'مقاطع دانشگاهی',
                description: 'مقاطع تحصیلی آموزش عالی',
                grades: courseExamValidation_1.GRADES.filter(grade => ['associate-degree', 'bachelor-degree', 'master-degree', 'doctorate-degree'].includes(grade)).map(grade => ({
                    value: grade,
                    label: courseExamValidation_1.GRADE_LABELS[grade],
                    description: getGradeDescription(grade)
                }))
            }
        };
        res.status(200).json({
            success: true,
            message: 'دسته‌بندی مقاطع تحصیلی با موفقیت دریافت شد',
            data: {
                categories,
                totalCategories: Object.keys(categories).length,
                totalGrades: courseExamValidation_1.GRADES.length
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت دسته‌بندی مقاطع تحصیلی',
            error: error instanceof Error ? error.message : 'خطای نامشخص'
        });
    }
});
/**
 * Helper function to get grade description
 * تابع کمکی برای دریافت توضیحات مقطع تحصیلی
 */
function getGradeDescription(grade) {
    const descriptions = {
        'elementary': 'شامل کلاس‌های اول تا ششم ابتدایی که پایه‌های اولیه یادگیری را تشکیل می‌دهد.',
        'middle-school': 'شامل کلاس‌های هفتم تا نهم که دوره متوسطه اول محسوب می‌شود.',
        'high-school': 'شامل کلاس‌های دهم تا دوازدهم که دوره متوسطه دوم و آمادگی برای کنکور است.',
        'associate-degree': 'مقطع کاردانی که معادل دو سال تحصیل پس از دیپلم است.',
        'bachelor-degree': 'مقطع کارشناسی که معادل چهار سال تحصیل دانشگاهی است.',
        'master-degree': 'مقطع کارشناسی ارشد که معادل دو سال تحصیل پس از کارشناسی است.',
        'doctorate-degree': 'مقطع دکتری که بالاترین مقطع تحصیلی و معادل چهار سال تحصیل پس از کارشناسی ارشد است.'
    };
    return descriptions[grade] || '';
}
/**
 * Helper function to get grade age range
 * تابع کمکی برای دریافت رده سنی مقطع تحصیلی
 */
function getGradeAgeRange(grade) {
    const ageRanges = {
        'elementary': '۶-۱۲ سال',
        'middle-school': '۱۲-۱۵ سال',
        'high-school': '۱۵-۱۸ سال',
        'associate-degree': '۱۸-۲۰ سال',
        'bachelor-degree': '۱۸-۲۲ سال',
        'master-degree': '۲۲-۲۴ سال',
        'doctorate-degree': '۲۴+ سال'
    };
    return ageRanges[grade] || '';
}
/**
 * Helper function to get grade duration
 * تابع کمکی برای دریافت مدت زمان مقطع تحصیلی
 */
function getGradeDuration(grade) {
    const durations = {
        'elementary': '۶ سال',
        'middle-school': '۳ سال',
        'high-school': '۳ سال',
        'associate-degree': '۲ سال',
        'bachelor-degree': '۴ سال',
        'master-degree': '۲ سال',
        'doctorate-degree': '۴ سال'
    };
    return durations[grade] || '';
}
/**
 * Helper function to get next level
 * تابع کمکی برای دریافت مقطع بعدی
 */
function getNextLevel(grade) {
    const nextLevels = {
        'elementary': 'مقطع متوسطه اول',
        'middle-school': 'مقطع متوسطه دوم',
        'high-school': 'کاردانی یا کارشناسی',
        'associate-degree': 'کارشناسی',
        'bachelor-degree': 'کارشناسی ارشد',
        'master-degree': 'دکتری',
        'doctorate-degree': 'پایان تحصیلات رسمی'
    };
    return nextLevels[grade] || '';
}
exports.default = router;
//# sourceMappingURL=grades.routes.js.map