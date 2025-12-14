// Import Express and create router
const express = require("express");
const router = express.Router();

// Import Feed Controller and auth middleware
const feedController = require("../controllers/feedController");
const auth = require("../middleware/auth");

// Feed Routes
// Get personalized feed for logged-in user
// Protected route → only authenticated users can see their feed
router.get("/", auth, feedController.getPersonalizedFeed);

// Export router
module.exports = router;
