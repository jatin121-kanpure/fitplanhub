// Import required packages
// mongoose is used to create schema and interact with MongoDB
const mongoose = require("mongoose");

// bcryptjs is used to hash and compare passwords securely
const bcrypt = require("bcryptjs");

// User Schema Definition
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // Role of the user in the system: 'user' or 'trainer'
  role: {
    type: String,
    enum: ["user", "trainer"],
    default: "user",
  },

  // List of trainers followed by the user
  followedTrainers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
  ],

  // List of subscriptions purchased by the user
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  ],

  // Account creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware: Hashing the password before saving user data
UserSchema.pre("save", async function () {
  // If password is not modified, skip hashing
  if (!this.isModified("password")) {
    return;
  }

  // Generate salt for password hashing
  const salt = await bcrypt.genSalt(10);

  // Hash the password and store it in database
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparing entered password with stored password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  // Returns true if passwords match, otherwise false
  return bcrypt.compare(enteredPassword, this.password);
};

// Exporting the model
module.exports = mongoose.model("User", UserSchema);
