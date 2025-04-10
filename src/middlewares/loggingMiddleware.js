const logRequest = (req, res, next) => {
    console.log('=== Incoming Request ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
    console.log('===================');
    next();
};

module.exports = {
    logRequest
}; 