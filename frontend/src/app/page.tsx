'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/organisms/Navbar/Navbar';
import Hero from '@/components/organisms/Hero/Hero';
import ProblemStatement from '@/components/organisms/ProblemStatement/ProblemStatement';
import HowItWorks from '@/components/organisms/HowItWorks/HowItWorks';
import Testimonials from '@/components/organisms/Testimonials/Testimonials';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

const Index = () => {
  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-white dark:bg-convrt-dark-blue overflow-hidden" dir="rtl">
      <div className="fixed w-full z-50">
        <Navbar />
      </div>
      
      <main className="pt-16">
        <Hero />
        <ProblemStatement />
        <HowItWorks />
        <Testimonials />
        
        <section className="py-16 px-6" id="cta">
          <div className="container mx-auto max-w-5xl">
            <div 
              className="rounded-2xl overflow-hidden relative bg-convrt-dark-blue"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="/images/students-success.svg" 
                  alt="تیم همکاری" 
                  className="w-full h-full object-cover object-center opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-convrt-dark-blue via-convrt-dark-blue/90 to-convrt-dark-blue/80"></div>
              </div>
              
              <div className="relative z-10 p-12 md:p-16 text-white">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="max-w-lg mr-auto"
                >
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-convrt-purple/20 text-convrt-purple mb-6">
                    <Sparkles className="w-4 h-4 ml-2" />
                    <span className="text-sm font-medium font-inter tracking-wide">همین حالا شروع کنید</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    آماده‌اید از 
                    <span className="text-[#EA384C] font-extrabold"> معمولی بودن </span> 
                    به 
                    <span className="text-convrt-purple font-extrabold"> تأثیرگذاری </span>
                    برسید؟
                  </h2>
                  
                  <p className="text-lg text-gray-100 mb-8">
                    به صدها طراح سوال و معلمی بپیوندید که آزمون‌های خود را با ابزارهای پیشرفته سوال جو متحول کرده‌اند.
                  </p>
                  
                  <div className="flex flex-col space-y-3 mb-8">
                    {[
                      "طراحی آزمون‌های استاندارد و حرفه‌ای",
                      "بانک سوالات گسترده و دسته‌بندی شده",
                      "تحلیل آماری پیشرفته نتایج"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="w-5 h-5 text-convrt-purple ml-2 flex-shrink-0" />
                        <span className="text-gray-100 text-sm font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="button-primary flex items-center text-lg px-8 py-4 shadow-lg shadow-convrt-purple/10 hover:shadow-xl hover:shadow-convrt-purple/20 rounded-full group"
                  >
                    شروع رایگان - بدون نیاز به کارت اعتباری
                    <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-6 md:mb-0"
            >
              <h3 className="text-2xl font-bold text-convrt-dark-blue">سوال جو</h3>
              <p className="text-sm text-gray-600 mt-2">© {new Date().getFullYear()} سوال جو. تمامی حقوق محفوظ است.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-8 space-x-reverse"
            >
              <a href="#" className="text-gray-600 hover:text-convrt-purple transition-colors">حریم خصوصی</a>
              <a href="#" className="text-gray-600 hover:text-convrt-purple transition-colors">شرایط استفاده</a>
              <a href="#" className="text-gray-600 hover:text-convrt-purple transition-colors">تماس با ما</a>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index; 