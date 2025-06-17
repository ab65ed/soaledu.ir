import request from 'supertest';
import app from '../server';

describe('Test Exam Controller Tests', () => {
  describe('GET /api/v1/test-exams/', () => {
    it('should get list of test exams successfully', async () => {
      const response = await request(app)
        .get('/api/v1/test-exams/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/v1/test-exams/', () => {
    it('should create test exam successfully', async () => {
      const testExamData = {
        title: 'آزمون تستی نمونه',
        description: 'توضیحات آزمون تستی'
      };

      const response = await request(app)
        .post('/api/v1/test-exams/')
        .send(testExamData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/test-exams/:id', () => {
    it('should get test exam by ID successfully', async () => {
      const response = await request(app)
        .get('/api/v1/test-exams/test-id')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/v1/test-exams/:id/start', () => {
    it('should start test exam successfully', async () => {
      const response = await request(app)
        .post('/api/v1/test-exams/test-id/start')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/v1/test-exams/:id/submit-answer', () => {
    it('should submit answer successfully', async () => {
      const answerData = {
        questionId: 'q1',
        answer: 'A'
      };

      const response = await request(app)
        .post('/api/v1/test-exams/test-id/submit-answer')
        .send(answerData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/v1/test-exams/:id/finish', () => {
    it('should finish test exam successfully', async () => {
      const response = await request(app)
        .post('/api/v1/test-exams/test-id/finish')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/test-exams/:id/results', () => {
    it('should get test exam results successfully', async () => {
      const response = await request(app)
        .get('/api/v1/test-exams/test-id/results')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/test-exams/nonexistent/invalid')
        .expect(404);
    });
  });
}); 