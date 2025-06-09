const Parse = require('parse/node');
const Question = require('./Question');

/**
 * TestExam Schema for Back4App
 * Represents a test exam entity with 40 questions and difficulty distribution
 * 
 * ویژگی‌های اصلی:
 * - 40 سوال با توزیع سختی
 * - شخصی‌سازی تعداد/سطح
 * - مدیریت جلسات آزمون
 * - محاسبه نتایج و تحلیل
 */
class TestExam extends Parse.Object {
  constructor() {
    super('TestExam');
  }

  // Getters
  get title() {
    return this.get('title');
  }

  get description() {
    return this.get('description');
  }

  get type() {
    return this.get('type');
  }

  get status() {
    return this.get('status');
  }

  get configuration() {
    return this.get('configuration') || {};
  }

  get questions() {
    return this.get('questions') || [];
  }

  get questionIds() {
    return this.get('questionIds') || [];
  }

  get authorId() {
    return this.get('authorId');
  }

  get author() {
    return this.get('author');
  }

  get startTime() {
    return this.get('startTime');
  }

  get endTime() {
    return this.get('endTime');
  }

  get isPublished() {
    return this.get('isPublished') || false;
  }

  get metadata() {
    return this.get('metadata') || {};
  }

  // Setters
  set title(value) {
    this.set('title', value);
  }

  set description(value) {
    this.set('description', value);
  }

  set type(value) {
    this.set('type', value);
  }

  set status(value) {
    this.set('status', value);
  }

  set configuration(value) {
    this.set('configuration', value);
  }

  set questions(value) {
    this.set('questions', value);
  }

  set questionIds(value) {
    this.set('questionIds', value);
  }

  set authorId(value) {
    this.set('authorId', value);
  }

  set author(value) {
    this.set('author', value);
  }

  set startTime(value) {
    this.set('startTime', value);
  }

  set endTime(value) {
    this.set('endTime', value);
  }

  set isPublished(value) {
    this.set('isPublished', value);
  }

  set metadata(value) {
    this.set('metadata', value);
  }

  // Static methods
  static async create(data) {
    const exam = new TestExam();
    
    // Required fields
    exam.title = data.title;
    exam.type = data.type || 'practice';
    exam.status = data.status || 'draft';
    exam.authorId = data.authorId;
    exam.isPublished = data.isPublished || false;
    
    // Configuration with defaults
    const defaultConfig = {
      totalQuestions: 40,
      difficultyDistribution: {
        easy: 10,
        medium: 15,
        hard: 15
      },
      timeLimit: 60,
      allowReview: true,
      shuffleQuestions: true,
      shuffleOptions: true,
      showResults: true,
      passingScore: 70
    };
    
    exam.configuration = { ...defaultConfig, ...data.configuration };
    
    // Optional fields
    exam.description = data.description || '';
    exam.startTime = data.startTime;
    exam.endTime = data.endTime;
    
    // Metadata
    exam.metadata = {
      version: 1,
      lastModified: new Date(),
      participantCount: 0,
      averageScore: 0,
      passRate: 0,
      ...data.metadata
    };

    // Set author relationship
    if (data.author) {
      exam.author = data.author;
    }

    // ACL settings
    const acl = new Parse.ACL();
    if (data.authorId) {
      acl.setReadAccess(data.authorId, true);
      acl.setWriteAccess(data.authorId, true);
    }
    acl.setPublicReadAccess(true); // Allow public read for published exams
    exam.setACL(acl);

    // Generate questions if configuration is provided
    if (data.configuration) {
      await exam.generateQuestions(data.configuration);
    }

    return await exam.save();
  }

  static async findById(id) {
    const query = new Parse.Query(TestExam);
    query.include('author');
    return await query.get(id);
  }

  static async findByAuthor(authorId, options = {}) {
    const query = new Parse.Query(TestExam);
    query.equalTo('authorId', authorId);
    query.include('author');
    
    if (options.status) {
      query.equalTo('status', options.status);
    }
    
    if (options.type) {
      query.equalTo('type', options.type);
    }
    
    if (options.limit) {
      query.limit(options.limit);
    }
    
    if (options.skip) {
      query.skip(options.skip);
    }
    
    query.descending('createdAt');
    return await query.find();
  }

  static async findPublished(options = {}) {
    const query = new Parse.Query(TestExam);
    query.equalTo('isPublished', true);
    query.equalTo('status', 'active');
    query.include('author');
    
    if (options.type) {
      query.equalTo('type', options.type);
    }
    
    if (options.search) {
      const titleQuery = new Parse.Query(TestExam);
      titleQuery.contains('title', options.search);
      
      const descQuery = new Parse.Query(TestExam);
      descQuery.contains('description', options.search);
      
      const searchQuery = Parse.Query.or(titleQuery, descQuery);
      query = Parse.Query.and(query, searchQuery);
    }
    
    if (options.limit) {
      query.limit(options.limit);
    }
    
    if (options.skip) {
      query.skip(options.skip);
    }
    
    query.descending('createdAt');
    return await query.find();
  }

  // Instance methods
  async generateQuestions(config = null) {
    const configuration = config || this.configuration;
    const { totalQuestions, difficultyDistribution, categories, tags } = configuration;
    
    try {
      // Build query for available questions
      const questionQuery = new Parse.Query(Question);
      questionQuery.equalTo('isPublished', true);
      
      if (categories && categories.length > 0) {
        questionQuery.containedIn('category', categories);
      }
      
      if (tags && tags.length > 0) {
        questionQuery.containedIn('tags', tags);
      }
      
      // Get questions by difficulty
      const easyQuery = new Parse.Query(Question);
      easyQuery.equalTo('difficulty', 'Easy');
      easyQuery.equalTo('isPublished', true);
      if (categories && categories.length > 0) easyQuery.containedIn('category', categories);
      if (tags && tags.length > 0) easyQuery.containedIn('tags', tags);
      
      const mediumQuery = new Parse.Query(Question);
      mediumQuery.equalTo('difficulty', 'Medium');
      mediumQuery.equalTo('isPublished', true);
      if (categories && categories.length > 0) mediumQuery.containedIn('category', categories);
      if (tags && tags.length > 0) mediumQuery.containedIn('tags', tags);
      
      const hardQuery = new Parse.Query(Question);
      hardQuery.equalTo('difficulty', 'Hard');
      hardQuery.equalTo('isPublished', true);
      if (categories && categories.length > 0) hardQuery.containedIn('category', categories);
      if (tags && tags.length > 0) hardQuery.containedIn('tags', tags);
      
      // Fetch questions
      const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
        easyQuery.find(),
        mediumQuery.find(),
        hardQuery.find()
      ]);
      
      // Select questions based on distribution
      const selectedQuestions = [];
      
      // Select easy questions
      const shuffledEasy = this.shuffleArray([...easyQuestions]);
      selectedQuestions.push(...shuffledEasy.slice(0, difficultyDistribution.easy));
      
      // Select medium questions
      const shuffledMedium = this.shuffleArray([...mediumQuestions]);
      selectedQuestions.push(...shuffledMedium.slice(0, difficultyDistribution.medium));
      
      // Select hard questions
      const shuffledHard = this.shuffleArray([...hardQuestions]);
      selectedQuestions.push(...shuffledHard.slice(0, difficultyDistribution.hard));
      
      // If we don't have enough questions, fill with available ones
      const remainingNeeded = totalQuestions - selectedQuestions.length;
      if (remainingNeeded > 0) {
        const allAvailable = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        const usedIds = selectedQuestions.map(q => q.id);
        const remaining = allAvailable.filter(q => !usedIds.includes(q.id));
        const shuffledRemaining = this.shuffleArray(remaining);
        selectedQuestions.push(...shuffledRemaining.slice(0, remainingNeeded));
      }
      
      // Shuffle final question order if configured
      const finalQuestions = configuration.shuffleQuestions 
        ? this.shuffleArray(selectedQuestions)
        : selectedQuestions;
      
      // Store question IDs and full question data
      this.questionIds = finalQuestions.map(q => q.id);
      this.questions = finalQuestions.map(q => q.toJSON());
      
      return finalQuestions;
      
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('خطا در تولید سوالات آزمون');
    }
  }

  async publish() {
    // Validate exam before publishing
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(`Cannot publish invalid exam: ${validation.errors.join(', ')}`);
    }
    
    this.isPublished = true;
    this.status = 'active';
    
    // Update metadata
    const currentMetadata = this.metadata || {};
    this.metadata = {
      ...currentMetadata,
      lastModified: new Date(),
      version: (currentMetadata.version || 0) + 1
    };
    
    return await this.save();
  }

  async unpublish() {
    this.isPublished = false;
    this.status = 'draft';
    return await this.save();
  }

  async updateStats(sessionResult) {
    const currentMetadata = this.metadata || {};
    const participantCount = (currentMetadata.participantCount || 0) + 1;
    const currentAverage = currentMetadata.averageScore || 0;
    const newAverage = ((currentAverage * (participantCount - 1)) + sessionResult.percentage) / participantCount;
    
    const passCount = currentMetadata.passCount || 0;
    const newPassCount = sessionResult.resultStatus === 'passed' ? passCount + 1 : passCount;
    const passRate = (newPassCount / participantCount) * 100;
    
    this.metadata = {
      ...currentMetadata,
      participantCount,
      averageScore: Math.round(newAverage * 100) / 100,
      passCount: newPassCount,
      passRate: Math.round(passRate * 100) / 100,
      lastParticipant: new Date()
    };
    
    return await this.save();
  }

  // Validation method
  validate() {
    const errors = [];
    
    // Title validation
    if (!this.title || this.title.trim().length < 3) {
      errors.push('عنوان آزمون باید حداقل 3 کاراکتر باشد');
    }
    
    // Configuration validation
    const config = this.configuration;
    if (!config) {
      errors.push('تنظیمات آزمون الزامی است');
    } else {
      if (config.totalQuestions < 5 || config.totalQuestions > 100) {
        errors.push('تعداد سوالات باید بین 5 تا 100 باشد');
      }
      
      const distribution = config.difficultyDistribution;
      if (distribution) {
        const total = distribution.easy + distribution.medium + distribution.hard;
        if (total !== config.totalQuestions) {
          errors.push('مجموع توزیع سختی باید برابر تعداد کل سوالات باشد');
        }
      }
      
      if (config.passingScore < 0 || config.passingScore > 100) {
        errors.push('نمره قبولی باید بین 0 تا 100 باشد');
      }
    }
    
    // Questions validation
    if (this.questionIds && this.questionIds.length !== config?.totalQuestions) {
      errors.push('تعداد سوالات انتخاب شده با تنظیمات مطابقت ندارد');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Utility methods
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      status: this.status,
      configuration: this.configuration,
      questions: this.questions,
      questionIds: this.questionIds,
      authorId: this.authorId,
      startTime: this.startTime,
      endTime: this.endTime,
      isPublished: this.isPublished,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// ExamSession class for managing exam sessions
class ExamSession extends Parse.Object {
  constructor() {
    super('ExamSession');
  }

  // Getters
  get examId() {
    return this.get('examId');
  }

  get exam() {
    return this.get('exam');
  }

  get participantId() {
    return this.get('participantId');
  }

  get participant() {
    return this.get('participant');
  }

  get status() {
    return this.get('status');
  }

  get startTime() {
    return this.get('startTime');
  }

  get endTime() {
    return this.get('endTime');
  }

  get timeRemaining() {
    return this.get('timeRemaining');
  }

  get currentQuestionIndex() {
    return this.get('currentQuestionIndex') || 0;
  }

  get answers() {
    return this.get('answers') || [];
  }

  get score() {
    return this.get('score');
  }

  get percentage() {
    return this.get('percentage');
  }

  get resultStatus() {
    return this.get('resultStatus');
  }

  get metadata() {
    return this.get('metadata') || {};
  }

  // Setters
  set examId(value) {
    this.set('examId', value);
  }

  set exam(value) {
    this.set('exam', value);
  }

  set participantId(value) {
    this.set('participantId', value);
  }

  set participant(value) {
    this.set('participant', value);
  }

  set status(value) {
    this.set('status', value);
  }

  set startTime(value) {
    this.set('startTime', value);
  }

  set endTime(value) {
    this.set('endTime', value);
  }

  set timeRemaining(value) {
    this.set('timeRemaining', value);
  }

  set currentQuestionIndex(value) {
    this.set('currentQuestionIndex', value);
  }

  set answers(value) {
    this.set('answers', value);
  }

  set score(value) {
    this.set('score', value);
  }

  set percentage(value) {
    this.set('percentage', value);
  }

  set resultStatus(value) {
    this.set('resultStatus', value);
  }

  set metadata(value) {
    this.set('metadata', value);
  }

  // Static methods
  static async create(data) {
    const session = new ExamSession();
    
    session.examId = data.examId;
    session.participantId = data.participantId;
    session.status = 'active';
    session.startTime = new Date();
    session.currentQuestionIndex = 0;
    session.answers = [];
    
    // Set relationships
    if (data.exam) {
      session.exam = data.exam;
    }
    if (data.participant) {
      session.participant = data.participant;
    }
    
    // Calculate time remaining if exam has time limit
    if (data.exam && data.exam.configuration.timeLimit) {
      session.timeRemaining = data.exam.configuration.timeLimit * 60; // Convert to seconds
    }
    
    // Initialize metadata
    session.metadata = {
      timeSpent: 0,
      questionsVisited: 0,
      questionsAnswered: 0,
      questionsMarkedForReview: 0,
      deviceInfo: data.deviceInfo,
      ipAddress: data.ipAddress,
      startedAt: new Date()
    };
    
    // ACL settings
    const acl = new Parse.ACL();
    acl.setReadAccess(data.participantId, true);
    acl.setWriteAccess(data.participantId, true);
    session.setACL(acl);
    
    return await session.save();
  }

  async submitAnswer(questionId, answer) {
    const answers = [...this.answers];
    const existingIndex = answers.findIndex(a => a.questionId === questionId);
    
    const answerData = {
      questionId,
      selectedOptions: answer.selectedOptions,
      textAnswer: answer.textAnswer,
      status: 'answered',
      timeSpent: answer.timeSpent || 0,
      answeredAt: new Date()
    };
    
    if (existingIndex >= 0) {
      answers[existingIndex] = answerData;
    } else {
      answers.push(answerData);
    }
    
    this.answers = answers;
    
    // Update metadata
    const metadata = this.metadata || {};
    metadata.questionsAnswered = answers.filter(a => a.status === 'answered').length;
    metadata.lastActivity = new Date();
    this.metadata = metadata;
    
    return await this.save();
  }

  async finishExam() {
    this.status = 'completed';
    this.endTime = new Date();
    
    // Calculate final score
    const result = await this.calculateResult();
    this.score = result.score;
    this.percentage = result.percentage;
    this.resultStatus = result.resultStatus;
    
    // Update metadata
    const metadata = this.metadata || {};
    metadata.completedAt = new Date();
    metadata.totalTimeSpent = Math.floor((this.endTime - this.startTime) / 1000);
    this.metadata = metadata;
    
    return await this.save();
  }

  async calculateResult() {
    try {
      // Get exam and questions
      const examQuery = new Parse.Query(TestExam);
      const exam = await examQuery.get(this.examId);
      const questions = exam.questions;
      
      let totalPoints = 0;
      let earnedPoints = 0;
      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let unansweredQuestions = 0;
      
      const detailedResults = [];
      
      questions.forEach((question, index) => {
        const userAnswer = this.answers.find(a => a.questionId === question.id);
        totalPoints += question.points;
        
        let isCorrect = false;
        
        if (!userAnswer || userAnswer.status === 'not_answered') {
          unansweredQuestions++;
        } else {
          // Check if answer is correct based on question type
          if (question.type === 'multiple-choice' || question.type === 'true-false') {
            const correctOptions = question.correctOptions || [];
            const selectedOptions = userAnswer.selectedOptions || [];
            
            isCorrect = correctOptions.length === selectedOptions.length &&
                       correctOptions.every(opt => selectedOptions.includes(opt));
          } else {
            // For text-based questions, simple string comparison (can be enhanced)
            isCorrect = userAnswer.textAnswer?.trim().toLowerCase() === 
                       question.correctAnswer?.trim().toLowerCase();
          }
          
          if (isCorrect) {
            correctAnswers++;
            earnedPoints += question.points;
          } else {
            incorrectAnswers++;
          }
        }
        
        detailedResults.push({
          questionId: question.id,
          question,
          userAnswer: userAnswer || { status: 'not_answered' },
          isCorrect,
          points: isCorrect ? question.points : 0,
          maxPoints: question.points,
          timeSpent: userAnswer?.timeSpent || 0,
          difficulty: question.difficulty,
          category: question.category
        });
      });
      
      const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const passingScore = exam.configuration.passingScore || 70;
      const resultStatus = percentage >= passingScore ? 'passed' : 'failed';
      
      return {
        score: earnedPoints,
        percentage,
        totalQuestions: questions.length,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions,
        resultStatus,
        detailedResults
      };
      
    } catch (error) {
      console.error('Error calculating result:', error);
      throw new Error('خطا در محاسبه نتیجه آزمون');
    }
  }

  toJSON() {
    return {
      id: this.id,
      examId: this.examId,
      participantId: this.participantId,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      timeRemaining: this.timeRemaining,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      score: this.score,
      percentage: this.percentage,
      resultStatus: this.resultStatus,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Register the classes
Parse.Object.registerSubclass('TestExam', TestExam);
Parse.Object.registerSubclass('ExamSession', ExamSession);

module.exports = { TestExam, ExamSession }; 