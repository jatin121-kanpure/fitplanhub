// Import mongoose
const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using URI from .env
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);

    // Stop the server if DB connection fails
    process.exit(1);
  }
};

// Export function
module.exports = connectDB;
