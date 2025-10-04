const express = require("express");
const router = express.Router();
const User = require("../Database/UserSchema");
const Post = require("../Database/PostSchema");
const verifyToken = require("../Middleware/verifytoken");

router.get("/userprofile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user excluding password
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch posts
    let posts = [];
    try {
      posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    } catch (err) {
      console.error("Error fetching posts:", err);
    }

    res.json({ ...user.toObject(), posts });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
