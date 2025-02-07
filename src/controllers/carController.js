const carService = require('../services/carService');

// Create a new car listing
const createCar = async (req, res) => {
  try {
    const { make, model, year, pricePerDay } = req.body;
    const car = await carService.createCar(req.user.id, make, model, year, pricePerDay);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all car listings
const getAllCars = async (req, res) => {
  try {
    const cars = await carService.getAllCars();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific car listing by ID
const getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a car listing
const updateCar = async (req, res) => {
  try {
    const { make, model, year, pricePerDay } = req.body;
    const car = await carService.updateCar(req.params.id, req.user.id, make, model, year, pricePerDay);
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a car listing
const deleteCar = async (req, res) => {
  try {
    const result = await carService.deleteCar(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};