'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'چگونه می‌توانم حساب کاربری ایجاد کنم؟',
    answer: 'برای ایجاد حساب کاربری، روی دکمه "ثبت‌نام" در بالای صفحه کلیک کنید و اطلاعات مورد نیاز را وارد کنید. پس از تایید ایمیل، می‌توانید از تمام امکانات سایت استفاده کنید.',
  },
  {
    id: '2',
    question: 'آیا امکان دانلود آفلاین سوالات وجود دارد؟',
    answer: 'بله، کاربران می‌توانند سوالات را در قالب PDF دانلود کنند تا در زمان عدم دسترسی به اینترنت نیز بتوانند مطالعه کنند. این قابلیت در بخش پروفایل کاربری در دسترس است.',
  },
  {
    id: '3',
    question: 'چگونه می‌توانم با پشتیبانی تماس بگیرم؟',
    answer: 'می‌توانید از طریق فرم تماس در همین صفحه، ایمیل support@exam-edu.ir، یا شماره تلفن 021-12345678 با تیم پشتیبانی ما در ارتباط باشید. پاسخگویی در ساعات اداری انجام می‌شود.',
  },
  {
    id: '4',
    question: 'آیا نسخه موبایل اپلیکیشن موجود است؟',
    answer: 'در حال حاضر اپلیکیشن موبایل در دست توسعه است. اما سایت ما کاملاً واکنش‌گرا (Responsive) است و تجربه مناسبی روی موبایل و تبلت ارائه می‌دهد.',
  },
  {
    id: '5',
    question: 'نحوه پرداخت و هزینه‌ها چگونه است؟',
    answer: 'ما از درگاه‌های پرداخت معتبر ایرانی پشتیبانی می‌کنیم. هزینه‌ها بر اساس نوع بسته انتخابی متفاوت است. اطلاعات کامل قیمت‌گذاری در بخش "پلن‌ها" موجود است.',
  },
  {
    id: '6',
    question: 'چگونه نتایج آزمون‌هایم را ببینم؟',
    answer: 'پس از تکمیل هر آزمون، نتایج شما در بخش "تاریخچه آزمون‌ها" ذخیره می‌شود. می‌توانید نمرات، زمان صرف شده، و تحلیل عملکردتان را مشاهده کنید.',
  },
];

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* سوال / Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${item.id}`}
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mr-3"
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      {/* پاسخ / Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-content-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 text-gray-700 leading-relaxed text-sm md:text-base">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQAccordion() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (openItems.size === faqData.length) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(faqData.map(item => item.id)));
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
    >
      {/* هدر */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          سوالات متداول
        </h2>
        <p className="text-gray-600 mb-4">
          پاسخ سوالات رایج کاربران را در اینجا مشاهده کنید
        </p>
        
        {/* دکمه بازکردن همه */}
        <button
          onClick={toggleAll}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          {openItems.size === faqData.length ? 'بستن همه' : 'باز کردن همه'}
        </button>
      </div>

      {/* لیست سوالات */}
      <div className="space-y-4">
        {faqData.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>

      {/* پیوند کمک بیشتر */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
      >
        <p className="text-blue-800 mb-2">
          پاسخ سوال خود را پیدا نکردید؟
        </p>
        <p className="text-blue-600 text-sm">
          از طریق فرم تماس با ما در ارتباط باشید تا پاسخ‌تان را در کوتاه‌ترین زمان دریافت کنید.
        </p>
      </motion.div>
    </motion.section>
  );
} 