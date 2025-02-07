const Car = require('../models/car');

// Create a new car listing
const createCar = async (userId, make, model, year, pricePerDay) => {
  const car = new Car({
    make,
    model,
    year,
    pricePerDay,
    owner: userId,
  });

  await car.save();
  return car;
};

// Get all car listings
const getAllCars = async () => {
  const cars = await Car.find().populate('owner', 'name email');
  return cars;
};

// Get a specific car listing by ID
const getCarById = async (carId) => {
  const car = await Car.findById(carId).populate('owner', 'name email');

  if (!car) {
    throw new Error('Car not found');
  }

  return car;
};

// Update a car listing
const updateCar = async (carId, userId, make, model, year, pricePerDay) => {
  const car = await Car.findOne({ _id: carId, owner: userId });

  if (!car) {
    throw new Error('Car not found or unauthorized');
  }

  // Update the car details
  car.make = make || car.make;
  car.model = model || car.model;
  car.year = year || car.year;
  car.pricePerDay = pricePerDay || car.pricePerDay;

  await car.save();
  return car;
};

// Delete a car listing
const deleteCar = async (carId, userId) => {
  const car = await Car.findOneAndDelete({ _id: carId, owner: userId });

  if (!car) {
    throw new Error('Car not found or unauthorized');
  }

  return { message: 'Car deleted successfully' };
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};