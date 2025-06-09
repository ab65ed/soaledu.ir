/**
 * Footer Component - فوتر حرفه‌ای با لینک‌های سریع
 * پشتیبانی از RTL، انیمیشن، و اطلاعات تماس
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';

// لینک‌های سریع
const quickLinks = [
  {
    title: 'خدمات',
    links: [
      { href: '/course-exam', label: 'آزمون‌های درسی' },
      { href: '/test-exams', label: 'آزمون‌های آزمایشی' },
      { href: '/questions', label: 'بانک سوالات' },
      { href: '/blog', label: 'وبلاگ آموزشی' },
    ],
  },
  {
    title: 'پشتیبانی',
    links: [
      { href: '/contact', label: 'تماس با ما' },
      { href: '/faq', label: 'سوالات متداول' },
      { href: '/help', label: 'راهنمای استفاده' },
      { href: '/support', label: 'پشتیبانی فنی' },
    ],
  },
  {
    title: 'قوانین',
    links: [
      { href: '/terms', label: 'قوانین و مقررات' },
      { href: '/privacy', label: 'حریم خصوصی' },
      { href: '/about', label: 'درباره ما' },
      { href: '/careers', label: 'فرصت‌های شغلی' },
    ],
  },
];

// اطلاعات تماس
const contactInfo = {
  phone: '۰۲۱-۱۲۳۴۵۶۷۸',
  email: 'info@soaledu.ir',
  address: 'تهران، میدان آزادی، برج میلاد',
};

// شبکه‌های اجتماعی
const socialLinks = [
  {
    name: 'تلگرام',
    href: 'https://t.me/soaledu',
    icon: ChatBubbleLeftRightIcon,
    color: 'hover:text-blue-500',
  },
  {
    name: 'اینستاگرام', 
    href: 'https://instagram.com/soaledu',
    icon: InformationCircleIcon,
    color: 'hover:text-pink-500',
  },
  {
    name: 'ایتا',
    href: 'https://eitaa.com/soaledu',
    icon: DocumentTextIcon,
    color: 'hover:text-green-500',
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* بخش اصلی فوتر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* لوگو و توضیحات */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/" 
                className="flex items-center space-x-2 rtl:space-x-reverse mb-4"
              >
                <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  سؤال‌ساز
                </span>
              </Link>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                پلتفرم جامع ایجاد و مدیریت آزمون‌های آموزشی با هدف ارتقای کیفیت آموزش و یادگیری
              </p>
              
              {/* شبکه‌های اجتماعی */}
              <div className="flex space-x-4 rtl:space-x-reverse">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 ${social.color}`}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* لینک‌های سریع */}
          {quickLinks.map((section, index) => (
            <div key={section.title} className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* اطلاعات تماس */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-8 pt-8"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            اطلاعات تماس
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* تلفن */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-primary/20 p-2 rounded-lg">
                <PhoneIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">تلفن تماس</p>
                <p className="text-sm text-gray-300" dir="ltr">
                  {contactInfo.phone}
                </p>
              </div>
            </div>

            {/* ایمیل */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-primary/20 p-2 rounded-lg">
                <EnvelopeIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">ایمیل</p>
                <p className="text-sm text-gray-300" dir="ltr">
                  {contactInfo.email}
                </p>
              </div>
            </div>

            {/* آدرس */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-primary/20 p-2 rounded-lg">
                <MapPinIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">آدرس</p>
                <p className="text-sm text-gray-300">
                  {contactInfo.address}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* کپی‌رایت */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-400">
              <ShieldCheckIcon className="w-4 h-4 text-primary" />
              <span>
                تمامی حقوق محفوظ است © {currentYear} سؤال‌ساز
              </span>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-400">
              <span>نسخه ۱.۰.۰</span>
              <span>•</span>
              <Link 
                href="/status" 
                className="hover:text-primary transition-colors duration-200"
              >
                وضعیت سرویس
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 