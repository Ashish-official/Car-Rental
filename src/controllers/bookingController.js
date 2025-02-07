const bookingService = require('../services/bookingService');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const booking = await bookingService.createBooking(req.user.id, carId, startDate, endDate);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings for the authenticated user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user.id);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const booking = await bookingService.updateBooking(req.params.id, req.user.id, startDate, endDate);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const result = await bookingService.deleteBooking(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};