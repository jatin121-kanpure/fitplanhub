// Import required models
const FitnessPlan = require("../models/FitnessPlan");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Trainer = require("../models/Trainer");

//Get personalized feed for Logged-in User
exports.getPersonalizedFeed = async (req, res) => {
  try {
    // 1. Find the logged-in user and load followed trainers
    const user = await User.findById(req.userId).populate("followedTrainers");

    // 2. If user is not following anyone, return empty feed
    if (!user.followedTrainers.length) {
      return res.json([]);
    }

    // 3. Get IDs of followed trainers
    const trainerIds = user.followedTrainers.map((t) => t._id);

    // 4. Get plans created by these trainers
    // Populate trainer info → trainer's user name
    const plans = await FitnessPlan.find({ trainerId: { $in: trainerIds } })
      .populate({
        path: "trainerId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ createdAt: -1 }); // newest first

    // 5. Get all active subscriptions of the user
    const userSubscriptions = await Subscription.find({
      userId: req.userId,
      status: "active",
    });

    const subscribedPlanIds = userSubscriptions.map((s) => s.planId.toString());

    // 6. Add subscription info to each plan
    const feedWithAccess = plans.map((plan) => ({
      ...plan.toObject(),
      isSubscribed: subscribedPlanIds.includes(plan._id.toString()), // true/false
    }));

    // 7. Return personalized feed
    res.json(feedWithAccess);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
