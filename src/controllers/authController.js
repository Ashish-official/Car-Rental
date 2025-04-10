const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const constants = require('../config/constants');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, contact, role } = req.body;
        console.log('Received registration data:', { name, email, contact, role });

        // Validate required fields
        const requiredFields = ['name', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                fields: missingFields
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists',
                message: 'An account with this email already exists'
            });
        }

        // Validate role
        const validRoles = ['user', 'admin'];
        const userRole = role ? role.toLowerCase() : 'user';
        
        if (!validRoles.includes(userRole)) {
            return res.status(400).json({ 
                error: 'Invalid role',
                message: 'Role must be either "user" or "admin"'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            contact,
            role: userRole
        });

        const savedUser = await user.save();

        // Generate token
        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role },
            constants.JWT_SECRET,
            { expiresIn: constants.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Registration failed',
            message: error.message
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Missing credentials',
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            constants.JWT_SECRET,
            { expiresIn: constants.JWT_EXPIRES_IN }
        );

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed',
            message: error.message
        });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    try {
        // In a real application, you might want to invalidate the token
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            error: 'Logout failed',
            message: error.message
        });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found',
                message: 'The requested user profile does not exist'
            });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            error: 'Failed to get profile',
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
};