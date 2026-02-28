const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Invalid Password"],
  },

  profileImage: String,
  bannerImage: String,
  name: String,
  bio: String,
  location: String,
  role: String,

  socials: {
    instagram: String,
    website: String,
  },

  portfolio: {
    title: String,
    description: String,
    link: String,
  },

  profileCompleted: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);



