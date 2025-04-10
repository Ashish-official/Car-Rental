const User = require('../models/user');
const mongoose = require('mongoose');

// Get the authenticated user's profile
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password'); // Exclude password
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Update the authenticated user's profile
const updateUserProfile = async (userId, name, email) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Update user details
  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();
  return user;
};

// Delete the authenticated user's account
const deleteUserProfile = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return { message: 'User deleted successfully' };
};

// Admin: Get all users
const getAllUsers = async () => {
  try {
    console.log('Fetching all users...');
    
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Current state:', mongoose.connection.readyState);
      throw new Error('Database connection not established');
    }

    // Try to find users with a timeout
    const users = await Promise.race([
      User.find().select('-password -__v'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      )
    ]);

    if (!users || !Array.isArray(users)) {
      console.error('Invalid users data:', users);
      throw new Error('Invalid users data received from database');
    }

    console.log(`Successfully retrieved ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error in getAllUsers service:', error);
    // Check if it's a mongoose error
    if (error instanceof mongoose.Error) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw error;
  }
};

// Admin: Update user status
const updateUserStatus = async (userId, status) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  user.status = status;
  await user.save();
  
  return user;
};

// Admin: Delete user
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return { message: 'User deleted successfully' };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
  updateUserStatus,
  deleteUser,
};