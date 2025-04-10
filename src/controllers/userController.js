const userService = require('../services/userService');

// Get the authenticated user's profile
const getUserProfile = async (req, res) => {
  try {
    console.log('Fetching user profile:', { userId: req.user.id });
    const user = await userService.getUserProfile(req.user.id);
    console.log('Successfully fetched user profile:', { userId: req.user.id });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', {
      userId: req.user.id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
};

// Update the authenticated user's profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log('Updating user profile:', { userId: req.user.id, updates: { name, email } });
    const user = await userService.updateUserProfile(req.user.id, name, email);
    console.log('Successfully updated user profile:', { userId: req.user.id });
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', {
      userId: req.user.id,
      error: error.message,
      stack: error.stack
    });
    res.status(400).json({ error: error.message });
  }
};

// Delete the authenticated user's account
const deleteUserProfile = async (req, res) => {
  try {
    console.log('Deleting user profile:', { userId: req.user.id });
    const result = await userService.deleteUserProfile(req.user.id);
    console.log('Successfully deleted user profile:', { userId: req.user.id });
    res.json(result);
  } catch (error) {
    console.error('Error deleting user profile:', {
      userId: req.user.id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
    try {
        console.log('Admin request to get all users:', {
            path: req.path,
            method: req.method,
            user: req.user ? { id: req.user._id, role: req.user.role } : 'No user'
        });

        // Verify admin role
        if (!req.user || req.user.role !== 'admin') {
            console.warn('Unauthorized access attempt to admin route:', {
                user: req.user ? { id: req.user._id, role: req.user.role } : 'No user'
            });
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        const users = await userService.getAllUsers();
        
        // Sanitize user data before sending
        const sanitizedUsers = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        console.log('Successfully retrieved all users:', {
            count: sanitizedUsers.length
        });

        res.status(200).json({
            success: true,
            count: sanitizedUsers.length,
            data: sanitizedUsers
        });
    } catch (error) {
        console.error('Error in getAllUsers controller:', {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        });

        if (error.name === 'MongoError') {
            return res.status(500).json({
                success: false,
                error: 'Database error occurred'
            });
        }

        if (error.name === 'RequestTimeout') {
            return res.status(408).json({
                success: false,
                error: 'Request timeout'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};

// Admin: Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log('Updating user status:', { userId: id, newStatus: status });
    const user = await userService.updateUserStatus(id, status);
    console.log('Successfully updated user status:', { userId: id, newStatus: status });
    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', {
      userId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    res.status(400).json({ error: error.message });
  }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting user:', { userId: id });
    const result = await userService.deleteUser(id);
    console.log('Successfully deleted user:', { userId: id });
    res.json(result);
  } catch (error) {
    console.error('Error deleting user:', {
      userId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
  updateUserStatus,
  deleteUser,
};