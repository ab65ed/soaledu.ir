export declare const validateBlogPost: (data: any) => {
    isValid: boolean;
    data: {
        title?: string;
        tags?: string[];
        status?: "draft" | "published" | "archived";
        categories?: string[];
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
        description?: string;
        order?: number;
        name?: string;
        parent?: string;
        color?: string;
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
