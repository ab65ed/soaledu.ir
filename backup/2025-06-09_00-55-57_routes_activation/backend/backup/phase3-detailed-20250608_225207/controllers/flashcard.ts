/**
 * Flashcard Controller
 * کنترلر فلش‌کارت
 * 
 * مدیریت عملیات CRUD، تولید خودکار، خرید و آمار فلش‌کارت‌ها
 */

import { Request, Response } from 'express';
import Parse from 'parse/node';
import {
  Flashcard,
  FlashcardSet,
  UserFlashcardAccess,
  FlashcardStudySession,
  FlashcardCreateData,
  FlashcardUpdateData,
  FlashcardSetCreateData,
  FlashcardFilters,
  FlashcardGenerationOptions,
  FlashcardDifficulty,
  FlashcardStatus,
  FlashcardFormat,
  AccessType,
  FLASHCARD_DEFAULTS,
  FLASHCARD_VALIDATION,
  calculateFlashcardSetPrice,
  calculateStudyAccuracy
} from '../models/flashcard';

/**
 * Get all flashcards with filters and pagination
 * دریافت تمام فلش‌کارت‌ها با فیلتر و صفحه‌بندی
 */
export const getFlashcards = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: FlashcardFilters = req.query;
    const {
      category,
      subcategory,
      difficulty,
      format,
      status,
      tags,
      search,
      isPublic,
      createdBy,
      priceRange,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const query = new Parse.Query('Flashcard');

    // Apply filters
    if (category) query.equalTo('category', category);
    if (subcategory) query.equalTo('subcategory', subcategory);
    if (difficulty) query.equalTo('difficulty', difficulty);
    if (format) query.equalTo('format', format);
    if (status) query.equalTo('status', status);
    if (isPublic !== undefined) query.equalTo('isPublic', isPublic);
    if (createdBy) query.equalTo('createdBy', createdBy);

    // Tags filter
    if (tags && tags.length > 0) {
      query.containedIn('tags', tags);
    }

    // Price range filter
    if (priceRange) {
      if (priceRange.min !== undefined) query.greaterThanOrEqualTo('price', priceRange.min);
      if (priceRange.max !== undefined) query.lessThanOrEqualTo('price', priceRange.max);
    }

    // Search filter
    if (search) {
      const searchQuery1 = new Parse.Query('Flashcard');
      searchQuery1.contains('question', search);
      
      const searchQuery2 = new Parse.Query('Flashcard');
      searchQuery2.contains('answer', search);
      
      const searchQuery3 = new Parse.Query('Flashcard');
      searchQuery3.contains('explanation', search);

      query._orQuery([searchQuery1, searchQuery2, searchQuery3]);
    }

    // Sorting
    if (sortOrder === 'desc') {
      query.descending(sortBy);
    } else {
      query.ascending(sortBy);
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query.skip(skip);
    query.limit(Number(limit));

    // Include user info
    query.include('createdBy');

    const [flashcards, total] = await Promise.all([
      query.find(),
      query.count()
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: {
        flashcards: flashcards.map(f => f.toJSON()),
        total,
        page: Number(page),
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1
      }
    });

  } catch (error) {
    console.error('Error getting flashcards:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فلش‌کارت‌ها',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a single flashcard by ID
 * دریافت فلش‌کارت خاص با شناسه
 */
export const getFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const query = new Parse.Query('Flashcard');
    query.include('createdBy');
    
    const flashcard = await query.get(id);
    
    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'فلش‌کارت یافت نشد'
      });
      return;
    }

    // Check access for private flashcards
    if (!flashcard.get('isPublic') && flashcard.get('createdBy').id !== userId) {
      // Check if user has purchased access
      const accessQuery = new Parse.Query('UserFlashcardAccess');
      accessQuery.equalTo('userId', userId);
      accessQuery.equalTo('flashcardId', id);
      accessQuery.equalTo('isActive', true);
      
      const access = await accessQuery.first();
      
      if (!access) {
        res.status(403).json({
          success: false,
          message: 'دسترسی به این فلش‌کارت ندارید',
          requiresPurchase: true,
          price: flashcard.get('price')
        });
        return;
      }
    }

    // Increment view count
    flashcard.increment('viewCount');
    await flashcard.save(null, { useMasterKey: true });

    res.json({
      success: true,
      data: flashcard.toJSON()
    });

  } catch (error) {
    console.error('Error getting flashcard:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فلش‌کارت',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create a new flashcard
 * ایجاد فلش‌کارت جدید
 */
export const createFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const data: FlashcardCreateData = req.body;

    // Validation
    if (!data.question || data.question.length < FLASHCARD_VALIDATION.question.minLength) {
      res.status(400).json({
        success: false,
        message: `سوال باید حداقل ${FLASHCARD_VALIDATION.question.minLength} کاراکتر باشد`
      });
      return;
    }

    if (!data.answer || data.answer.length < FLASHCARD_VALIDATION.answer.minLength) {
      res.status(400).json({
        success: false,
        message: 'پاسخ الزامی است'
      });
      return;
    }

    if (!data.category || data.category.length < FLASHCARD_VALIDATION.category.minLength) {
      res.status(400).json({
        success: false,
        message: 'دسته‌بندی الزامی است'
      });
      return;
    }

    const FlashcardClass = Parse.Object.extend('Flashcard');
    const flashcard = new FlashcardClass();

    // Set required fields
    flashcard.set('question', data.question);
    flashcard.set('answer', data.answer);
    flashcard.set('category', data.category);
    flashcard.set('difficulty', data.difficulty || FLASHCARD_DEFAULTS.difficulty);
    flashcard.set('format', data.format || FLASHCARD_DEFAULTS.format);
    flashcard.set('status', FLASHCARD_DEFAULTS.status);
    flashcard.set('createdBy', userId);
    flashcard.set('isPublic', data.isPublic || FLASHCARD_DEFAULTS.isPublic);
    flashcard.set('price', data.price || FLASHCARD_DEFAULTS.price);
    flashcard.set('tags', data.tags || []);

    // Set optional fields
    if (data.explanation) flashcard.set('explanation', data.explanation);
    if (data.subcategory) flashcard.set('subcategory', data.subcategory);
    if (data.notes) flashcard.set('notes', data.notes);
    if (data.imageUrl) flashcard.set('imageUrl', data.imageUrl);
    if (data.audioUrl) flashcard.set('audioUrl', data.audioUrl);
    if (data.sourceQuestionId) flashcard.set('sourceQuestionId', data.sourceQuestionId);
    
    flashcard.set('estimatedStudyTime', data.estimatedStudyTime || FLASHCARD_DEFAULTS.estimatedStudyTime);

    // Initialize counters
    flashcard.set('downloadCount', 0);
    flashcard.set('viewCount', 0);
    flashcard.set('likeCount', 0);
    flashcard.set('studyCount', 0);
    flashcard.set('correctCount', 0);
    flashcard.set('incorrectCount', 0);
    flashcard.set('averageResponseTime', 0);

    const savedFlashcard = await flashcard.save();

    res.status(201).json({
      success: true,
      message: 'فلش‌کارت با موفقیت ایجاد شد',
      data: savedFlashcard.toJSON()
    });

  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد فلش‌کارت',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update a flashcard
 * ویرایش فلش‌کارت
 */
export const updateFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const data: FlashcardUpdateData = req.body;

    const query = new Parse.Query('Flashcard');
    const flashcard = await query.get(id);

    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'فلش‌کارت یافت نشد'
      });
      return;
    }

    // Check ownership
    if (flashcard.get('createdBy') !== userId) {
      res.status(403).json({
        success: false,
        message: 'شما مجاز به ویرایش این فلش‌کارت نیستید'
      });
      return;
    }

    // Update fields
    Object.keys(data).forEach(key => {
      if (data[key as keyof FlashcardUpdateData] !== undefined) {
        flashcard.set(key, data[key as keyof FlashcardUpdateData]);
      }
    });

    flashcard.set('updatedAt', new Date());

    const updatedFlashcard = await flashcard.save();

    res.json({
      success: true,
      message: 'فلش‌کارت با موفقیت به‌روزرسانی شد',
      data: updatedFlashcard.toJSON()
    });

  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی فلش‌کارت',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete a flashcard
 * حذف فلش‌کارت
 */
export const deleteFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const query = new Parse.Query('Flashcard');
    const flashcard = await query.get(id);

    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'فلش‌کارت یافت نشد'
      });
      return;
    }

    // Check ownership
    if (flashcard.get('createdBy') !== userId) {
      res.status(403).json({
        success: false,
        message: 'شما مجاز به حذف این فلش‌کارت نیستید'
      });
      return;
    }

    await flashcard.destroy();

    res.json({
      success: true,
      message: 'فلش‌کارت با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف فلش‌کارت',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Generate flashcards from questions
 * تولید خودکار فلش‌کارت از سوالات
 */
export const generateFromQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const options: FlashcardGenerationOptions = req.body;

    if (!options.sourceQuestionIds || options.sourceQuestionIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'شناسه سوالات الزامی است'
      });
      return;
    }

    // Get questions
    const questionQuery = new Parse.Query('Question');
    questionQuery.containedIn('objectId', options.sourceQuestionIds);
    questionQuery.equalTo('isPublishedForTestExam', true); // Only published questions
    questionQuery.include('courseExam'); // Include course info
    
    const questions = await questionQuery.find();

    if (questions.length === 0) {
      res.status(404).json({
        success: false,
        message: 'سوال منتشر شده‌ای یافت نشد'
      });
      return;
    }

    const flashcards = [];
    const FlashcardClass = Parse.Object.extend('Flashcard');

    for (const question of questions) {
      const flashcard = new FlashcardClass();
      
      // Extract question text and correct answer
      const questionText = question.get('questionText');
      const choices = question.get('choices') || [];
      const correctAnswer = choices.find((choice: any) => choice.isCorrect)?.text || '';
      
      // Get course information if available
      const courseExam = question.get('courseExam');
      let category = 'عمومی';
      let subcategory = '';
      
      if (courseExam) {
        category = courseExam.get('title') || courseExam.get('subject') || 'عمومی';
        subcategory = courseExam.get('grade') || '';
      }

      flashcard.set('question', questionText);
      flashcard.set('answer', correctAnswer);
      flashcard.set('category', options.category || category);
      flashcard.set('subcategory', options.subcategory || subcategory);
      flashcard.set('difficulty', options.difficulty || question.get('difficulty') || FLASHCARD_DEFAULTS.difficulty);
      flashcard.set('format', FLASHCARD_DEFAULTS.format);
      flashcard.set('status', options.autoPublish ? FlashcardStatus.PUBLISHED : FLASHCARD_DEFAULTS.status);
      flashcard.set('createdBy', userId);
      flashcard.set('isPublic', options.autoPublish || false);
      
      // Set price - default 200 tomans or custom price
      const price = options.price || FLASHCARD_DEFAULTS.price || 200;
      flashcard.set('price', price);
      
      // Set tags from question or options
      const questionTags = question.get('tags') || [];
      const optionTags = options.tags || [];
      const combinedTags = [...new Set([...questionTags, ...optionTags])];
      flashcard.set('tags', combinedTags);
      
      flashcard.set('sourceQuestionId', question.id);
      flashcard.set('estimatedStudyTime', FLASHCARD_DEFAULTS.estimatedStudyTime);

      // Add explanation if requested and available
      if (options.includeExplanation && question.get('explanation')) {
        flashcard.set('explanation', question.get('explanation'));
      }

      // Initialize counters
      flashcard.set('downloadCount', 0);
      flashcard.set('viewCount', 0);
      flashcard.set('likeCount', 0);
      flashcard.set('studyCount', 0);
      flashcard.set('correctCount', 0);
      flashcard.set('incorrectCount', 0);
      flashcard.set('averageResponseTime', 0);

      flashcards.push(flashcard);
    }

    // Save all flashcards
    const savedFlashcards = await Parse.Object.saveAll(flashcards);

    res.status(201).json({
      success: true,
      message: `${savedFlashcards.length} فلش‌کارت با موفقیت از سوالات تولید شد`,
      data: {
        flashcards: savedFlashcards.map(f => f.toJSON()),
        totalGenerated: savedFlashcards.length,
        price: options.price || FLASHCARD_DEFAULTS.price || 200,
        isPublic: options.autoPublish || false
      }
    });

  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تولید فلش‌کارت‌ها',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Purchase flashcard access
 * خرید دسترسی به فلش‌کارت
 */
export const purchaseFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { paymentMethod = 'zarinpal' } = req.body;

    // Get flashcard
    const flashcardQuery = new Parse.Query('Flashcard');
    const flashcard = await flashcardQuery.get(id);

    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'فلش‌کارت یافت نشد'
      });
      return;
    }

    // Check if already purchased
    const accessQuery = new Parse.Query('UserFlashcardAccess');
    accessQuery.equalTo('userId', userId);
    accessQuery.equalTo('flashcardId', id);
    accessQuery.equalTo('isActive', true);
    
    const existingAccess = await accessQuery.first();
    
    if (existingAccess) {
      res.status(400).json({
        success: false,
        message: 'شما قبلاً این فلش‌کارت را خریداری کرده‌اید'
      });
      return;
    }

    // Get user info for pricing calculation
    const userQuery = new Parse.Query('User');
    const user = await userQuery.get(userId);
    const userType = user?.get('userType') || 'regular';
    const purchaseHistory = user?.get('purchaseHistory') || [];
    const isFirstPurchase = purchaseHistory.length === 0;

    // Calculate price with discounts
    const basePrice = flashcard.get('price') || 200; // Default price from config
    const discounts = [];
    let finalPrice = basePrice;

    // Apply first-time purchase discount (10%)
    if (isFirstPurchase) {
      const discountAmount = Math.round(basePrice * 0.1);
      discounts.push({
        type: 'first_time',
        amount: discountAmount,
        percentage: 10
      });
      finalPrice -= discountAmount;
    }

    // Apply student discount (15%)
    if (userType === 'student') {
      const discountAmount = Math.round(basePrice * 0.15);
      discounts.push({
        type: 'student',
        amount: discountAmount,
        percentage: 15
      });
      finalPrice -= discountAmount;
    }

    // Ensure minimum price
    finalPrice = Math.max(100, finalPrice);

    // Create payment transaction
    const TransactionClass = Parse.Object.extend('PaymentTransaction');
    const transaction = new TransactionClass();
    
    transaction.set('userId', userId);
    transaction.set('flashcardId', id);
    transaction.set('amount', finalPrice);
    transaction.set('status', 'pending');
    transaction.set('paymentMethod', paymentMethod);
    transaction.set('metadata', {
      flashcardTitle: flashcard.get('question'),
      basePrice,
      discounts,
      finalPrice
    });

    const savedTransaction = await transaction.save();

    // For demo purposes, auto-complete the payment
    // In production, this would be done by payment gateway callback
    transaction.set('status', 'completed');
    transaction.set('completedAt', new Date());
    transaction.set('transactionId', `fc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    await transaction.save();

    // Grant access
    const AccessClass = Parse.Object.extend('UserFlashcardAccess');
    const access = new AccessClass();
    
    access.set('userId', userId);
    access.set('flashcardId', id);
    access.set('accessType', AccessType.PURCHASE);
    access.set('purchaseDate', new Date());
    access.set('price', finalPrice);
    access.set('isActive', true);
    access.set('transactionId', transaction.get('transactionId'));

    await access.save();

    // Update flashcard statistics
    flashcard.increment('downloadCount');
    await flashcard.save(null, { useMasterKey: true });

    // Update user purchase history
    purchaseHistory.push({
      transactionId: transaction.id,
      flashcardId: id,
      amount: finalPrice,
      purchasedAt: new Date()
    });
    user.set('purchaseHistory', purchaseHistory);
    await user.save();

    res.json({
      success: true,
      message: 'خرید با موفقیت انجام شد',
      data: {
        accessId: access.id,
        transactionId: transaction.get('transactionId'),
        price: finalPrice,
        discounts,
        purchaseDate: access.get('purchaseDate')
      }
    });

  } catch (error) {
    console.error('Error purchasing flashcard:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در خرید فلش‌کارت',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get user's purchased flashcards
 * دریافت فلش‌کارت‌های خریداری شده کاربر
 */
export const getUserPurchases = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 12 } = req.query;

    const accessQuery = new Parse.Query('UserFlashcardAccess');
    accessQuery.equalTo('userId', userId);
    accessQuery.equalTo('isActive', true);
    accessQuery.descending('purchaseDate');
    
    const skip = (Number(page) - 1) * Number(limit);
    accessQuery.skip(skip);
    accessQuery.limit(Number(limit));

    const [accesses, total] = await Promise.all([
      accessQuery.find(),
      accessQuery.count()
    ]);

    // Get flashcard details
    const flashcardIds = accesses.map(access => access.get('flashcardId')).filter(Boolean);
    
    let flashcards = [];
    if (flashcardIds.length > 0) {
      const flashcardQuery = new Parse.Query('Flashcard');
      flashcardQuery.containedIn('objectId', flashcardIds);
      flashcardQuery.include('createdBy');
      flashcards = await flashcardQuery.find();
    }

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: {
        purchases: accesses.map(access => ({
          ...access.toJSON(),
          flashcard: flashcards.find(f => f.id === access.get('flashcardId'))?.toJSON()
        })),
        total,
        page: Number(page),
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1
      }
    });

  } catch (error) {
    console.error('Error getting user purchases:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت خریدهای کاربر',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Record study session
 * ثبت جلسه مطالعه
 */
export const recordStudySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { responseTime, isCorrect, difficulty, notes } = req.body;

    // Check access
    const accessQuery = new Parse.Query('UserFlashcardAccess');
    accessQuery.equalTo('userId', userId);
    accessQuery.equalTo('flashcardId', id);
    accessQuery.equalTo('isActive', true);
    
    const access = await accessQuery.first();
    
    if (!access) {
      res.status(403).json({
        success: false,
        message: 'دسترسی به این فلش‌کارت ندارید'
      });
      return;
    }

    // Record study session
    const SessionClass = Parse.Object.extend('FlashcardStudySession');
    const session = new SessionClass();
    
    session.set('userId', userId);
    session.set('flashcardId', id);
    session.set('startTime', new Date());
    session.set('responseTime', responseTime);
    session.set('isCorrect', isCorrect);
    session.set('difficulty', difficulty);
    if (notes) session.set('notes', notes);

    await session.save();

    // Update flashcard statistics
    const flashcardQuery = new Parse.Query('Flashcard');
    const flashcard = await flashcardQuery.get(id);
    
    if (flashcard) {
      flashcard.increment('studyCount');
      if (isCorrect) {
        flashcard.increment('correctCount');
      } else {
        flashcard.increment('incorrectCount');
      }
      
      // Update average response time
      const currentAvg = flashcard.get('averageResponseTime') || 0;
      const studyCount = flashcard.get('studyCount') || 1;
      const newAvg = ((currentAvg * (studyCount - 1)) + responseTime) / studyCount;
      flashcard.set('averageResponseTime', newAvg);
      flashcard.set('lastStudied', new Date());
      
      await flashcard.save(null, { useMasterKey: true });
    }

    res.json({
      success: true,
      message: 'جلسه مطالعه ثبت شد',
      data: session.toJSON()
    });

  } catch (error) {
    console.error('Error recording study session:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت جلسه مطالعه',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get flashcard categories
 * دریافت دسته‌بندی‌های فلش‌کارت
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = new Parse.Query('Flashcard');
    query.equalTo('status', FlashcardStatus.PUBLISHED);
    query.equalTo('isPublic', true);
    
    const flashcards = await query.find();
    
    const categories = new Map();
    
    flashcards.forEach(flashcard => {
      const category = flashcard.get('category');
      const subcategory = flashcard.get('subcategory');
      
      if (!categories.has(category)) {
        categories.set(category, {
          name: category,
          count: 0,
          subcategories: new Map()
        });
      }
      
      const categoryData = categories.get(category);
      categoryData.count++;
      
      if (subcategory) {
        if (!categoryData.subcategories.has(subcategory)) {
          categoryData.subcategories.set(subcategory, {
            name: subcategory,
            count: 0
          });
        }
        categoryData.subcategories.get(subcategory).count++;
      }
    });

    const result = Array.from(categories.values()).map(category => ({
      ...category,
      subcategories: Array.from(category.subcategories.values())
    }));

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دسته‌بندی‌ها',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get user flashcard statistics
 * دریافت آمار فلش‌کارت کاربر
 */
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Get user's study sessions
    const sessionQuery = new Parse.Query('FlashcardStudySession');
    sessionQuery.equalTo('userId', userId);
    sessionQuery.descending('startTime');
    
    const sessions = await sessionQuery.find();

    // Get user's purchased flashcards
    const accessQuery = new Parse.Query('UserFlashcardAccess');
    accessQuery.equalTo('userId', userId);
    accessQuery.equalTo('isActive', true);
    
    const accesses = await accessQuery.find();

    // Calculate statistics
    const totalStudySessions = sessions.length;
    const correctSessions = sessions.filter(s => s.get('isCorrect')).length;
    const averageAccuracy = totalStudySessions > 0 ? Math.round((correctSessions / totalStudySessions) * 100) : 0;
    
    const totalStudyTime = sessions.reduce((sum, session) => sum + (session.get('responseTime') || 0), 0);
    
    // Calculate streak
    let streakDays = 0;
    const today = new Date();
    const studyDates = sessions.map(s => s.get('startTime')).filter(Boolean);
    
    if (studyDates.length > 0) {
      const sortedDates = studyDates.sort((a, b) => b.getTime() - a.getTime());
      let currentDate = new Date(today);
      currentDate.setHours(0, 0, 0, 0);
      
      for (const studyDate of sortedDates) {
        const studyDay = new Date(studyDate);
        studyDay.setHours(0, 0, 0, 0);
        
        if (studyDay.getTime() === currentDate.getTime()) {
          streakDays++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (studyDay.getTime() < currentDate.getTime()) {
          break;
        }
      }
    }

    const lastStudyDate = studyDates.length > 0 ? studyDates[0] : undefined;

    res.json({
      success: true,
      data: {
        totalFlashcards: accesses.length,
        totalStudySessions,
        averageAccuracy,
        totalStudyTime: Math.round(totalStudyTime / 60), // Convert to minutes
        streakDays,
        lastStudyDate
      }
    });

  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار کاربر',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 