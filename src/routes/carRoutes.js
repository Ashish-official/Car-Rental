const express = require('express');
const Car = require('../models/car');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware for authentication
const router = express.Router();

// Middleware to ensure only authenticated users can access these routes
router.use(authMiddleware);

// Create a new car listing
router.post('/', async (req, res) => {
  try {
    const { make, model, year, pricePerDay } = req.body;
    const car = new Car({
      make,
      model,
      year,
      pricePerDay,
      owner: req.user.id, // Attach the car to the authenticated user
    });
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all car listings
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().populate('owner', 'name email'); // Populate owner details
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific car listing by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'name email');
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a car listing (only by the owner)
router.put('/:id', async (req, res) => {
  try {
    const { make, model, year, pricePerDay } = req.body;
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });

    if (!car) {
      return res.status(404).json({ error: 'Car not found or unauthorized' });
    }

    car.make = make || car.make;
    car.model = model || car.model;
    car.year = year || car.year;
    car.pricePerDay = pricePerDay || car.pricePerDay;

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a car listing (only by the owner)
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!car) {
      return res.status(404).json({ error: 'Car not found or unauthorized' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;