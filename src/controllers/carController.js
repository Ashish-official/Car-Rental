const carService = require('../services/carService');
const constants = require('../config/constants');

// Create a new car listing
const createCar = async (req, res) => {
  try {
    console.log('=== Car Controller ===');
    console.log('Creating car with data:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user);
    
    // Parse features if it's a string
    let features = req.body.features;
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
        console.log('Parsed features:', features);
      } catch (error) {
        console.error('Error parsing features:', error);
        return res.status(400).json({ error: 'Invalid features format' });
      }
    }

    // Ensure features is an array
    if (!Array.isArray(features)) {
      console.error('Features is not an array:', features);
      return res.status(400).json({ error: 'Features must be an array' });
    }

    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'pricePerDay', 'type', 'transmission', 'fuelType', 'seats', 'description', 'city'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Handle file uploads
    if (!req.files || req.files.length === 0) {
      console.error('No files uploaded');
      return res.status(400).json({ error: 'At least one image is required' });
    }

    console.log('Processing uploaded files:', req.files.map(f => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path
    })));

    const images = req.files.map(file => ({
      path: file.path,
      filename: file.filename
    }));

    const carData = {
      owner: req.user._id,
      make: req.body.make.trim(),
      model: req.body.model.trim(),
      year: parseInt(req.body.year),
      pricePerDay: parseFloat(req.body.pricePerDay),
      type: req.body.type,
      transmission: req.body.transmission,
      fuelType: req.body.fuelType,
      seats: parseInt(req.body.seats),
      description: req.body.description.trim(),
      features,
      images,
      city: req.body.city.trim(),
      state: req.body.state ? req.body.state.trim() : '',
      address: req.body.address ? req.body.address.trim() : ''
    };

    console.log('Calling carService.createCar with:', {
      ...carData,
      images: `${carData.images.length} images`
    });

    const car = await carService.createCar(carData);
    console.log('Car created successfully:', car);
    res.status(201).json(car);
  } catch (error) {
    console.error('Error in createCar:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create car listing',
      message: error.message,
      details: error.stack
    });
  }
};

// Get all cars
const getAllCars = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      transmission: req.query.transmission,
      fuelType: req.query.fuelType,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      minSeats: req.query.minSeats ? parseInt(req.query.minSeats) : undefined,
      maxSeats: req.query.maxSeats ? parseInt(req.query.maxSeats) : undefined
    };

    const cars = await carService.getAllCars(filters);
    res.json(cars);
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a car by ID
const getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    res.json(car);
  } catch (error) {
    console.error('Error getting car:', error);
    res.status(404).json({ error: error.message });
  }
};

// Update a car listing
const updateCar = async (req, res) => {
  try {
    const car = await carService.updateCar(req.params.id, req.user.id, req.body);
    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a car listing
const deleteCar = async (req, res) => {
  try {
    console.log('=== Delete Car Controller ===');
    console.log('User:', req.user);
    console.log('Car ID:', req.params.id);
    
    const isAdmin = req.user.role === 'admin';
    console.log('Is Admin:', isAdmin);
    
    const car = await carService.deleteCar(req.params.id, req.user.id, isAdmin);
    console.log('Car deleted successfully:', car);
    
    res.json({ 
      success: true,
      message: 'Car deleted successfully', 
      car 
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(error.message.includes('not found') ? 404 : 400).json({ 
      success: false,
      error: error.message 
    });
  }
  console.log('=======================');
};

// Get user's cars
const getUserCars = async (req, res) => {
  try {
    console.log('=== getUserCars Controller ===');
    console.log('Request path:', req.path);
    console.log('Request query:', req.query);
    console.log('Request user:', req.user);
    console.log('User ID:', req.user?.id);
    
    const cars = await carService.getUserCars(req.user.id);
    console.log('Found cars:', cars.length);
    res.json(cars);
  } catch (error) {
    console.error('Error getting user cars:', error);
    res.status(500).json({ error: error.message });
  }
  console.log('===========================');
};

// Update car status (admin only)
const updateCarStatus = async (req, res) => {
  try {
    const car = await carService.updateCarStatus(req.params.id, req.body.status);
    res.json(car);
  } catch (error) {
    console.error('Error updating car status:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all cars (admin only)
const getAllCarsAdmin = async (req, res) => {
  try {
    const cars = await carService.getAllCarsAdmin();
    res.json(cars);
  } catch (error) {
    console.error('Error getting all cars for admin:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  getUserCars,
  updateCarStatus,
  getAllCarsAdmin
};