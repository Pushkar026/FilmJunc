// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // use your secret key
    req.user = verified; // add user payload to request
    next(); // continue to the actual route
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
