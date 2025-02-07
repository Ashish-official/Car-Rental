const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user; // Attach the user to the request object
    req.token = token; // Attach the token to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = authMiddleware;