// MongoDB initialization script
// This script runs when the container starts for the first time

print('Starting initialization of wine_catalog database...');

// Switch to the wine_catalog database
db = db.getSiblingDB('wine_catalog');

// Create a basic user for the application (optional, since we're using admin auth)
db.createUser({
  user: 'wine_app_user',
  pwd: process.env.WINE_APP_PASSWORD || 'wine_app_secure_password_change_me',
  roles: [
    {
      role: 'readWrite',
      db: 'wine_catalog'
    }
  ]
});

// Create indexes for better performance
print('Creating indexes...');

// User collection indexes
db.users.createIndex({ "email": 1 }, { unique: true });

// Wine collection indexes
db.wines.createIndex({ "userId": 1, "createdAt": -1 });
db.wines.createIndex({ "userId": 1, "style": 1 });
db.wines.createIndex({ "userId": 1, "region.country": 1 });
db.wines.createIndex({ "userId": 1, "vintage": 1 });
db.wines.createIndex({ "userId": 1, "producer": 1 });
db.wines.createIndex({ 
  "userId": 1, 
  "name": "text", 
  "producer": "text",
  "grapes": "text"
}, {
  weights: {
    "name": 10,
    "producer": 5,
    "grapes": 1
  },
  name: "wine_text_search"
});

print('Wine Catalog database initialization completed!');
