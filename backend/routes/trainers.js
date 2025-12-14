// Import Express and create router
const express = require("express");
const router = express.Router();

// Import controller and authentication middleware
const trainerController = require("../controllers/trainerController");
const auth = require("../middleware/auth");

// Trainer Routes
// Follow a trainer (protected)
router.post("/follow", auth, trainerController.followTrainer);

// Unfollow a trainer (protected)
router.post("/unfollow", auth, trainerController.unfollowTrainer);

// Get all trainers (public)
router.get("/", trainerController.getAllTrainers);

// Get single trainer by ID (public)
router.get("/:id", trainerController.getTrainerById);

// Export router
module.exports = router;
