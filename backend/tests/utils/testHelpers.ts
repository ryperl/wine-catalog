import { faker } from '@faker-js/faker';
import { IUser, IWine } from '../../src/types';
import { User, Wine } from '../../src/models';
import { generateToken } from '../../src/utils/jwt';

// Test data factories using Faker
export const createMockUser = (overrides: Partial<IUser> = {}): Partial<IUser> => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 8 }), // secret-ignore
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  ...overrides,
});

export const createMockWine = (userId: string, overrides: Partial<IWine> = {}): Partial<IWine> => ({
  userId,
  name: faker.commerce.productName(),
  producer: faker.company.name(),
  vintage: faker.date.between({ from: '1990-01-01', to: '2023-12-31' }).getFullYear(),
  region: {
    country: faker.location.country(),
    area: faker.location.state(),
    subregion: faker.location.city(),
  },
  grapes: [faker.lorem.word(), faker.lorem.word()],
  style: faker.helpers.arrayElement(['red', 'white', 'rosé', 'sparkling', 'dessert']),
  alcohol: faker.number.float({ min: 8, max: 16, fractionDigits: 1 }),
  tastingNotes: {
    aroma: [faker.lorem.word(), faker.lorem.word()],
    taste: [faker.lorem.word(), faker.lorem.word()],
    finish: faker.lorem.sentence(),
  },
  ratings: {
    personal: faker.number.int({ min: 70, max: 100 }),
  },
  cellar: {
    quantity: faker.number.int({ min: 1, max: 6 }),
    location: {
      room: faker.helpers.arrayElement(['Main Cellar', 'Climate Room', 'Basement']),
      rack: faker.helpers.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1']),
      shelf: faker.number.int({ min: 1, max: 5 }).toString(),
      position: faker.number.int({ min: 1, max: 20 }).toString(),
    },
    purchasePrice: faker.number.float({ min: 20, max: 500, fractionDigits: 2 }),
    purchaseDate: faker.date.past(),
    drinkBy: faker.date.future(),
  },
  ...overrides,
});

// Database test helpers
export const createTestUser = async (userData: Partial<IUser> = {}): Promise<IUser> => {
  const mockUser = createMockUser(userData);
  const user = new User(mockUser);
  return await user.save();
};

export const createTestWine = async (userId: string, wineData: Partial<IWine> = {}): Promise<IWine> => {
  const mockWine = createMockWine(userId, wineData);
  const wine = new Wine(mockWine);
  return await wine.save();
};

// Authentication helpers
export const createAuthToken = (userId: string, email: string): string => {
  return generateToken({ userId, email });
};

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// Test cleanup helpers
export const clearDatabase = async () => {
  await User.deleteMany({});
  await Wine.deleteMany({});
};

// Assertion helpers
export const expectValidationError = (response: any, field: string) => {
  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toMatch(/validation/i);
};

export const expectAuthenticationError = (response: any) => {
  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toMatch(/invalid|missing|unauthorized|expired/i);
};

export const expectNotFoundError = (response: any) => {
  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toMatch(/not found/i);
};
