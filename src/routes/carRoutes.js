const express = require('express');
const carController = require('../controllers/carController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Protect all car routes with authentication
router.use(authMiddleware);

// Create a new car listing
router.post('/', carController.createCar);

// Get all car listings
router.get('/', carController.getAllCars);

// Get a specific car listing by ID
router.get('/:id', carController.getCarById);

// Update a car listing
router.put('/:id', carController.updateCar);

// Delete a car listing
router.delete('/:id', carController.deleteCar);

module.exports = router;