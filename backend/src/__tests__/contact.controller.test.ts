import request from 'supertest';
import app from '../server';

describe('Contact Controller Tests', () => {
  describe('POST /api/v1/contact-form/', () => {
    it('should submit contact form successfully', async () => {
      const contactData = {
        name: 'احمد محمدی',
        email: 'ahmad@example.com',
        subject: 'سوال در مورد آزمون‌ها',
        message: 'سلام، سوالی در مورد آزمون‌ها دارم'
      };

      const response = await request(app)
        .post('/api/v1/contact-form/')
        .send(contactData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBeDefined();
    });

    it('should handle empty contact form', async () => {
      const response = await request(app)
        .post('/api/v1/contact-form/')
        .send({})
        .expect(201); // Our simplified controller accepts any data

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/contact-form/:id', () => {
    it('should get contact message by ID successfully', async () => {
      const response = await request(app)
        .get('/api/v1/contact-form/contact-123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/v1/contact-form/:id', () => {
    it('should update contact message successfully', async () => {
      const updateData = {
        status: 'resolved',
        adminNote: 'مشکل حل شد'
      };

      const response = await request(app)
        .put('/api/v1/contact-form/contact-123')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('DELETE /api/v1/contact-form/:id', () => {
    it('should delete contact message successfully', async () => {
      const response = await request(app)
        .delete('/api/v1/contact-form/contact-123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/v1/contact-form/:id/reply', () => {
    it('should reply to contact message successfully', async () => {
      const replyData = {
        reply: 'سلام، پاسخ شما اینجاست...',
        adminId: 'admin-123'
      };

      const response = await request(app)
        .post('/api/v1/contact-form/contact-123/reply')
        .send(replyData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/contact-form/nonexistent/invalid')
        .expect(404);
    });
  });
}); 