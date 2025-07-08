<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Wine Catalog Application - Copilot Instructions

This is a full-stack wine catalog application with the following architecture:

## Technology Stack

### Backend (Node.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt for password hashing
- **API**: RESTful API with proper error handling and validation

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom wine-themed color palette
- **State Management**: Zustand for auth state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with validation
- **Routing**: React Router DOM

### Development Environment
- **Database**: Local MongoDB via Docker Compose
- **Development**: Concurrent frontend and backend development
- **Package Management**: npm workspaces

## Project Structure

```
wine-catalog/
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks for API
│   │   ├── store/        # Zustand stores
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Utility functions
└── docker-compose.yml    # Local MongoDB setup
```

## Key Features

1. **User Authentication**: Registration, login, JWT-based auth
2. **Wine Management**: CRUD operations for wine collection
3. **Advanced Search**: Filter by style, region, vintage, ratings
4. **Collection Analytics**: Statistics and insights
5. **Responsive Design**: Works on desktop, tablet, and mobile

## Development Guidelines

### Code Style
- Use TypeScript strictly - avoid `any` types
- Follow React best practices with functional components and hooks
- Use Tailwind CSS utility classes with semantic component classes
- Implement proper error handling and loading states

### API Design
- RESTful endpoints with consistent response format
- Proper HTTP status codes
- User-specific data isolation (wines belong to users)
- Input validation and sanitization

### Database Schema
- Users: email, password (hashed), firstName, lastName
- Wines: comprehensive wine data including region, grapes, tasting notes, cellar info
- Indexes for performance on search fields

### Security
- JWT tokens for authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input validation

## Getting Started

1. Start MongoDB: `npm run docker:up`
2. Install dependencies: `npm run install:all`
3. Start development: `npm run dev`

## Common Tasks

- **Add new API endpoint**: Create route, controller, add to routes
- **Add new page**: Create component in pages/, add to App.tsx routes
- **Add new component**: Create in components/, export, import where needed
- **Database changes**: Update models, consider migrations if needed
- **Authentication**: All API routes except auth are protected

## Environment Variables

Backend (.env):
- MONGODB_URI: Database connection string
- JWT_SECRET: Secret for signing tokens
- PORT: Server port (default 3001)

Frontend (.env):
- VITE_API_URL: Backend API URL

Remember to maintain the wine theme throughout the UI and provide excellent user experience for wine collectors!
