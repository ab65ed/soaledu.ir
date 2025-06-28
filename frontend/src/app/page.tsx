'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  Sparkles, 
  BookOpen, 
  Users, 
  Award,
  Star,
  Play,
  ChevronDown,
  Target,
  Brain,
  Clock,
  Shield
} from 'lucide-react';
import PlatformDemo from '@/components/organisms/Hero/PlatformDemo';

const ModernHomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    setIsLoaded(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
    );

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('section').forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const stats = [
    { number: "50,000+", label: "دانش‌آموز موفق", icon: Users },
    { number: "10,000+", label: "آزمون برگزار شده", icon: BookOpen },
    { number: "95%", label: "رضایت کاربران", icon: Award },
    { number: "24/7", label: "پشتیبانی", icon: Shield }
  ];

  const features = [
    {
      icon: Target,
      title: "آزمون‌های هدفمند",
      description: "طراحی آزمون‌های تخصصی متناسب با نیاز هر رشته و مقطع تحصیلی",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Brain,
      title: "تحلیل هوشمند",
      description: "بررسی دقیق عملکرد و ارائه راهکارهای بهبود با استفاده از هوش مصنوعی",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Clock,
      title: "یادگیری سریع",
      description: "روش‌های نوین آموزش برای کاهش زمان یادگیری و افزایش کیفیت",
      color: "from-green-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">سوال جو</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-8 space-x-reverse"
            >
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">ویژگی‌ها</a>
              <a href="#stats" className="text-gray-600 hover:text-blue-600 transition-colors">آمار</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">نظرات</a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                شروع کنید
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
            alt="دانش‌آموزان در حال مطالعه"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { left: 15, top: 20, delay: 0, duration: 4 },
            { left: 85, top: 10, delay: 1, duration: 5 },
            { left: 70, top: 70, delay: 0.5, duration: 3.5 },
            { left: 25, top: 80, delay: 1.5, duration: 4.5 },
            { left: 90, top: 45, delay: 0.8, duration: 3.8 },
            { left: 40, top: 15, delay: 2, duration: 4.2 }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 mb-6">
                <Sparkles className="w-4 h-4 ml-2" />
                <span className="text-sm font-medium">پلتفرم هوشمند آزمون‌سازی</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  آینده آموزش
                </span>
                <br />
                <span className="text-gray-900">در دستان شماست</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                با سوال جو، آزمون‌های استاندارد و حرفه‌ای بسازید. 
                از تحلیل‌های هوشمند استفاده کنید و موفقیت دانش‌آموزانتان را تضمین کنید.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center">
                شروع رایگان
                <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
              
              <button className="group flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center ml-3 group-hover:shadow-xl transition-shadow">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">مشاهده ویدیو معرفی</span>
              </button>
            </motion.div>

                         <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="relative max-w-6xl mx-auto"
             >
               <PlatformDemo />
             </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              اعتماد هزاران کاربر
            </h2>
            <p className="text-xl text-blue-100">
              آمار واقعی از عملکرد پلتفرم سوال جو
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ویژگی‌های منحصر به فرد
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              با ابزارهای پیشرفته و تکنولوژی روز، بهترین آزمون‌ها را بسازید
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              نظرات کاربران
            </h2>
            <p className="text-xl text-gray-600">
              تجربه واقعی معلمان و دانش‌آموزان از سوال جو
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "دکتر احمد رضایی",
                role: "دبیر ریاضی",
                content: "سوال جو کیفیت آزمون‌های من را به طور چشمگیری بهبود داده. حالا می‌توانم آزمون‌های استاندارد و حرفه‌ای بسازم.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                name: "مریم احمدی",
                role: "دانش‌آموز کنکور",
                content: "با آزمون‌های سوال جو، نقاط ضعفم رو شناختم و توانستم نمره‌ام رو ۳۰ درصد بهبود بدم.",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                name: "علی محمدی",
                role: "مدیر آموزشگاه",
                content: "پلتفرم فوق‌العاده‌ای است. تحلیل‌های دقیق و گزارش‌های جامع، کار ما را خیلی آسان کرده.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ml-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="دانش‌آموزان موفق"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              آماده‌اید شروع کنید؟
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              به هزاران معلم و دانش‌آموزی بپیوندید که با سوال جو به موفقیت رسیده‌اند
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button className="group bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 flex items-center">
                شروع رایگان - بدون نیاز به کارت اعتباری
                <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                <Check className="w-5 h-5 ml-2" />
                <span>بدون محدودیت زمانی</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 ml-2" />
                <span>پشتیبانی ۲۴ ساعته</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 ml-2" />
                <span>آپدیت‌های رایگان</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">سوال جو</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                پلتفرم هوشمند آزمون‌سازی برای معلمان و دانش‌آموزان ایرانی
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">محصولات</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">آزمون‌ساز</a></li>
                <li><a href="#" className="hover:text-white transition-colors">بانک سوال</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تحلیل نتایج</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">پشتیبانی</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">راهنما</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تماس با ما</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سوالات متداول</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">شرکت</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">درباره ما</a></li>
                <li><a href="#" className="hover:text-white transition-colors">حریم خصوصی</a></li>
                <li><a href="#" className="hover:text-white transition-colors">شرایط استفاده</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} سوال جو. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernHomePage; 