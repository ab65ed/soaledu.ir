import { z } from 'zod';
export type ImageType = 'avatar' | 'blog' | 'lesson' | 'exam';
export interface ImageFile {
    size: number;
    mimetype: string;
    originalname?: string;
}
export interface ValidationError {
    field: string;
    message: string;
}
export interface DimensionLimits {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
}
export declare const ImageUploadSchema: z.ZodObject<{
    type: z.ZodEnum<["avatar", "blog", "lesson", "exam"]>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description?: string;
    type?: "lesson" | "exam" | "avatar" | "blog";
}, {
    description?: string;
    type?: "lesson" | "exam" | "avatar" | "blog";
}>;
export declare const ImageUpdateSchema: z.ZodObject<{
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    caption: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url?: string;
    alt?: string;
    caption?: string;
}, {
    url?: string;
    alt?: string;
    caption?: string;
}>;
export declare const BlogImageSchema: z.ZodObject<{
    postId: z.ZodString;
} & {
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    caption: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url?: string;
    alt?: string;
    caption?: string;
    postId?: string;
}, {
    url?: string;
    alt?: string;
    caption?: string;
    postId?: string;
}>;
export declare const LessonImageSchema: z.ZodObject<{
    lessonId: z.ZodString;
} & {
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    caption: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url?: string;
    alt?: string;
    caption?: string;
    lessonId?: string;
}, {
    url?: string;
    alt?: string;
    caption?: string;
    lessonId?: string;
}>;
export declare const validateImageFile: (file: ImageFile | undefined) => ValidationError[];
export declare const validateImageDimensions: (width: number, height: number, type: ImageType) => ValidationError[];
export type ImageUploadType = z.infer<typeof ImageUploadSchema>;
export type ImageUpdateType = z.infer<typeof ImageUpdateSchema>;
export type BlogImageType = z.infer<typeof BlogImageSchema>;
export type LessonImageType = z.infer<typeof LessonImageSchema>;
