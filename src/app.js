const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes); // Authentication routes
app.use('/api/cars', carRoutes); // Car routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/users', userRoutes); // User routes

module.exports = app;