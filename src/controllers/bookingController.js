const bookingService = require('../services/bookingService');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, pickupLocation, dropoffLocation, totalPrice } = req.body;

    // Validate required fields
    if (!carId || !startDate || !endDate || !pickupLocation || !dropoffLocation || !totalPrice) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Car ID, start date, end date, pickup location, dropoff location, and total price are required'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({
        error: 'Invalid start date',
        message: 'Start date cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        error: 'Invalid date range',
        message: 'End date must be after start date'
      });
    }

    // Validate locations
    if (pickupLocation.trim().length === 0 || dropoffLocation.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid locations',
        message: 'Pickup and dropoff locations cannot be empty'
      });
    }

    // Validate total price
    if (totalPrice <= 0) {
      return res.status(400).json({
        error: 'Invalid total price',
        message: 'Total price must be greater than 0'
      });
    }

    const booking = await bookingService.createBooking(
      req.user.id, 
      carId, 
      startDate, 
      endDate, 
      pickupLocation.trim(), 
      dropoffLocation.trim(), 
      totalPrice
    );
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to create booking',
      details: error.details
    });
  }
};

// Get all bookings for the authenticated user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      error: 'Failed to get bookings',
      message: error.message
    });
  }
};

// Get a specific booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user.id);
    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'The requested booking does not exist'
      });
    }
    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: 'Failed to get booking',
      message: error.message
    });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Validate dates if provided
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const now = new Date();

      if (start && start < now) {
        return res.status(400).json({
          error: 'Invalid start date',
          message: 'Start date cannot be in the past'
        });
      }

      if (start && end && end <= start) {
        return res.status(400).json({
          error: 'Invalid date range',
          message: 'End date must be after start date'
        });
      }
    }

    const booking = await bookingService.updateBooking(req.params.id, req.user.id, startDate, endDate);
    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to update booking',
      details: error.details
    });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const result = await bookingService.deleteBooking(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to delete booking',
      details: error.details
    });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      error: 'Failed to get bookings',
      message: error.message
    });
  }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        error: 'Missing status',
        message: 'Status is required'
      });
    }

    const booking = await bookingService.updateBookingStatus(req.params.id, status);
    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to update booking status',
      details: error.details
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAllBookings,
  updateBookingStatus,
};