// Import required models
const User = require("../models/User");
const Trainer = require("../models/Trainer");

//Follow a trainer
exports.followTrainer = async (req, res) => {
  try {
    // 1. Get trainer ID from request body
    const { trainerId } = req.body;

    // 2. Find logged-in user
    const user = await User.findById(req.userId);

    // 3. Find trainer to follow
    const trainer = await Trainer.findById(trainerId);

    // 4. If trainer does not exist
    if (!trainer) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    // 5. Check if user already follows this trainer
    const trainerIdStr = trainerId.toString();
    if (!user.followedTrainers.some((id) => id.toString() === trainerIdStr)) {
      // Add trainer to user's followed list
      user.followedTrainers.push(trainerId);

      // Add user to trainer's followers list
      trainer.followers.push(req.userId);

      // 6. Save changes in both collections
      await user.save();
      await trainer.save();
    }

    res.json({ message: "Trainer followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Unfollow a trainer
exports.unfollowTrainer = async (req, res) => {
  try {
    // 1. Get trainer ID from request body
    const { trainerId } = req.body;

    // 2. Find logged-in user
    const user = await User.findById(req.userId);

    // 3. Find trainer
    const trainer = await Trainer.findById(trainerId);

    // 4. Remove trainer from user's followed list
    const trainerIdStr = trainerId.toString();
    user.followedTrainers = user.followedTrainers.filter(
      (id) => id.toString() !== trainerIdStr
    );

    // 5. Remove user from trainer's followers list
    trainer.followers = trainer.followers.filter(
      (f) => f.toString() !== req.userId.toString()
    );

    // 6. Save updated data
    await user.save();
    await trainer.save();

    res.json({ message: "Trainer unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    // Fetch all trainers
    // Populate:
    // user name from User collection
    // fitness plans created by trainer
    const trainers = await Trainer.find()
      .populate("userId", "name")
      .populate("plans");

    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get Trainer by ID
exports.getTrainerById = async (req, res) => {
  try {
    // Get trainer ID from URL params
    const trainer = await Trainer.findById(req.params.id)
      .populate("userId", "name")
      .populate("plans");

    // If trainer not found
    if (!trainer) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
