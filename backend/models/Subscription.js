const mongoose = require("mongoose");

// Subscription schema stores purchase details of fitness plans
const SubscriptionSchema = new mongoose.Schema({
  // User who purchased the plan
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Fitness plan that was purchased
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FitnessPlan",
    required: true,
  },

  // Current subscription status
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active",
  },

  // Date when plan was purchased
  purchaseDate: {
    type: Date,
    default: Date.now,
  },

  // Date when subscription expires
  expiryDate: {
    type: Date,
  },

  // Price paid by user
  price: {
    type: Number,
    required: true,
  },
});

// Exporting the model
module.exports = mongoose.model("Subscription", SubscriptionSchema);
