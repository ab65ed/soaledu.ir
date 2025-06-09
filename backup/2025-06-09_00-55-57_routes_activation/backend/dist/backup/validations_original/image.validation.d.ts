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
declare const imageUploadSchema: {
    type: {
        type: string;
        required: boolean;
        enum: string[];
        messages: {
            required: string;
            enum: string;
        };
    };
    description: {
        type: string;
        optional: boolean;
        max: number;
        messages: {
            max: string;
        };
    };
};
declare const imageUpdateSchema: {
    url: {
        type: string;
        required: boolean;
        messages: {
            required: string;
            url: string;
        };
    };
    alt: {
        type: string;
        optional: boolean;
        max: number;
        messages: {
            max: string;
        };
    };
    caption: {
        type: string;
        optional: boolean;
        max: number;
        messages: {
            max: string;
        };
    };
};
declare const blogImageSchema: {
    url: {
        type: string;
        required: boolean;
        messages: {
            required: string;
            url: string;
        };
    };
    alt: {
        type: string;
        optional: boolean;
        max: number;
        messages: {
            max: string;
        };
    };
    caption: {
        type: string;
        optional: boolean;
        max: number;
        messages: {
            max: string;
        };
    };
    postId: {
        type: string;
        required: boolean;
        pattern: RegExp;
        messages: {
            required: string;
            pattern: string;
        };
    };
};
declare const lessonImageSchema: {
    url: {
        type: string;
        required: boolean;
        messages: {
            required: string;
            url: string;
        };
    };
    alt: {
        type: string;
        optional: boolean;
        max: number;
        messages: {
            max: string;
        };
    };
    caption: {
        type: string;
        optional: boolean;
        max: number;
        messages: {
            max: string;
        };
    };
    lessonId: {
        type: string;
        required: boolean;
        pattern: RegExp;
        messages: {
            required: string;
            pattern: string;
        };
    };
};
export declare const validateImageFile: (file: ImageFile | undefined) => ValidationError[];
export declare const validateImageDimensions: (width: number, height: number, type: ImageType) => ValidationError[];
export declare const validateImageUpload: import("fastest-validator").SyncCheckFunction | import("fastest-validator").AsyncCheckFunction;
export declare const validateImageUpdate: import("fastest-validator").SyncCheckFunction | import("fastest-validator").AsyncCheckFunction;
export declare const validateBlogImage: import("fastest-validator").SyncCheckFunction | import("fastest-validator").AsyncCheckFunction;
export declare const validateLessonImage: import("fastest-validator").SyncCheckFunction | import("fastest-validator").AsyncCheckFunction;
export { imageUploadSchema, imageUpdateSchema, blogImageSchema, lessonImageSchema };
