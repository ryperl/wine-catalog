import 'jest-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var mongoServer: MongoMemoryServer;
}

// Setup runs before each test file
beforeAll(async () => {
  // Create in-memory MongoDB instance for testing
  global.mongoServer = await MongoMemoryServer.create();
  const mongoUri = global.mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

// Cleanup after each test
afterEach(async () => {
  // Clean up all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Stop the in-memory MongoDB instance
  if (global.mongoServer) {
    await global.mongoServer.stop();
  }
});
