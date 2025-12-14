// Import required models
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const FitnessPlan = require("../models/FitnessPlan");

//Subscribe to a fitness plan
exports.subscribeToPlan = async (req, res) => {
  try {
    // 1️. Get plan ID from request body
    const { planId } = req.body;

    // 2️. Check if user is already subscribed to this plan
    let subscription = await Subscription.findOne({
      userId: req.userId,
      planId,
      status: "active", // only active subscriptions
    });

    if (subscription) {
      return res
        .status(400)
        .json({ message: "Already subscribed to this plan" });
    }

    // 3️. Check if plan exists
    const plan = await FitnessPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // 4️. Create a new subscription
    // Here we simulate payment by setting expiry date to 30 days from now
    subscription = new Subscription({
      userId: req.userId,
      planId,
      price: plan.price,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await subscription.save();

    // 5️. Add subscription ID to user's document
    const user = await User.findById(req.userId);
    user.subscriptions.push(subscription._id);
    await user.save();

    // 6️. Respond with subscription details
    res.status(201).json({
      message: "Successfully subscribed",
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get User's Subscriptions
exports.getUserSubscriptions = async (req, res) => {
  try {
    // Find all subscriptions for the logged-in user
    // Populate plan info → trainer info → trainer's name
    const subscriptions = await Subscription.find({ userId: req.userId })
      .populate("planId")
      .populate({
        path: "planId",
        populate: {
          path: "trainerId",
          populate: {
            path: "userId",
            select: "name", // get trainer name
          },
        },
      });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user has access to a specific plan
exports.checkAccess = async (req, res) => {
  try {
    // 1️. Get plan ID from URL params
    const { planId } = req.params;

    // 2️. Check if user has an active subscription
    const subscription = await Subscription.findOne({
      userId: req.userId,
      planId,
      status: "active",
    });

    // 3️. Respond with boolean
    res.json({ hasAccess: !!subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
