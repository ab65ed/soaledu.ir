import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

export const metadata: Metadata = {
  title: "سؤال‌ساز - سیستم آموزشی",
  description: "پلتفرم جامع ایجاد و مدیریت آزمون‌های آموزشی",
  keywords: ["آزمون", "سؤال", "آموزش", "تحصیل", "امتحان"],
  authors: [{ name: "تیم توسعه سؤال‌ساز" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "سؤال‌ساز - سیستم آموزشی",
    description: "پلتفرم جامع ایجاد و مدیریت آزمون‌های آموزشی",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className="rtl">
      <head>
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="/fonts/IRANSans-Regular.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/IRANSans-Medium.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/IRANSans-Bold.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <Providers>
          <div id="root" className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
