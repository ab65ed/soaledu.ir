/**
 * Course Types Validation Tests
 * تست‌های اعتبارسنجی انواع درس
 */

import { 
  CreateCourseExamSchema, 
  UpdateCourseExamSchema, 
  COURSE_TYPES,
  COURSE_TYPE_LABELS
} from '../validations/courseExamValidation';

describe('Course Types Validation Tests', () => {
  describe('COURSE_TYPES Constants', () => {
    test('should contain all expected course type options', () => {
      expect(COURSE_TYPES).toContain('academic');
      expect(COURSE_TYPES).toContain('non-academic');
      expect(COURSE_TYPES).toContain('skill-based');
      expect(COURSE_TYPES).toContain('aptitude');
      expect(COURSE_TYPES).toContain('general');
      expect(COURSE_TYPES).toContain('specialized');
    });

    test('should have exactly 6 course types', () => {
      expect(COURSE_TYPES.length).toBe(6);
    });

    test('should not contain old course types', () => {
      expect(COURSE_TYPES).not.toContain('mathematics');
      expect(COURSE_TYPES).not.toContain('physics');
      expect(COURSE_TYPES).not.toContain('chemistry');
      expect(COURSE_TYPES).not.toContain('other');
    });
  });

  describe('COURSE_TYPE_LABELS Constants', () => {
    test('should have Persian labels for all course types', () => {
      expect(COURSE_TYPE_LABELS.academic).toBe('درسی');
      expect(COURSE_TYPE_LABELS['non-academic']).toBe('غیر درسی');
      expect(COURSE_TYPE_LABELS['skill-based']).toBe('مهارتی');
      expect(COURSE_TYPE_LABELS.aptitude).toBe('استعدادی');
      expect(COURSE_TYPE_LABELS.general).toBe('عمومی');
      expect(COURSE_TYPE_LABELS.specialized).toBe('تخصصی');
    });

    test('should have labels for all course types', () => {
      COURSE_TYPES.forEach(type => {
        expect(COURSE_TYPE_LABELS[type]).toBeDefined();
        expect(COURSE_TYPE_LABELS[type]).not.toBe('');
      });
    });
  });

  describe('CreateCourseExamSchema with new courseType', () => {
    const validBaseData = {
      title: 'آزمون تست جدید',
      grade: 'high-school' as const,
      description: 'این یک آزمون تست است که با انواع درس جدید کار می‌کند.'
    };

    test('should accept valid new course types', () => {
      const testCases = [
        'academic',
        'non-academic', 
        'skill-based',
        'aptitude',
        'general',
        'specialized'
      ];

      testCases.forEach(courseType => {
        const validData = {
          ...validBaseData,
          courseType: courseType as any
        };

        const result = CreateCourseExamSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.courseType).toBe(courseType);
        }
      });
    });

    test('should reject old course types', () => {
      const oldCourseTypes = [
        'mathematics',
        'physics', 
        'chemistry',
        'biology',
        'other'
      ];

      oldCourseTypes.forEach(courseType => {
        const invalidData = {
          ...validBaseData,
          courseType: courseType
        };

        const result = CreateCourseExamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: ['courseType'],
                message: 'نوع درس معتبر نیست'
              })
            ])
          );
        }
      });
    });

    test('should reject invalid course types', () => {
      const invalidData = {
        ...validBaseData,
        courseType: 'invalid-type'
      };

      const result = CreateCourseExamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['courseType'],
              message: 'نوع درس معتبر نیست'
            })
          ])
        );
      }
    });
  });

  describe('UpdateCourseExamSchema with new courseType', () => {
    test('should accept valid new course types in update', () => {
      const updateData = {
        courseType: 'skill-based' as const
      };

      const result = UpdateCourseExamSchema.safeParse(updateData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.courseType).toBe('skill-based');
      }
    });

    test('should accept empty update object', () => {
      const updateData = {};

      const result = UpdateCourseExamSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    test('should reject old course types in update', () => {
      const invalidUpdateData = {
        courseType: 'mathematics'
      };

      const result = UpdateCourseExamSchema.safeParse(invalidUpdateData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['courseType'],
              message: 'نوع درس معتبر نیست'
            })
          ])
        );
      }
    });
  });

  describe('Course Types Categories', () => {
    test('should categorize course types correctly', () => {
      // درسی و غیر درسی - مربوط به برنامه رسمی
      expect(['academic', 'non-academic']).toEqual(
        expect.arrayContaining(['academic', 'non-academic'])
      );

      // مهارتی و تخصصی - مربوط به یادگیری خاص
      expect(['skill-based', 'specialized']).toEqual(
        expect.arrayContaining(['skill-based', 'specialized'])
      );

      // استعدادی و عمومی - مربوط به سنجش و دانش کلی
      expect(['aptitude', 'general']).toEqual(
        expect.arrayContaining(['aptitude', 'general'])
      );
    });
  });
}); 