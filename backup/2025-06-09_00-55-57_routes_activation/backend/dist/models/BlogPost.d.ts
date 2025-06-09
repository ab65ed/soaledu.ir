/**
 * Blog Post Model
 *
 * Handles blog posts with rich content, categories, tags, and comments
 */
import { Model } from 'mongoose';
import { IBlogPost } from '../types/index';
interface PublishedPostsOptions {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: number;
}
interface IBlogPostModel extends Model<IBlogPost> {
    getPublishedPosts(options?: PublishedPostsOptions): Promise<IBlogPost[]>;
    getRelatedPosts(postId: string, limit?: number): Promise<IBlogPost[]>;
}
declare const _default: IBlogPostModel;
export default _default;
