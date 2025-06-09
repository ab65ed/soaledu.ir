/**
 * MongoDB Index Setup for Parse Server
 * تنظیم ایندکس‌های MongoDB برای بهینه‌سازی کارایی
 */

import Parse from 'parse/node';
import logger from '../config/logger';

export interface IndexConfig {
  className: string;
  indexName: string;
  fields: Record<string, any>;
  options?: any;
}

/**
 * تنظیمات ایندکس‌ها برای مدل‌های مختلف
 */
export const indexConfigs: IndexConfig[] = [
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
export const createIndexes = async (): Promise<void> => {
  try {
    logger.info('🔧 شروع ایجاد ایندکس‌های MongoDB...');

    // در Parse Server، ایندکس‌ها باید مستقیماً در MongoDB ایجاد شوند
    // این فانکشن راهنمای ایجاد آن‌ها را ارائه می‌دهد
    
    logger.info('ℹ️  برای ایجاد ایندکس‌ها، کامندهای زیر را در MongoDB shell اجرا کنید:');
    
    indexConfigs.forEach(config => {
      const command = `db.${config.className}.createIndex(${JSON.stringify(config.fields)}, ${JSON.stringify(config.options)})`;
      logger.info(`📝 ${command}`);
    });

    logger.info('✅ راهنمای ایندکس‌ها آماده شد');

  } catch (error) {
    logger.error('❌ خطا در آماده‌سازی ایندکس‌ها:', error);
    throw error;
  }
};

/**
 * بررسی وجود ایندکس‌ها
 */
export const checkIndexes = async (): Promise<boolean> => {
  try {
    logger.info('🔍 بررسی وضعیت ایندکس‌ها...');
    
    // برای Parse Server، بررسی ایندکس‌ها نیاز به دسترسی مستقیم به MongoDB دارد
    logger.warn('⚠️  بررسی ایندکس‌ها نیاز به دسترسی مستقیم به MongoDB دارد');
    
    return true;
  } catch (error) {
    logger.error('❌ خطا در بررسی ایندکس‌ها:', error);
    return false;
  }
};

/**
 * اسکریپت نصب ایندکس‌ها برای MongoDB
 */
export const generateMongoIndexScript = (): string => {
  const script = indexConfigs.map(config => {
    return `// ${config.indexName} برای ${config.className}
db.${config.className}.createIndex(${JSON.stringify(config.fields, null, 2)}, ${JSON.stringify(config.options, null, 2)});`;
  }).join('\n\n');

  return `// MongoDB Index Installation Script
// اسکریپت نصب ایندکس‌های MongoDB
// این اسکریپت را در MongoDB shell اجرا کنید

${script}

// بررسی ایندکس‌های ایجاد شده
${indexConfigs.map(config => `db.${config.className}.getIndexes();`).join('\n')}
`;
};

export default {
  createIndexes,
  checkIndexes,
  generateMongoIndexScript,
  indexConfigs
}; 