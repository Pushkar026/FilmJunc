// routes/auth.js (or wherever you're defining routes)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Database/UserSchema'); // adjust path if needed

// POST 
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    
    // 2. Compare passwords (plain text comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 3. Generate JWT token
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '1d',
    });

    // 4. Return token
    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
