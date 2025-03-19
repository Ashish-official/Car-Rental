const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protect all booking routes with authentication
router.use(authMiddleware);

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings for the authenticated user
router.get('/', bookingController.getUserBookings);

// Get a specific booking by ID
router.get('/:id', bookingController.getBookingById);

// Update a booking
router.put('/:id', bookingController.updateBooking);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;