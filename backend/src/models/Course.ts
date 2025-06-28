import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  category: string;
  grade: string;
  courseType?: string;
  group?: string;
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
      'دروس پایه کامپیوتر',
      'دروس اختصاصی',
      'دروس فنی',
      'علوم پایه',
      'علوم انسانی',
      'علوم زیستی'
    ]
  },
  grade: {
    type: String,
    required: [true, 'مقطع تحصیلی الزامی است'],
    enum: [
      'عمومی',
      'کارشناسی',
      'فنی',
      'دهم',
      'یازدهم',
      'دوازدهم',
      'middle-school',
      'high-school'
    ]
  },
  courseType: {
    type: String,
    enum: [
      'mathematics',
      'physics',
      'chemistry',
      'biology',
      'literature',
      'computer-science',
      'general',
      'technical'
    ]
  },
  group: {
    type: String,
    enum: [
      'math-physics',
      'experimental',
      'literature-humanities',
      'computer',
      'technical',
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
courseSchema.index({ isActive: 1 });
courseSchema.index({ createdAt: -1 });

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course; 