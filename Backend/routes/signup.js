const express = require("express");
const router = express.Router();
const User = require("../Database/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Route for new user registration
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Request body:", req.body);

  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Username, email, and password are required.",
    });
  }

  try {
    // 1️⃣ Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2️⃣ Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileCompleted: false, // Important for flow
    });

    await newUser.save();

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6️⃣ Send response
    res.status(201).json({
      message: "New user created successfully",
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileCompleted: newUser.profileCompleted,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = router;
