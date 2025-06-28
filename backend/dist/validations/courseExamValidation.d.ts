/**
 * Course Exam validation middleware with Zod
 *
 * This file contains validation schemas and middleware for course exam-related requests
 * using Zod with Persian error messages.
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
declare const COURSE_TYPES: readonly ["academic", "non-academic", "skill-based", "aptitude", "general", "specialized"];
declare const GRADES: readonly ["elementary", "middle-school", "high-school", "associate-degree", "bachelor-degree", "master-degree", "doctorate-degree"];
declare const FIELD_OF_STUDY: readonly ["math-physics", "experimental-sciences", "humanities", "technical-vocational", "computer-engineering", "electrical-engineering", "mechanical-engineering", "civil-engineering", "chemical-engineering", "industrial-engineering", "aerospace-engineering", "biomedical-engineering", "pure-mathematics", "applied-mathematics", "physics", "chemistry", "biology", "geology", "statistics", "computer-science", "law", "economics", "management", "psychology", "sociology", "political-science", "history", "philosophy", "literature", "linguistics", "archaeology", "geography", "medicine", "dentistry", "pharmacy", "nursing", "veterinary", "public-health", "medical-laboratory", "physiotherapy", "fine-arts", "music", "theater", "cinema", "graphic-design", "architecture", "urban-planning", "agriculture", "horticulture", "animal-science", "forestry", "other"];
declare const FIELD_OF_STUDY_LABELS: {
    readonly 'math-physics': "ریاضی-فیزیک";
    readonly 'experimental-sciences': "علوم تجربی";
    readonly humanities: "علوم انسانی";
    readonly 'technical-vocational': "فنی-حرفه‌ای";
    readonly 'computer-engineering': "مهندسی کامپیوتر";
    readonly 'electrical-engineering': "مهندسی برق";
    readonly 'mechanical-engineering': "مهندسی مکانیک";
    readonly 'civil-engineering': "مهندسی عمران";
    readonly 'chemical-engineering': "مهندسی شیمی";
    readonly 'industrial-engineering': "مهندسی صنایع";
    readonly 'aerospace-engineering': "مهندسی هوافضا";
    readonly 'biomedical-engineering': "مهندسی پزشکی";
    readonly 'pure-mathematics': "ریاضی محض";
    readonly 'applied-mathematics': "ریاضی کاربردی";
    readonly physics: "فیزیک";
    readonly chemistry: "شیمی";
    readonly biology: "زیست‌شناسی";
    readonly geology: "زمین‌شناسی";
    readonly statistics: "آمار";
    readonly 'computer-science': "علوم کامپیوتر";
    readonly law: "حقوق";
    readonly economics: "اقتصاد";
    readonly management: "مدیریت";
    readonly psychology: "روان‌شناسی";
    readonly sociology: "جامعه‌شناسی";
    readonly 'political-science': "علوم سیاسی";
    readonly history: "تاریخ";
    readonly philosophy: "فلسفه";
    readonly literature: "ادبیات";
    readonly linguistics: "زبان‌شناسی";
    readonly archaeology: "باستان‌شناسی";
    readonly geography: "جغرافیا";
    readonly medicine: "پزشکی";
    readonly dentistry: "دندان‌پزشکی";
    readonly pharmacy: "داروسازی";
    readonly nursing: "پرستاری";
    readonly veterinary: "دامپزشکی";
    readonly 'public-health': "بهداشت عمومی";
    readonly 'medical-laboratory': "آزمایشگاه پزشکی";
    readonly physiotherapy: "فیزیوتراپی";
    readonly 'fine-arts': "هنرهای تجسمی";
    readonly music: "موسیقی";
    readonly theater: "تئاتر";
    readonly cinema: "سینما";
    readonly 'graphic-design': "طراحی گرافیک";
    readonly architecture: "معماری";
    readonly 'urban-planning': "شهرسازی";
    readonly agriculture: "کشاورزی";
    readonly horticulture: "باغبانی";
    readonly 'animal-science': "علوم دامی";
    readonly forestry: "جنگلداری";
    readonly other: "سایر";
};
declare const COURSE_TYPE_LABELS: {
    readonly academic: "درسی";
    readonly 'non-academic': "غیر درسی";
    readonly 'skill-based': "مهارتی";
    readonly aptitude: "استعدادی";
    readonly general: "عمومی";
    readonly specialized: "تخصصی";
};
declare const GRADE_LABELS: {
    readonly elementary: "مقطع ابتدایی";
    readonly 'middle-school': "مقطع متوسطه اول";
    readonly 'high-school': "مقطع متوسطه دوم";
    readonly 'associate-degree': "کاردانی";
    readonly 'bachelor-degree': "کارشناسی";
    readonly 'master-degree': "کارشناسی ارشد";
    readonly 'doctorate-degree': "دکتری";
};
declare const DIFFICULTIES: readonly ["easy", "medium", "hard"];
/**
 * Validation schema for creating a course exam
 */
export declare const CreateCourseExamSchema: z.ZodObject<{
    title: z.ZodString;
    courseType: z.ZodEnum<["academic", "non-academic", "skill-based", "aptitude", "general", "specialized"]>;
    grade: z.ZodEnum<["elementary", "middle-school", "high-school", "associate-degree", "bachelor-degree", "master-degree", "doctorate-degree"]>;
    fieldOfStudy: z.ZodOptional<z.ZodEnum<["math-physics", "experimental-sciences", "humanities", "technical-vocational", "computer-engineering", "electrical-engineering", "mechanical-engineering", "civil-engineering", "chemical-engineering", "industrial-engineering", "aerospace-engineering", "biomedical-engineering", "pure-mathematics", "applied-mathematics", "physics", "chemistry", "biology", "geology", "statistics", "computer-science", "law", "economics", "management", "psychology", "sociology", "political-science", "history", "philosophy", "literature", "linguistics", "archaeology", "geography", "medicine", "dentistry", "pharmacy", "nursing", "veterinary", "public-health", "medical-laboratory", "physiotherapy", "fine-arts", "music", "theater", "cinema", "graphic-design", "architecture", "urban-planning", "agriculture", "horticulture", "animal-science", "forestry", "other"]>>;
    description: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    estimatedTime: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    description?: string;
    tags?: string[];
    title?: string;
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    estimatedTime?: number;
    price?: number;
    isPublished?: boolean;
    isDraft?: boolean;
    metadata?: Record<string, any>;
}, {
    description?: string;
    tags?: string[];
    title?: string;
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    estimatedTime?: number;
    price?: number;
    isPublished?: boolean;
    isDraft?: boolean;
    metadata?: Record<string, any>;
}>;
/**
 * Validation schema for updating a course exam
 */
export declare const UpdateCourseExamSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    courseType: z.ZodOptional<z.ZodEnum<["academic", "non-academic", "skill-based", "aptitude", "general", "specialized"]>>;
    grade: z.ZodOptional<z.ZodEnum<["elementary", "middle-school", "high-school", "associate-degree", "bachelor-degree", "master-degree", "doctorate-degree"]>>;
    fieldOfStudy: z.ZodOptional<z.ZodEnum<["math-physics", "experimental-sciences", "humanities", "technical-vocational", "computer-engineering", "electrical-engineering", "mechanical-engineering", "civil-engineering", "chemical-engineering", "industrial-engineering", "aerospace-engineering", "biomedical-engineering", "pure-mathematics", "applied-mathematics", "physics", "chemistry", "biology", "geology", "statistics", "computer-science", "law", "economics", "management", "psychology", "sociology", "political-science", "history", "philosophy", "literature", "linguistics", "archaeology", "geography", "medicine", "dentistry", "pharmacy", "nursing", "veterinary", "public-health", "medical-laboratory", "physiotherapy", "fine-arts", "music", "theater", "cinema", "graphic-design", "architecture", "urban-planning", "agriculture", "horticulture", "animal-science", "forestry", "other"]>>;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    estimatedTime: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    description?: string;
    tags?: string[];
    title?: string;
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    estimatedTime?: number;
    price?: number;
    isPublished?: boolean;
    isDraft?: boolean;
    metadata?: Record<string, any>;
}, {
    description?: string;
    tags?: string[];
    title?: string;
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    estimatedTime?: number;
    price?: number;
    isPublished?: boolean;
    isDraft?: boolean;
    metadata?: Record<string, any>;
}>;
/**
 * Validation schema for course exam parameters (ID validation)
 */
export declare const CourseExamParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: string;
}, {
    id?: string;
}>;
/**
 * Validation schema for rating a course exam
 */
export declare const RatingSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    comment?: string;
    rating?: number;
}, {
    comment?: string;
    rating?: number;
}>;
/**
 * Validation schema for auto-save progress
 */
export declare const AutoSaveSchema: z.ZodObject<{
    progress: z.ZodNumber;
    lastQuestionIndex: z.ZodOptional<z.ZodNumber>;
    answers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timeSpent: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    progress?: number;
    lastQuestionIndex?: number;
    answers?: Record<string, any>;
    timeSpent?: number;
}, {
    progress?: number;
    lastQuestionIndex?: number;
    answers?: Record<string, any>;
    timeSpent?: number;
}>;
/**
 * Validation schema for search queries
 */
export declare const SearchQuerySchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    courseType: z.ZodOptional<z.ZodEnum<["academic", "non-academic", "skill-based", "aptitude", "general", "specialized"]>>;
    grade: z.ZodOptional<z.ZodEnum<["elementary", "middle-school", "high-school", "associate-degree", "bachelor-degree", "master-degree", "doctorate-degree"]>>;
    fieldOfStudy: z.ZodOptional<z.ZodEnum<["math-physics", "experimental-sciences", "humanities", "technical-vocational", "computer-engineering", "electrical-engineering", "mechanical-engineering", "civil-engineering", "chemical-engineering", "industrial-engineering", "aerospace-engineering", "biomedical-engineering", "pure-mathematics", "applied-mathematics", "physics", "chemistry", "biology", "geology", "statistics", "computer-science", "law", "economics", "management", "psychology", "sociology", "political-science", "history", "philosophy", "literature", "linguistics", "archaeology", "geography", "medicine", "dentistry", "pharmacy", "nursing", "veterinary", "public-health", "medical-laboratory", "physiotherapy", "fine-arts", "music", "theater", "cinema", "graphic-design", "architecture", "urban-planning", "agriculture", "horticulture", "animal-science", "forestry", "other"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    priceMin: z.ZodOptional<z.ZodNumber>;
    priceMax: z.ZodOptional<z.ZodNumber>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodEnum<["createdAt", "updatedAt", "title", "price", "averageRating"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    publishedOnly: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    limit?: number;
    tags?: string[];
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    q?: string;
    priceMin?: number;
    priceMax?: number;
    page?: number;
    sortBy?: "createdAt" | "updatedAt" | "title" | "price" | "averageRating";
    sortOrder?: "asc" | "desc";
    publishedOnly?: boolean;
}, {
    limit?: number;
    tags?: string[];
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    q?: string;
    priceMin?: number;
    priceMax?: number;
    page?: number;
    sortBy?: "createdAt" | "updatedAt" | "title" | "price" | "averageRating";
    sortOrder?: "asc" | "desc";
    publishedOnly?: boolean;
}>;
/**
 * Validation schema for list queries
 */
export declare const ListQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    courseType: z.ZodOptional<z.ZodEnum<["academic", "non-academic", "skill-based", "aptitude", "general", "specialized"]>>;
    grade: z.ZodOptional<z.ZodEnum<["elementary", "middle-school", "high-school", "associate-degree", "bachelor-degree", "master-degree", "doctorate-degree"]>>;
    fieldOfStudy: z.ZodOptional<z.ZodEnum<["math-physics", "experimental-sciences", "humanities", "technical-vocational", "computer-engineering", "electrical-engineering", "mechanical-engineering", "civil-engineering", "chemical-engineering", "industrial-engineering", "aerospace-engineering", "biomedical-engineering", "pure-mathematics", "applied-mathematics", "physics", "chemistry", "biology", "geology", "statistics", "computer-science", "law", "economics", "management", "psychology", "sociology", "political-science", "history", "philosophy", "literature", "linguistics", "archaeology", "geography", "medicine", "dentistry", "pharmacy", "nursing", "veterinary", "public-health", "medical-laboratory", "physiotherapy", "fine-arts", "music", "theater", "cinema", "graphic-design", "architecture", "urban-planning", "agriculture", "horticulture", "animal-science", "forestry", "other"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    authorId: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    sortBy: z.ZodOptional<z.ZodEnum<["createdAt", "updatedAt", "title", "price", "averageRating"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit?: number;
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    isPublished?: boolean;
    isDraft?: boolean;
    page?: number;
    sortBy?: "createdAt" | "updatedAt" | "title" | "price" | "averageRating";
    sortOrder?: "asc" | "desc";
    authorId?: string;
}, {
    limit?: number;
    courseType?: "academic" | "non-academic" | "skill-based" | "aptitude" | "general" | "specialized";
    grade?: "elementary" | "middle-school" | "high-school" | "associate-degree" | "bachelor-degree" | "master-degree" | "doctorate-degree";
    fieldOfStudy?: "other" | "math-physics" | "experimental-sciences" | "humanities" | "technical-vocational" | "computer-engineering" | "electrical-engineering" | "mechanical-engineering" | "civil-engineering" | "chemical-engineering" | "industrial-engineering" | "aerospace-engineering" | "biomedical-engineering" | "pure-mathematics" | "applied-mathematics" | "physics" | "chemistry" | "biology" | "geology" | "statistics" | "computer-science" | "law" | "economics" | "management" | "psychology" | "sociology" | "political-science" | "history" | "philosophy" | "literature" | "linguistics" | "archaeology" | "geography" | "medicine" | "dentistry" | "pharmacy" | "nursing" | "veterinary" | "public-health" | "medical-laboratory" | "physiotherapy" | "fine-arts" | "music" | "theater" | "cinema" | "graphic-design" | "architecture" | "urban-planning" | "agriculture" | "horticulture" | "animal-science" | "forestry";
    difficulty?: "easy" | "medium" | "hard";
    isPublished?: boolean;
    isDraft?: boolean;
    page?: number;
    sortBy?: "createdAt" | "updatedAt" | "title" | "price" | "averageRating";
    sortOrder?: "asc" | "desc";
    authorId?: string;
}>;
export declare const validateCourseExam: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCourseExamUpdate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRating: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateAutoSave: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateSearchQuery: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateListQuery: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCourseExamPublishing: (courseExamId: string) => Promise<{
    isValid: boolean;
    errors: string[];
}>;
export declare const validateQuestionDifficultyDistribution: (questions: any[]) => {
    isValid: boolean;
    errors: string[];
};
export type CreateCourseExamType = z.infer<typeof CreateCourseExamSchema>;
export type UpdateCourseExamType = z.infer<typeof UpdateCourseExamSchema>;
export type CourseExamParamsType = z.infer<typeof CourseExamParamsSchema>;
export type RatingType = z.infer<typeof RatingSchema>;
export type AutoSaveType = z.infer<typeof AutoSaveSchema>;
export type SearchQueryType = z.infer<typeof SearchQuerySchema>;
export type ListQueryType = z.infer<typeof ListQuerySchema>;
export { COURSE_TYPES, COURSE_TYPE_LABELS, GRADES, GRADE_LABELS, FIELD_OF_STUDY, FIELD_OF_STUDY_LABELS, DIFFICULTIES };
