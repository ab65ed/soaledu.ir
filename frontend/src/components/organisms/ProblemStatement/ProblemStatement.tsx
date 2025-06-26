'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, FileText, TrendingDown } from 'lucide-react';

const ProblemStatement = () => {
  const problems = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "وقت‌گیر بودن طراحی آزمون",
      description: "طراحی آزمون‌های با کیفیت ساعت‌ها زمان می‌برد"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "کمبود منابع سوال",
      description: "دسترسی محدود به بانک سوالات متنوع و استاندارد"
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "تحلیل ضعیف نتایج",
      description: "عدم وجود ابزارهای تحلیل آماری پیشرفته"
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "عدم استاندارد بودن",
      description: "آزمون‌های غیراستاندارد و عدم تطبیق با معیارهای علمی"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-20 bg-gray-50" id="problems">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-600 mb-6">
            <AlertCircle className="w-4 h-4 ml-2" />
            <span className="text-sm font-medium">چالش‌های موجود</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-convrt-dark-blue mb-6">
            مشکلات طراحی آزمون‌های سنتی
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            معلمان و طراحان سوال با چالش‌های متعددی در طراحی آزمون‌های باکیفیت مواجه هستند
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  {problem.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-convrt-dark-blue mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-convrt-purple/10 to-convrt-purple-light/10 rounded-2xl p-8 border border-convrt-purple/20">
            <h3 className="text-2xl font-bold text-convrt-dark-blue mb-4">
              راه‌حل: سوال جو
            </h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              پلتفرم هوشمند طراحی آزمون که تمام این مشکلات را با استفاده از فناوری‌های نوین حل می‌کند
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemStatement; 