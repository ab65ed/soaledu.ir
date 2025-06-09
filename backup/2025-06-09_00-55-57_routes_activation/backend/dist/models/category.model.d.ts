/**
 * Category model
 *
 * This file defines the Category schema for MongoDB.
 * Categories represent educational groups (e.g., "Science", "Engineering").
 */
import mongoose, { Document, Model } from 'mongoose';
export interface ICategory extends Document {
    name: string;
    description?: string;
    parent?: mongoose.Types.ObjectId | null;
    level: number;
    path?: string;
    icon?: string;
    color: string;
    thumbnail?: string;
    isActive: boolean;
    sortOrder: number;
    questionCount: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    generatePath(): Promise<void>;
    getFullTree(): Promise<ICategory[]>;
    getBreadcrumb(): Promise<{
        _id: mongoose.Types.ObjectId;
        name: string;
        path?: string;
    }[]>;
}
export interface ICategoryModel extends Model<ICategory> {
    getCategoryTree(parentId?: mongoose.Types.ObjectId | null): Promise<ICategory[]>;
    getFlatHierarchy(): Promise<any[]>;
    updateQuestionCounts(): Promise<void>;
}
declare const _default: ICategoryModel;
export default _default;
