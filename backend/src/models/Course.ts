import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  category: string;
  grade: string;
  courseType: string;
  fieldOfStudy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'عنوان درس الزامی است'],
    trim: true,
    minlength: [3, 'عنوان درس باید حداقل 3 کاراکتر باشد'],
    maxlength: [200, 'عنوان درس نباید بیش از 200 کاراکتر باشد']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'توضیحات نباید بیش از 1000 کاراکتر باشد']
  },
  category: {
    type: String,
    required: [true, 'دسته‌بندی درس الزامی است'],
    enum: [
      'دروس عمومی',
      'دروس پایه',
      'دروس اختصاصی',
      'دروس فنی و حرفه‌ای'
    ]
  },
  grade: {
    type: String,
    required: [true, 'مقطع تحصیلی الزامی است'],
    enum: [
      'دیپلم',
      'کاردانی', 
      'کارشناسی',
      'کارشناسی ارشد',
      'دکتری'
    ]
  },
  courseType: {
    type: String,
    required: [true, 'نوع درس الزامی است'],
    enum: [
      'academic',
      'non-academic', 
      'skill-based',
      'aptitude',
      'general',
      'specialized'
    ]
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'رشته تحصیلی الزامی است'],
    enum: [
      'computer-engineering',
      'electrical-engineering',
      'mechanical-engineering',
      'civil-engineering',
      'mathematics',
      'physics',
      'chemistry',
      'biology',
      'literature',
      'general'
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// ایجاد ایندکس برای جستجوی سریع
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ grade: 1 });
courseSchema.index({ courseType: 1 });
courseSchema.index({ fieldOfStudy: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ createdAt: -1 });

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course; 