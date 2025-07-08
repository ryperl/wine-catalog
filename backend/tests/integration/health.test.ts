import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../../src/server';

describe('Health Check Integration', () => {
  let app: Express;

  beforeAll(async () => {
    app = createServer();
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('healthy');
    });

    it('should include version information', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.version).toBeDefined();
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Welcome');
    });
  });
});
