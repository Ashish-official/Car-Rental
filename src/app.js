const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const { logRequest } = require('./middlewares/loggingMiddleware');
const constants = require('./config/constants');

// Import routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(constants.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 3600
};

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
}));

// Serve static files from images directory
app.use('/images', express.static(path.join(__dirname, '../images'), {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
}));

// Routes - Register user routes before other routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(errorHandler);
app.use(notFound);

module.exports = app;