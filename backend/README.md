# Wine Catalog Backend API

A robust Node.js REST API for managing wine collections, built with Express.js, TypeScript, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Wine Management**: Complete CRUD operations for wine collection
- **Advanced Search**: Filter and search wines by multiple criteria
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM and optimized indexes
- **TypeScript**: Full type safety and modern ES features
- **Error Handling**: Comprehensive error handling and validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Wines
- `GET /api/wines` - Get user's wines (with filtering/search)
- `POST /api/wines` - Add new wine
- `GET /api/wines/:id` - Get specific wine
- `PUT /api/wines/:id` - Update wine
- `DELETE /api/wines/:id` - Delete wine

### Utility
- `GET /api/health` - Health check endpoint

## Wine Search & Filtering

The wine endpoints support various query parameters for filtering and searching:

- `style` - Filter by wine style (red, white, rosé, sparkling, dessert)
- `country` - Filter by country
- `vintage` - Filter by vintage year
- `producer` - Filter by producer name
- `search` - Text search across name, producer, and grape varieties
- `page` - Page number for pagination (default: 1)
- `limit` - Number of results per page (default: 20)
- `sort` - Sort field (default: -createdAt)

Example: `GET /api/wines?style=red&country=France&vintage=2020&search=Cabernet&page=1&limit=10`

## Data Models

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  firstName: string (required)
  lastName: string (required)
  createdAt: Date
  updatedAt: Date
}
```

### Wine Model
```typescript
{
  userId: string (required, indexed)
  name: string (required)
  producer: string (required)
  vintage: number (required, 1800-current year)
  region: {
    country: string (required)
    area: string (required)
    subregion?: string
  }
  grapes: string[] (required, min 1)
  style: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert' (required)
  alcohol: number (required, 0-50%)
  tastingNotes: {
    appearance?: string
    aroma: string[] (required, min 1)
    taste: string[] (required, min 1)
    finish?: string
  }
  ratings: {
    personal?: number (1-100)
    critic?: {
      score: number (1-100)
      reviewer: string
    }
  }
  cellar: {
    quantity: number (required, min 0)
    location?: string
    purchasePrice?: number
    purchaseDate: Date (required)
    drinkBy?: Date
  }
  createdAt: Date
  updatedAt: Date
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the example file and customize
cp .env.example .env
```

Example configuration (replace with your actual values):
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://admin:YOUR_MONGODB_PASSWORD@localhost:27017/wine_catalog?authSource=admin
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_MINIMUM_32_CHARACTERS
JWT_EXPIRES_IN=7d
```

**⚠️ Security**: Use strong, unique passwords and never commit `.env` files!

## Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for development and production origins
- **Helmet**: Security headers
- **Input Validation**: express-validator for request validation
- **Error Handling**: Comprehensive error responses without exposing sensitive data

## Database Indexes

The application creates several indexes for optimal performance:

- **Users**: email (unique)
- **Wines**: userId + createdAt, userId + style, userId + country, userId + vintage, userId + producer
- **Text Search**: Full-text search across wine name, producer, and grapes

## Error Responses

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Success Responses

All success responses follow a consistent format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {} // Response data
}
```

## Testing

Run tests with:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

## Linting

Check code style:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```
