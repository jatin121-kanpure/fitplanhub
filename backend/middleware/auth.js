// Importing jsonwebtoken package to verify jwt tokens
const jwt = require("jsonwebtoken");

// Authentication Middleware
// This middleware checks whether the user is logged in,
// it verifies the JWT token sent in the request header

const auth = (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    // Format: "Bearer token_here"
    const authHeader = req.header("Authorization");

    // If no Authorization header is found
    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // 2. Remove 'Bearer ' from token string
    const token = authHeader.replace("Bearer ", "");

    // 3. Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Save user ID from token into request object
    req.userId = decoded.id;

    // 5. Move to next middleware or controller
    next();
  } catch (error) {
    // If token is invalid or expired
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

//Exporting the auth middleware
module.exports = auth;
