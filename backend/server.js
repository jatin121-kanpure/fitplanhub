// Import Dependencies
const express = require("express"); // Express framework
const cors = require("cors"); // Enable cross-origin requests
require("dotenv").config(); // Load environment variables from .env
const connectDB = require("./config/db"); // MongoDB connection function

//Initialize Express app
const app = express();

// Connects to MongoDB using MONGODB_URI from .env
connectDB();

// MIDDLEWARE
app.use(cors()); // Allow requests from different origins (frontend)
app.use(express.json()); // Parse JSON data in request bodies

// ROUTES
app.use("/api/auth", require("./routes/auth")); // Auth routes (login/register)
app.use("/api/plans", require("./routes/plans")); // Plans routes
app.use("/api/trainers", require("./routes/trainers")); // Trainers routes
app.use("/api/subscriptions", require("./routes/subscriptions")); // Subscription routes
app.use("/api/feed", require("./routes/feed")); // Personalized feed routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
