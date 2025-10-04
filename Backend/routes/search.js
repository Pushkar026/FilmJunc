const express = require('express');
const router = express.Router();
const User = require('../Database/UserSchema'); 
const verifyToken = require("../Middleware/verifytoken");

// Route: Search users by location
router.get('/search', verifyToken, async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: 'Location is required.' });
  }

  try {
    const users = await User.find({
      location: { $regex: new RegExp(location, 'i') }, // case-insensitive search
      _id: { $ne: req.user.id } // exclude logged-in user
    }).select('-password'); // do not send password field

    res.json(users);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
