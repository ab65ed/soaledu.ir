'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, BookOpen, Target, BarChart3 } from 'lucide-react';
import PlatformDemo from './PlatformDemo';
import StatsSection from './StatsSection';

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const floatingVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-bl from-white via-gray-50/50 to-convrt-purple/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.5 }}
          className="absolute top-20 left-10 w-16 h-16 bg-convrt-purple/10 rounded-full blur-xl animate-floating"
        />
        <motion.div
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 2 }}
          className="absolute top-1/3 right-20 w-24 h-24 bg-convrt-purple-light/15 rounded-full blur-2xl animate-floating"
          style={{ animationDelay: '2s' }}
        />
        <motion.div
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 2.5 }}
          className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-convrt-purple/8 rounded-full blur-xl animate-floating"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="container mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-2 rounded-full bg-convrt-purple/10 text-convrt-purple mb-6">
            <Users className="w-4 h-4 ml-2" />
            <span className="text-sm font-medium font-inter">پلتفرم طراحی آزمون و جامعه طراحان سوال</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={itemVariants} className="heading-xl text-convrt-dark-blue mb-6 max-w-4xl mx-auto">
            آزمون‌های خود را با 
            <span className="gradient-text"> سوال جو </span>
            حرفه‌ای کنید
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            بهترین پلتفرم برای طراحی آزمون‌های تستی، مدیریت بانک سوالات و تحلیل نتایج. 
            به جامعه‌ای از طراحان حرفه‌ای سوال بپیوندید.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="button-primary flex items-center text-lg px-8 py-4 shadow-lg shadow-convrt-purple/20 group">
              همین حالا شروع کنید
              <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </button>
            
            <button className="button-outline flex items-center text-lg px-8 py-4 group">
              <BookOpen className="ml-2 w-5 h-5" />
              راهنما و آموزش
            </button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 mb-16">
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <Target className="w-4 h-4 text-convrt-purple ml-2" />
              <span className="text-sm font-medium text-convrt-dark-blue">طراحی آزمون هوشمند</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <BookOpen className="w-4 h-4 text-convrt-purple ml-2" />
              <span className="text-sm font-medium text-convrt-dark-blue">بانک سوالات گسترده</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <BarChart3 className="w-4 h-4 text-convrt-purple ml-2" />
              <span className="text-sm font-medium text-convrt-dark-blue">تحلیل آماری پیشرفته</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Platform Demo */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <PlatformDemo />
        </motion.div>

        {/* Stats Section */}
        <StatsSection statsRef={statsRef} />
      </div>
    </section>
  );
};

export default Hero; 