"use strict";
/**
 * مدل پیام تماس - Contact Model
 * @description مدل ذخیره پیام‌های تماس کاربران در Parse Server
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("parse/node"));
/**
 * Contact Schema for Parse Server
 * مدل پیام‌های تماس با ما
 */
class Contact extends node_1.default.Object {
    constructor() {
        super('Contact');
    }
    // Static methods for CRUD operations
    static async create(data) {
        const contact = new Contact();
        // Set basic fields
        contact.set('name', data.name);
        contact.set('email', data.email);
        contact.set('message', data.message);
        contact.set('status', 'pending');
        contact.set('priority', 'medium');
        contact.set('category', 'general');
        // Set optional fields
        if (data.userAgent)
            contact.set('userAgent', data.userAgent);
        if (data.ipAddress)
            contact.set('ipAddress', data.ipAddress);
        if (data.userId)
            contact.set('userId', data.userId);
        // Auto-categorize and prioritize
        contact.autoCategorize();
        contact.autoPrioritize();
        // Set default tags
        contact.set('tags', []);
        await contact.save();
        return contact;
    }
    static async findById(id) {
        const query = new node_1.default.Query(Contact);
        try {
            return await query.get(id);
        }
        catch (error) {
            return null;
        }
    }
    static async findAll(options = {}) {
        const query = new node_1.default.Query(Contact);
        if (options.status) {
            query.equalTo('status', options.status);
        }
        if (options.priority) {
            query.equalTo('priority', options.priority);
        }
        if (options.category) {
            query.equalTo('category', options.category);
        }
        query.descending('createdAt');
        if (options.limit) {
            query.limit(options.limit);
        }
        if (options.skip) {
            query.skip(options.skip);
        }
        return await query.find();
    }
    static async getStats() {
        const totalQuery = new node_1.default.Query(Contact);
        const total = await totalQuery.count();
        const pendingQuery = new node_1.default.Query(Contact);
        pendingQuery.equalTo('status', 'pending');
        const pending = await pendingQuery.count();
        const readQuery = new node_1.default.Query(Contact);
        readQuery.equalTo('status', 'read');
        const read = await readQuery.count();
        const repliedQuery = new node_1.default.Query(Contact);
        repliedQuery.equalTo('status', 'replied');
        const replied = await repliedQuery.count();
        const closedQuery = new node_1.default.Query(Contact);
        closedQuery.equalTo('status', 'closed');
        const closed = await closedQuery.count();
        // Priority stats
        const priorities = ['low', 'medium', 'high', 'urgent'];
        const byPriority = {};
        for (const priority of priorities) {
            const priorityQuery = new node_1.default.Query(Contact);
            priorityQuery.equalTo('priority', priority);
            byPriority[priority] = await priorityQuery.count();
        }
        // Category stats
        const categories = ['general', 'technical', 'billing', 'feature_request', 'bug_report'];
        const byCategory = {};
        for (const category of categories) {
            const categoryQuery = new node_1.default.Query(Contact);
            categoryQuery.equalTo('category', category);
            byCategory[category] = await categoryQuery.count();
        }
        return {
            total,
            pending,
            read,
            replied,
            closed,
            byPriority,
            byCategory
        };
    }
    // Instance methods
    async updateContact(data) {
        if (data.status)
            this.set('status', data.status);
        if (data.priority)
            this.set('priority', data.priority);
        if (data.category)
            this.set('category', data.category);
        if (data.assignedTo)
            this.set('assignedTo', data.assignedTo);
        if (data.tags)
            this.set('tags', data.tags);
        if (data.response) {
            this.set('response', data.response);
            this.set('responseDate', new Date());
            this.set('status', 'replied');
        }
        await this.save();
        return this;
    }
    addTag(tag) {
        const currentTags = this.get('tags') || [];
        if (!currentTags.includes(tag)) {
            this.set('tags', [...currentTags, tag]);
        }
    }
    removeTag(tag) {
        const currentTags = this.get('tags') || [];
        this.set('tags', currentTags.filter((t) => t !== tag));
    }
    markAsRead() {
        if (this.get('status') === 'pending') {
            this.set('status', 'read');
        }
    }
    markAsReplied(response, assignedTo) {
        this.set('response', response);
        this.set('responseDate', new Date());
        this.set('status', 'replied');
        if (assignedTo) {
            this.set('assignedTo', assignedTo);
        }
    }
    close() {
        this.set('status', 'closed');
    }
    // Auto-categorize based on message content
    autoCategorize() {
        const message = this.get('message')?.toLowerCase() || '';
        if (message.includes('خطا') || message.includes('باگ') || message.includes('مشکل')) {
            this.set('category', 'bug_report');
            this.set('priority', 'high');
        }
        else if (message.includes('قابلیت') || message.includes('ویژگی') || message.includes('پیشنهاد')) {
            this.set('category', 'feature_request');
            this.set('priority', 'medium');
        }
        else if (message.includes('فنی') || message.includes('تکنیکال') || message.includes('عملکرد')) {
            this.set('category', 'technical');
            this.set('priority', 'high');
        }
        else if (message.includes('پرداخت') || message.includes('مالی') || message.includes('کیف پول')) {
            this.set('category', 'billing');
            this.set('priority', 'high');
        }
        else {
            this.set('category', 'general');
            this.set('priority', 'medium');
        }
    }
    // Auto-prioritize based on urgency keywords
    autoPrioritize() {
        const message = this.get('message')?.toLowerCase() || '';
        if (message.includes('فوری') || message.includes('اضطراری') || message.includes('مهم')) {
            this.set('priority', 'urgent');
        }
        else if (message.includes('سریع') || message.includes('خطا') || message.includes('کار نمی‌کند')) {
            this.set('priority', 'high');
        }
        else if (message.includes('وقت دارد') || message.includes('عجله ندارد')) {
            this.set('priority', 'low');
        }
    }
    // Convert to JSON for API responses
    toJSON() {
        return {
            name: this.get('name'),
            email: this.get('email'),
            message: this.get('message'),
            status: this.get('status'),
            priority: this.get('priority'),
            category: this.get('category'),
            userAgent: this.get('userAgent'),
            ipAddress: this.get('ipAddress'),
            userId: this.get('userId'),
            assignedTo: this.get('assignedTo'),
            tags: this.get('tags') || [],
            response: this.get('response'),
            responseDate: this.get('responseDate'),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
// Register the subclass
node_1.default.Object.registerSubclass('Contact', Contact);
exports.default = Contact;
//# sourceMappingURL=contact.js.map