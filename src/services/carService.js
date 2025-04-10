const Car = require('../models/car');
const constants = require('../config/constants');

const carService = {
    // Create a new car listing
    createCar: async (carData) => {
        try {
            console.log('Creating car with data:', carData);
            
            // Validate car type, transmission, and fuel type
            if (!constants.CAR_TYPES.includes(carData.type)) {
                throw new Error(`Invalid car type. Must be one of: ${constants.CAR_TYPES.join(', ')}`);
            }
            if (!constants.TRANSMISSION_TYPES.includes(carData.transmission)) {
                throw new Error(`Invalid transmission type. Must be one of: ${constants.TRANSMISSION_TYPES.join(', ')}`);
            }
            if (!constants.FUEL_TYPES.includes(carData.fuelType)) {
                throw new Error(`Invalid fuel type. Must be one of: ${constants.FUEL_TYPES.join(', ')}`);
            }

            // Validate required fields
            if (!carData.owner) {
                throw new Error('Owner is required');
            }
            if (!carData.city) {
                throw new Error('City is required');
            }

            // Create new car instance
            const car = new Car({
                owner: carData.owner,
                make: carData.make,
                model: carData.model,
                year: carData.year,
                pricePerDay: carData.pricePerDay,
                type: carData.type,
                transmission: carData.transmission,
                fuelType: carData.fuelType,
                seats: carData.seats,
                description: carData.description,
                features: carData.features,
                images: carData.images,
                city: carData.city,
                state: carData.state || '',
                address: carData.address || '',
                status: 'available'
            });

            console.log('Attempting to save car:', {
                ...car.toObject(),
                images: `${car.images.length} images`
            });

            // Save the car
            await car.save();
            return car;
        } catch (error) {
            console.error('Error in carService.createCar:', error);
            throw error;
        }
    },

    // Get all cars (with optional filters)
    getAllCars: async (filters = {}) => {
        try {
            const query = { status: 'available' };
            
            // Apply filters if provided
            if (filters.type) query.type = filters.type;
            if (filters.transmission) query.transmission = filters.transmission;
            if (filters.fuelType) query.fuelType = filters.fuelType;
            if (filters.minPrice) query.pricePerDay = { $gte: filters.minPrice };
            if (filters.maxPrice) query.pricePerDay = { ...query.pricePerDay, $lte: filters.maxPrice };
            if (filters.minSeats) query.seats = { $gte: filters.minSeats };
            if (filters.maxSeats) query.seats = { ...query.seats, $lte: filters.maxSeats };

            const cars = await Car.find(query)
                .populate('owner', 'name email')
                .sort({ createdAt: -1 });
            
            return cars;
        } catch (error) {
            console.error('Error getting cars:', error);
            throw new Error('Failed to get car listings');
        }
    },

    // Get a car by ID
    getCarById: async (carId) => {
        try {
            const car = await Car.findById(carId)
                .populate('owner', 'name email');
            
            if (!car) {
                throw new Error('Car not found');
            }
            
            return car;
        } catch (error) {
            console.error('Error getting car:', error);
            throw new Error('Failed to get car details');
        }
    },

    // Update a car listing
    updateCar: async (carId, userId, updateData) => {
        try {
            const car = await Car.findOne({ _id: carId, owner: userId });
            
            if (!car) {
                throw new Error('Car not found or unauthorized');
            }

            // Update only allowed fields
            const allowedFields = ['make', 'model', 'year', 'pricePerDay', 'type', 'transmission', 'fuelType', 'seats', 'description', 'features', 'status'];
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    car[field] = updateData[field];
                }
            });

            await car.save();
            return car;
        } catch (error) {
            console.error('Error updating car:', error);
            throw new Error('Failed to update car listing');
        }
    },

    // Delete a car listing
    deleteCar: async (carId, userId, isAdmin = false) => {
        try {
            console.log('=== Delete Car Service ===');
            console.log('Car ID:', carId);
            console.log('User ID:', userId);
            console.log('Is Admin:', isAdmin);
            
            let query = { _id: carId };
            if (!isAdmin) {
                query.owner = userId;
            }
            
            console.log('Delete query:', query);
            
            const car = await Car.findOneAndDelete(query);
            
            if (!car) {
                console.log('Car not found or unauthorized');
                throw new Error(isAdmin ? 'Car not found' : 'Car not found or unauthorized');
            }
            
            console.log('Car deleted successfully:', car);
            return car;
        } catch (error) {
            console.error('Error deleting car:', error);
            throw error;
        } finally {
            console.log('=======================');
        }
    },

    // Get all cars for a specific user
    getUserCars: async (userId) => {
        try {
            console.log('=== getUserCars Service ===');
            console.log('Looking for cars with owner:', userId);
            
            const cars = await Car.find({ owner: userId })
                .sort({ createdAt: -1 });
            
            console.log('Found cars count:', cars.length);
            if (cars.length > 0) {
                console.log('First car details:', {
                    id: cars[0]._id,
                    make: cars[0].make,
                    model: cars[0].model,
                    images: cars[0].images
                });
            }
            
            return cars;
        } catch (error) {
            console.error('Error getting user cars:', error);
            throw new Error('Failed to get user car listings');
        } finally {
            console.log('===========================');
        }
    },

    // Update car status (admin only)
    updateCarStatus: async (carId, status) => {
        try {
            const car = await Car.findById(carId);
            
            if (!car) {
                throw new Error('Car not found');
            }

            if (!['available', 'rented', 'maintenance', 'inactive'].includes(status)) {
                throw new Error('Invalid status');
            }

            car.status = status;
            await car.save();
            
            return car;
        } catch (error) {
            console.error('Error updating car status:', error);
            throw new Error('Failed to update car status');
        }
    },

    // Get all cars for admin (including unavailable cars)
    getAllCarsAdmin: async () => {
        try {
            const cars = await Car.find()
                .populate('owner', 'name email')
                .sort({ createdAt: -1 });
            
            return cars;
        } catch (error) {
            console.error('Error getting all cars for admin:', error);
            throw new Error('Failed to get all car listings');
        }
    }
};

module.exports = carService;