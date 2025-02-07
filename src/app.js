const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);

module.exports = app;