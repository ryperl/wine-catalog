import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'fake-jwt-token-only-for-unit-testing-not-real'; // secret-ignore
  process.env.JWT_EXPIRES_IN = '1h';
  
  console.log('🧪 Setting up test environment...');
}
