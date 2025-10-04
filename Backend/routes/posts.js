// routes/posts.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../Database/PostSchema"); 
const verifyToken = require("../Middleware/verifytoken");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // store uploads in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filenames
  },
});

const upload = multer({ storage });

// Create a new post
router.post("/", verifyToken, upload.single("media"), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const newPost = new Post({
      user: req.user.id,          // uses req.user.id from verifyToken
      content,
      media: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get posts by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
