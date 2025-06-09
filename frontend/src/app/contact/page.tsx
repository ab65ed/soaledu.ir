import { Metadata } from 'next';
import ContactHeader from '@/components/molecules/ContactHeader';
import ContactForm from '@/components/molecules/ContactForm';
import FAQAccordion from '@/components/organisms/FAQAccordion';

export const metadata: Metadata = {
  title: 'تماس با ما | Exam-Edu',
  description: 'با تیم پشتیبانی Exam-Edu در ارتباط باشید. فرم تماس، سوالات متداول و اطلاعات تماس',
  keywords: 'تماس، پشتیبانی، کمک، سوالات متداول، Exam-Edu',
  openGraph: {
    title: 'تماس با ما | Exam-Edu',
    description: 'با تیم پشتیبانی Exam-Edu در ارتباط باشید',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* هدر صفحه تماس با ما */}
        <ContactHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* فرم تماس با ما */}
          <div className="order-2 lg:order-1">
            <ContactForm />
          </div>

          {/* سوالات متداول */}
          <div className="order-1 lg:order-2">
            <FAQAccordion />
          </div>
        </div>
      </div>
    </main>
  );
} 