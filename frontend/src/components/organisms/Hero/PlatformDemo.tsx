'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, FileText, Users, BarChart2, Save, Clock, User, Edit, ArrowRight, ArrowLeft, X, Plus, Search } from 'lucide-react';

const PlatformDemo = () => {
  return (
    <div className="relative max-w-5xl mx-auto mb-20">
      {/* Gradient background */}
      <div className="absolute inset-0 -m-10 bg-gradient-to-br from-convrt-purple/20 via-convrt-purple/20 to-convrt-purple/20 rounded-3xl blur-3xl opacity-40"></div>
      
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
        {/* Platform UI Header - Tabs and Navigation */}
        <div className="bg-white border-b border-gray-200 flex items-center px-6 py-3">
          <div className="flex space-x-1 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex space-x-1 space-x-reverse overflow-x-auto scrollbar-hide">
            <div className="px-4 py-2 text-convrt-purple bg-convrt-purple/10 rounded-t-lg font-medium text-sm border-b-2 border-convrt-purple">
              طراحی آزمون (۱۲)
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-t-lg font-medium text-sm">
              بانک سوالات (۱۵۶)
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-t-lg font-medium text-sm">
              نتایج (۸۹)
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-t-lg font-medium text-sm">
              تحلیل آماری
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
              <span className="text-xs font-medium text-green-700">۱۲۴ سوال فعال</span>
            </div>
            <div className="flex items-center bg-orange-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full ml-2"></div>
              <span className="text-xs font-medium text-orange-700">۸ آزمون امروز</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        {/* Main Content Area - Test Design Interface */}
        <div className="bg-gray-50 p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Question Design */}
            <div className="col-span-8 space-y-6">
              {/* Test Creation Header */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-convrt-dark-blue">آزمون ریاضی پایه دهم</h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button className="bg-convrt-purple text-white px-3 py-1 rounded-md text-xs font-medium flex items-center">
                      <Save className="w-3 h-3 ml-1" />
                      ذخیره
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                      پیش‌نمایش
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-600">تعداد سوالات:</span>
                    <span className="font-medium text-convrt-dark-blue mr-2">۲۵</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-600">مدت زمان:</span>
                    <span className="font-medium text-convrt-dark-blue mr-2">۹۰ دقیقه</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-600">نمره کل:</span>
                    <span className="font-medium text-convrt-dark-blue mr-2">۱۰۰</span>
                  </div>
                </div>
              </div>
              
              {/* Question Design Area */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">سوال شماره ۱۵</h4>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">هندسه</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">متوسط</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">متن سوال:</label>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm text-gray-700">
                      در یک مثلث قائم‌الزاویه، اگر طول دو ضلع قائمه برابر ۳ و ۴ سانتی‌متر باشد، طول وتر چقدر است؟
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="radio" name="answer" className="ml-2" />
                      <div className="flex-1 bg-gray-50 p-2 rounded border border-gray-200">
                        ۵ سانتی‌متر
                      </div>
                      <div className="mr-2 text-green-600">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="answer" className="ml-2" />
                      <div className="flex-1 bg-gray-50 p-2 rounded border border-gray-200">
                        ۶ سانتی‌متر
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="answer" className="ml-2" />
                      <div className="flex-1 bg-gray-50 p-2 rounded border border-gray-200">
                        ۷ سانتی‌متر
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="answer" className="ml-2" />
                      <div className="flex-1 bg-gray-50 p-2 rounded border border-gray-200">
                        ۸ سانتی‌متر
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Question Controls */}
                <div className="bg-gray-50 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">امتیاز سوال</span>
                    <span className="text-convrt-purple font-bold">۴ نمره</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-convrt-purple h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">۴ از ۵ نمره</div>
                </div>
                
                <div className="flex items-center justify-between p-3 border-t border-gray-200">
                  <button className="text-gray-500 flex items-center text-sm">
                    <ArrowRight className="w-4 h-4 ml-1" />
                    سوال قبل
                  </button>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button className="text-blue-500 flex items-center text-sm">
                      <Edit className="w-4 h-4 ml-1" />
                      ویرایش
                    </button>
                    <button className="text-red-500 flex items-center text-sm">
                      <X className="w-4 h-4 ml-1" />
                      حذف
                    </button>
                  </div>
                  <button className="text-gray-500 flex items-center text-sm">
                    سوال بعد
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Panel - Test Settings and Stats */}
            <div className="col-span-4 space-y-4">
              {/* Question Bank */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 text-convrt-purple ml-1" />
                  جستجو در بانک سوالات
                </h3>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="جستجو سوال..." 
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                  />
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-convrt-purple/10 text-convrt-purple text-xs px-2 py-1 rounded">ریاضی</span>
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">هندسه</span>
                    <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded">متوسط</span>
                  </div>
                </div>
              </div>
              
              {/* Test Statistics */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">آمار آزمون</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">تعداد سوالات:</span>
                    <span className="font-medium text-convrt-dark-blue">۲۵</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تکمیل شده:</span>
                    <span className="font-medium text-green-600">۱۵</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">باقی‌مانده:</span>
                    <span className="font-medium text-orange-600">۱۰</span>
                  </div>
                </div>
              </div>
              
              {/* Difficulty Distribution */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">توزیع سختی سوالات</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">آسان</span>
                    <span className="text-green-600 font-medium">۸</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '32%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">متوسط</span>
                    <span className="text-yellow-600 font-medium">۱۲</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '48%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">سخت</span>
                    <span className="text-red-600 font-medium">۵</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">عملیات سریع</h3>
                <div className="space-y-2">
                  <button className="w-full bg-convrt-purple text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                    <Plus className="w-4 h-4 ml-2" />
                    افزودن سوال جدید
                  </button>
                  <button className="w-full border border-convrt-purple text-convrt-purple py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                    <FileText className="w-4 h-4 ml-2" />
                    ایمپورت از فایل
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 ml-2" />
                    نمایش گزارش
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating UI Element */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-8 top-1/3 z-10"
      >
        <div className="animate-float bg-white/70 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/20 flex items-center">
          <div className="bg-[#6936F5]/20 rounded-lg p-2 ml-3">
            <Check className="w-4 h-4 text-[#6936F5]" />
          </div>
          <div>
            <div className="text-gray-800 text-xs font-medium">سوال جدید ایجاد شد</div>
            <div className="text-gray-600 text-xs">ریاضی - پایه دهم</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlatformDemo; 