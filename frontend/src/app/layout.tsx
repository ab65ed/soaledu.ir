import type { Metadata, Viewport } from 'next'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'سؤال‌ساز - سیستم آموزشی پیشرفته',
  description: 'پلتفرم جامع ایجاد و مدیریت آزمون‌های آموزشی با رابط کاربری مدرن و امکانات پیشرفته',
  keywords: 'آزمون آنلاین، سؤال‌ساز، سیستم آموزشی، مدیریت آزمون، آموزش آنلاین',
  authors: [{ name: 'تیم توسعه سؤال‌ساز' }],
  creator: 'سؤال‌ساز',
  publisher: 'سؤال‌ساز',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://soaledu.ir'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://soaledu.ir',
    title: 'سؤال‌ساز - سیستم آموزشی پیشرفته',
    description: 'پلتفرم جامع ایجاد و مدیریت آزمون‌های آموزشی',
    siteName: 'سؤال‌ساز',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سؤال‌ساز - سیستم آموزشی پیشرفته',
    description: 'پلتفرم جامع ایجاد و مدیریت آزمون‌های آموزشی',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body className="font-yekanbakh antialiased min-h-screen bg-white text-gray-900">
        <QueryProvider>
          <div id="root" className="min-h-screen">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  )
} 