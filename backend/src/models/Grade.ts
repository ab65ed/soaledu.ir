/**
 * Grade Model
 * مدل مقاطع تحصیلی
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IGrade extends Document {
  value: string;
  label: string;
  description: string;
  ageRange: string;
  duration: string;
  nextLevel: string;
  category: 'school-levels' | 'university-levels';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GradeSchema = new Schema<IGrade>({
  value: {
    type: String,
    required: [true, 'مقدار مقطع تحصیلی الزامی است'],
    unique: true,
    enum: ['elementary', 'middle-school', 'high-school', 'associate-degree', 'bachelor-degree', 'master-degree', 'doctorate-degree'],
    trim: true
  },
  label: {
    type: String,
    required: [true, 'عنوان مقطع تحصیلی الزامی است'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'توضیحات مقطع تحصیلی الزامی است'],
    trim: true
  },
  ageRange: {
    type: String,
    required: [true, 'رده سنی الزامی است'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'مدت زمان الزامی است'],
    trim: true
  },
  nextLevel: {
    type: String,
    required: [true, 'مقطع بعدی الزامی است'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'دسته‌بندی الزامی است'],
    enum: ['school-levels', 'university-levels']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// ایندکس‌گذاری برای جستجوی سریع
GradeSchema.index({ value: 1 });
GradeSchema.index({ category: 1 });
GradeSchema.index({ isActive: 1 });
GradeSchema.index({ createdAt: -1 });

// Pre-save middleware برای validation اضافی
GradeSchema.pre('save', function(next) {
  if (this.isModified('value')) {
    this.value = this.value.toLowerCase().trim();
  }
  
  // تشخیص خودکار دسته‌بندی
  if (this.isModified('value') && !this.isModified('category')) {
    const schoolLevels = ['elementary', 'middle-school', 'high-school'];
    this.category = schoolLevels.includes(this.value) ? 'school-levels' : 'university-levels';
  }
  
  next();
});

const Grade = mongoose.model<IGrade>('Grade', GradeSchema);

export default Grade; 