const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Register a new user
router.post('/register', authController.registerUser);

// Login a user
router.post('/login', authController.loginUser);

module.exports = router;