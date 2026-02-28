const express = require("express");
const router = express.Router();

const User = require("../Database/UserSchema");
const verifyToken = require("../Middleware/verifytoken");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.put(
  "/editprofile",
  verifyToken,
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const updates = { ...req.body };

      if (req.files) {
        if (req.files.profile) {
          updates.profileImage = `/uploads/${req.files.profile[0].filename}`;
        }
        if (req.files.banner) {
          updates.bannerImage = `/uploads/${req.files.banner[0].filename}`;
        }
      }

      let updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const isProfileComplete =
        updatedUser.bio &&
        updatedUser.location &&
        updatedUser.role;

      if (isProfileComplete && !updatedUser.profileCompleted) {
        updatedUser.profileCompleted = true;
        await updatedUser.save();
      }

      res.json(updatedUser);

    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;