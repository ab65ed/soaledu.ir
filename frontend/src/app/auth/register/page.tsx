"use client"

import { motion } from 'framer-motion';
import { RegisterHeader } from '@/components/auth/RegisterHeader';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { LoginFooter } from '@/components/auth/LoginFooter';

/**
 * صفحه ثبت نام - صفحه اصلی ثبت نام کاربران جدید
 * 
 * ویژگی‌ها:
 * - پشتیبانی از تمام نقش‌های کاربری (Admin, Designer, Learner, Expert, Support)
 * - طراحی ریسپانسیو و RTL
 * - انیمیشن‌های جذاب با Framer Motion
 * - اعتبارسنجی کامل با Zod
 * - امنیت بالا با Rate Limiting
 * - پس‌زمینه پیشرفته با انیمیشن‌های particle
 */

export default function RegisterPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: 'var(--font-family-yekanbakh)' }}>
      {/* پس‌زمینه گرادیانت روشن‌تر با کنتراست بهتر */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            hsl(220, 20%, 85%) 0%, 
            hsl(230, 25%, 90%) 25%, 
            hsl(240, 30%, 95%) 75%, 
            hsl(250, 20%, 97%) 100%)`
        }}
      />
      
      {/* شبکه نقطه‌ای ملایم‌تر */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(105, 54, 245, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* عناصر هندسی قابل رؤیت‌تر */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute z-5"
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${Math.random() * 60 + 20}%`,
            left: `${Math.random() * 60 + 20}%`,
          }}
        >
          {i % 3 === 0 ? (
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-purple-500/40" />
          ) : i % 2 === 0 ? (
            <div className="w-5 h-5 rounded-full bg-indigo-500/35 border border-indigo-400/50" />
          ) : (
            <div className="w-5 h-5 bg-blue-500/35 rotate-45 rounded-sm border border-blue-400/50" />
          )}
        </motion.div>
      ))}
      
      {/* ذرات قابل رؤیت‌تر */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute z-5 ${i % 3 === 0 ? 'w-3 h-3' : 'w-2 h-2'} ${i % 2 === 0 ? 'bg-purple-500/40' : 'bg-indigo-500/35'} rounded-full border ${i % 2 === 0 ? 'border-purple-400/60' : 'border-indigo-400/50'}`}
          animate={{
            y: [-15, -30, -15],
            x: [-8, 8, -8],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${Math.random() * 70 + 15}%`,
            left: `${Math.random() * 70 + 15}%`,
          }}
        />
      ))}
      
      {/* اورلی ملایم */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 70%, 
            rgba(105, 54, 245, 0.12) 0%, 
            transparent 60%), 
          radial-gradient(circle at 70% 30%, 
            rgba(155, 135, 245, 0.08) 0%, 
            transparent 60%)`
        }}
      />
      
      {/* محتوای اصلی با layout responsive بهتر */}
      <div className="relative z-10 min-h-screen p-4">
        {/* Container برای دسکتاپ */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* بخش چپ - محتوای اضافی برای دسکتاپ */}
            <div className="hidden lg:block lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-right"
              >
                <h1 className="text-4xl xl:text-5xl font-bold text-gray-800 mb-6">
                  به خانواده سوال‌ساز بپیوندید
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  حساب کاربری خود را ایجاد کنید و از امکانات پیشرفته پلتفرم بهره‌مند شوید
                </p>
                
                {/* ویژگی‌ها */}
                <div className="space-y-6">
                  {[
                    { icon: '🚀', title: 'شروع سریع', desc: 'ثبت نام آسان در کمتر از ۲ دقیقه' },
                    { icon: '🔒', title: 'امنیت بالا', desc: 'حفاظت از اطلاعات شخصی با بالاترین استانداردها' },
                    { icon: '📚', title: 'دسترسی کامل', desc: 'دسترسی به تمام آزمون‌ها و سوالات' },
                    { icon: '💡', title: 'پشتیبانی ۲۴/۷', desc: 'تیم پشتیبانی همیشه در خدمت شما' }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40"
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* بخش راست - فرم ثبت نام */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }}
                className="w-full max-w-md mx-auto lg:max-w-none"
              >
                {/* کارت فرم با پس‌زمینه سفید و شفافیت بهتر */}
                <div 
                  className="relative backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.9) 0%, 
                      rgba(255, 255, 255, 0.85) 100%)`,
                    boxShadow: `
                      0 20px 40px -12px rgba(105, 54, 245, 0.15),
                      0 8px 16px -4px rgba(0, 0, 0, 0.1),
                      0 0 0 1px rgba(255, 255, 255, 0.2)
                    `
                  }}
                >
                  {/* افکت نوری بالای کارت */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(105, 54, 245, 0.4), transparent)'
                    }}
                  />
                  
                  {/* محتوای کارت */}
                  <div className="p-8">
                    <RegisterHeader />
                    <RegisterForm />
                    <LoginFooter />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 