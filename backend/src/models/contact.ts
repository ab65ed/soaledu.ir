/**
 * مدل پیام تماس - Contact Model
 * @description مدل ذخیره پیام‌های تماس کاربران در Parse Server
 */

import Parse from 'parse/node';

export interface ContactData {
  objectId?: string;
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
class Contact extends Parse.Object {
  constructor() {
    super('Contact');
  }

  // Static methods for CRUD operations
  static async create(data: ContactCreateData): Promise<Contact> {
    const contact = new Contact();
    
    // Set required fields
    contact.set('name', data.name);
    contact.set('email', data.email);
    contact.set('message', data.message);
    
    // Set optional fields
    if (data.userAgent) contact.set('userAgent', data.userAgent);
    if (data.ipAddress) contact.set('ipAddress', data.ipAddress);
    if (data.userId) contact.set('userId', data.userId);
    
    // Set default values
    contact.set('status', 'pending');
    contact.set('priority', 'medium');
    contact.set('category', 'general');
    contact.set('tags', []);
    
    // Auto-categorize and prioritize
    contact.autoCategorize();
    contact.autoPrioritize();
    
    await contact.save();
    return contact;
  }

  static async findById(id: string): Promise<Contact | null> {
    try {
      const query = new Parse.Query(Contact);
      const result = await query.get(id);
      return result as unknown as Contact;
    } catch (error) {
      return null;
    }
  }

  static async findAll(options: {
    limit?: number;
    skip?: number;
    status?: ContactData['status'];
    priority?: ContactData['priority'];
    category?: ContactData['category'];
  } = {}): Promise<Contact[]> {
    const query = new Parse.Query(Contact);
    
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
    
    const results = await query.find();
    return results as unknown as Contact[];
  }

  static async getStats(): Promise<{
    total: number;
    pending: number;
    read: number;
    replied: number;
    closed: number;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    const totalQuery = new Parse.Query(Contact);
    const total = await totalQuery.count();
    
    const pendingQuery = new Parse.Query(Contact);
    pendingQuery.equalTo('status', 'pending');
    const pending = await pendingQuery.count();
    
    const readQuery = new Parse.Query(Contact);
    readQuery.equalTo('status', 'read');
    const read = await readQuery.count();
    
    const repliedQuery = new Parse.Query(Contact);
    repliedQuery.equalTo('status', 'replied');
    const replied = await repliedQuery.count();
    
    const closedQuery = new Parse.Query(Contact);
    closedQuery.equalTo('status', 'closed');
    const closed = await closedQuery.count();
    
    // Priority stats
    const priorities = ['low', 'medium', 'high', 'urgent'];
    const byPriority: Record<string, number> = {};
    for (const priority of priorities) {
      const priorityQuery = new Parse.Query(Contact);
      priorityQuery.equalTo('priority', priority);
      byPriority[priority] = await priorityQuery.count();
    }
    
    // Category stats
    const categories = ['general', 'technical', 'billing', 'feature_request', 'bug_report'];
    const byCategory: Record<string, number> = {};
    for (const category of categories) {
      const categoryQuery = new Parse.Query(Contact);
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
  async updateContact(data: ContactUpdateData): Promise<Contact> {
    if (data.status) this.set('status', data.status);
    if (data.priority) this.set('priority', data.priority);
    if (data.category) this.set('category', data.category);
    if (data.assignedTo) this.set('assignedTo', data.assignedTo);
    if (data.tags) this.set('tags', data.tags);
    if (data.response) {
      this.set('response', data.response);
      this.set('responseDate', new Date());
      this.set('status', 'replied');
    }
    
    await this.save();
    return this;
  }

  addTag(tag: string): void {
    const currentTags = this.get('tags') || [];
    if (!currentTags.includes(tag)) {
      this.set('tags', [...currentTags, tag]);
    }
  }

  removeTag(tag: string): void {
    const currentTags = this.get('tags') || [];
    this.set('tags', currentTags.filter((t: string) => t !== tag));
  }

  markAsRead(): void {
    if (this.get('status') === 'pending') {
      this.set('status', 'read');
    }
  }

  markAsReplied(response: string, assignedTo?: string): void {
    this.set('response', response);
    this.set('responseDate', new Date());
    this.set('status', 'replied');
    if (assignedTo) {
      this.set('assignedTo', assignedTo);
    }
  }

  close(): void {
    this.set('status', 'closed');
  }

  // Auto-categorize based on message content
  autoCategorize(): void {
    const message = this.get('message')?.toLowerCase() || '';
    
    if (message.includes('خطا') || message.includes('باگ') || message.includes('مشکل')) {
      this.set('category', 'bug_report');
      this.set('priority', 'high');
    } else if (message.includes('قابلیت') || message.includes('ویژگی') || message.includes('پیشنهاد')) {
      this.set('category', 'feature_request');
      this.set('priority', 'medium');
    } else if (message.includes('فنی') || message.includes('تکنیکال') || message.includes('عملکرد')) {
      this.set('category', 'technical');
      this.set('priority', 'high');
    } else if (message.includes('پرداخت') || message.includes('مالی') || message.includes('کیف پول')) {
      this.set('category', 'billing');
      this.set('priority', 'high');
    } else {
      this.set('category', 'general');
      this.set('priority', 'medium');
    }
  }

  // Auto-prioritize based on urgency keywords
  autoPrioritize(): void {
    const message = this.get('message')?.toLowerCase() || '';
    
    if (message.includes('فوری') || message.includes('اضطراری') || message.includes('مهم')) {
      this.set('priority', 'urgent');
    } else if (message.includes('سریع') || message.includes('خطا') || message.includes('کار نمی‌کند')) {
      this.set('priority', 'high');
    } else if (message.includes('وقت دارد') || message.includes('عجله ندارد')) {
      this.set('priority', 'low');
    }
  }

  // Convert to JSON for API responses
  toContactData(): ContactData & { objectId: string } {
    return {
      objectId: this.id,
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
Parse.Object.registerSubclass('Contact', Contact as any);

export default Contact; 