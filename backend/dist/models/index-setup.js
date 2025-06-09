"use strict";
/**
 * MongoDB Index Setup for Parse Server
 * تنظیم ایندکس‌های MongoDB برای بهینه‌سازی کارایی
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMongoIndexScript = exports.checkIndexes = exports.createIndexes = exports.indexConfigs = void 0;
const logger_1 = __importDefault(require("../config/logger"));
/**
 * تنظیمات ایندکس‌ها برای مدل‌های مختلف
 */
exports.indexConfigs = [
    // Question Model Indexes
    {
        className: 'Question',
        indexName: 'text_search_index',
        fields: { text: 'text' },
        options: {
            background: true,
            name: 'question_text_search'
        }
    },
    {
        className: 'Question',
        indexName: 'difficulty_category_compound',
        fields: { difficulty: 1, category: 1 },
        options: {
            background: true,
            name: 'question_difficulty_category'
        }
    },
    {
        className: 'Question',
        indexName: 'author_published_index',
        fields: { authorId: 1, isPublished: 1 },
        options: {
            background: true,
            name: 'question_author_published'
        }
    },
    // CourseExam Model Indexes  
    {
        className: 'CourseExam',
        indexName: 'title_search_index',
        fields: { title: 'text' },
        options: {
            background: true,
            name: 'courseexam_title_search'
        }
    },
    {
        className: 'CourseExam',
        indexName: 'author_grade_compound',
        fields: { authorId: 1, grade: 1 },
        options: {
            background: true,
            name: 'courseexam_author_grade'
        }
    },
    {
        className: 'CourseExam',
        indexName: 'published_difficulty_index',
        fields: { isPublished: 1, difficulty: 1 },
        options: {
            background: true,
            name: 'courseexam_published_difficulty'
        }
    }
];
/**
 * ایجاد ایندکس‌ها در MongoDB از طریق Parse Server
 * برای Parse Server، ایندکس‌ها باید مستقیماً در MongoDB ایجاد شوند
 */
const createIndexes = async () => {
    try {
        logger_1.default.info('🔧 شروع ایجاد ایندکس‌های MongoDB...');
        // در Parse Server، ایندکس‌ها باید مستقیماً در MongoDB ایجاد شوند
        // این فانکشن راهنمای ایجاد آن‌ها را ارائه می‌دهد
        logger_1.default.info('ℹ️  برای ایجاد ایندکس‌ها، کامندهای زیر را در MongoDB shell اجرا کنید:');
        exports.indexConfigs.forEach(config => {
            const command = `db.${config.className}.createIndex(${JSON.stringify(config.fields)}, ${JSON.stringify(config.options)})`;
            logger_1.default.info(`📝 ${command}`);
        });
        logger_1.default.info('✅ راهنمای ایندکس‌ها آماده شد');
    }
    catch (error) {
        logger_1.default.error('❌ خطا در آماده‌سازی ایندکس‌ها:', error);
        throw error;
    }
};
exports.createIndexes = createIndexes;
/**
 * بررسی وجود ایندکس‌ها
 */
const checkIndexes = async () => {
    try {
        logger_1.default.info('🔍 بررسی وضعیت ایندکس‌ها...');
        // برای Parse Server، بررسی ایندکس‌ها نیاز به دسترسی مستقیم به MongoDB دارد
        logger_1.default.warn('⚠️  بررسی ایندکس‌ها نیاز به دسترسی مستقیم به MongoDB دارد');
        return true;
    }
    catch (error) {
        logger_1.default.error('❌ خطا در بررسی ایندکس‌ها:', error);
        return false;
    }
};
exports.checkIndexes = checkIndexes;
/**
 * اسکریپت نصب ایندکس‌ها برای MongoDB
 */
const generateMongoIndexScript = () => {
    const script = exports.indexConfigs.map(config => {
        return `// ${config.indexName} برای ${config.className}
db.${config.className}.createIndex(${JSON.stringify(config.fields, null, 2)}, ${JSON.stringify(config.options, null, 2)});`;
    }).join('\n\n');
    return `// MongoDB Index Installation Script
// اسکریپت نصب ایندکس‌های MongoDB
// این اسکریپت را در MongoDB shell اجرا کنید

${script}

// بررسی ایندکس‌های ایجاد شده
${exports.indexConfigs.map(config => `db.${config.className}.getIndexes();`).join('\n')}
`;
};
exports.generateMongoIndexScript = generateMongoIndexScript;
exports.default = {
    createIndexes: exports.createIndexes,
    checkIndexes: exports.checkIndexes,
    generateMongoIndexScript: exports.generateMongoIndexScript,
    indexConfigs: exports.indexConfigs
};
//# sourceMappingURL=index-setup.js.map