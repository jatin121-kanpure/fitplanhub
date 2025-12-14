// Import Express and create router
const express = require("express");
const router = express.Router();

// Import controller functions
const {
  signup,
  login,
  getCurrentUser,
} = require("../controllers/authController");

// Middleware to protect routes
const authMiddleware = require("../middleware/auth");

// User registration
router.post("/signup", signup);

// User login
router.post("/login", login);

// Get logged-in user details (protected)
router.get("/me", authMiddleware, getCurrentUser);

//Exporting the router
module.exports = router;
