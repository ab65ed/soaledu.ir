const Parse = require('parse/node');
import { CourseExamOptions } from '../types/interfaces';
const CourseExam = require('../models/CourseExam');

class CourseExamController {
  /**
   * Create a new course exam
   */
  static async createCourseExam(req, res) {
    try {
      const {
        title,
        courseType,
        grade,
        group,
        description,
        tags = [],
        difficulty,
        estimatedTime,
        price = 0,
        isPublished = false
      } = req.body;

      // Validation
      if (!title || !courseType || !grade || !group || !description) {
        return res.status(400).json({
          error: 'Required fields missing: title, courseType, grade, group, description'
        });
      }

      // Get current user
      const userId = req.user ? req.user.id : null;

      const courseExamData = {
        title,
        courseType,
        grade,
        group,
        description,
        tags,
        difficulty,
        estimatedTime,
        price,
        isPublished,
        isDraft: !isPublished,
        authorId: userId,
        author: req.user
      };

      const courseExam = await CourseExam.create(courseExamData);

      res.status(201).json({
        success: true,
        data: courseExam.toJSON(),
        message: 'Course exam created successfully'
      });
    } catch (error) {
      console.error('Error creating course exam:', error);
      res.status(500).json({
        error: 'Failed to create course exam',
        details: error.message
      });
    }
  }

  /**
   * Get course exam by ID
   */
  static async getCourseExam(req, res) {
    try {
      const { id } = req.params;

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      res.json({
        success: true,
        data: courseExam.toJSON()
      });
    } catch (error) {
      console.error('Error fetching course exam:', error);
      res.status(500).json({
        error: 'Failed to fetch course exam',
        details: error.message
      });
    }
  }

  /**
   * Update course exam
   */
  static async updateCourseExam(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      // Check if user has permission to update
      if (req.user && courseExam.authorId !== req.user.id) {
        return res.status(403).json({
          error: 'Unauthorized to update this course exam'
        });
      }

      // Update fields
      Object.keys(updates).forEach(key => {
        if (courseExam.hasOwnProperty(key)) {
          courseExam[key] = updates[key];
        }
      });

      // Update metadata
      const currentMetadata = courseExam.metadata || {};
      courseExam.metadata = {
        ...currentMetadata,
        version: (currentMetadata.version || 0) + 1
      };

      await courseExam.save();

      res.json({
        success: true,
        data: courseExam.toJSON(),
        message: 'Course exam updated successfully'
      });
    } catch (error) {
      console.error('Error updating course exam:', error);
      res.status(500).json({
        error: 'Failed to update course exam',
        details: error.message
      });
    }
  }

  /**
   * Delete course exam
   */
  static async deleteCourseExam(req, res) {
    try {
      const { id } = req.params;

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      // Check if user has permission to delete
      if (req.user && courseExam.authorId !== req.user.id) {
        return res.status(403).json({
          error: 'Unauthorized to delete this course exam'
        });
      }

      await courseExam.destroy();

      res.json({
        success: true,
        message: 'Course exam deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting course exam:', error);
      res.status(500).json({
        error: 'Failed to delete course exam',
        details: error.message
      });
    }
  }

  /**
   * List course exams with filtering and pagination
   */
  static async listCourseExams(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        courseType,
        grade,
        group,
        difficulty,
        tags,
        priceMin,
        priceMax,
        search,
        sortBy = 'newest',
        publishedOnly = false,
        authorId
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const options: CourseExamOptions = {
        limit: parseInt(limit),
        skip,
        sortBy
      };

      // Add filters
      if (courseType) options.courseType = courseType;
      if (grade) options.grade = grade;
      if (group) options.group = group;
      if (difficulty) options.difficulty = difficulty;
      if (tags) {
        options.tags = Array.isArray(tags) ? tags : [tags];
      }
      if (priceMin || priceMax) {
        options.priceRange = {};
        if (priceMin) options.priceRange.min = parseInt(priceMin);
        if (priceMax) options.priceRange.max = parseInt(priceMax);
      }
      if (search) options.search = search;

      let courseExams;

      if (authorId) {
        // Get exams by specific author
        courseExams = await CourseExam.findByAuthor(authorId, options);
      } else if (publishedOnly === 'true') {
        // Get only published exams
        courseExams = await CourseExam.findPublished(options);
      } else {
        // Get all exams (for admin or authorized users)
        courseExams = await CourseExam.findPublished(options);
      }

      // Get total count for pagination
      const countQuery = new Parse.Query(CourseExam);
      if (publishedOnly === 'true') {
        countQuery.equalTo('isPublished', true);
      }
      if (authorId) {
        countQuery.equalTo('authorId', authorId);
      }

      const total = await countQuery.count();
      const totalPages = Math.ceil(total / parseInt(limit));

      res.json({
        success: true,
        data: courseExams.map(exam => exam.toJSON()),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      });
    } catch (error) {
      console.error('Error listing course exams:', error);
      res.status(500).json({
        error: 'Failed to list course exams',
        details: error.message
      });
    }
  }

  /**
   * Search course exams by text
   */
  static async searchCourseExams(req, res) {
    try {
      const { q, limit = 10, publishedOnly = true } = req.query;

      if (!q) {
        return res.status(400).json({
          error: 'Search query is required'
        });
      }

      const options = {
        limit: parseInt(limit),
        publishedOnly: publishedOnly === 'true'
      };

      const courseExams = await CourseExam.searchByText(q, options);

      res.json({
        success: true,
        data: courseExams.map(exam => exam.toJSON()),
        query: q,
        resultCount: courseExams.length
      });
    } catch (error) {
      console.error('Error searching course exams:', error);
      res.status(500).json({
        error: 'Failed to search course exams',
        details: error.message
      });
    }
  }

  /**
   * Publish course exam
   */
  static async publishCourseExam(req, res) {
    try {
      const { id } = req.params;

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      // Check if user has permission
      if (req.user && courseExam.authorId !== req.user.id) {
        return res.status(403).json({
          error: 'Unauthorized to publish this course exam'
        });
      }

      await courseExam.publish();

      res.json({
        success: true,
        data: courseExam.toJSON(),
        message: 'Course exam published successfully'
      });
    } catch (error) {
      console.error('Error publishing course exam:', error);
      res.status(500).json({
        error: 'Failed to publish course exam',
        details: error.message
      });
    }
  }

  /**
   * Unpublish course exam
   */
  static async unpublishCourseExam(req, res) {
    try {
      const { id } = req.params;

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      // Check if user has permission
      if (req.user && courseExam.authorId !== req.user.id) {
        return res.status(403).json({
          error: 'Unauthorized to unpublish this course exam'
        });
      }

      await courseExam.unpublish();

      res.json({
        success: true,
        data: courseExam.toJSON(),
        message: 'Course exam unpublished successfully'
      });
    } catch (error) {
      console.error('Error unpublishing course exam:', error);
      res.status(500).json({
        error: 'Failed to unpublish course exam',
        details: error.message
      });
    }
  }

  /**
   * Auto-save course exam (for draft functionality)
   */
  static async autoSaveCourseExam(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      // Check if user has permission
      if (req.user && courseExam.authorId !== req.user.id) {
        return res.status(403).json({
          error: 'Unauthorized to update this course exam'
        });
      }

      await courseExam.autoSave(updates);

      res.json({
        success: true,
        data: courseExam.toJSON(),
        message: 'Course exam auto-saved successfully'
      });
    } catch (error) {
      console.error('Error auto-saving course exam:', error);
      res.status(500).json({
        error: 'Failed to auto-save course exam',
        details: error.message
      });
    }
  }

  /**
   * Get course exam statistics
   */
  static async getCourseExamStats(req, res) {
    try {
      const { authorId } = req.query;

      // If authorId is provided, get stats for specific author
      // Otherwise, get global stats (admin only)
      const stats = await CourseExam.getStats(authorId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting course exam stats:', error);
      res.status(500).json({
        error: 'Failed to get course exam statistics',
        details: error.message
      });
    }
  }

  /**
   * Record a sale for course exam
   */
  static async recordSale(req, res) {
    try {
      const { id } = req.params;
      const { amount = 1, price } = req.body;

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      await courseExam.incrementSales(amount, price || courseExam.price);

      res.json({
        success: true,
        data: courseExam.toJSON(),
        message: 'Sale recorded successfully'
      });
    } catch (error) {
      console.error('Error recording sale:', error);
      res.status(500).json({
        error: 'Failed to record sale',
        details: error.message
      });
    }
  }

  /**
   * Add rating to course exam
   */
  static async addRating(req, res) {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          error: 'Rating must be between 1 and 5'
        });
      }

      const courseExam = await CourseExam.findById(id);

      if (!courseExam) {
        return res.status(404).json({
          error: 'Course exam not found'
        });
      }

      await courseExam.updateRating(rating);

      res.json({
        success: true,
        data: courseExam.toJSON(),
        message: 'Rating added successfully'
      });
    } catch (error) {
      console.error('Error adding rating:', error);
      res.status(500).json({
        error: 'Failed to add rating',
        details: error.message
      });
    }
  }

  /**
   * Get available tags
   */
  static async getAvailableTags(req, res) {
    try {
      const query = new Parse.Query(CourseExam);
      query.equalTo('isPublished', true);
      query.select('tags');

      const courseExams = await query.find();
      
      // Extract all tags and get unique ones
      const allTags = courseExams.reduce((tags, exam) => {
        return tags.concat(exam.get('tags') || []);
      }, []);

      const uniqueTags = [...new Set(allTags)].sort();

      res.json({
        success: true,
        data: uniqueTags
      });
    } catch (error) {
      console.error('Error getting available tags:', error);
      res.status(500).json({
        error: 'Failed to get available tags',
        details: error.message
      });
    }
  }
}

module.exports = CourseExamController; 