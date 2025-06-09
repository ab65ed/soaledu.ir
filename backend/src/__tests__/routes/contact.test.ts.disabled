/**
 * Contact Routes Tests
 * تست‌های مسیرهای مدیریت تماس
 */

import request from 'supertest';
import express from 'express';
import contactRoutes from '../../routes/contact';

const app = express();
app.use(express.json());
app.use('/api/v1/contact', contactRoutes);

describe('Contact Routes', () => {
  describe('GET /api/v1/contact', () => {
    it('should return contacts list with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/contact')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('contacts');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.contacts)).toBe(true);
    });

    it('should filter contacts by status', async () => {
      const response = await request(app)
        .get('/api/v1/contact?status=pending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contacts).toBeDefined();
    });

    it('should search contacts by name', async () => {
      const response = await request(app)
        .get('/api/v1/contact?search=احمد')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/contact', () => {
    it('should create new contact with valid data', async () => {
      const contactData = {
        name: 'احمد محمدی',
        email: 'ahmad@example.com',
        phone: '09123456789',
        subject: 'سوال درباره دوره',
        message: 'سلام، سوالی درباره دوره ریاضی دارم',
        type: 'inquiry'
      };

      const response = await request(app)
        .post('/api/v1/contact')
        .send(contactData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(contactData.name);
      expect(response.body.data.email).toBe(contactData.email);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        name: 'احمد محمدی'
        // missing email, subject, message
      };

      const response = await request(app)
        .post('/api/v1/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('فیلدهای الزامی');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidData = {
        name: 'احمد محمدی',
        email: 'invalid-email',
        subject: 'تست',
        message: 'پیام تست'
      };

      const response = await request(app)
        .post('/api/v1/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/contact/:id', () => {
    it('should return contact by id', async () => {
      // First create a contact
      const contactData = {
        name: 'علی احمدی',
        email: 'ali@example.com',
        subject: 'تست',
        message: 'پیام تست'
      };

      const createResponse = await request(app)
        .post('/api/v1/contact')
        .send(contactData);

      const contactId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/v1/contact/${contactId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(contactId);
      expect(response.body.data.name).toBe(contactData.name);
    });

    it('should return 404 for non-existent contact', async () => {
      const response = await request(app)
        .get('/api/v1/contact/nonexistent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('یافت نشد');
    });
  });

  describe('PUT /api/v1/contact/:id', () => {
    it('should update contact successfully', async () => {
      // First create a contact
      const contactData = {
        name: 'محمد رضایی',
        email: 'mohammad@example.com',
        subject: 'سوال اولیه',
        message: 'پیام اولیه'
      };

      const createResponse = await request(app)
        .post('/api/v1/contact')
        .send(contactData);

      const contactId = createResponse.body.data.id;

      const updateData = {
        status: 'resolved',
        response: 'پاسخ داده شد'
      };

      const response = await request(app)
        .put(`/api/v1/contact/${contactId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('resolved');
      expect(response.body.data.response).toBe('پاسخ داده شد');
    });

    it('should return 404 for non-existent contact', async () => {
      const updateData = {
        status: 'resolved'
      };

      const response = await request(app)
        .put('/api/v1/contact/nonexistent-id')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/contact/:id', () => {
    it('should delete contact successfully', async () => {
      // First create a contact
      const contactData = {
        name: 'حسن موسوی',
        email: 'hassan@example.com',
        subject: 'تست حذف',
        message: 'این پیام برای تست حذف است'
      };

      const createResponse = await request(app)
        .post('/api/v1/contact')
        .send(contactData);

      const contactId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/v1/contact/${contactId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('حذف شد');

      // Verify contact is deleted
      await request(app)
        .get(`/api/v1/contact/${contactId}`)
        .expect(404);
    });

    it('should return 404 for non-existent contact', async () => {
      const response = await request(app)
        .delete('/api/v1/contact/nonexistent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/contact/search', () => {
    it('should search contacts with advanced filters', async () => {
      const response = await request(app)
        .get('/api/v1/contact/search?q=احمد&type=inquiry&status=pending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('results');
      expect(Array.isArray(response.body.data.results)).toBe(true);
    });

    it('should return empty results for no matches', async () => {
      const response = await request(app)
        .get('/api/v1/contact/search?q=nonexistentquery12345')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toHaveLength(0);
    });
  });
}); 