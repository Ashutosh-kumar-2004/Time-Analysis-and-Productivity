import DailyCheckIn from "../../modal/personalAnalysis/DailyCheckIn.js";

/**
 * @desc    Create or update daily check-in
 * @route   POST /api/v1/daily-check-in
 * @access  Private
 */
export const createDailyCheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      priorities,
      energyLevel,
      moodLevel,
      stressLevel,
      focusAreas,
      motivation,
    } = req.body;

    // Check if check-in already exists for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let checkIn = await DailyCheckIn.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (checkIn) {
      // Update existing
      checkIn.priorities = priorities;
      checkIn.energyLevel = energyLevel;
      checkIn.moodLevel = moodLevel;
      checkIn.stressLevel = stressLevel;
      checkIn.focusAreas = focusAreas;
      checkIn.motivation = motivation;

      await checkIn.save();
      return res.status(200).json({
        success: true,
        message: "Daily check-in updated successfully",
        data: checkIn,
      });
    }

    // Create new
    checkIn = await DailyCheckIn.create({
      userId,
      priorities,
      energyLevel,
      moodLevel,
      stressLevel,
      focusAreas,
      motivation,
    });

    res.status(201).json({
      success: true,
      message: "Daily check-in created successfully",
      data: checkIn,
    });
  } catch (error) {
    console.error("Create Daily Check-In Error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to save daily check-in",
    });
  }
};

/**
 * @desc    Get check-in for today
 * @route   GET /api/v1/daily-check-in/today
 * @access  Private
 */
export const getTodayCheckIn = async (req, res) => {
  try {
    const userId = req.user.id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const checkIn = await DailyCheckIn.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!checkIn) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: checkIn,
    });
  } catch (error) {
    console.error("Get Daily Check-In Error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch daily check-in",
    });
  }
};

/**
 * @desc    Get check-in history
 * @route   GET /api/v1/daily-check-in/history
 * @access  Private
 */
export const getCheckInHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 7, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const history = await DailyCheckIn.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DailyCheckIn.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: history,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get Check-In History Error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch check-in history",
    });
  }
};
