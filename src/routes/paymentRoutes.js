const express = require('express');
const router = express.Router();
const { createPaymentIntent, getStripeConfig } = require('../controllers/paymentController');
const { authenticateToken } = require('../middlewares/auth');

// Public route - Get Stripe configuration
router.get('/config', getStripeConfig);

// Protected route - Create payment intent
router.post('/create-payment-intent', authenticateToken, createPaymentIntent);

module.exports = router; 