// Import Express and create router
const express = require("express");
const router = express.Router();

// Import controller and authentication middleware
const planController = require("../controllers/planController");
const auth = require("../middleware/auth");

// Fitness Plan Routes
// Create a new plan (only trainer, protected route)
router.post("/create", auth, planController.createPlan);

// Get all fitness plans (public)
router.get("/", planController.getAllPlans);

// Get a single plan by ID (public)
router.get("/:id", planController.getPlanById);

// Update a plan (only trainer who owns the plan, protected route)
router.put("/:id", auth, planController.updatePlan);

// Delete a plan (only trainer who owns the plan, protected route)
router.delete("/:id", auth, planController.deletePlan);

// Get logged-in trainer's own plans (protected)
router.get("/trainer/myplans", auth, planController.getTrainerPlans);

// Export router
module.exports = router;
