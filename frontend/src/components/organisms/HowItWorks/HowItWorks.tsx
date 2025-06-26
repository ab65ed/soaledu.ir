'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Settings, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "انتخاب سوالات",
      description: "از بانک گسترده سوالات انتخاب کنید یا سوالات جدید ایجاد کنید"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "طراحی آزمون",
      description: "آزمون خود را با ابزارهای پیشرفته طراحی و تنظیم کنید"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "تحلیل نتایج",
      description: "نتایج را تحلیل کرده و گزارش‌های جامع دریافت کنید"
    }
  ];

  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-convrt-dark-blue mb-6">
            چگونه کار می‌کند؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            با سه مرحله ساده، آزمون‌های حرفه‌ای خود را طراحی کنید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-convrt-purple/10 text-convrt-purple mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-convrt-dark-blue mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 