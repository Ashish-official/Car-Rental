// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error status and message
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = err.message;
    } else if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired';
    }
    
    // Send error response
    res.status(status).json({
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// Not found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound }; 