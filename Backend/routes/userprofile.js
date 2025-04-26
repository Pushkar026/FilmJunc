const express = require('express');
const router = express.Router();
const User = require('../Database/UserSchema'); // my User model
const verifyToken = require("../Middleware/verifytoken");


// GET /api/user/profile
router.get("/userprofile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // user info from token
    const user = await User.findById(userId).select('-password'); // don't send password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // send user data
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
