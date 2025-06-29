/**
 * FieldOfStudy Model
 * مدل رشته‌های تحصیلی
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IFieldOfStudy extends Document {
  value: string;
  label: string;
  category: 'high-school' | 'engineering' | 'basic-science' | 'humanities' | 'medical' | 'art' | 'agriculture' | 'other';
  categoryLabel: string;
  categoryDescription: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FieldOfStudySchema = new Schema<IFieldOfStudy>({
  value: {
    type: String,
    required: [true, 'مقدار رشته تحصیلی الزامی است'],
    unique: true,
    enum: [
      // رشته‌های دبیرستان
      'math-physics', 'experimental-sciences', 'humanities', 'technical-vocational',
      // رشته‌های دانشگاهی - مهندسی
      'computer-engineering', 'electrical-engineering', 'mechanical-engineering', 
      'civil-engineering', 'chemical-engineering', 'industrial-engineering',
      'aerospace-engineering', 'biomedical-engineering',
      // رشته‌های دانشگاهی - علوم پایه
      'pure-mathematics', 'applied-mathematics', 'physics', 'chemistry', 'biology',
      'geology', 'statistics', 'computer-science',
      // رشته‌های دانشگاهی - علوم انسانی
      'law', 'economics', 'management', 'psychology', 'sociology',
      'political-science', 'history', 'philosophy', 'literature',
      'linguistics', 'archaeology', 'geography',
      // رشته‌های دانشگاهی - پزشکی
      'medicine', 'dentistry', 'pharmacy', 'nursing', 'veterinary',
      'public-health', 'medical-laboratory', 'physiotherapy',
      // رشته‌های دانشگاهی - هنر
      'fine-arts', 'music', 'theater', 'cinema', 'graphic-design',
      'architecture', 'urban-planning',
      // رشته‌های دانشگاهی - کشاورزی
      'agriculture', 'horticulture', 'animal-science', 'forestry',
      // سایر
      'other'
    ],
    trim: true
  },
  label: {
    type: String,
    required: [true, 'عنوان رشته تحصیلی الزامی است'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'دسته‌بندی رشته الزامی است'],
    enum: ['high-school', 'engineering', 'basic-science', 'humanities', 'medical', 'art', 'agriculture', 'other']
  },
  categoryLabel: {
    type: String,
    required: [true, 'عنوان دسته‌بندی الزامی است'],
    trim: true
  },
  categoryDescription: {
    type: String,
    required: [true, 'توضیحات دسته‌بندی الزامی است'],
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
FieldOfStudySchema.index({ value: 1 });
FieldOfStudySchema.index({ category: 1 });
FieldOfStudySchema.index({ isActive: 1 });
FieldOfStudySchema.index({ createdAt: -1 });
FieldOfStudySchema.index({ label: 'text' }); // برای جستجوی متنی

// Pre-save middleware برای validation اضافی
FieldOfStudySchema.pre('save', function(next) {
  if (this.isModified('value')) {
    this.value = this.value.toLowerCase().trim();
  }
  
  // تشخیص خودکار دسته‌بندی
  if (this.isModified('value') && !this.isModified('category')) {
    this.category = getCategoryByField(this.value);
    this.categoryLabel = getCategoryLabel(this.category);
    this.categoryDescription = getCategoryDescription(this.category);
  }
  
  next();
});

// Helper functions
function getCategoryByField(field: string): IFieldOfStudy['category'] {
  const highSchoolFields = ['math-physics', 'experimental-sciences', 'humanities', 'technical-vocational'];
  const engineeringFields = [
    'computer-engineering', 'electrical-engineering', 'mechanical-engineering', 
    'civil-engineering', 'chemical-engineering', 'industrial-engineering',
    'aerospace-engineering', 'biomedical-engineering'
  ];
  const basicScienceFields = [
    'pure-mathematics', 'applied-mathematics', 'physics', 'chemistry', 'biology',
    'geology', 'statistics', 'computer-science'
  ];
  const humanitiesFields = [
    'law', 'economics', 'management', 'psychology', 'sociology',
    'political-science', 'history', 'philosophy', 'literature',
    'linguistics', 'archaeology', 'geography'
  ];
  const medicalFields = [
    'medicine', 'dentistry', 'pharmacy', 'nursing', 'veterinary',
    'public-health', 'medical-laboratory', 'physiotherapy'
  ];
  const artFields = [
    'fine-arts', 'music', 'theater', 'cinema', 'graphic-design',
    'architecture', 'urban-planning'
  ];
  const agricultureFields = [
    'agriculture', 'horticulture', 'animal-science', 'forestry'
  ];

  if (highSchoolFields.includes(field)) return 'high-school';
  if (engineeringFields.includes(field)) return 'engineering';
  if (basicScienceFields.includes(field)) return 'basic-science';
  if (humanitiesFields.includes(field)) return 'humanities';
  if (medicalFields.includes(field)) return 'medical';
  if (artFields.includes(field)) return 'art';
  if (agricultureFields.includes(field)) return 'agriculture';
  return 'other';
}

function getCategoryLabel(category: IFieldOfStudy['category']): string {
  const labels = {
    'high-school': 'رشته‌های دبیرستان',
    'engineering': 'رشته‌های مهندسی',
    'basic-science': 'علوم پایه',
    'humanities': 'علوم انسانی',
    'medical': 'علوم پزشکی',
    'art': 'هنر',
    'agriculture': 'کشاورزی',
    'other': 'سایر'
  };
  return labels[category];
}

function getCategoryDescription(category: IFieldOfStudy['category']): string {
  const descriptions = {
    'high-school': 'رشته‌های تحصیلی دوره متوسطه',
    'engineering': 'رشته‌های مهندسی و فناوری',
    'basic-science': 'رشته‌های علوم پایه و ریاضی',
    'humanities': 'رشته‌های علوم انسانی و اجتماعی',
    'medical': 'رشته‌های پزشکی و بهداشت',
    'art': 'رشته‌های هنری و طراحی',
    'agriculture': 'رشته‌های کشاورزی و منابع طبیعی',
    'other': 'سایر رشته‌های تحصیلی'
  };
  return descriptions[category];
}

const FieldOfStudy = mongoose.model<IFieldOfStudy>('FieldOfStudy', FieldOfStudySchema);

export default FieldOfStudy; 