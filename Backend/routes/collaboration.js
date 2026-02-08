const express = require("express");
const router = express.Router();

const Collaboration = require("../Database/CollaborationSchema");
const verifyToken = require("../Middleware/verifytoken");

/**
 * ================================
 * SEND COLLABORATION REQUEST
 * POST /collaboration/send
 * ================================
 */
router.post("/send", verifyToken, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    // Prevent self collaboration
    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot collaborate with yourself",
      });
    }

    // Check existing collaboration (both directions)
    const existingRequest = await Collaboration.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Collaboration request already exists",
        status: existingRequest.status,
      });
    }

    const newRequest = new Collaboration({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    await newRequest.save();

    return res.status(201).json({
      message: "Collaboration request sent",
      request: newRequest,
    });
  } catch (error) {
    console.error("Collaboration send error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



/**
 * ================================
 * ACCEPT / REJECT COLLABORATION
 * POST /collaboration/respond
 * ================================
 */
router.post("/respond", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId, action } = req.body; // action: accepted | rejected

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const collaboration = await Collaboration.findById(requestId);

    if (!collaboration) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only receiver can accept/reject
    if (collaboration.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent re-responding
    if (collaboration.status !== "pending") {
      return res.status(400).json({
        message: `Request already ${collaboration.status}`,
      });
    }

    collaboration.status = action;
    await collaboration.save();

    return res.json({
      message: `Collaboration ${action}`,
      collaboration,
    });
  } catch (error) {
    console.error("Collaboration respond error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



/**
 * ================================
 * GET PENDING COLLABORATION REQUESTS
 * GET /collaboration/pending
 * ================================
 */
router.get("/pending", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingRequests = await Collaboration.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "name role profileImage");

    return res.json(pendingRequests);
  } catch (error) {
    console.error("Fetch pending collaborations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET COLLABORATORS COUNT
 * GET /collaboration/count
 */
router.get("/count", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Collaboration.countDocuments({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    });

    res.json({ count });
  } catch (error) {
    console.error("Collaborators count error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * GET COLLABORATORS LIST
 * GET /collaboration/list
 */
router.get("/list", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const collaborations = await Collaboration.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name role profileImage")
      .populate("receiver", "name role profileImage");

    const collaborators = collaborations.map((c) =>
      c.sender._id.toString() === userId ? c.receiver : c.sender
    );

    res.json(collaborators);
  } catch (error) {
    console.error("Collaborators list error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * ================================
 * GET COLLABORATION STATUS WITH USER
 * GET /collaboration/status/:userId
 * ================================
 */
router.get("/status/:userId", verifyToken, async (req, res) => {
  try {
    const myId = req.user.id;
    const otherUserId = req.params.userId;

    const collaboration = await Collaboration.findOne({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    });

    if (!collaboration) {
      return res.json({ status: "none" });
    }

    return res.json({ status: collaboration.status });
  } catch (error) {
    console.error("Collaboration status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

