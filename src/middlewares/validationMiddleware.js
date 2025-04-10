const constants = require('../config/constants');
const path = require('path');

const validateCarInput = (req, res, next) => {
  // Log the entire request body for debugging
  console.log('=== Validation Middleware ===');
  console.log('Raw request body:', req.body);
  console.log('Request headers:', req.headers);
  console.log('Content-Type:', req.get('content-type'));
  console.log('Files:', req.files);

  // Get all form fields from the request
  const formData = req.body;

  // Log the form data for debugging
  console.log('Form data received:', formData);

  // Parse numeric values from FormData
  const year = formData.year ? parseInt(formData.year) : null;
  const pricePerDay = formData.pricePerDay ? parseFloat(formData.pricePerDay) : null;
  const seats = formData.seats ? parseInt(formData.seats) : null;

  // Log parsed values for debugging
  console.log('Parsed values:', { year, pricePerDay, seats });

  // Check each required field individually and collect missing fields
  const missingFields = [];
  
  // Check string fields
  if (!formData.make || formData.make.trim() === '') {
    console.log('Missing make field');
    missingFields.push('make');
  }
  if (!formData.model || formData.model.trim() === '') {
    console.log('Missing model field');
    missingFields.push('model');
  }
  if (!formData.type || formData.type.trim() === '') {
    console.log('Missing type field');
    missingFields.push('type');
  }
  if (!formData.transmission || formData.transmission.trim() === '') {
    console.log('Missing transmission field');
    missingFields.push('transmission');
  }
  if (!formData.fuelType || formData.fuelType.trim() === '') {
    console.log('Missing fuelType field');
    missingFields.push('fuelType');
  }
  if (!formData.description || formData.description.trim() === '') {
    console.log('Missing description field');
    missingFields.push('description');
  }
  if (!formData.city || formData.city.trim() === '') {
    console.log('Missing city field');
    missingFields.push('city');
  }

  // Check numeric fields
  if (!year || isNaN(year)) {
    console.log('Invalid year field');
    missingFields.push('year');
  }
  if (!pricePerDay || isNaN(pricePerDay)) {
    console.log('Invalid pricePerDay field');
    missingFields.push('pricePerDay');
  }
  if (!seats || isNaN(seats)) {
    console.log('Invalid seats field');
    missingFields.push('seats');
  }

  // Check features
  if (!formData.features) {
    console.log('Missing features field');
    missingFields.push('features');
  }

  // Check images
  if (!req.files || req.files.length === 0) {
    console.log('Missing images');
    missingFields.push('images');
  } else if (req.files.length > constants.MAX_FILES) {
    return res.status(400).json({
      error: 'Too many files',
      message: `Maximum ${constants.MAX_FILES} images allowed`
    });
  }

  // Check file types
  if (req.files) {
    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!constants.ALLOWED_FILE_EXTENSIONS.includes(ext)) {
        return res.status(400).json({
          error: 'Invalid file type',
          message: `Only ${constants.ALLOWED_FILE_EXTENSIONS.join(', ')} files are allowed`
        });
      }
    }
  }

  // If there are missing fields, return an error
  if (missingFields.length > 0) {
    console.log('Missing fields:', missingFields);
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }

  // Validate year range
  if (year < constants.MIN_CAR_YEAR || year > constants.MAX_CAR_YEAR) {
    return res.status(400).json({
      error: 'Invalid year',
      message: `Year must be between ${constants.MIN_CAR_YEAR} and ${constants.MAX_CAR_YEAR}`
    });
  }

  // Validate price
  if (pricePerDay <= constants.MIN_CAR_PRICE) {
    return res.status(400).json({
      error: 'Invalid price',
      message: 'Price per day must be greater than 0'
    });
  }

  // Validate seats
  if (seats < constants.MIN_CAR_SEATS || seats > constants.MAX_CAR_SEATS) {
    return res.status(400).json({
      error: 'Invalid seats',
      message: `Number of seats must be between ${constants.MIN_CAR_SEATS} and ${constants.MAX_CAR_SEATS}`
    });
  }

  // Validate car type
  if (!constants.CAR_TYPES.includes(formData.type)) {
    return res.status(400).json({
      error: 'Invalid car type',
      message: `Car type must be one of: ${constants.CAR_TYPES.join(', ')}`
    });
  }

  // Validate transmission
  if (!constants.TRANSMISSION_TYPES.includes(formData.transmission)) {
    return res.status(400).json({
      error: 'Invalid transmission',
      message: `Transmission must be one of: ${constants.TRANSMISSION_TYPES.join(', ')}`
    });
  }

  // Validate fuel type
  if (!constants.FUEL_TYPES.includes(formData.fuelType)) {
    return res.status(400).json({
      error: 'Invalid fuel type',
      message: `Fuel type must be one of: ${constants.FUEL_TYPES.join(', ')}`
    });
  }

  // If all validations pass, proceed to the next middleware
  next();
};

module.exports = {
  validateCarInput
}; 