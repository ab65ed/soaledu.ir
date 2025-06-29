/**
 * Seed script for courses
 * اسکریپت پر کردن جدول دروس
 */

import mongoose from 'mongoose';
import Course from '../models/Course';
import { MONGO_URI } from '../config/env';

const courses = [
  // دروس عمومی - دیپلم
  {
    title: 'زبان و ادبیات فارسی',
    description: 'آموزش زبان و ادبیات فارسی شامل نحو، صرف، و ادبیات کلاسیک',
    category: 'دروس عمومی',
    grade: 'دیپلم',
    courseType: 'general',
    fieldOfStudy: 'literature'
  },
  {
    title: 'ریاضی عمومی',
    description: 'آموزش مبانی ریاضی شامل جبر، هندسه، و آمار',
    category: 'دروس عمومی',
    grade: 'دیپلم',
    courseType: 'general',
    fieldOfStudy: 'mathematics'
  },
  {
    title: 'زبان انگلیسی',
    description: 'آموزش زبان انگلیسی شامل گرامر، واژگان، و مهارت‌های چهارگانه',
    category: 'دروس عمومی',
    grade: 'دیپلم',
    courseType: 'general',
    fieldOfStudy: 'general'
  },

  // دروس پایه - کارشناسی مهندسی کامپیوتر
  {
    title: 'ریاضی مهندسی',
    description: 'آموزش ریاضی مهندسی شامل حساب دیفرانسیل و انتگرال',
    category: 'دروس پایه',
    grade: 'کارشناسی',
    courseType: 'academic',
    fieldOfStudy: 'computer-engineering'
  },
  {
    title: 'فیزیک عمومی',
    description: 'آموزش مبانی فیزیک شامل مکانیک، الکتریسیته، و مغناطیس',
    category: 'دروس پایه',
    grade: 'کارشناسی',
    courseType: 'academic',
    fieldOfStudy: 'computer-engineering'
  },
  {
    title: 'مبانی برنامه‌نویسی',
    description: 'آموزش مبانی برنامه‌نویسی با زبان C++',
    category: 'دروس پایه',
    grade: 'کارشناسی',
    courseType: 'academic',
    fieldOfStudy: 'computer-engineering'
  },

  // دروس اختصاصی - کارشناسی مهندسی کامپیوتر
  {
    title: 'ساختمان داده و الگوریتم',
    description: 'آموزش ساختمان داده‌ها و طراحی الگوریتم‌های بهینه',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'specialized',
    fieldOfStudy: 'computer-engineering'
  },
  {
    title: 'پایگاه داده',
    description: 'آموزش طراحی و پیاده‌سازی پایگاه‌های داده رابطه‌ای',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'specialized',
    fieldOfStudy: 'computer-engineering'
  },
  {
    title: 'شبکه‌های کامپیوتری',
    description: 'آموزش مفاهیم شبکه، پروتکل‌ها، و امنیت شبکه',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'specialized',
    fieldOfStudy: 'computer-engineering'
  },
  {
    title: 'مهندسی نرم‌افزار',
    description: 'آموزش روش‌های توسعه نرم‌افزار و مدیریت پروژه',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'specialized',
    fieldOfStudy: 'computer-engineering'
  },

  // دروس مهندسی برق
  {
    title: 'مدارهای الکتریکی',
    description: 'آموزش تحلیل مدارهای الکتریکی AC و DC',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'specialized',
    fieldOfStudy: 'electrical-engineering'
  },
  {
    title: 'الکترونیک',
    description: 'آموزش مبانی الکترونیک و طراحی مدارهای آنالوگ و دیجیتال',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'specialized',
    fieldOfStudy: 'electrical-engineering'
  },

  // دروس فنی و حرفه‌ای
  {
    title: 'تعمیرات کامپیوتر',
    description: 'آموزش تعمیر و نگهداری سخت‌افزار کامپیوتر',
    category: 'دروس فنی و حرفه‌ای',
    grade: 'کاردانی',
    courseType: 'skill-based',
    fieldOfStudy: 'computer-engineering'
  },
  {
    title: 'شبکه‌های محلی',
    description: 'آموزش نصب و راه‌اندازی شبکه‌های محلی',
    category: 'دروس فنی و حرفه‌ای',
    grade: 'کاردانی',
    courseType: 'skill-based',
    fieldOfStudy: 'computer-engineering'
  },

  // دروس کارشناسی ارشد
  {
    title: 'هوش مصنوعی',
    description: 'آموزش مفاهیم پیشرفته هوش مصنوعی و یادگیری ماشین',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی ارشد',
    courseType: 'specialized',
    fieldOfStudy: 'computer-engineering'
  },
  {
    title: 'پردازش تصویر',
    description: 'آموزش تکنیک‌های پردازش و تحلیل تصاویر دیجیتال',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی ارشد',
    courseType: 'specialized',
    fieldOfStudy: 'computer-engineering'
  }
];

async function seedCourses() {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to database');

    // حذف دروس موجود
    await Course.deleteMany({});
    console.log('🗑️ Cleared existing courses');

    // اضافه کردن دروس جدید
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // نمایش آمار
    const stats = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Course statistics:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} courses`);
    });

    console.log('\n🎉 Course seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// اجرای اسکریپت
if (require.main === module) {
  seedCourses();
}

export default seedCourses; 