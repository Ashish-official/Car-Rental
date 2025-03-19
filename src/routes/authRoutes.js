const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Protected routes
router.post('/logout', authMiddleware, authController.logoutUser);
router.get('/profile', authMiddleware, authController.getUserProfile);

module.exports = router;