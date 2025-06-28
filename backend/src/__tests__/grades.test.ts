/**
 * Grades Validation Tests
 * تست‌های اعتبارسنجی مقاطع تحصیلی
 */

import { 
  CreateCourseExamSchema, 
  UpdateCourseExamSchema, 
  GRADES,
  GRADE_LABELS
} from '../validations/courseExamValidation';

describe('Grades Validation Tests', () => {
  describe('GRADES Constants', () => {
    test('should contain all expected grade options', () => {
      expect(GRADES).toContain('elementary');
      expect(GRADES).toContain('middle-school');
      expect(GRADES).toContain('high-school');
      expect(GRADES).toContain('associate-degree');
      expect(GRADES).toContain('bachelor-degree');
      expect(GRADES).toContain('master-degree');
      expect(GRADES).toContain('doctorate-degree');
    });

    test('should have exactly 7 grades', () => {
      expect(GRADES.length).toBe(7);
    });

    test('should not contain old grade formats', () => {
      expect(GRADES).not.toContain('elementary-1');
      expect(GRADES).not.toContain('middle-school-1');
      expect(GRADES).not.toContain('high-school-10');
      expect(GRADES).not.toContain('university');
      expect(GRADES).not.toContain('konkur');
    });
  });

  describe('GRADE_LABELS Constants', () => {
    test('should have Persian labels for all grades', () => {
      expect(GRADE_LABELS.elementary).toBe('مقطع ابتدایی');
      expect(GRADE_LABELS['middle-school']).toBe('مقطع متوسطه اول');
      expect(GRADE_LABELS['high-school']).toBe('مقطع متوسطه دوم');
      expect(GRADE_LABELS['associate-degree']).toBe('کاردانی');
      expect(GRADE_LABELS['bachelor-degree']).toBe('کارشناسی');
      expect(GRADE_LABELS['master-degree']).toBe('کارشناسی ارشد');
      expect(GRADE_LABELS['doctorate-degree']).toBe('دکتری');
    });

    test('should have labels for all grades', () => {
      GRADES.forEach(grade => {
        expect(GRADE_LABELS[grade]).toBeDefined();
        expect(GRADE_LABELS[grade]).not.toBe('');
      });
    });
  });

  describe('CreateCourseExamSchema with new grades', () => {
    const validBaseData = {
      title: 'آزمون تست جدید',
      courseType: 'academic' as const,
      description: 'این یک آزمون تست است که با مقاطع تحصیلی جدید کار می‌کند.'
    };

    test('should accept valid new grades', () => {
      const testCases = [
        'elementary',
        'middle-school',
        'high-school',
        'associate-degree',
        'bachelor-degree',
        'master-degree',
        'doctorate-degree'
      ];

      testCases.forEach(grade => {
        const validData = {
          ...validBaseData,
          grade: grade as any
        };

        const result = CreateCourseExamSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.grade).toBe(grade);
        }
      });
    });

    test('should reject old grade formats', () => {
      const oldGrades = [
        'elementary-1',
        'elementary-6',
        'middle-school-7',
        'high-school-10',
        'university',
        'konkur'
      ];

      oldGrades.forEach(grade => {
        const invalidData = {
          ...validBaseData,
          grade: grade
        };

        const result = CreateCourseExamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: ['grade'],
                message: 'مقطع تحصیلی معتبر نیست'
              })
            ])
          );
        }
      });
    });

    test('should reject invalid grades', () => {
      const invalidData = {
        ...validBaseData,
        grade: 'invalid-grade'
      };

      const result = CreateCourseExamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['grade'],
              message: 'مقطع تحصیلی معتبر نیست'
            })
          ])
        );
      }
    });
  });

  describe('UpdateCourseExamSchema with new grades', () => {
    test('should accept valid new grades in update', () => {
      const updateData = {
        grade: 'bachelor-degree' as const
      };

      const result = UpdateCourseExamSchema.safeParse(updateData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.grade).toBe('bachelor-degree');
      }
    });

    test('should accept empty update object', () => {
      const updateData = {};

      const result = UpdateCourseExamSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    test('should reject old grade formats in update', () => {
      const invalidUpdateData = {
        grade: 'elementary-1'
      };

      const result = UpdateCourseExamSchema.safeParse(invalidUpdateData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['grade'],
              message: 'مقطع تحصیلی معتبر نیست'
            })
          ])
        );
      }
    });
  });

  describe('Grade Categories', () => {
    test('should categorize school levels correctly', () => {
      const schoolLevels = ['elementary', 'middle-school', 'high-school'];
      schoolLevels.forEach(grade => {
        expect(GRADES).toContain(grade);
      });
    });

    test('should categorize university levels correctly', () => {
      const universityLevels = ['associate-degree', 'bachelor-degree', 'master-degree', 'doctorate-degree'];
      universityLevels.forEach(grade => {
        expect(GRADES).toContain(grade);
      });
    });

    test('should have logical progression', () => {
      const expectedOrder = [
        'elementary',
        'middle-school', 
        'high-school',
        'associate-degree',
        'bachelor-degree',
        'master-degree',
        'doctorate-degree'
      ];

      expectedOrder.forEach((grade, index) => {
        expect(GRADES[index]).toBe(grade);
      });
    });
  });

  describe('Grade Level Validation', () => {
    test('should validate elementary level', () => {
      const elementaryData = {
        title: 'آزمون ابتدایی',
        courseType: 'academic' as const,
        grade: 'elementary' as const,
        description: 'آزمون ریاضی برای دانش‌آموزان ابتدایی'
      };

      const result = CreateCourseExamSchema.safeParse(elementaryData);
      expect(result.success).toBe(true);
    });

    test('should validate university levels', () => {
      const universityLevels = ['associate-degree', 'bachelor-degree', 'master-degree', 'doctorate-degree'];
      
      universityLevels.forEach(level => {
        const universityData = {
          title: `آزمون ${GRADE_LABELS[level as keyof typeof GRADE_LABELS]}`,
          courseType: 'specialized' as const,
          grade: level as any,
          description: `آزمون تخصصی برای مقطع ${GRADE_LABELS[level as keyof typeof GRADE_LABELS]}`
        };

        const result = CreateCourseExamSchema.safeParse(universityData);
        expect(result.success).toBe(true);
      });
    });
  });
}); 