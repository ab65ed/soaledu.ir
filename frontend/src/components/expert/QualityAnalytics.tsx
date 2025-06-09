'use client';

import { motion } from 'framer-motion';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Progress from '@/components/atoms/Progress';
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ArrowTrendingDownIcon as TrendingDownIcon, 
  ChartBarIcon as BarChart3Icon,
  CalendarIcon,
  UsersIcon,
  TrophyIcon as AwardIcon
} from '@heroicons/react/24/outline';

interface QualityStats {
  overall_average?: number;
  today_reviews?: number;
  today_trend?: number;
  high_quality_percentage?: number;
  active_experts?: number;
  content_type_quality?: Array<{
    type: string;
    average: number;
    count: number;
    improvement: number;
  }>;
  weekly_trend?: Array<{
    day: string;
    day_name?: string;
    average: number;
    count: number;
  }>;
  expert_performance?: Array<{
    name: string;
    reviews_count: number;
    average_score: number;
    consistency: number;
    daily_average?: number;
  }>;
  status_breakdown?: {
    approved?: number;
    needs_revision?: number;
    rejected?: number;
  };
  response_time?: {
    average?: number;
    min?: number;
    max?: number;
  };
  top_expert?: {
    name?: string;
  };
  satisfaction_rate?: number;
}

interface QualityAnalyticsProps {
  stats: QualityStats | null;
  isLoading: boolean;
}

const QualityAnalytics: React.FC<QualityAnalyticsProps> = ({ stats, isLoading }) => {
  
  // انیمیشن‌های کارت‌ها
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const chartVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* آمار کلی کیفیت */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* میانگین کیفیت کلی */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-blue-700 font-iransans">
                  میانگین کیفیت کلی
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats?.overall_average || 0}/10
                </p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <AwardIcon className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <div className="space-y-2">
              <Progress 
                value={(stats?.overall_average || 0) * 10} 
                className="h-2" 
              />
              <div className="flex justify-between text-xs text-blue-600">
                <span className="font-iransans">ضعیف</span>
                <span className="font-iransans">عالی</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تعداد بررسی‌های امروز */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-green-700 font-iransans">
                  بررسی‌های امروز
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {stats?.today_reviews || 0}
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <CalendarIcon className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              {(stats?.today_trend ?? 0) >= 0 ? (
                <TrendingUpIcon className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDownIcon className="w-4 h-4 text-red-600" />
              )}
              <span className={`font-iransans ${(stats?.today_trend ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(stats?.today_trend || 0)}% نسبت به دیروز
              </span>
            </div>
          </CardContent>
        </Card>

        {/* محتوای با کیفیت بالا */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-purple-700 font-iransans">
                  محتوای باکیفیت (8+)
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats?.high_quality_percentage || 0}%
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <BarChart3Icon className="w-6 h-6 text-purple-700" />
              </div>
            </div>
            <Progress 
              value={stats?.high_quality_percentage || 0} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        {/* کارشناسان فعال */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-orange-700 font-iransans">
                  کارشناسان فعال
                </p>
                <p className="text-3xl font-bold text-orange-900">
                  {stats?.active_experts || 0}
                </p>
              </div>
              <div className="bg-orange-200 p-3 rounded-full">
                <UsersIcon className="w-6 h-6 text-orange-700" />
              </div>
            </div>
            <p className="text-xs text-orange-600 font-iransans">
              در ۲۴ ساعت گذشته
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* نمودار کیفیت بر اساس نوع محتوا */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-iransans">کیفیت بر اساس نوع محتوا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.content_type_quality?.map((item, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 font-iransans">
                    {item.type === 'question' ? 'سوالات' : 'درس-آزمون‌ها'}
                  </span>
                  <Badge variant={item.average >= 8 ? 'default' : item.average >= 6 ? 'secondary' : 'destructive'}>
                    {item.average}/10
                  </Badge>
                </div>
                <motion.div
                  variants={chartVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ originY: 1 }}
                >
                  <Progress value={item.average * 10} className="h-3" />
                </motion.div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="font-iransans">{item.count} مورد</span>
                  <span className="font-iransans">
                    {item.improvement > 0 ? '+' : ''}{item.improvement}% این ماه
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* روند کیفیت در هفته گذشته */}
        <Card>
          <CardHeader>
            <CardTitle className="font-iransans">روند کیفیت - ۷ روز گذشته</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.weekly_trend?.map((day, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-16 text-sm text-gray-600 font-iransans">
                    {day.day_name}
                  </div>
                  <div className="flex-1">
                    <motion.div
                      variants={chartVariants}
                      initial="hidden"
                      animate="visible"
                      style={{ originX: 0 }}
                      className="bg-gray-200 rounded-full h-3 overflow-hidden"
                    >
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(day.average / 10) * 100}%` }}
                      ></div>
                    </motion.div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900">
                    {day.average}/10
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* آمار تفصیلی */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-iransans">گزارش تفصیلی عملکرد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* وضعیت‌های بررسی */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 font-iransans">وضعیت بررسی‌ها</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">تأیید شده</span>
                    <Badge variant="default">{stats?.status_breakdown?.approved || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">نیاز به بازنگری</span>
                    <Badge variant="secondary">{stats?.status_breakdown?.needs_revision || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">رد شده</span>
                    <Badge variant="destructive">{stats?.status_breakdown?.rejected || 0}</Badge>
                  </div>
                </div>
              </div>

              {/* زمان پاسخ */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 font-iransans">زمان پاسخ</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">میانگین زمان</span>
                    <span className="text-sm font-medium font-iransans">
                      {stats?.response_time?.average || 0} ساعت
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">کمترین زمان</span>
                    <span className="text-sm font-medium font-iransans">
                      {stats?.response_time?.min || 0} ساعت
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">بیشترین زمان</span>
                    <span className="text-sm font-medium font-iransans">
                      {stats?.response_time?.max || 0} ساعت
                    </span>
                  </div>
                </div>
              </div>

              {/* کارایی کارشناسان */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 font-iransans">عملکرد کارشناسان</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">بهترین کارشناس</span>
                    <Badge variant="default">{stats?.top_expert?.name || '-'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">میانگین بررسی روزانه</span>
                    <span className="text-sm font-medium font-iransans">
                      {stats?.expert_performance?.[0]?.daily_average || 0} مورد
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-iransans">نرخ رضایت</span>
                    <span className="text-sm font-medium font-iransans">
                      {stats?.satisfaction_rate || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QualityAnalytics; 