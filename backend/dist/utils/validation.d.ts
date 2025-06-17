export declare const validateBlogPost: (data: any) => {
    isValid: boolean;
    data: {
        tags?: string[];
        categories?: string[];
        title?: string;
        status?: "draft" | "published" | "archived";
        content?: string;
        metaTitle?: string;
        metaDescription?: string;
        excerpt?: string;
        metaKeywords?: string[];
        allowComments?: boolean;
        isFeatured?: boolean;
        isSticky?: boolean;
    };
    errors: any[];
} | {
    isValid: boolean;
    data: any;
    errors: {
        field: string;
        message: string;
    }[];
};
export declare const validateBlogCategory: (data: any) => {
    isValid: boolean;
    data: {
        name?: string;
        description?: string;
        parent?: string;
        color?: string;
        order?: number;
    };
    errors: any[];
} | {
    isValid: boolean;
    data: any;
    errors: {
        field: string;
        message: string;
    }[];
};
