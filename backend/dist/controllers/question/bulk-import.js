"use strict";
/**
 * Question Bulk Import Controller
 * کنترلر بارگزاری انبوه سوالات از فایل اکسل
 *
 * ویژگی‌های اصلی:
 * - پردازش فایل‌های اکسل (.xlsx, .xls)
 * - اعتبارسنجی کامل داده‌ها
 * - پردازش ناهمزمان
 * - گزارش تفصیلی نتایج
 * - محدودیت دسترسی (طراح سوال و ادمین)
 *
 * @author Exam-Edu Platform
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadTemplate = exports.getBulkUploadStatus = exports.bulkUploadQuestions = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const zod_1 = require("zod");
const bulkImportService_1 = require("../../services/bulkImportService");
// ==================== Validation Schemas ====================
const ExcelQuestionRowSchema = zod_1.z.object({
    title: zod_1.z.string()
        .trim()
        .min(5, 'عنوان باید حداقل 5 کاراکتر باشد')
        .max(200, 'عنوان حداکثر 200 کاراکتر'),
    content: zod_1.z.string()
        .trim()
        .min(10, 'شرح سوال باید حداقل 10 کاراکتر باشد')
        .max(2000, 'شرح حداکثر 2000 کاراکتر'),
    type: zod_1.z.enum(['multiple-choice', 'true-false', 'descriptive'], {
        errorMap: () => ({ message: 'نوع سوال باید یکی از: multiple-choice, true-false, descriptive باشد' })
    }),
    optionA: zod_1.z.string().trim().optional(),
    optionB: zod_1.z.string().trim().optional(),
    optionC: zod_1.z.string().trim().optional(),
    optionD: zod_1.z.string().trim().optional(),
    correctAnswer: zod_1.z.string()
        .trim()
        .min(1, 'پاسخ صحیح الزامی است'),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard'], {
        errorMap: () => ({ message: 'سطح سختی باید یکی از: easy, medium, hard باشد' })
    }),
    tags: zod_1.z.string().optional(),
    explanation: zod_1.z.string().trim().optional(),
    source: zod_1.z.string().trim().optional(),
    sourcePage: zod_1.z.number().min(1).max(9999).optional(),
    rowIndex: zod_1.z.number()
});
// ==================== Multer Configuration ====================
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.join(__dirname, '../../../uploads/bulk-questions');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'questions-bulk-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    // فقط فایل‌های اکسل مجاز هستند
    const allowedTypes = ['.xlsx', '.xls'];
    const fileExt = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
        cb(null, true);
    }
    else {
        cb(new Error('فقط فایل‌های اکسل (.xlsx, .xls) مجاز هستند'), false);
    }
};
exports.uploadMiddleware = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    },
    fileFilter: fileFilter,
});
// ==================== Helper Functions ====================
/**
 * خواندن و تجزیه فایل اکسل
 */
function parseExcelFile(filePath) {
    try {
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // تبدیل به JSON با header اول
        const jsonData = xlsx_1.default.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length < 2) {
            throw new Error('فایل باید حداقل یک ردیف داده داشته باشد');
        }
        const rows = [];
        // شروع از ردیف دوم (ردیف اول هدر است)
        for (let i = 1; i < jsonData.length && i <= 101; i++) { // حداکثر 100 سوال + هدر
            const row = jsonData[i];
            if (row && row.length >= 8) { // حداقل ستون‌های ضروری
                rows.push({
                    title: row[0]?.toString().trim() || '',
                    content: row[1]?.toString().trim() || '',
                    type: row[2]?.toString().trim().toLowerCase() || '',
                    optionA: row[3]?.toString().trim() || '',
                    optionB: row[4]?.toString().trim() || '',
                    optionC: row[5]?.toString().trim() || '',
                    optionD: row[6]?.toString().trim() || '',
                    correctAnswer: row[7]?.toString().trim() || '',
                    difficulty: row[8]?.toString().trim().toLowerCase() || 'medium',
                    tags: row[9]?.toString().trim() || '',
                    explanation: row[10]?.toString().trim() || '',
                    source: row[11]?.toString().trim() || '',
                    sourcePage: row[12] ? parseInt(row[12].toString()) : undefined,
                    rowIndex: i + 1,
                });
            }
        }
        if (rows.length === 0) {
            throw new Error('هیچ ردیف معتبری در فایل یافت نشد');
        }
        if (rows.length > 100) {
            throw new Error('حداکثر 100 سوال در هر فایل مجاز است');
        }
        return rows;
    }
    catch (error) {
        throw new Error(`خطا در خواندن فایل اکسل: ${error.message}`);
    }
}
/**
 * اعتبارسنجی و پردازش داده‌های اکسل
 */
async function validateAndProcessRows(rows, courseExamId) {
    const result = {
        totalRows: rows.length,
        successfulImports: 0,
        failedImports: 0,
        createdQuestions: [],
        errors: [],
        warnings: []
    };
    for (const row of rows) {
        try {
            // اعتبارسنجی ساختار ردیف
            const validatedRow = ExcelQuestionRowSchema.parse(row);
            // اعتبارسنجی‌های تخصصی
            const validationResult = await validateQuestionRow(validatedRow);
            if (validationResult.isValid) {
                // ایجاد سوال
                const questionData = await createQuestionFromRow(validatedRow, courseExamId);
                result.createdQuestions.push(questionData);
                result.successfulImports++;
                // اضافه کردن هشدارها در صورت وجود
                result.warnings.push(...validationResult.warnings.map(w => ({
                    ...w,
                    row: row.rowIndex
                })));
            }
            else {
                result.errors.push(...validationResult.errors.map(e => ({
                    ...e,
                    row: row.rowIndex,
                    data: row
                })));
                result.failedImports++;
            }
        }
        catch (error) {
            result.errors.push({
                row: row.rowIndex,
                message: error.message || 'خطای نامشخص در پردازش ردیف',
                data: row
            });
            result.failedImports++;
        }
    }
    return result;
}
/**
 * اعتبارسنجی تخصصی برای هر ردیف سوال
 */
async function validateQuestionRow(row) {
    const errors = [];
    const warnings = [];
    // اعتبارسنجی گزینه‌ها بر اساس نوع سوال
    if (row.type === 'multiple-choice') {
        if (!row.optionA || !row.optionB) {
            errors.push({
                row: 0,
                field: 'options',
                message: 'سوالات چند گزینه‌ای باید حداقل دو گزینه داشته باشند',
                data: row
            });
        }
        // بررسی پاسخ صحیح
        const validAnswers = ['الف', 'ا', 'A', 'ب', 'B', 'ج', 'C', 'د', 'D'];
        if (!validAnswers.includes(row.correctAnswer.toUpperCase())) {
            errors.push({
                row: 0,
                field: 'correctAnswer',
                message: 'پاسخ صحیح باید یکی از گزینه‌های الف، ب، ج، د باشد',
                data: row
            });
        }
        // هشدار برای گزینه‌های خالی
        if (!row.optionC && !row.optionD) {
            warnings.push({
                row: 0,
                field: 'options',
                message: 'تنها دو گزینه تعریف شده است',
                data: row
            });
        }
    }
    if (row.type === 'true-false') {
        const validTrueFalse = ['درست', 'غلط', 'صحیح', 'نادرست', 'TRUE', 'FALSE', 'T', 'F'];
        if (!validTrueFalse.includes(row.correctAnswer.toUpperCase())) {
            errors.push({
                row: 0,
                field: 'correctAnswer',
                message: 'پاسخ سوالات درست/غلط باید یکی از: درست، غلط، صحیح، نادرست باشد',
                data: row
            });
        }
    }
    // اعتبارسنجی برچسب‌ها
    if (row.tags) {
        const tags = row.tags.split(',').map(tag => tag.trim());
        if (tags.length > 10) {
            warnings.push({
                row: 0,
                field: 'tags',
                message: 'تعداد برچسب‌ها زیاد است (بیشتر از 10)',
                data: row
            });
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
/**
 * ایجاد سوال از روی داده‌های ردیف
 */
async function createQuestionFromRow(row, courseExamId) {
    // تبدیل گزینه‌ها
    const options = [];
    if (row.type === 'multiple-choice') {
        if (row.optionA)
            options.push({ label: 'الف', content: row.optionA, isCorrect: normalizeAnswer(row.correctAnswer) === 'A' });
        if (row.optionB)
            options.push({ label: 'ب', content: row.optionB, isCorrect: normalizeAnswer(row.correctAnswer) === 'B' });
        if (row.optionC)
            options.push({ label: 'ج', content: row.optionC, isCorrect: normalizeAnswer(row.correctAnswer) === 'C' });
        if (row.optionD)
            options.push({ label: 'د', content: row.optionD, isCorrect: normalizeAnswer(row.correctAnswer) === 'D' });
    }
    // تبدیل برچسب‌ها
    const tags = row.tags ? row.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    const questionData = {
        courseExamId,
        title: row.title,
        content: row.content,
        type: row.type,
        options: options.length > 0 ? options : undefined,
        correctAnswer: row.correctAnswer,
        difficulty: row.difficulty,
        tags,
        explanation: row.explanation || undefined,
        source: row.source || undefined,
        sourcePage: row.sourcePage || undefined,
        metadata: {
            points: 1,
            timeLimit: undefined,
            chapter: undefined
        }
    };
    // اعتبارسنجی نهایی - موقتاً ساده‌سازی شده
    // const validatedData = CreateQuestionSchema.parse(questionData);
    // ذخیره در دیتابیس Parse Server
    try {
        const Parse = require('parse/node');
        const Question = Parse.Object.extend('Question');
        const question = new Question();
        // Set all fields
        Object.keys(questionData).forEach(key => {
            if (key !== 'metadata') { // Handle metadata separately
                question.set(key, questionData[key]);
            }
        });
        // Set metadata as a nested object
        if (questionData.metadata) {
            question.set('metadata', questionData.metadata);
        }
        const savedQuestion = await question.save();
        console.log(`✅ سوال ذخیره شد: ${savedQuestion.id}`);
        return {
            _id: savedQuestion.id,
            ...questionData,
            createdAt: savedQuestion.createdAt,
            updatedAt: savedQuestion.updatedAt,
            objectId: savedQuestion.id
        };
    }
    catch (dbError) {
        console.error('❌ خطا در ذخیره سوال:', dbError);
        throw new Error(`خطا در ذخیره سوال در دیتابیس: ${dbError.message}`);
    }
}
/**
 * تطبیق پاسخ صحیح
 */
function normalizeAnswer(answer) {
    const answerMap = {
        'الف': 'A', 'ا': 'A', 'A': 'A',
        'ب': 'B', 'B': 'B',
        'ج': 'C', 'C': 'C',
        'د': 'D', 'D': 'D'
    };
    return answerMap[answer.trim()] || answer.toUpperCase();
}
// ==================== Main Controller ====================
/**
 * بارگزاری و پردازش فایل اکسل سوالات
 * POST /api/questions/bulk-upload
 */
const bulkUploadQuestions = async (req, res) => {
    try {
        // بررسی وجود فایل
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'فایل اکسل ارسال نشده است',
                code: 'NO_FILE'
            });
            return;
        }
        const { courseExamId } = req.body;
        const userId = req.user?.id;
        // اعتبارسنجی courseExamId
        if (!courseExamId) {
            if (req.file && fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
            }
            res.status(400).json({
                success: false,
                message: 'شناسه درس-آزمون الزامی است',
                code: 'MISSING_COURSE_EXAM_ID'
            });
            return;
        }
        // تنظیم وضعیت در حال پردازش
        await bulkImportService_1.BulkImportService.setProcessing(userId);
        // شروع پردازش ناهمزمان
        processFileAsync(req.file.path, courseExamId, userId);
        res.status(202).json({
            success: true,
            message: 'فایل با موفقیت دریافت شد و در حال پردازش است',
            data: {
                fileName: req.file.originalname,
                status: 'processing'
            }
        });
    }
    catch (error) {
        console.error('Error in bulk upload:', error);
        // پاک کردن فایل در صورت خطا
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'خطا در پردازش فایل',
            code: 'PROCESSING_ERROR',
            error: error.message
        });
    }
};
exports.bulkUploadQuestions = bulkUploadQuestions;
/**
 * پردازش ناهمزمان فایل
 */
async function processFileAsync(filePath, courseExamId, userId) {
    try {
        console.log(`شروع پردازش فایل: ${filePath}`);
        // خواندن فایل اکسل
        const excelRows = parseExcelFile(filePath);
        console.log(`تعداد ردیف‌های خوانده شده: ${excelRows.length}`);
        // پردازش و اعتبارسنجی
        const result = await validateAndProcessRows(excelRows, courseExamId);
        // ذخیره نتایج در دیتابیس برای نمایش به کاربر
        await bulkImportService_1.BulkImportService.saveResult(userId, result);
        console.log('نتیجه پردازش:', {
            total: result.totalRows,
            success: result.successfulImports,
            failed: result.failedImports,
            errors: result.errors.length,
            warnings: result.warnings.length
        });
        // حذف فایل پس از پردازش
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        console.log(`پردازش فایل با موفقیت کامل شد`);
    }
    catch (error) {
        console.error('خطا در پردازش ناهمزمان:', error);
        // حذف فایل در صورت خطا
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        // ثبت خطا برای نمایش به کاربر
        await bulkImportService_1.BulkImportService.saveError(userId, error.message);
    }
}
/**
 * دریافت وضعیت پردازش
 * GET /api/questions/bulk-upload/status
 */
const getBulkUploadStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        // دریافت وضعیت از دیتابیس
        const status = await bulkImportService_1.BulkImportService.getStatus(userId);
        if (!status) {
            res.json({
                success: true,
                data: {
                    status: 'not_found',
                    message: 'هیچ عملیات بارگزاری یافت نشد'
                }
            });
            return;
        }
        res.json({
            success: true,
            data: {
                status: status.status,
                message: status.status === 'completed' ? 'عملیات تکمیل شده است' :
                    status.status === 'processing' ? 'در حال پردازش...' :
                        'عملیات با خطا مواجه شد',
                result: status.result,
                error: status.error,
                timestamp: status.timestamp
            }
        });
    }
    catch (error) {
        console.error('Error getting bulk upload status:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت وضعیت',
            error: error.message
        });
    }
};
exports.getBulkUploadStatus = getBulkUploadStatus;
/**
 * دانلود فایل نمونه
 * GET /api/questions/bulk-upload/template
 */
const downloadTemplate = async (req, res) => {
    try {
        // ایجاد فایل نمونه
        const templateData = [
            [
                'عنوان سوال', 'شرح سوال', 'نوع سوال', 'گزینه الف', 'گزینه ب',
                'گزینه ج', 'گزینه د', 'پاسخ صحیح', 'سطح سختی', 'برچسب‌ها',
                'توضیح اضافی', 'منبع', 'صفحه منبع'
            ],
            [
                'ریاضیات پایه', '2 + 2 چند است؟', 'multiple-choice', '3', '4',
                '5', '6', 'ب', 'easy', 'ریاضی,جمع',
                'سوال ساده جمع', 'کتاب ریاضی', '10'
            ],
            [
                'علوم پایه', 'آب در دمای 100 درجه سانتیگراد می‌جوشد', 'true-false', '', '',
                '', '', 'درست', 'medium', 'علوم,فیزیک',
                'نقطه جوش آب', 'کتاب علوم', '25'
            ]
        ];
        const workbook = xlsx_1.default.utils.book_new();
        const worksheet = xlsx_1.default.utils.aoa_to_sheet(templateData);
        xlsx_1.default.utils.book_append_sheet(workbook, worksheet, 'سوالات');
        // تنظیم عرض ستون‌ها
        const colWidths = [
            { wch: 20 }, { wch: 40 }, { wch: 15 }, { wch: 25 }, { wch: 25 },
            { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 20 },
            { wch: 30 }, { wch: 15 }, { wch: 10 }
        ];
        worksheet['!cols'] = colWidths;
        // ایجاد buffer
        const buffer = xlsx_1.default.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="question-template.xlsx"');
        res.send(buffer);
    }
    catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در ایجاد فایل نمونه',
            error: error.message
        });
    }
};
exports.downloadTemplate = downloadTemplate;
//# sourceMappingURL=bulk-import.js.map