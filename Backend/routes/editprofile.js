const express = require('express');
const router = express.Router();
const User = require('../Database/UserSchema'); // my User model
const verifyToken = require("../Middleware/verifytoken");

router.put("/editprofile", verifyToken, async(req,res)=>{
    try{
    const userId = req.user.id; // getting id from decoded token
    const updates = req.body;   // getting updated fields from frontend

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  }catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
