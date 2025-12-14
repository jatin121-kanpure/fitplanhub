// Import required models
const FitnessPlan = require("../models/FitnessPlan");
const Trainer = require("../models/Trainer");

//  Creating a fitness plan, only trainer can do this

exports.createPlan = async (req, res) => {
  try {
    // 1. Get data sent from frontend
    const { title, description, price, duration, category, exercises } =
      req.body;

    // 2. Find trainer using logged-in user's ID
    // req.userId comes from auth middleware
    const trainer = await Trainer.findOne({ userId: req.userId });

    // 3. If user is not a trainer, stop here
    if (!trainer) {
      return res.status(403).json({
        message: "Only trainers can create plans",
      });
    }

    // 4. Create a new fitness plan
    const plan = new FitnessPlan({
      trainerId: trainer._id, // link plan to trainer
      title,
      description,
      price,
      duration,
      category,
      exercises,
    });

    // 5. Save plan to database
    await plan.save();

    // 6. Store plan ID inside trainer document
    trainer.plans.push(plan._id);
    await trainer.save();

    // 7. Send created plan as response
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all fitness plans with trainer details for users
exports.getAllPlans = async (req, res) => {
  try {
    // 1. Fetch all plans
    // 2. Populate trainer details
    // 3. Also populate trainer's user name
    const plans = await FitnessPlan.find().populate({
      path: "trainerId",
      populate: {
        path: "userId",
        select: "name",
      },
    });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get a specific fitness plan by ID with trainer details
exports.getPlanById = async (req, res) => {
  try {
    // Find plan using ID from URL
    const plan = await FitnessPlan.findById(req.params.id).populate(
      "trainerId"
    );

    // If plan does not exist
    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a fitness plan, only the trainer who owns the plan can do this
exports.updatePlan = async (req, res) => {
  try {
    // 1. Get plan and trainer
    const plan = await FitnessPlan.findById(req.params.id);
    const trainer = await Trainer.findOne({ userId: req.userId });

    // 2. Check ownership
    if (plan.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this plan",
      });
    }

    // 3. Update plan fields
    Object.assign(plan, req.body);
    plan.updatedAt = new Date();

    // 4. Save updated plan
    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete a fitness plan, only the trainer who owns the plan can do this
exports.deletePlan = async (req, res) => {
  try {
    // 1. Find plan and trainer
    const plan = await FitnessPlan.findById(req.params.id);
    const trainer = await Trainer.findOne({ userId: req.userId });

    // 2. Check ownership
    if (plan.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this plan",
      });
    }

    // 3. Delete plan from plans collection
    await FitnessPlan.findByIdAndDelete(req.params.id);

    // 4. Remove plan ID from trainer document
    trainer.plans = trainer.plans.filter((p) => p.toString() !== req.params.id);

    await trainer.save();

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all plans created by the logged-in trainer
exports.getTrainerPlans = async (req, res) => {
  try {
    // Find trainer and load all their plans
    const trainer = await Trainer.findOne({ userId: req.userId }).populate(
      "plans"
    );

    if (!trainer) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    res.json(trainer.plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
