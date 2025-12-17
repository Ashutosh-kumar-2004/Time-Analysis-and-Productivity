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
      date, // Extract date
    } = req.body;

    // Use provided date or default to now
    const targetDate = date ? new Date(date) : new Date();

    // Check if check-in already exists for target date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
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
      date: targetDate, // Save the specific date
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
    const { date } = req.query; // Support optional date param

    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
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
    const { limit = 7, page = 1, startDate, endDate } = req.query;

    const query = { userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const history = await DailyCheckIn.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DailyCheckIn.countDocuments(query);

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
