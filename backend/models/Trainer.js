const mongoose = require("mongoose");

// Trainer Schema
// This schema stores trainer specific details
// Each trainer is linked to a User account

const TrainerSchema = new mongoose.Schema({
  // Reference to the User who is a trainer
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Trainer certification details
  certification: {
    type: String,
    required: true,
  },

  // Area of expertise - optional
  specialization: {
    type: String,
  },

  // Short description about the trainer
  bio: {
    type: String,
  },

  // Users who follow this trainer
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // Fitness plans created by this trainer
  plans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FitnessPlan",
    },
  ],

  // Profile creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exporting the model
module.exports = mongoose.model("Trainer", TrainerSchema);
