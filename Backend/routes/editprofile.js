const express = require("express");
const router = express.Router();

const User = require("../Database/UserSchema");
const verifyToken = require("../Middleware/verifytoken");
const multer = require("multer");
const cloudinary = require("../cloudinary"); // adjust path if needed

// 🔥 Use memory storage instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: `filmjunc/${folder}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

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

      // 🔥 Upload profile image
      if (req.files?.profile) {
        const result = await uploadToCloudinary(
          req.files.profile[0].buffer,
          "profiles"
        );
        updates.profileImage = result.secure_url;
      }

      // 🔥 Upload banner image
      if (req.files?.banner) {
        const result = await uploadToCloudinary(
          req.files.banner[0].buffer,
          "banners"
        );
        updates.bannerImage = result.secure_url;
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