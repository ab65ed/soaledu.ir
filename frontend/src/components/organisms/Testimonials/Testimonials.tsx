'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "سوال جو به ما این امکان را داد که آزمون‌های خود را بدون از دست دادن کیفیت، با سرعت بیشتری طراحی کنیم.",
    name: "دکتر احمد رضایی",
    title: "مدیر آموزشی دبیرستان نمونه",
    company: "دبیرستان نمونه تهران",
    logo: "school",
    bgColor: "bg-[#efeaf5]",
  },
  {
    id: 2,
    quote: "با استفاده از بانک سوالات سوال جو، زمان طراحی آزمون‌هایم به نصف کاهش یافت و کیفیت سوالات نیز بهبود پیدا کرد.",
    name: "معلمان ریاضی",
    title: "مدرسه راهنمایی",
    company: "مدرسه راهنمایی فردوسی",
    logo: "math",
    bgColor: "bg-[#fde7dc]",
  },
  {
    id: 3,
    quote: "گزارش‌های تحلیلی سوال جو به من کمک کرد تا نقاط ضعف دانش‌آموزانم را شناسایی کنم.",
    name: "مریم احمدی",
    title: "معلم زبان انگلیسی",
    company: "دبیرستان دخترانه سپهر",
    logo: "language",
    bgColor: "bg-[#e9e9e9]",
  }
];

const stats = [
  {
    id: 1,
    value: "۲۰۰+",
    description: "معلم راضی از خدمات",
    company: "کاربران فعال",
    bgColor: "bg-[#efeaf5]",
  },
  {
    id: 2,
    value: "آموزش و پرورش",
    description: "",
    company: "وزارت آموزش و پرورش",
    bgColor: "bg-white",
  },
  {
    id: 3,
    value: "دانشگاه‌ها",
    description: "",
    company: "مراکز آموزشی",
    bgColor: "bg-white",
  }
];

const Testimonials = () => {
  return (
    <section className="py-8 bg-white" id="testimonials">
      <div className="container-section max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">مورد اعتماد متخصصان آموزش</h2>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {/* Stats box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-4 lg:col-span-3 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${stats[0].bgColor} p-8 flex flex-col`}>
              <div className="mt-auto">
                <div className="text-5xl font-bold mb-2">{stats[0].value}</div>
                <div className="text-gray-600">{stats[0].description}</div>
              </div>
              <div className="mt-auto pt-6">
                <div className="font-bold text-lg">
                  <span className="font-black">سوال</span>•<span className="font-black">جو</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-4 lg:col-span-3 rounded-xl overflow-hidden border border-gray-100"
          >
            <div className="h-full flex items-center justify-center p-6">
              <div className="font-black text-xl">آموزش و پرورش</div>
            </div>
          </motion.div>

          {/* First testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-8 lg:col-span-6 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${testimonials[0].bgColor} p-8 flex flex-col`}>
              <div className="text-2xl font-medium mb-8">
                &ldquo;{testimonials[0].quote}&rdquo;
              </div>
              <div className="mt-auto">
                <div className="font-medium">{testimonials[0].name}</div>
                <div className="text-gray-600 text-sm">{testimonials[0].title}</div>
              </div>
            </div>
          </motion.div>

          {/* Second testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-7 lg:col-span-6 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${testimonials[1].bgColor} p-8 flex flex-col`}>
              <div className="text-2xl font-medium mb-8">
                &ldquo;{testimonials[1].quote}&rdquo;
              </div>
              <div className="mt-auto">
                <div className="font-bold text-lg">{testimonials[1].company}</div>
              </div>
            </div>
          </motion.div>

          {/* Universities box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-5 lg:col-span-3 rounded-xl overflow-hidden border border-gray-100"
          >
            <div className="h-full flex items-center justify-center p-6">
              <div className="font-black text-xl">
                <span className="inline-block bg-convrt-purple text-white px-2 py-1 rounded ml-2">📚</span> دانشگاه‌ها
              </div>
            </div>
          </motion.div>

          {/* Third testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-12 lg:col-span-3 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${testimonials[2].bgColor} p-8 flex flex-col`}>
              <div className="text-2xl font-medium mb-8">
                &ldquo;{testimonials[2].quote}&rdquo;
              </div>
              <div className="mt-auto">
                <div className="font-bold flex items-center">
                  <span className="inline-block ml-1">📖</span> {testimonials[2].company}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 