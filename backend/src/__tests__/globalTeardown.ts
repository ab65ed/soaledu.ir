/**
 * Jest Global Teardown
 * پاکسازی محیط تست
 */

import mongoose from 'mongoose';

export default async (): Promise<void> => {
  console.log('🧹 پاکسازی محیط تست...');
  
  try {
    // قطع اتصال mongoose
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('✅ اتصال mongoose قطع شد');
    }
    
    // پاکسازی متغیرهای global
    delete globalThis.__MONGO_URI__;
    
    console.log('✅ پاکسازی محیط تست تکمیل شد');
    
  } catch (error) {
    console.error('❌ خطا در پاکسازی محیط تست:', error);
    // ادامه دادن به جای throw error تا تست‌ها متوقف نشوند
  }
}; 