const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { validateCarInput } = require('../middlewares/validationMiddleware');
const carController = require('../controllers/carController');
const { logRequest } = require('../middlewares/loggingMiddleware');
const constants = require('../config/constants');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
console.log('Upload directory:', uploadDir);
if (!fs.existsSync(uploadDir)) {
    console.log('Creating upload directory...');
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Processing file upload:', file.originalname);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    console.log('Checking file type:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        console.log('Invalid file type:', file.mimetype);
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: constants.MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

// Apply logging middleware
router.use(logRequest);

// IMPORTANT: Order of routes matters in Express!
// More specific routes MUST come BEFORE less specific ones

// User specific routes (protected) - MUST be before wildcard routes
router.get('/user/cars', authMiddleware, carController.getUserCars);

// Admin routes
router.get('/admin/all', authMiddleware, checkRole(['admin']), carController.getAllCarsAdmin);
router.put('/admin/:id/status', authMiddleware, checkRole(['admin']), carController.updateCarStatus);

// Public routes - General listing route with no params
router.get('/', carController.getAllCars);

// Car specific routes with parameters - MUST come AFTER specific routes 
router.get('/:id', carController.getCarById);
router.post('/', authMiddleware, upload.array('images', constants.MAX_FILES), validateCarInput, carController.createCar);
router.put('/:id', authMiddleware, upload.array('images', constants.MAX_FILES), validateCarInput, carController.updateCar);
router.delete('/:id', authMiddleware, carController.deleteCar);

module.exports = router;