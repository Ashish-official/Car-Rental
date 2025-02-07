const User = require('../models/user');

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

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};