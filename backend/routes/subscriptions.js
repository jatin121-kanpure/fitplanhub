// Import Express and create router
const express = require("express");
const router = express.Router();

// Import Subscription Controller and auth middleware
const subscriptionController = require("../controllers/subscriptionController");
const auth = require("../middleware/auth");
const Subscription = require("../models/Subscription");

// Subscription Routes
// Subscribe to a plan (protected)
router.post("/subscribe", auth, subscriptionController.subscribeToPlan);

// Get all subscriptions of logged-in user (protected)
router.get(
  "/my-subscriptions",
  auth,
  subscriptionController.getUserSubscriptions
);

// Check if user has access to a specific plan (protected)
router.get("/check-access/:planId", auth, subscriptionController.checkAccess);

// Export router
module.exports = router;
