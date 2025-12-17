import ProductivityGoal from "../../modal/personalAnalysis/ProductivityGoal.js";

/**
 * @desc    Create a new productivity goal
 * @route   POST /api/v1/productivity-goals
 * @access  Private
 */
export const createProductivityGoal = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      goalTitle,
      goalDescription,
      goalType,
      targetMetrics,
      goalPeriod,
      priorityLevel = "medium",
      motivationNotes,
    } = req.body;

    const productivityGoal = new ProductivityGoal({
      userId,
      goalTitle,
      goalDescription,
      goalType,
      targetMetrics,
      goalPeriod,
      priorityLevel,
      motivationNotes,
      progressData: {
        completionPercentage: 0,
        dailyProgress: [],
        lastUpdated: new Date(),
      },
    });

    await productivityGoal.save();

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: productivityGoal,
    });
  } catch (error) {
    console.error("Create Goal Error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to create goal",
    });
  }
};

/**
 * @desc    Get user's productivity goals
 * @route   GET /api/v1/productivity-goals
 * @access  Private
 */
export const getProductivityGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const query = { userId };
    if (status) query.goalStatus = status;

    const goals = await ProductivityGoal.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error("Get Goals Error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch goals",
    });
  }
};

/**
 * @desc    Update goal progress
 * @route   PUT /api/v1/productivity-goals/:id/progress
 * @access  Private
 */
export const updateGoalProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { newValue, notes } = req.body;

    const goal = await ProductivityGoal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Goal not found",
      });
    }

    await goal.updateProgress(newValue, notes);

    res.json({
      success: true,
      message: "Progress updated",
      data: goal,
    });
  } catch (error) {
    console.error("Update Progress Error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to update progress",
    });
  }
};
