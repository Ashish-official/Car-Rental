const Booking = require('../models/booking');
const Car = require('../models/car');

// Create a new booking
const createBooking = async (userId, carId, startDate, endDate, pickupLocation, dropoffLocation, totalPrice) => {
  // Check if the car exists
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error('Car not found');
  }

  // Check if the car is available for the given dates
  const existingBooking = await Booking.findOne({
    car: carId,
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Overlapping dates
    ],
  });

  if (existingBooking) {
    throw new Error('Car is already booked for the selected dates');
  }

  // Create a new booking
  const booking = new Booking({
    car: carId,
    user: userId,
    startDate,
    endDate,
    pickupLocation,
    dropoffLocation,
    totalPrice,
    status: 'pending'
  });

  await booking.save();
  return booking;
};

// Get all bookings for a user
const getUserBookings = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .populate('car', 'make model year pricePerDay')
    .populate('user', 'name email');
  return bookings;
};

// Get a specific booking by ID
const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId)
    .populate('car', 'make model year pricePerDay')
    .populate('user', 'name email');

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Ensure the authenticated user owns the booking
  if (booking.user._id.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  return booking;
};

// Update a booking
const updateBooking = async (bookingId, userId, startDate, endDate) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });

  if (!booking) {
    throw new Error('Booking not found or unauthorized');
  }

  // Update the booking
  booking.startDate = startDate || booking.startDate;
  booking.endDate = endDate || booking.endDate;

  await booking.save();
  return booking;
};

// Delete a booking
const deleteBooking = async (bookingId, userId) => {
  const booking = await Booking.findOneAndDelete({ _id: bookingId, user: userId });

  if (!booking) {
    throw new Error('Booking not found or unauthorized');
  }

  return { message: 'Booking deleted successfully' };
};

// Admin: Get all bookings
const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate('car', 'make model year pricePerDay')
    .populate('user', 'name email');
  return bookings;
};

// Admin: Update booking status
const updateBookingStatus = async (bookingId, status) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  booking.status = status;
  await booking.save();

  return booking;
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