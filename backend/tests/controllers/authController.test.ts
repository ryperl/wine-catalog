import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../../src/server';
import { 
  createTestUser, 
  createMockUser, 
  clearDatabase,
  expectValidationError,
  expectAuthenticationError
} from '../utils/testHelpers';

describe('Auth Controller', () => {
  let app: Express;

  beforeAll(async () => {
    app = createServer();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = createMockUser({
        email: `test-register-${Date.now()}@example.com`
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('registered successfully');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email?.toLowerCase());
      expect(response.body.data.user.password).toBeUndefined(); // Should not return password
    });

    it('should not register user with invalid email', async () => {
      const userData = createMockUser({ email: 'invalid-email' });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expectValidationError(response, 'email');
    });

    it('should not register user with short password', async () => {
      const userData = createMockUser({ 
        email: `test-short-pwd-${Date.now()}@example.com`,
        password: '123' 
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expectValidationError(response, 'password');
    });

    it('should not register user with existing email', async () => {
      const userData = createMockUser({
        email: `test-duplicate-${Date.now()}@example.com`
      });
      
      // Create user first
      await createTestUser(userData);

      // Try to register again with exact same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: userData.email,
          password: 'test-password-different',
          firstName: 'Different',
          lastName: 'User'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should require all required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expectValidationError(response, 'validation');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const userData = createMockUser({
        email: `test-login-${Date.now()}@example.com`,
        password: 'test-password-123'
      });
      const savedUser = await createTestUser(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Login successful');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email?.toLowerCase());
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'test-password-invalid',
        });

      expectAuthenticationError(response);
    });

    it('should not login with invalid password', async () => {
      const userData = createMockUser({
        email: `test-invalid-pwd-${Date.now()}@example.com`
      });
      await createTestUser(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'test-wrong-password',
        });

      expectAuthenticationError(response);
    });

    it('should require email and password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expectValidationError(response, 'validation');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const userData = createMockUser({
        email: `test-profile-${Date.now()}@example.com`,
        password: 'test-password-profile'
      });
      const user = await createTestUser(userData);

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      const token = loginResponse.body.data.token;

      // Get profile
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email?.toLowerCase());
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not return profile without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expectAuthenticationError(response);
    });

    it('should not return profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expectAuthenticationError(response);
    });
  });
});
