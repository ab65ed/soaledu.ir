/**
 * مدل پیام تماس - Contact Model
 * @description مدل ذخیره پیام‌های تماس کاربران در Parse Server
 */
import Parse from 'parse/node';
export interface ContactData {
    name: string;
    email: string;
    message: string;
    status: 'pending' | 'read' | 'replied' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'general' | 'technical' | 'billing' | 'feature_request' | 'bug_report';
    userAgent?: string;
    ipAddress?: string;
    userId?: string;
    assignedTo?: string;
    tags?: string[];
    response?: string;
    responseDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ContactCreateData {
    name: string;
    email: string;
    message: string;
    userAgent?: string;
    ipAddress?: string;
    userId?: string;
}
export interface ContactUpdateData {
    status?: ContactData['status'];
    priority?: ContactData['priority'];
    category?: ContactData['category'];
    assignedTo?: string;
    tags?: string[];
    response?: string;
}
/**
 * Contact Schema for Parse Server
 * مدل پیام‌های تماس با ما
 */
declare class Contact extends Parse.Object {
    constructor();
    static create(data: ContactCreateData): Promise<Contact>;
    static findById(id: string): Promise<Contact | null>;
    static findAll(options?: {
        limit?: number;
        skip?: number;
        status?: ContactData['status'];
        priority?: ContactData['priority'];
        category?: ContactData['category'];
    }): Promise<Contact[]>;
    static getStats(): Promise<{
        total: number;
        pending: number;
        read: number;
        replied: number;
        closed: number;
        byPriority: Record<string, number>;
        byCategory: Record<string, number>;
    }>;
    updateContact(data: ContactUpdateData): Promise<Contact>;
    addTag(tag: string): void;
    removeTag(tag: string): void;
    markAsRead(): void;
    markAsReplied(response: string, assignedTo?: string): void;
    close(): void;
    autoCategorize(): void;
    autoPrioritize(): void;
    toJSON(): ContactData;
}
export default Contact;
