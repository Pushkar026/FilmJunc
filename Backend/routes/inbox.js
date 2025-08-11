// routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../Database/MessageSchema");
const User = require("../Database/UserSchema");
const mongoose = require("mongoose");

// GET inbox for a user
router.get("/inbox", async (req, res) => {
  try {
    const { userId } = req.query;

     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid or missing userId" });
     }

    const latestMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$timestamp" }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);

    const results = await Promise.all(
      latestMessages.map(async (msg) => {
        const user = await User.findById(msg._id).select("username profileImage");
        return {
          _id: user?._id,
          username: user?.username,
          profileImage: user?.profileImage,
          lastMessage: msg.lastMessage,
          updatedAt: msg.lastMessageTime
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("Inbox fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


