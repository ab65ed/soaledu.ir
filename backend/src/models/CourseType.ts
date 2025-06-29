/**
 * CourseType Model
 * مدل انواع درس
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseType extends Document {
  value: string;
  label: string;
  description: string;
  examples: string;
  usage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseTypeSchema = new Schema<ICourseType>({
  value: {
    type: String,
    required: [true, 'مقدار نوع درس الزامی است'],
    unique: true,
    enum: ['academic', 'non-academic', 'skill-based', 'aptitude', 'general', 'specialized'],
    trim: true
  },
  label: {
    type: String,
    required: [true, 'عنوان نوع درس الزامی است'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'توضیحات نوع درس الزامی است'],
    trim: true
  },
  examples: {
    type: String,
    required: [true, 'مثال‌های نوع درس الزامی است'],
    trim: true
  },
  usage: {
    type: String,
    required: [true, 'کاربرد نوع درس الزامی است'],
    trim: true
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
CourseTypeSchema.index({ value: 1 });
CourseTypeSchema.index({ isActive: 1 });
CourseTypeSchema.index({ createdAt: -1 });

// Pre-save middleware برای validation اضافی
CourseTypeSchema.pre('save', function(next) {
  if (this.isModified('value')) {
    this.value = this.value.toLowerCase().trim();
  }
  next();
});

const CourseType = mongoose.model<ICourseType>('CourseType', CourseTypeSchema);

export default CourseType; 