const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protect all user routes with authentication
router.use(authMiddleware);

// Get the authenticated user's profile
router.get('/me', userController.getUserProfile);

// Update the authenticated user's profile
router.put('/me', userController.updateUserProfile);

// Delete the authenticated user's account
router.delete('/me', userController.deleteUserProfile);

module.exports = router;