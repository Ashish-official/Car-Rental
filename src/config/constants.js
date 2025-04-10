require('dotenv').config();

module.exports = {
  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '24h',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 1000, // 1000 requests per minute

  // Car Validation
  MIN_CAR_YEAR: 1900,
  MAX_CAR_YEAR: new Date().getFullYear() + 2,
  MIN_CAR_SEATS: 1,
  MAX_CAR_SEATS: 10,
  MIN_CAR_PRICE: 0,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  UPLOAD_DIR: 'uploads',
  MAX_FILES: 5,
  ALLOWED_FILE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],

  // Error Messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error'
  },

  // Car Types
  CAR_TYPES: ['Sedan', 'SUV', 'Hatchback', 'Luxury'],
  TRANSMISSION_TYPES: ['Automatic', 'Manual'],
  FUEL_TYPES: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],

  // Car Status
  CAR_STATUS: ['available', 'rented', 'maintenance', 'inactive']
}; 