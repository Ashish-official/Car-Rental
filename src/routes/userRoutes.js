const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// User profile routes
router.get('/me', userController.getUserProfile);
router.put('/me', userController.updateUserProfile);
router.delete('/me', userController.deleteUserProfile);

// Admin routes
router.get('/admin/all', checkRole(['admin']), userController.getAllUsers);
router.put('/admin/:id/status', checkRole(['admin']), userController.updateUserStatus);
router.delete('/admin/:id', checkRole(['admin']), userController.deleteUser);

module.exports = router; 