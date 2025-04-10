const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token payload' });
        }

        // Find user
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Role-based access control middleware
const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    error: 'Access denied',
                    message: `Required role: ${roles.join(', ')}`,
                    currentRole: req.user.role
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({ error: 'Authorization failed' });
        }
    };
};

// Admin middleware
const adminMiddleware = [authMiddleware, checkRole(['admin'])];

module.exports = {
    authMiddleware,
    checkRole,
    adminMiddleware
};