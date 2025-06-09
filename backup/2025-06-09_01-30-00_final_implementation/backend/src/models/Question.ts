import Parse from 'parse/node';

interface QuestionData {
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'fill-blank';
  text: string;
  options?: string[];
  correctOptions?: number[];
  correctAnswer?: string | number;
  allowMultipleCorrect?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  points?: number;
  explanation?: string;
  category?: string;
  lesson?: string;
  tags?: string[];
  timeLimit?: number;
  sourcePage?: string;
  sourceBook?: string;
  sourceChapter?: string;
  isDraft?: boolean;
  isPublished?: boolean;
  authorId?: string;
  author?: Parse.User;
  metadata?: Record<string, any>;
}

/**
 * Question Schema for Back4App
 * Represents a question entity with comprehensive metadata
 * 
 * ویژگی‌های اصلی:
 * - 4 گزینه با اعتبارسنجی
 * - ذخیره لحظه‌ای
 * - صفحه منبع اختیاری
 * - انواع مختلف سوال
 */
class Question extends Parse.Object {
  constructor() {
    super('Question');
  }

  // Getters
  get type() {
    return this.get('type');
  }

  get text() {
    return this.get('text');
  }

  get options() {
    return this.get('options') || [];
  }

  get correctOptions() {
    return this.get('correctOptions') || [];
  }

  get correctAnswer() {
    return this.get('correctAnswer');
  }

  get allowMultipleCorrect() {
    return this.get('allowMultipleCorrect') || false;
  }

  get difficulty() {
    return this.get('difficulty');
  }

  get points() {
    return this.get('points') || 1;
  }

  get explanation() {
    return this.get('explanation');
  }

  get category() {
    return this.get('category');
  }

  get lesson() {
    return this.get('lesson');
  }

  get tags() {
    return this.get('tags') || [];
  }

  get timeLimit() {
    return this.get('timeLimit');
  }

  get sourcePage() {
    return this.get('sourcePage');
  }

  get sourceBook() {
    return this.get('sourceBook');
  }

  get sourceChapter() {
    return this.get('sourceChapter');
  }

  get isDraft() {
    return this.get('isDraft') || true;
  }

  get isPublished() {
    return this.get('isPublished') || false;
  }

  get authorId() {
    return this.get('authorId');
  }

  get author() {
    return this.get('author');
  }

  get lastAutoSave() {
    return this.get('lastAutoSave');
  }

  get version() {
    return this.get('version') || 1;
  }

  get metadata() {
    return this.get('metadata') || {};
  }

  // Setters
  set type(value) {
    this.set('type', value);
  }

  set text(value) {
    this.set('text', value);
  }

  set options(value) {
    this.set('options', value);
  }

  set correctOptions(value) {
    this.set('correctOptions', value);
  }

  set correctAnswer(value) {
    this.set('correctAnswer', value);
  }

  set allowMultipleCorrect(value) {
    this.set('allowMultipleCorrect', value);
  }

  set difficulty(value) {
    this.set('difficulty', value);
  }

  set points(value) {
    this.set('points', value);
  }

  set explanation(value) {
    this.set('explanation', value);
  }

  set category(value) {
    this.set('category', value);
  }

  set lesson(value) {
    this.set('lesson', value);
  }

  set tags(value) {
    this.set('tags', value);
  }

  set timeLimit(value) {
    this.set('timeLimit', value);
  }

  set sourcePage(value) {
    this.set('sourcePage', value);
  }

  set sourceBook(value) {
    this.set('sourceBook', value);
  }

  set sourceChapter(value) {
    this.set('sourceChapter', value);
  }

  set isDraft(value) {
    this.set('isDraft', value);
  }

  set isPublished(value) {
    this.set('isPublished', value);
  }

  set authorId(value) {
    this.set('authorId', value);
  }

  set author(value) {
    this.set('author', value);
  }

  set lastAutoSave(value) {
    this.set('lastAutoSave', value);
  }

  set version(value) {
    this.set('version', value);
  }

  set metadata(value) {
    this.set('metadata', value);
  }

  // Static methods for creation and queries
  static async create(data) {
    const question = new Question();
    
    // Required fields
    question.type = data.type;
    question.text = data.text;
    question.category = data.category;
    question.difficulty = data.difficulty || 'Medium';
    question.points = data.points || 1;
    
    // Type-specific fields
    if (data.type === 'multiple-choice' || data.type === 'true-false') {
      question.options = data.options || [];
      question.correctOptions = data.correctOptions || [];
      question.allowMultipleCorrect = data.allowMultipleCorrect || false;
    } else {
      question.correctAnswer = data.correctAnswer || '';
    }
    
    // Optional fields
    question.explanation = data.explanation || '';
    question.lesson = data.lesson;
    question.tags = data.tags || [];
    question.timeLimit = data.timeLimit;
    question.sourcePage = data.sourcePage;
    question.sourceBook = data.sourceBook;
    question.sourceChapter = data.sourceChapter;
    question.isDraft = data.isDraft !== undefined ? data.isDraft : true;
    question.isPublished = data.isPublished || false;
    question.authorId = data.authorId;
    question.version = data.version || 1;
    
    // Metadata
    question.metadata = {
      lastAutoSave: new Date(),
      version: 1,
      ...data.metadata
    };

    // Set author relationship if provided
    if (data.author) {
      question.author = data.author;
    }

    // ACL settings
    const acl = new Parse.ACL();
    if (data.authorId) {
      acl.setReadAccess(data.authorId, true);
      acl.setWriteAccess(data.authorId, true);
    }
    acl.setPublicReadAccess(true); // Allow public read for published questions
    question.setACL(acl);

    // Validate before saving
    const validation = question.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return await question.save();
  }

  static async findById(id) {
    const query = new Parse.Query(Question);
    return await query.get(id);
  }

  static async findByAuthor(authorId, options = {}) {
    const query = new Parse.Query(Question);
    query.equalTo('authorId', authorId);
    
    if (options.include) {
      query.include(options.include);
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
    const query = new Parse.Query(Question);
    query.equalTo('isPublished', true);
    
    if (options.type) {
      query.equalTo('type', options.type);
    }
    
    if (options.category) {
      query.equalTo('category', options.category);
    }
    
    if (options.difficulty) {
      query.equalTo('difficulty', options.difficulty);
    }
    
    if (options.tags && options.tags.length > 0) {
      query.containedIn('tags', options.tags);
    }
    
    if (options.search) {
      // Create compound query for text search
      const textQuery = new Parse.Query(Question);
      textQuery.contains('text', options.search);
      
      const categoryQuery = new Parse.Query(Question);
      categoryQuery.contains('category', options.search);
      
      const tagQuery = new Parse.Query(Question);
      tagQuery.containedIn('tags', [options.search]);
      
      const searchQuery = Parse.Query.or(textQuery, categoryQuery, tagQuery);
      query = Parse.Query.and(query, searchQuery);
    }
    
    if (options.sortBy) {
      if (options.sortBy === 'difficulty') {
        query.ascending('difficulty');
      } else if (options.sortBy === 'points') {
        query.descending('points');
      } else if (options.sortBy === 'newest') {
        query.descending('createdAt');
      } else if (options.sortBy === 'category') {
        query.ascending('category');
      }
    } else {
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
    const query = new Parse.Query(Question);
    
    // Full text search across multiple fields
    const textQuery = new Parse.Query(Question);
    textQuery.contains('text', searchText);
    
    const categoryQuery = new Parse.Query(Question);
    categoryQuery.contains('category', searchText);
    
    const tagQuery = new Parse.Query(Question);
    tagQuery.containedIn('tags', [searchText]);
    
    const searchQuery = Parse.Query.or(textQuery, categoryQuery, tagQuery);
    
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
    const query = new Parse.Query(Question);
    
    if (authorId) {
      query.equalTo('authorId', authorId);
    }
    
    const allQuestions = await query.find();
    
    const totalQuestions = allQuestions.length;
    const publishedQuestions = allQuestions.filter(q => q.isPublished).length;
    const draftQuestions = totalQuestions - publishedQuestions;
    
    // Validation stats
    const validQuestions = allQuestions.filter(q => {
      const validation = q.validate();
      return validation.isValid;
    }).length;
    
    const invalidQuestions = totalQuestions - validQuestions;
    
    // Difficulty distribution
    const difficultyStats = {
      Easy: allQuestions.filter(q => q.difficulty === 'Easy').length,
      Medium: allQuestions.filter(q => q.difficulty === 'Medium').length,
      Hard: allQuestions.filter(q => q.difficulty === 'Hard').length,
    };
    
    // Type distribution
    const typeStats = {
      'multiple-choice': allQuestions.filter(q => q.type === 'multiple-choice').length,
      'true-false': allQuestions.filter(q => q.type === 'true-false').length,
      'short-answer': allQuestions.filter(q => q.type === 'short-answer').length,
      'essay': allQuestions.filter(q => q.type === 'essay').length,
    };
    
    // Category distribution
    const categoryStats = allQuestions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {});
    
    // Source information stats
    const questionsWithSource = allQuestions.filter(q => 
      q.sourcePage || q.sourceBook || q.sourceChapter
    ).length;
    
    return {
      totalQuestions,
      publishedQuestions,
      draftQuestions,
      validQuestions,
      invalidQuestions,
      difficultyStats,
      typeStats,
      categoryStats,
      questionsWithSource
    };
  }

  // Instance methods
  async publish() {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(`Cannot publish invalid question: ${validation.errors.join(', ')}`);
    }
    
    this.isPublished = true;
    this.isDraft = false;
    return await this.save();
  }

  async unpublish() {
    this.isPublished = false;
    this.isDraft = true;
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
    
    this.lastAutoSave = new Date();
    
    return await this.save();
  }

  // Validation method
  validate() {
    const errors = [];

    // Text validation
    if (!this.text || this.text.trim().length < 10) {
      errors.push('Question text must be at least 10 characters');
    }

    // Category validation
    if (!this.category || this.category.trim().length === 0) {
      errors.push('Category is required');
    }

    // Type-specific validation
    if (this.type === 'multiple-choice') {
      // Must have exactly 4 options
      if (!this.options || this.options.length !== 4) {
        errors.push('Multiple choice questions must have exactly 4 options');
      } else {
        // Each option must have at least 2 characters
        const invalidOptions = this.options.filter(opt => !opt || opt.trim().length < 2);
        if (invalidOptions.length > 0) {
          errors.push('Each option must have at least 2 characters');
        }
      }

      // Must have at least one correct option
      if (!this.correctOptions || this.correctOptions.length === 0) {
        errors.push('At least one correct option must be selected');
      }
    } else if (this.type === 'true-false') {
      // Must have exactly 2 options
      if (!this.options || this.options.length !== 2) {
        errors.push('True/false questions must have exactly 2 options');
      }
      
      if (!this.correctOptions || this.correctOptions.length === 0) {
        errors.push('Correct option must be selected');
      }
    } else if (this.type === 'short-answer' || this.type === 'essay') {
      // Must have correct answer
      if (!this.correctAnswer || this.correctAnswer.trim().length === 0) {
        errors.push('Correct answer is required');
      }
    }

    // Points validation
    if (this.points < 0.5 || this.points > 10) {
      errors.push('Points must be between 0.5 and 10');
    }

    // Source page validation (optional but if provided must be valid)
    if (this.sourcePage && (this.sourcePage < 1 || this.sourcePage > 9999)) {
      errors.push('Source page must be between 1 and 9999');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      text: this.text,
      options: this.options,
      correctOptions: this.correctOptions,
      correctAnswer: this.correctAnswer,
      allowMultipleCorrect: this.allowMultipleCorrect,
      difficulty: this.difficulty,
      points: this.points,
      explanation: this.explanation,
      category: this.category,
      lesson: this.lesson,
      tags: this.tags,
      timeLimit: this.timeLimit,
      sourcePage: this.sourcePage,
      sourceBook: this.sourceBook,
      sourceChapter: this.sourceChapter,
      isDraft: this.isDraft,
      isPublished: this.isPublished,
      authorId: this.authorId,
      lastAutoSave: this.lastAutoSave,
      version: this.version,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Register the class
Parse.Object.registerSubclass('Question', Question);

export { Question };
export default Question; 