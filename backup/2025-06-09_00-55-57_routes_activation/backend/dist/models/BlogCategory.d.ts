/**
 * Blog Category Model
 *
 * Handles hierarchical blog categories for content organization
 */
import mongoose, { Model } from 'mongoose';
import { IBlogCategory } from '../types/index';
interface ICategoryImage {
    url?: string;
    alt?: string;
}
interface IBlogCategoryDocument extends IBlogCategory {
    slug: string;
    parent?: mongoose.Types.ObjectId;
    path: string;
    level: number;
    order: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords: string[];
    image?: ICategoryImage;
    color: string;
    postCount: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    children?: IBlogCategoryDocument[];
    posts?: any[];
    updatePostCount(): Promise<void>;
}
interface CategoryTreeItem extends IBlogCategoryDocument {
    children: CategoryTreeItem[];
}
interface BreadcrumbItem {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    path: string;
}
interface BlogCategoryModel extends Model<IBlogCategoryDocument> {
    getCategoryTree(parentId?: mongoose.Types.ObjectId | null): Promise<CategoryTreeItem[]>;
    getBreadcrumbs(categoryId: string): Promise<BreadcrumbItem[]>;
    getDescendants(categoryId: string): Promise<IBlogCategoryDocument[]>;
}
declare const _default: BlogCategoryModel;
export default _default;
