/**
 * Seed Script for Course Metadata
 * اسکریپت پر کردن متادیتای دروس
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CourseType from '../models/CourseType';
import Grade from '../models/Grade';
import FieldOfStudy from '../models/FieldOfStudy';
import { 
  COURSE_TYPES, 
  COURSE_TYPE_LABELS,
  GRADES,
  GRADE_LABELS,
  FIELD_OF_STUDY,
  FIELD_OF_STUDY_LABELS
} from '../validations/courseExamValidation';

dotenv.config();

// Course Types Data
const courseTypesData = [
  {
    value: 'academic',
    label: 'درسی',
    description: 'شامل محتواییه که مستقیم به برنامه درسی رسمی (مثل کتاب‌های درسی آموزش‌وپرورش یا دانشگاه) مربوط می‌شه.',
    examples: 'سوالات ریاضی، ادبیات، فیزیک که برای امتحانات کلاسی یا کنکور طراحی می‌شن.',
    usage: 'برای آزمون‌های استاندارد مدارس یا کنکور.'
  },
  {
    value: 'non-academic',
    label: 'غیر درسی',
    description: 'شامل محتواییه که در برنامه درسی رسمی نیست، اما برای یادگیری عمومی یا مهارت‌های جانبی مناسبه.',
    examples: 'سوالات آموزش مهارت‌های زندگی، تفکر خلاق، یا موضوعات عمومی مثل فرهنگ و هنر.',
    usage: 'برای دوره‌های آموزشی آزاد یا فلش‌کارت‌های یادگیری عمومی.'
  },
  {
    value: 'skill-based',
    label: 'مهارتی',
    description: 'محتوایی که روی یادگیری مهارت‌های خاص (فنی یا غیرفنی) تمرکز داره.',
    examples: 'سوالات برنامه‌نویسی، مهارت‌های نرم‌افزاری، یا مهارت‌های حرفه‌ای مثل مدیریت زمان.',
    usage: 'برای آزمون‌های حرفه‌ای یا دوره‌های تخصصی.'
  },
  {
    value: 'aptitude',
    label: 'استعدادی',
    description: 'شامل محتواییه که برای سنجش استعداد یا هوش طراحی شده.',
    examples: 'سوالات هوش و استعداد تحلیلی، تست‌های روان‌شناختی یا المپیادها.',
    usage: 'برای آزمون‌های ورودی تیزهوشان یا المپیادهای علمی.'
  },
  {
    value: 'general',
    label: 'عمومی',
    description: 'محتوایی که به درس خاصی وابسته نیست و برای دانش عمومی یا فرهنگ‌سازی مناسبه.',
    examples: 'سوالات اطلاعات عمومی، تاریخ جهان، یا موضوعات محیط‌زیستی.',
    usage: 'برای فلش‌کارت‌ها یا آزمون‌های سرگرمی و آموزشی.'
  },
  {
    value: 'specialized',
    label: 'تخصصی',
    description: 'محتوایی که برای رشته‌ها یا حوزه‌های خیلی خاص طراحی شده.',
    examples: 'سوالات پزشکی تخصصی، مهندسی پیشرفته، یا حقوق.',
    usage: 'برای آزمون‌های دانشگاهی یا حرفه‌ای پیشرفته.'
  }
];

// Grades Data
const gradesData = [
  {
    value: 'elementary',
    label: 'مقطع ابتدایی',
    description: 'شامل کلاس‌های اول تا ششم ابتدایی که پایه‌های اولیه یادگیری را تشکیل می‌دهد.',
    ageRange: '۶-۱۲ سال',
    duration: '۶ سال',
    nextLevel: 'مقطع متوسطه اول',
    category: 'school-levels' as const
  },
  {
    value: 'middle-school',
    label: 'مقطع متوسطه اول',
    description: 'شامل کلاس‌های هفتم تا نهم که دوره متوسطه اول محسوب می‌شود.',
    ageRange: '۱۲-۱۵ سال',
    duration: '۳ سال',
    nextLevel: 'مقطع متوسطه دوم',
    category: 'school-levels' as const
  },
  {
    value: 'high-school',
    label: 'مقطع متوسطه دوم',
    description: 'شامل کلاس‌های دهم تا دوازدهم که دوره متوسطه دوم و آمادگی برای کنکور است.',
    ageRange: '۱۵-۱۸ سال',
    duration: '۳ سال',
    nextLevel: 'کاردانی یا کارشناسی',
    category: 'school-levels' as const
  },
  {
    value: 'associate-degree',
    label: 'کاردانی',
    description: 'مقطع کاردانی که معادل دو سال تحصیل پس از دیپلم است.',
    ageRange: '۱۸-۲۰ سال',
    duration: '۲ سال',
    nextLevel: 'کارشناسی',
    category: 'university-levels' as const
  },
  {
    value: 'bachelor-degree',
    label: 'کارشناسی',
    description: 'مقطع کارشناسی که معادل چهار سال تحصیل دانشگاهی است.',
    ageRange: '۱۸-۲۲ سال',
    duration: '۴ سال',
    nextLevel: 'کارشناسی ارشد',
    category: 'university-levels' as const
  },
  {
    value: 'master-degree',
    label: 'کارشناسی ارشد',
    description: 'مقطع کارشناسی ارشد که معادل دو سال تحصیل پس از کارشناسی است.',
    ageRange: '۲۲-۲۴ سال',
    duration: '۲ سال',
    nextLevel: 'دکتری',
    category: 'university-levels' as const
  },
  {
    value: 'doctorate-degree',
    label: 'دکتری',
    description: 'مقطع دکتری که بالاترین مقطع تحصیلی و معادل چهار سال تحصیل پس از کارشناسی ارشد است.',
    ageRange: '۲۴+ سال',
    duration: '۴ سال',
    nextLevel: 'پایان تحصیلات رسمی',
    category: 'university-levels' as const
  }
];

// Field of Study Data with Category Information
const fieldOfStudyData = FIELD_OF_STUDY.map(field => {
  const label = FIELD_OF_STUDY_LABELS[field as keyof typeof FIELD_OF_STUDY_LABELS];
  const category = getCategoryByField(field);
  const categoryLabel = getCategoryLabel(category);
  const categoryDescription = getCategoryDescription(category);
  
  return {
    value: field,
    label,
    category,
    categoryLabel,
    categoryDescription
  };
});

// Helper functions for field categorization
function getCategoryByField(field: string): 'high-school' | 'engineering' | 'basic-science' | 'humanities' | 'medical' | 'art' | 'agriculture' | 'other' {
  const highSchoolFields = ['math-physics', 'experimental-sciences', 'humanities', 'technical-vocational'];
  const engineeringFields = [
    'computer-engineering', 'electrical-engineering', 'mechanical-engineering', 
    'civil-engineering', 'chemical-engineering', 'industrial-engineering',
    'aerospace-engineering', 'biomedical-engineering'
  ];
  const basicScienceFields = [
    'pure-mathematics', 'applied-mathematics', 'physics', 'chemistry', 'biology',
    'geology', 'statistics', 'computer-science'
  ];
  const humanitiesFields = [
    'law', 'economics', 'management', 'psychology', 'sociology',
    'political-science', 'history', 'philosophy', 'literature',
    'linguistics', 'archaeology', 'geography'
  ];
  const medicalFields = [
    'medicine', 'dentistry', 'pharmacy', 'nursing', 'veterinary',
    'public-health', 'medical-laboratory', 'physiotherapy'
  ];
  const artFields = [
    'fine-arts', 'music', 'theater', 'cinema', 'graphic-design',
    'architecture', 'urban-planning'
  ];
  const agricultureFields = [
    'agriculture', 'horticulture', 'animal-science', 'forestry'
  ];

  if (highSchoolFields.includes(field)) return 'high-school';
  if (engineeringFields.includes(field)) return 'engineering';
  if (basicScienceFields.includes(field)) return 'basic-science';
  if (humanitiesFields.includes(field)) return 'humanities';
  if (medicalFields.includes(field)) return 'medical';
  if (artFields.includes(field)) return 'art';
  if (agricultureFields.includes(field)) return 'agriculture';
  return 'other';
}

function getCategoryLabel(category: 'high-school' | 'engineering' | 'basic-science' | 'humanities' | 'medical' | 'art' | 'agriculture' | 'other'): string {
  const labels = {
    'high-school': 'رشته‌های دبیرستان',
    'engineering': 'رشته‌های مهندسی',
    'basic-science': 'علوم پایه',
    'humanities': 'علوم انسانی',
    'medical': 'علوم پزشکی',
    'art': 'هنر',
    'agriculture': 'کشاورزی',
    'other': 'سایر'
  };
  return labels[category];
}

function getCategoryDescription(category: 'high-school' | 'engineering' | 'basic-science' | 'humanities' | 'medical' | 'art' | 'agriculture' | 'other'): string {
  const descriptions = {
    'high-school': 'رشته‌های تحصیلی دوره متوسطه',
    'engineering': 'رشته‌های مهندسی و فناوری',
    'basic-science': 'رشته‌های علوم پایه و ریاضی',
    'humanities': 'رشته‌های علوم انسانی و اجتماعی',
    'medical': 'رشته‌های پزشکی و بهداشت',
    'art': 'رشته‌های هنری و طراحی',
    'agriculture': 'رشته‌های کشاورزی و منابع طبیعی',
    'other': 'سایر رشته‌های تحصیلی'
  };
  return descriptions[category];
}

async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-edu';
    await mongoose.connect(mongoUri);
    console.log('✅ اتصال به پایگاه داده برقرار شد');
  } catch (error) {
    console.error('❌ خطا در اتصال به پایگاه داده:', error);
    process.exit(1);
  }
}

async function seedCourseTypes() {
  try {
    console.log('🔄 در حال پر کردن انواع درس...');
    
    // حذف داده‌های قبلی
    await CourseType.deleteMany({});
    
    // اضافه کردن داده‌های جدید
    const result = await CourseType.insertMany(courseTypesData);
    
    console.log(`✅ ${result.length} نوع درس با موفقیت اضافه شد`);
    
    // نمایش آمار
    const stats = await CourseType.aggregate([
      { $group: { _id: '$isActive', count: { $sum: 1 } } }
    ]);
    
    console.log('📊 آمار انواع درس:');
    stats.forEach(stat => {
      console.log(`  - ${stat._id ? 'فعال' : 'غیرفعال'}: ${stat.count}`);
    });
    
  } catch (error) {
    console.error('❌ خطا در پر کردن انواع درس:', error);
    throw error;
  }
}

async function seedGrades() {
  try {
    console.log('🔄 در حال پر کردن مقاطع تحصیلی...');
    
    // حذف داده‌های قبلی
    await Grade.deleteMany({});
    
    // اضافه کردن داده‌های جدید
    const result = await Grade.insertMany(gradesData);
    
    console.log(`✅ ${result.length} مقطع تحصیلی با موفقیت اضافه شد`);
    
    // نمایش آمار
    const stats = await Grade.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    console.log('📊 آمار مقاطع تحصیلی:');
    stats.forEach(stat => {
      const categoryName = stat._id === 'school-levels' ? 'مقاطع مدرسه‌ای' : 'مقاطع دانشگاهی';
      console.log(`  - ${categoryName}: ${stat.count}`);
    });
    
  } catch (error) {
    console.error('❌ خطا در پر کردن مقاطع تحصیلی:', error);
    throw error;
  }
}

async function seedFieldOfStudy() {
  try {
    console.log('🔄 در حال پر کردن رشته‌های تحصیلی...');
    
    // حذف داده‌های قبلی
    await FieldOfStudy.deleteMany({});
    
    // اضافه کردن داده‌های جدید
    const result = await FieldOfStudy.insertMany(fieldOfStudyData);
    
    console.log(`✅ ${result.length} رشته تحصیلی با موفقیت اضافه شد`);
    
    // نمایش آمار
    const stats = await FieldOfStudy.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    console.log('📊 آمار رشته‌های تحصیلی:');
    stats.forEach(stat => {
      console.log(`  - ${stat._id}: ${stat.count}`);
    });
    
  } catch (error) {
    console.error('❌ خطا در پر کردن رشته‌های تحصیلی:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 شروع عملیات seed متادیتای دروس...\n');
    
    await connectDatabase();
    
    await seedCourseTypes();
    console.log('');
    
    await seedGrades();
    console.log('');
    
    await seedFieldOfStudy();
    console.log('');
    
    console.log('🎉 عملیات seed با موفقیت تکمیل شد!');
    
  } catch (error) {
    console.error('❌ خطا در عملیات seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 اتصال پایگاه داده قطع شد');
  }
}

// اجرای اسکریپت
if (require.main === module) {
  main();
}

export default main; 