"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parse = require('parse/node');
/**
 * CourseExam Schema for Back4App
 * Represents a course exam entity with comprehensive metadata
 */
class CourseExam extends Parse.Object {
    constructor() {
        super('CourseExam');
    }
    // Getters
    get title() {
        return this.get('title');
    }
    get courseType() {
        return this.get('courseType');
    }
    get grade() {
        return this.get('grade');
    }
    get fieldOfStudy() {
        return this.get('fieldOfStudy');
    }
    get description() {
        return this.get('description');
    }
    get tags() {
        return this.get('tags') || [];
    }
    get isPublished() {
        return this.get('isPublished') || false;
    }
    get isDraft() {
        return this.get('isDraft') || true;
    }
    get questionCount() {
        return this.get('questionCount') || 0;
    }
    get totalSales() {
        return this.get('totalSales') || 0;
    }
    get revenue() {
        return this.get('revenue') || 0;
    }
    get difficulty() {
        return this.get('difficulty');
    }
    get estimatedTime() {
        return this.get('estimatedTime');
    }
    get price() {
        return this.get('price') || 0;
    }
    get authorId() {
        return this.get('authorId');
    }
    get author() {
        return this.get('author');
    }
    get metadata() {
        return this.get('metadata') || {};
    }
    get averageRating() {
        return this.get('averageRating') || 0;
    }
    get ratingCount() {
        return this.get('ratingCount') || 0;
    }
    get lastAutoSave() {
        return this.get('lastAutoSave');
    }
    get version() {
        return this.get('version') || 1;
    }
    get chapters() {
        return this.get('chapters') || [];
    }
    // Setters
    set title(value) {
        this.set('title', value);
    }
    set courseType(value) {
        this.set('courseType', value);
    }
    set grade(value) {
        this.set('grade', value);
    }
    set fieldOfStudy(value) {
        this.set('fieldOfStudy', value);
    }
    set description(value) {
        this.set('description', value);
    }
    set tags(value) {
        this.set('tags', value);
    }
    set isPublished(value) {
        this.set('isPublished', value);
    }
    set isDraft(value) {
        this.set('isDraft', value);
    }
    set questionCount(value) {
        this.set('questionCount', value);
    }
    set totalSales(value) {
        this.set('totalSales', value);
    }
    set revenue(value) {
        this.set('revenue', value);
    }
    set difficulty(value) {
        this.set('difficulty', value);
    }
    set estimatedTime(value) {
        this.set('estimatedTime', value);
    }
    set price(value) {
        this.set('price', value);
    }
    set authorId(value) {
        this.set('authorId', value);
    }
    set author(value) {
        this.set('author', value);
    }
    set metadata(value) {
        this.set('metadata', value);
    }
    set averageRating(value) {
        this.set('averageRating', value);
    }
    set ratingCount(value) {
        this.set('ratingCount', value);
    }
    set lastAutoSave(value) {
        this.set('lastAutoSave', value);
    }
    set version(value) {
        this.set('version', value);
    }
    set chapters(value) {
        this.set('chapters', value);
    }
    // Static methods
    static async create(data) {
        const courseExam = new CourseExam();
        // Set all properties
        Object.keys(data).forEach(key => {
            if (courseExam.hasOwnProperty(key) || ['title', 'courseType', 'grade', 'fieldOfStudy', 'description', 'tags', 'difficulty', 'estimatedTime', 'price', 'isPublished', 'isDraft', 'authorId', 'author', 'metadata'].includes(key)) {
                courseExam.set(key, data[key]);
            }
        });
        // Set default values
        if (!data.hasOwnProperty('isPublished')) {
            courseExam.isPublished = false;
        }
        if (!data.hasOwnProperty('isDraft')) {
            courseExam.isDraft = true;
        }
        if (!data.hasOwnProperty('questionCount')) {
            courseExam.questionCount = 0;
        }
        if (!data.hasOwnProperty('totalSales')) {
            courseExam.totalSales = 0;
        }
        if (!data.hasOwnProperty('revenue')) {
            courseExam.revenue = 0;
        }
        if (!data.hasOwnProperty('averageRating')) {
            courseExam.averageRating = 0;
        }
        if (!data.hasOwnProperty('ratingCount')) {
            courseExam.ratingCount = 0;
        }
        if (!data.hasOwnProperty('version')) {
            courseExam.version = 1;
        }
        // Initialize metadata
        const metadata = data.metadata || {};
        metadata.createdAt = new Date();
        metadata.version = 1;
        courseExam.metadata = metadata;
        return await courseExam.save();
    }
    static async findById(id) {
        const query = new Parse.Query(CourseExam);
        return await query.get(id);
    }
    static async findByAuthor(authorId, options = {}) {
        let query = new Parse.Query(CourseExam);
        query.equalTo('authorId', authorId);
        if (options.courseType) {
            query.equalTo('courseType', options.courseType);
        }
        if (options.grade) {
            query.equalTo('grade', options.grade);
        }
        if (options.difficulty) {
            query.equalTo('difficulty', options.difficulty);
        }
        if (options.tags && options.tags.length > 0) {
            query.containedIn('tags', options.tags);
        }
        if (options.priceRange) {
            if (options.priceRange.min !== undefined) {
                query.greaterThanOrEqualTo('price', options.priceRange.min);
            }
            if (options.priceRange.max !== undefined) {
                query.lessThanOrEqualTo('price', options.priceRange.max);
            }
        }
        if (options.search) {
            const titleQuery = new Parse.Query(CourseExam);
            titleQuery.contains('title', options.search);
            const descQuery = new Parse.Query(CourseExam);
            descQuery.contains('description', options.search);
            const tagQuery = new Parse.Query(CourseExam);
            tagQuery.containedIn('tags', [options.search]);
            const searchQuery = Parse.Query.or(titleQuery, descQuery, tagQuery);
            query = Parse.Query.and(query, searchQuery);
        }
        if (options.sortBy) {
            if (options.sortBy === 'popularity') {
                query.descending('totalSales');
            }
            else if (options.sortBy === 'revenue') {
                query.descending('revenue');
            }
            else if (options.sortBy === 'rating') {
                query.descending('averageRating');
            }
            else if (options.sortBy === 'newest') {
                query.descending('createdAt');
            }
            else if (options.sortBy === 'price_low') {
                query.ascending('price');
            }
            else if (options.sortBy === 'price_high') {
                query.descending('price');
            }
        }
        else {
            query.descending('createdAt');
        }
        if (options.limit) {
            query.limit(options.limit);
        }
        if (options.skip) {
            query.skip(options.skip);
        }
        return await query.find();
    }
    static async findPublished(options = {}) {
        let query = new Parse.Query(CourseExam);
        query.equalTo('isPublished', true);
        if (options.courseType) {
            query.equalTo('courseType', options.courseType);
        }
        if (options.grade) {
            query.equalTo('grade', options.grade);
        }
        if (options.difficulty) {
            query.equalTo('difficulty', options.difficulty);
        }
        if (options.tags && options.tags.length > 0) {
            query.containedIn('tags', options.tags);
        }
        if (options.priceRange) {
            if (options.priceRange.min !== undefined) {
                query.greaterThanOrEqualTo('price', options.priceRange.min);
            }
            if (options.priceRange.max !== undefined) {
                query.lessThanOrEqualTo('price', options.priceRange.max);
            }
        }
        if (options.search) {
            // Create compound query for title and description search
            const titleQuery = new Parse.Query(CourseExam);
            titleQuery.contains('title', options.search);
            const descQuery = new Parse.Query(CourseExam);
            descQuery.contains('description', options.search);
            const tagQuery = new Parse.Query(CourseExam);
            tagQuery.containedIn('tags', [options.search]);
            const searchQuery = Parse.Query.or(titleQuery, descQuery, tagQuery);
            query = Parse.Query.and(query, searchQuery);
        }
        if (options.sortBy) {
            if (options.sortBy === 'popularity') {
                query.descending('totalSales');
            }
            else if (options.sortBy === 'revenue') {
                query.descending('revenue');
            }
            else if (options.sortBy === 'rating') {
                query.descending('averageRating');
            }
            else if (options.sortBy === 'newest') {
                query.descending('createdAt');
            }
            else if (options.sortBy === 'price_low') {
                query.ascending('price');
            }
            else if (options.sortBy === 'price_high') {
                query.descending('price');
            }
        }
        else {
            query.descending('createdAt');
        }
        if (options.limit) {
            query.limit(options.limit);
        }
        if (options.skip) {
            query.skip(options.skip);
        }
        return await query.find();
    }
    static async searchByText(searchText, options = {}) {
        let query = new Parse.Query(CourseExam);
        // Full text search across multiple fields
        const titleQuery = new Parse.Query(CourseExam);
        titleQuery.contains('title', searchText);
        const descQuery = new Parse.Query(CourseExam);
        descQuery.contains('description', searchText);
        const tagQuery = new Parse.Query(CourseExam);
        tagQuery.containedIn('tags', [searchText]);
        const searchQuery = Parse.Query.or(titleQuery, descQuery, tagQuery);
        if (options.publishedOnly) {
            searchQuery.equalTo('isPublished', true);
        }
        if (options.limit) {
            searchQuery.limit(options.limit);
        }
        searchQuery.descending('createdAt');
        return await searchQuery.find();
    }
    static async getStats(authorId) {
        const query = new Parse.Query(CourseExam);
        if (authorId) {
            query.equalTo('authorId', authorId);
        }
        const allExams = await query.find();
        const totalCourses = allExams.length;
        const publishedCourses = allExams.filter(exam => exam.isPublished).length;
        const draftCourses = totalCourses - publishedCourses;
        const totalRevenue = allExams.reduce((sum, exam) => sum + (exam.revenue || 0), 0);
        const totalSales = allExams.reduce((sum, exam) => sum + (exam.totalSales || 0), 0);
        const averageRating = allExams.length > 0
            ? allExams.reduce((sum, exam) => sum + (exam.averageRating || 0), 0) / allExams.length
            : 0;
        const topSellingCourse = allExams.reduce((top, exam) => (exam.totalSales || 0) > (top?.totalSales || 0) ? exam : top, null);
        return {
            totalCourses,
            publishedCourses,
            draftCourses,
            totalRevenue,
            totalSales,
            averageRating,
            topSellingCourse
        };
    }
    // Instance methods
    async publish() {
        this.isPublished = true;
        this.isDraft = false;
        return await this.save();
    }
    async unpublish() {
        this.isPublished = false;
        this.isDraft = true;
        return await this.save();
    }
    async incrementSales(amount = 1, price = null) {
        this.totalSales = (this.totalSales || 0) + amount;
        if (price) {
            this.revenue = (this.revenue || 0) + (price * amount);
        }
        return await this.save();
    }
    async updateRating(newRating) {
        const currentRating = this.averageRating || 0;
        const currentCount = this.ratingCount || 0;
        const totalRating = currentRating * currentCount + newRating;
        const newCount = currentCount + 1;
        this.averageRating = totalRating / newCount;
        this.ratingCount = newCount;
        return await this.save();
    }
    async autoSave(data) {
        // Update fields from data
        Object.keys(data).forEach(key => {
            if (this.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        });
        // Update metadata
        const currentMetadata = this.metadata || {};
        this.metadata = {
            ...currentMetadata,
            lastAutoSave: new Date(),
            version: (currentMetadata.version || 0) + 1
        };
        return await this.save();
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            courseType: this.courseType,
            grade: this.grade,
            fieldOfStudy: this.fieldOfStudy,
            description: this.description,
            tags: this.tags,
            isPublished: this.isPublished,
            isDraft: this.isDraft,
            questionCount: this.questionCount,
            totalSales: this.totalSales,
            revenue: this.revenue,
            difficulty: this.difficulty,
            estimatedTime: this.estimatedTime,
            price: this.price,
            authorId: this.authorId,
            averageRating: this.averageRating,
            ratingCount: this.ratingCount,
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
// Register the class
Parse.Object.registerSubclass('CourseExam', CourseExam);
module.exports = CourseExam;
//# sourceMappingURL=CourseExam.js.map