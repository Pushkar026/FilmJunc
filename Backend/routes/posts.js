// routes/posts.js

const express = require("express");
const multer = require("multer");
const Post = require("../Database/PostSchema");
const verifyToken = require("../Middleware/verifytoken");
const cloudinary = require("../cloudinary");

const router = express.Router();

// Use memory storage (no filesystem needed)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/*
CREATE POST
Uploads media to Cloudinary and saves post in MongoDB
*/
router.post("/", verifyToken, upload.single("media"), async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    let mediaUrl = null;

    // Upload media to Cloudinary if a file is included
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "filmjunc_posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      mediaUrl = result.secure_url;
    }

    const newPost = new Post({
      user: req.user.id,
      content,
      media: mediaUrl,
    });

    const savedPost = await newPost.save();

    res.json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
GET POSTS BY USER
Used for profile pages
*/
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
