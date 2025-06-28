/**
 * Script to seed initial courses data
 * اسکریپت برای اضافه کردن دروس اولیه
 */

import mongoose from 'mongoose';
import Course from '../models/Course';
import { MONGO_URI } from '../config/env';

const initialCourses = [
  // دروس عمومی
  {
    title: 'زبان و ادبیات فارسی',
    description: 'آموزش زبان و ادبیات فارسی شامل دستور زبان، املا، و تحلیل متون ادبی',
    category: 'دروس عمومی',
    grade: 'عمومی',
    courseType: 'literature',
    group: 'literature-humanities',
    isActive: true
  },
  {
    title: 'معارف اسلامی',
    description: 'آموزش معارف اسلامی شامل عقاید، اخلاق، و احکام',
    category: 'دروس عمومی',
    grade: 'عمومی',
    courseType: 'general',
    group: 'general',
    isActive: true
  },
  {
    title: 'زبان انگلیسی',
    description: 'آموزش زبان انگلیسی شامل گرامر، واژگان، و مهارت‌های چهارگانه',
    category: 'دروس عمومی',
    grade: 'عمومی',
    courseType: 'general',
    group: 'general',
    isActive: true
  },
  {
    title: 'ریاضی و آمار',
    description: 'آموزش مبانی ریاضی و آمار برای رشته‌های مختلف',
    category: 'دروس پایه',
    grade: 'عمومی',
    courseType: 'mathematics',
    group: 'math-physics',
    isActive: true
  },
  {
    title: 'اطلاعات عمومی',
    description: 'آموزش اطلاعات عمومی در زمینه‌های مختلف علمی و فرهنگی',
    category: 'دروس عمومی',
    grade: 'عمومی',
    courseType: 'general',
    group: 'general',
    isActive: true
  },

  // دروس پایه کامپیوتر
  {
    title: 'مبانی کامپیوتر',
    description: 'آموزش مبانی علوم کامپیوتر شامل سخت‌افزار، نرم‌افزار، و سیستم‌های کامپیوتری',
    category: 'دروس پایه کامپیوتر',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'برنامه نویسی',
    description: 'آموزش مبانی برنامه نویسی با زبان‌های مختلف و الگوریتم‌های پایه',
    category: 'دروس پایه کامپیوتر',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'شبکه های کامپیوتری',
    description: 'آموزش مفاهیم شبکه‌های کامپیوتری، پروتکل‌ها، و معماری شبکه',
    category: 'دروس پایه کامپیوتر',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'پایگاه داده',
    description: 'آموزش سیستم‌های پایگاه داده، طراحی دیتابیس، و زبان SQL',
    category: 'دروس پایه کامپیوتر',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'سیستم های عامل',
    description: 'آموزش مفاهیم سیستم‌های عامل، مدیریت منابع، و فرآیندها',
    category: 'دروس پایه کامپیوتر',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'ساختمان داده و الگوریتم ها',
    description: 'آموزش ساختارهای داده مختلف و الگوریتم‌های کارآمد',
    category: 'دروس پایه کامپیوتر',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'ذخیره و بازیابی اطلاعات',
    description: 'آموزش سیستم‌های ذخیره‌سازی و بازیابی اطلاعات',
    category: 'دروس پایه کامپیوتر',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },

  // دروس اختصاصی
  {
    title: 'مهندسی نرم افزار',
    description: 'آموزش فرآیند توسعه نرم‌افزار، مدیریت پروژه، و کیفیت نرم‌افزار',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'معماری کامپیوتر',
    description: 'آموزش معماری سخت‌افزار کامپیوتر و طراحی پردازنده',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'امنیت شبکه',
    description: 'آموزش مفاهیم امنیت در شبکه‌های کامپیوتری و روش‌های محافظت',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'سیستم های اطلاعات مدیریت',
    description: 'آموزش طراحی و پیاده‌سازی سیستم‌های اطلاعاتی در سازمان‌ها',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'ساختمان گسسته',
    description: 'آموزش ریاضیات گسسته شامل گراف، منطق، و ترکیبیات',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'mathematics',
    group: 'computer',
    isActive: true
  },
  {
    title: 'برنامه نویسی پیشرفته',
    description: 'آموزش تکنیک‌های پیشرفته برنامه نویسی و الگوهای طراحی',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'توسعه برنامه سازی و پایگاه داده',
    description: 'آموزش توسعه برنامه‌های کاربردی با استفاده از پایگاه داده',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },
  {
    title: 'پیاده سازی سیستم های اطلاعاتی و طراحی وب',
    description: 'آموزش پیاده‌سازی سیستم‌های اطلاعاتی و طراحی وب‌سایت',
    category: 'دروس اختصاصی',
    grade: 'کارشناسی',
    courseType: 'computer-science',
    group: 'computer',
    isActive: true
  },

  // دروس فنی
  {
    title: 'دانش فنی پایه – شبکه و نرم افزار رایانه ای',
    description: 'آموزش دانش فنی پایه در زمینه شبکه و نرم‌افزارهای رایانه‌ای',
    category: 'دروس فنی',
    grade: 'فنی',
    courseType: 'technical',
    group: 'technical',
    isActive: true
  },
  {
    title: 'دانش فنی تخصصی – شبکه و نرم افزار رایانه ای',
    description: 'آموزش دانش فنی تخصصی در زمینه شبکه و نرم‌افزارهای رایانه‌ای',
    category: 'دروس فنی',
    grade: 'فنی',
    courseType: 'technical',
    group: 'technical',
    isActive: true
  },
  {
    title: 'نصب و راه اندازی سیستم های رایانه ای',
    description: 'آموزش نصب، راه‌اندازی، و نگهداری سیستم‌های رایانه‌ای',
    category: 'دروس فنی',
    grade: 'فنی',
    courseType: 'technical',
    group: 'technical',
    isActive: true
  },
  {
    title: 'تولید محتوای الکترونیک و برنامه سازی',
    description: 'آموزش تولید محتوای دیجیتال و برنامه‌نویسی کاربردی',
    category: 'دروس فنی',
    grade: 'فنی',
    courseType: 'technical',
    group: 'technical',
    isActive: true
  }
];

async function seedCourses() {
  try {
    console.log('🔗 اتصال به پایگاه داده...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ اتصال به پایگاه داده برقرار شد');

    // بررسی وجود دروس قبلی
    const existingCoursesCount = await Course.countDocuments();
    if (existingCoursesCount > 0) {
      console.log(`⚠️  ${existingCoursesCount} درس در پایگاه داده موجود است`);
      console.log('آیا می‌خواهید دروس موجود را حذف کنید؟ (y/N)');
      
      // در محیط production باید از readline استفاده کنیم
      // اما برای سادگی، دروس موجود را حذف می‌کنیم
      await Course.deleteMany({});
      console.log('🗑️  تمام دروس قبلی حذف شدند');
    }

    // اضافه کردن دروس جدید
    console.log(`📚 در حال اضافه کردن ${initialCourses.length} درس...`);
    const createdCourses = await Course.insertMany(initialCourses);
    
    console.log(`✅ ${createdCourses.length} درس با موفقیت اضافه شد:`);
    createdCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} (${course.category})`);
    });

    // نمایش آمار دسته‌بندی‌ها
    const categoriesStats = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 آمار دسته‌بندی‌ها:');
    categoriesStats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count} درس`);
    });

    console.log('\n🎉 عملیات seed با موفقیت انجام شد!');
  } catch (error) {
    console.error('❌ خطا در عملیات seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 اتصال پایگاه داده بسته شد');
    process.exit(0);
  }
}

// اجرای اسکریپت
if (require.main === module) {
  seedCourses();
}

export { seedCourses, initialCourses }; 