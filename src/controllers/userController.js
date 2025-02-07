const userService = require('../services/userService');

// Get the authenticated user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the authenticated user's profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userService.updateUserProfile(req.user.id, name, email);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete the authenticated user's account
const deleteUserProfile = async (req, res) => {
  try {
    const result = await userService.deleteUserProfile(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};