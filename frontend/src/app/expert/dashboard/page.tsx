'use client';

import { motion } from 'framer-motion';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { expertService } from '@/services/api';

// انیمیشن‌های Framer Motion
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function ExpertDashboard() {

  // دریافت محتوای در انتظار بررسی
  const { data: pendingContent, isLoading: pendingLoading } = useQuery({
    queryKey: ['expert', 'content', 'pending'],
    queryFn: () => expertService.getPendingContent(),
    staleTime: 30000, // کش 30 ثانیه
    refetchInterval: 60000 // آپدیت هر دقیقه
  });

  // دریافت آمار کیفیت
  const { data: qualityStats, isLoading: statsLoading } = useQuery({
    queryKey: ['expert', 'quality-stats'],
    queryFn: () => expertService.getQualityStats(),
    staleTime: 30000
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 rtl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* هدر صفحه */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-iransans">
            داشبورد کارشناس آموزشی
          </h1>
          <p className="text-gray-600 font-iransans">
            بررسی و تأیید محتوای آموزشی، کنترل کیفیت و ارائه بازخورد
          </p>
        </motion.div>

        {/* کارت‌های آمار */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-iransans">
                      در انتظار بررسی
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {pendingContent?.total || 0}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <ClockIcon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-iransans">
                      تأیید شده امروز
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {qualityStats?.approved_today || 0}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-iransans">
                      نیاز به بازنگری
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {qualityStats?.needs_revision || 0}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-iransans">
                      میانگین کیفیت
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {qualityStats?.average_quality || 0}%
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ChartBarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* تب‌های اصلی */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="pending" className="font-iransans">
                <ClockIcon className="w-4 h-4 ml-2" />
                در انتظار بررسی
              </TabsTrigger>
              <TabsTrigger value="analytics" className="font-iransans">
                <ChartBarIcon className="w-4 h-4 ml-2" />
                آمار کیفیت
              </TabsTrigger>
              <TabsTrigger value="history" className="font-iransans">
                <DocumentTextIcon className="w-4 h-4 ml-2" />
                تاریخچه بررسی
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-iransans">محتوای در انتظار بررسی</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-iransans text-center py-8">
                    {pendingLoading ? 'در حال بارگذاری...' : 'این بخش در حال توسعه است...'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-iransans">آمار کیفیت</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-iransans text-center py-8">
                    {statsLoading ? 'در حال بارگذاری...' : 'این بخش در حال توسعه است...'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-iransans">تاریخچه بررسی‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-iransans text-center py-8">
                    این بخش در حال توسعه است...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
} 