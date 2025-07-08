# Wine Catalog Application

A full-stack wine catalog application built with React TypeScript frontend and Node.js Express backend with MongoDB.

## 🎯 Current Status

✅ **Backend API** - Fully implemented and running  
✅ **MongoDB Database** - Running via Docker Compose  
✅ **Docker Setup** - Complete with Mongo Express UI  
⏳ **Frontend** - Ready for development  

## 🚀 Quick Start

### 1. Start Database Services
```bash
npm run docker:up
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Start Backend API
```bash
npm run dev:backend
```

### 4. Verify Setup
- **API Health Check**: http://localhost:3001/api/health
- **MongoDB Admin UI**: http://localhost:8081 (see .env.example for credentials)
- **API Documentation**: See backend/README.md

## 🏗️ Architecture

### Backend (✅ Complete)
- **Node.js + Express + TypeScript**
- **MongoDB with Mongoose ODM**
- **JWT Authentication with bcrypt**
- **RESTful API with validation**
- **Comprehensive error handling**
- **Security middleware (CORS, Helmet, Rate limiting)**

### Frontend (⏳ To be implemented)
- **React 18 with TypeScript**
- **Vite for development**
- **Tailwind CSS styling**
- **Zustand for state management**
- **TanStack Query for data fetching**
- **React Hook Form for forms**

### Database (✅ Running)
- **MongoDB via Docker**
- **Optimized indexes for performance**
- **Mongo Express for database management**

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
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

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run docker:up` | Start MongoDB services |
| `npm run docker:down` | Stop MongoDB services |
| `npm run docker:logs` | View container logs |
| `npm run dev:backend` | Start backend development server |
| `npm run dev:frontend` | Start frontend development server (when ready) |
| `npm run dev` | Start both frontend and backend |
| `npm run build` | Build for production |

## 🗂️ Project Structure

```
wine-catalog/
├── backend/                 # ✅ Node.js API Server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/                # ⏳ React Application (to be created)
├── mongodb-init/            # ✅ Database initialization
├── docker-compose.yml       # ✅ Docker services
├── package.json             # ✅ Workspace configuration
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)

**⚠️ Security Note**: Copy `.env.example` and customize with your values. Never commit actual secrets!

```bash
# Copy the example file
cp backend/.env.example backend/.env
```

Example configuration (update with your actual values):
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://admin:YOUR_MONGODB_PASSWORD@localhost:27017/wine_catalog?authSource=admin
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_MINIMUM_32_CHARACTERS
JWT_EXPIRES_IN=7d
```

## 🎨 Features Implemented

### Backend Features ✅
- **User Authentication**: JWT-based with secure password hashing
- **Wine Management**: Full CRUD operations
- **Advanced Search**: Filter by style, region, vintage, producer
- **Security**: Rate limiting, CORS, input validation
- **Database**: Optimized MongoDB with proper indexing
- **Error Handling**: Comprehensive error responses
- **API Validation**: Request/response validation
- **Development**: Hot reload with nodemon

### Database Features ✅
- **User Collection**: Secure user management
- **Wine Collection**: Comprehensive wine data model
- **Indexing**: Performance-optimized queries
- **Text Search**: Full-text search across wines
- **Relationships**: User-specific data isolation

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Configuration** for cross-origin requests
- **Input Validation** using express-validator
- **Security Headers** via Helmet middleware
- **Error Sanitization** to prevent data leaks

## 📖 Data Models

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
  userId: string (required)
  name: string (required)
  producer: string (required)
  vintage: number (1800-current year)
  region: {
    country: string
    area: string
    subregion?: string
  }
  grapes: string[] (min 1)
  style: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert'
  alcohol: number (0-50%)
  tastingNotes: {
    appearance?: string
    aroma: string[] (min 1)
    taste: string[] (min 1)
    finish?: string
  }
  ratings: {
    personal?: number (1-100)
    critic?: { score: number, reviewer: string }
  }
  cellar: {
    quantity: number (required)
    location?: string
    purchasePrice?: number
    purchaseDate: Date
    drinkBy?: Date
  }
  createdAt: Date
  updatedAt: Date
}
```

## 🧪 Testing the API

### Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "your-password",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "your-password"
  }'
```

### Add a Wine (requires JWT token)
```bash
curl -X POST http://localhost:3001/api/wines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Château Margaux",
    "producer": "Château Margaux",
    "vintage": 2015,
    "region": {
      "country": "France",
      "area": "Bordeaux"
    },
    "grapes": ["Cabernet Sauvignon", "Merlot"],
    "style": "red",
    "alcohol": 13.5,
    "tastingNotes": {
      "aroma": ["dark fruit", "vanilla"],
      "taste": ["full-bodied", "elegant tannins"]
    },
    "cellar": {
      "quantity": 1,
      "purchasePrice": 500,
      "purchaseDate": "2023-01-15"
    }
  }'
```

## 🚀 Next Steps

1. **Create Frontend Application**
   - Set up React + TypeScript + Vite
   - Implement authentication flow
   - Build wine management interface
   - Add search and filtering capabilities

2. **Enhanced Features**
   - Image upload for wines
   - Wine recommendations
   - Collection analytics
   - Export/import functionality

3. **Production Deployment**
   - Environment-specific configurations
   - Database migration scripts
   - CI/CD pipeline setup
   - Monitoring and logging

## 📚 Additional Resources

- **Backend Documentation**: [backend/README.md](backend/README.md)
- **API Testing**: Use tools like Postman or Insomnia
- **Database Management**: Access Mongo Express at http://localhost:8081
- **MongoDB Docs**: [MongoDB Manual](https://docs.mongodb.com/)
- **Express.js Docs**: [Express.js Guide](https://expressjs.com/)

---

**Built with ❤️ for wine enthusiasts**
