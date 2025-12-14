const mongoose = require("mongoose");

// Creating schema for fitness Plan
const FitnessPlanSchema = new mongoose.Schema({
  // Reference to Trainer who created this plan
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },

  // Title of the fitness plan
  title: {
    type: String,
    required: true,
  },

  // Detailed description of the plan
  description: {
    type: String,
    required: true,
  },

  // Price of the plan
  price: {
    type: Number,
    required: true,
  },

  // Duration of the plan (example: "30 days")
  duration: {
    type: String,
    required: true,
  },

  // Category like Fat Loss, Muscle Gain, etc.
  category: {
    type: String,
  },

  // List of exercises included in the plan
  exercises: [
    {
      name: String, // Exercise name
      sets: Number, // Number of sets
      reps: String, // Reps (e.g., "12-15")
      description: String, // Instructions
    },
  ],

  // Date when plan was created
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Date when plan was last updated
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Exporting the model
module.exports = mongoose.model("FitnessPlan", FitnessPlanSchema);
