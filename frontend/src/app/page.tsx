/**
 * Home Page - صفحه خانه
 * صفحه اصلی سامانه آزمون‌های آنلاین با طراحی مدرن و رنگ‌های theme
 */

'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { theme, applyCSSVariables } from '../theme.js'

export default function HomePage() {
  useEffect(() => {
    applyCSSVariables()
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
      {/* Header */}
      <header className="backdrop-blur-sm border-b" style={{ 
        backgroundColor: `${theme.colors.secondary}CC`, 
        borderColor: theme.colors.accent 
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ 
                backgroundColor: theme.colors.black 
              }}>
                <span className="font-bold text-xl" style={{ color: theme.colors.primary }}>س</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: theme.colors.black }}>سؤال‌جو</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Link href="/" className="font-medium transition-colors hover:opacity-80" style={{ color: theme.colors.black }}>
                خانه
              </Link>
              <Link href="/course-exam" className="font-medium transition-colors hover:opacity-80" style={{ color: theme.colors.black }}>
                آزمون درس
              </Link>
              <Link href="/test" className="font-medium transition-colors hover:opacity-80" style={{ color: theme.colors.black }}>
                تست آزمایشی
              </Link>
              <Link href="/questions" className="font-medium transition-colors hover:opacity-80" style={{ color: theme.colors.black }}>
                بانک سؤالات
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button className="px-6 py-2 font-medium transition-all duration-200 rounded-lg hover:opacity-80" style={{ 
                color: theme.colors.black,
                backgroundColor: 'transparent'
              }}>
                ورود
              </button>
              <button className="px-8 py-3 font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-105" style={{ 
                backgroundColor: theme.colors.black,
                color: theme.colors.primary
              }}>
                ثبت‌نام رایگان
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="py-20 sm:py-32 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
            <div className="absolute top-40 right-20 w-24 h-24 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-right">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{ color: theme.colors.black }}>
                  <span className="block mb-2">سؤال‌جو</span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl opacity-80">
                    مسیر موفقیت در کنکور
                  </span>
                </h1>
                
                <p className="text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90" style={{ color: theme.colors.black }}>
                  پلتفرم هوشمند آمادگی کنکور با هزاران سؤال تخصصی، آزمون‌های شبیه‌سازی شده و تحلیل دقیق عملکرد
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/course-exam"
                    className="group px-10 py-4 font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 text-center"
                    style={{ 
                      backgroundColor: theme.colors.black,
                      color: theme.colors.primary
                    }}
                  >
                    شروع آزمون‌سازی
                    <span className="mr-2 group-hover:mr-3 transition-all duration-300">←</span>
                  </Link>
                  <Link
                    href="/test"
                    className="px-10 py-4 border-2 font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-xl text-center"
                    style={{ 
                      borderColor: theme.colors.accent,
                      color: theme.colors.black,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement
                      target.style.backgroundColor = theme.colors.accent
                      target.style.color = theme.colors.primary
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement
                      target.style.backgroundColor = 'transparent'
                      target.style.color = theme.colors.black
                    }}
                  >
                    آزمون رایگان
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t" style={{ borderColor: theme.colors.accent }}>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.black }}>+۱۰۰۰</div>
                    <div className="text-sm opacity-70" style={{ color: theme.colors.black }}>دانشجوی موفق</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.black }}>۹۵٪</div>
                    <div className="text-sm opacity-70" style={{ color: theme.colors.black }}>نرخ موفقیت</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.black }}>۵۰+</div>
                    <div className="text-sm opacity-70" style={{ color: theme.colors.black }}>دانشگاه برتر</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/images/konkur-hero.svg"
                    alt="کنکور سراسری - آمادگی برای موفقیت"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: theme.colors.accent }}></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-15" style={{ backgroundColor: theme.colors.secondary }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20" style={{ backgroundColor: theme.colors.secondary }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: theme.colors.black }}>
                امکانات پیشرفته سؤال‌جو
              </h2>
              <p className="text-xl opacity-80" style={{ color: theme.colors.black }}>
                ابزارهای هوشمند برای آمادگی کامل کنکور
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105" style={{ 
                backgroundColor: theme.colors.primary,
                border: `2px solid ${theme.colors.accent}`
              }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ 
                  backgroundColor: theme.colors.accent 
                }}>
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: theme.colors.black }}></div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: theme.colors.black }}>آزمون‌های شبیه‌سازی</h3>
                <p className="opacity-80 leading-relaxed" style={{ color: theme.colors.black }}>
                  آزمون‌های کاملاً شبیه‌سازی شده کنکور با زمان‌بندی دقیق و سؤالات استандارد
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105" style={{ 
                backgroundColor: theme.colors.primary,
                border: `2px solid ${theme.colors.accent}`
              }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ 
                  backgroundColor: theme.colors.secondary 
                }}>
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: theme.colors.black }}></div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: theme.colors.black }}>بانک سؤالات غنی</h3>
                <p className="opacity-80 leading-relaxed" style={{ color: theme.colors.black }}>
                  هزاران سؤال تخصصی در تمام رشته‌ها با پاسخ‌های تشریحی کامل
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105" style={{ 
                backgroundColor: theme.colors.primary,
                border: `2px solid ${theme.colors.accent}`
              }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ 
                  backgroundColor: theme.colors.accent 
                }}>
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: theme.colors.black }}></div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: theme.colors.black }}>تحلیل هوشمند</h3>
                <p className="opacity-80 leading-relaxed" style={{ color: theme.colors.black }}>
                  گزارش‌های دقیق عملکرد و نقاط قوت و ضعف با راهکارهای بهبود
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20" style={{ backgroundColor: theme.colors.primary }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/students-success.svg"
                  alt="موفقیت دانشجویان"
                  width={500}
                  height={350}
                  className="w-full h-auto rounded-3xl shadow-xl"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6" style={{ color: theme.colors.black }}>
                  داستان‌های موفقیت
                </h2>
                <p className="text-xl mb-8 leading-relaxed opacity-90" style={{ color: theme.colors.black }}>
                  هزاران دانشجو با استفاده از سؤال‌جو به دانشگاه‌های مطرح کشور راه یافته‌اند. 
                  آن‌ها با تمرین مستمر و استفاده از ابزارهای هوشمند ما، رؤیای خود را محقق کردند.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.accent }}>
                      <span className="font-bold" style={{ color: theme.colors.primary }}>✓</span>
                    </div>
                    <span className="text-lg" style={{ color: theme.colors.black }}>بیش از ۱۰۰۰ دانشجوی قبولی در رشته‌های مختلف</span>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.accent }}>
                      <span className="font-bold" style={{ color: theme.colors.primary }}>✓</span>
                    </div>
                    <span className="text-lg" style={{ color: theme.colors.black }}>۹۵ درصد نرخ موفقیت در کنکور سراسری</span>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.accent }}>
                      <span className="font-bold" style={{ color: theme.colors.primary }}>✓</span>
                    </div>
                    <span className="text-lg" style={{ color: theme.colors.black }}>قبولی در بیش از ۵۰ دانشگاه برتر کشور</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20" style={{ backgroundColor: theme.colors.secondary }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ color: theme.colors.black }}>
              آماده شروع هستید؟
            </h2>
            <p className="text-xl mb-8 opacity-90" style={{ color: theme.colors.black }}>
              همین امروز مسیر موفقیت خود را در کنکور آغاز کنید
            </p>
            <Link
              href="/course-exam"
              className="inline-block px-12 py-4 font-bold text-xl rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
              style={{ 
                backgroundColor: theme.colors.black,
                color: theme.colors.primary
              }}
            >
              شروع رایگان
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16" style={{ backgroundColor: theme.colors.black }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
                  backgroundColor: theme.colors.primary 
                }}>
                  <span className="font-bold text-xl" style={{ color: theme.colors.black }}>س</span>
                </div>
                <span className="text-2xl font-bold" style={{ color: theme.colors.primary }}>سؤال‌جو</span>
              </div>
              <p className="text-lg leading-relaxed opacity-80" style={{ color: theme.colors.primary }}>
                پلتفرم هوشمند آمادگی کنکور که هزاران دانشجو را به موفقیت رسانده است.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.primary }}>دسترسی سریع</h3>
              <ul className="space-y-2">
                <li><Link href="/course-exam" className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: theme.colors.primary }}>آزمون درس</Link></li>
                <li><Link href="/test" className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: theme.colors.primary }}>تست آزمایشی</Link></li>
                <li><Link href="/questions" className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: theme.colors.primary }}>بانک سؤالات</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.primary }}>تماس با ما</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: theme.colors.primary }}>پشتیبانی</Link></li>
                <li><span className="opacity-80" style={{ color: theme.colors.primary }}>۰۲۱-۱۲۳۴۵۶۷۸</span></li>
                <li><span className="opacity-80" style={{ color: theme.colors.primary }}>info@soalejo.ir</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center" style={{ borderColor: theme.colors.accent }}>
            <p className="opacity-70" style={{ color: theme.colors.primary }}>
              © ۱۴۰۳ سؤال‌جو. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

