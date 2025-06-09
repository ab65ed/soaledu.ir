'use client';

import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface ContactCard {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
}

const contactCards: ContactCard[] = [
  {
    icon: <EnvelopeIcon className="w-6 h-6 text-blue-600" />,
    title: 'ایمیل',
    content: 'support@exam-edu.ir',
    link: 'mailto:support@exam-edu.ir'
  },
  {
    icon: <PhoneIcon className="w-6 h-6 text-blue-600" />,
    title: 'تلفن پشتیبانی',
    content: '021-12345678',
    link: 'tel:02112345678'
  },
  {
    icon: <MapPinIcon className="w-6 h-6 text-blue-600" />,
    title: 'آدرس',
    content: 'تهران، خیابان ولی‌عصر، پلاک 123',
  },
  {
    icon: <ClockIcon className="w-6 h-6 text-blue-600" />,
    title: 'ساعات پاسخگویی',
    content: 'شنبه تا چهارشنبه، 9:00 تا 17:00',
  }
];

export default function ContactHeader() {
  return (
    <section className="text-center mb-12">
      {/* عنوان اصلی */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          تماس با ما
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          سوال، پیشنهاد یا نیاز به راهنمایی دارید؟ تیم پشتیبانی ما آماده کمک به شماست.
          پیام خود را ارسال کنید تا در کوتاه‌ترین زمان پاسخ‌تان را دریافت کنید.
        </p>
      </motion.div>

      {/* کارت‌های اطلاعات تماس */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {contactCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
          >
            {card.link ? (
              <a
                href={card.link}
                className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-200 
                         hover:shadow-lg hover:border-blue-300 transition-all duration-300
                         group-hover:scale-105"
              >
                <ContactCardContent card={card} />
              </a>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 
                           hover:shadow-lg hover:border-blue-300 transition-all duration-300
                           group-hover:scale-105">
                <ContactCardContent card={card} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ContactCardContent({ card }: { card: ContactCard }) {
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
          {card.icon}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{card.content}</p>
    </>
  );
} 