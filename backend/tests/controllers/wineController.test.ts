import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../../src/server';
import { 
  createTestUser, 
  createTestWine, 
  createMockWine,
  getAuthHeaders,
  createAuthToken,
  clearDatabase,
  expectAuthenticationError,
  expectNotFoundError
} from '../utils/testHelpers';

describe('Wine Controller', () => {
  let app: Express;

  beforeAll(async () => {
    app = createServer();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/wines', () => {
    it('should return empty array when no wines exist', async () => {
      const user = await createTestUser();
      const token = createAuthToken(user._id.toString(), user.email);

      const response = await request(app)
        .get('/api/wines')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.wines).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
    });

    it('should return user wines when they exist', async () => {
      const user = await createTestUser();
      const token = createAuthToken(user._id.toString(), user.email);
      
      // Create test wines
      await createTestWine(user._id.toString(), { name: 'Test Wine 1' });
      await createTestWine(user._id.toString(), { name: 'Test Wine 2' });

      const response = await request(app)
        .get('/api/wines')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.wines).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/wines');

      expectAuthenticationError(response);
    });
  });

  describe('POST /api/wines', () => {
    it('should create a new wine successfully', async () => {
      const user = await createTestUser();
      const token = createAuthToken(user._id.toString(), user.email);
      const wineData = createMockWine(user._id.toString());

      const response = await request(app)
        .post('/api/wines')
        .set(getAuthHeaders(token))
        .send(wineData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('created successfully');
      expect(response.body.data.wine.name).toBe(wineData.name);
      expect(response.body.data.wine.userId).toBe(user._id.toString());
    });

    it('should require authentication', async () => {
      const wineData = createMockWine('user123');

      const response = await request(app)
        .post('/api/wines')
        .send(wineData);

      expectAuthenticationError(response);
    });
  });

  describe('GET /api/wines/:id', () => {
    it('should return a specific wine', async () => {
      const user = await createTestUser();
      const token = createAuthToken(user._id.toString(), user.email);
      const wine = await createTestWine(user._id.toString(), { name: 'Specific Wine' });

      const response = await request(app)
        .get(`/api/wines/${wine._id}`)
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.wine.name).toBe('Specific Wine');
    });

    it('should return 404 for non-existent wine', async () => {
      const user = await createTestUser();
      const token = createAuthToken(user._id.toString(), user.email);
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/wines/${fakeId}`)
        .set(getAuthHeaders(token));

      expectNotFoundError(response);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/wines/507f1f77bcf86cd799439011');

      expectAuthenticationError(response);
    });
  });

  describe('PUT /api/wines/:id', () => {
    it('should update a wine successfully', async () => {
      const user = await createTestUser();
      const token = createAuthToken(user._id.toString(), user.email);
      const wine = await createTestWine(user._id.toString(), { name: 'Original Name' });

      const updateData = { name: 'Updated Wine Name' };

      const response = await request(app)
        .put(`/api/wines/${wine._id}`)
        .set(getAuthHeaders(token))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('updated successfully');
      expect(response.body.data.wine.name).toBe('Updated Wine Name');
    });

    it('should require authentication', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put('/api/wines/507f1f77bcf86cd799439011')
        .send(updateData);

      expectAuthenticationError(response);
    });
  });

  describe('DELETE /api/wines/:id', () => {
    it('should delete a wine successfully', async () => {
      const user = await createTestUser();
      const token = createAuthToken(user._id.toString(), user.email);
      const wine = await createTestWine(user._id.toString());

      const response = await request(app)
        .delete(`/api/wines/${wine._id}`)
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/wines/507f1f77bcf86cd799439011');

      expectAuthenticationError(response);
    });
  });
});
