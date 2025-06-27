import React from "react";
import LoginHeader from "@/components/auth/LoginHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginFooter } from "@/components/auth/LoginFooter";
import BackgroundAnimations from "@/components/auth/BackgroundAnimations";

/**
 * صفحه لاگین
 * شامل هدر، فرم، و فوتر
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* انیمیشن‌های پس‌زمینه - فقط client-side */}
      <BackgroundAnimations />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 min-h-screen">
      
          {/* بخش چپ - معرفی پلتفرم */}
          <div className="flex-1 max-w-lg text-center lg:text-right">
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              به پلتفرم آموزشی{' '}
              <span 
                className="font-extrabold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent shadow-lg"
          style={{
                  color: '#EA384C',
                  textShadow: '0 2px 4px rgba(234, 56, 76, 0.3)'
                }}
              >
                سوال‌جو
              </span>
              <br className="block" />
              خوش آمدید
                </h1>
            
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  پلتفرم هوشمند تولید و مدیریت سوالات آزمون با قابلیت‌های پیشرفته A/B Testing
                </p>
                
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-800 mb-2">تولید سوالات هوشمند</h3>
                <p className="text-gray-600 text-sm">ساخت سوالات با کیفیت بالا و متنوع</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-gray-800 mb-2">آنالیز پیشرفته</h3>
                <p className="text-gray-600 text-sm">بررسی عملکرد و آمار دقیق آزمون‌ها</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="font-bold text-gray-800 mb-2">A/B Testing</h3>
                <p className="text-gray-600 text-sm">بهینه‌سازی سوالات با تست‌های مقایسه‌ای</p>
                      </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="font-bold text-gray-800 mb-2">مدیریت مالی</h3>
                <p className="text-gray-600 text-sm">سیستم کیف پول و درآمدزایی طراحان</p>
                </div>
            </div>
            </div>
            
            {/* بخش راست - فرم لاگین */}
          <div className="flex-1 max-w-md w-full">
            <div className="space-y-6">
                      <LoginHeader />
                      <LoginForm />
                      <LoginFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 