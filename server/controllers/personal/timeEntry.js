import TimeEntry from "../../modal/personalAnalysis/TimeEntry.js";
import userTask from "../../modal/personalAnalysis/UserTask.js";
/**
 * @desc    Create a new time entry
 * @route   POST /api/v1/time-entries
 * @access  Private
 */
export const createTimeEntry = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware

    const {
      taskId,
      title,
      startTimestamp,
      endTimestamp, // Allow endTimestamp for manual entry
      focusScore = 3,
      productivityTags = [],
      additionalNotes = "",
    } = req.body;

    // ... (skipping unchanged lines)

    // Create time entry
    const timeEntry = new TimeEntry({
      userId,
      taskId,
      title: title || undefined, // Save specific title if provided
      startTimestamp: startTimestamp || new Date(),
      endTimestamp: endTimestamp || undefined, // Set end timestamp if provided
      focusScore: Math.round(focusScore),
      productivityTags: Array.isArray(productivityTags)
        ? productivityTags.filter((tag) => typeof tag === "string").slice(0, 10)
        : [],
      additionalNotes: String(additionalNotes).substring(0, 500),
      entryStatus: endTimestamp ? "completed" : "active", // Set status based on endTimestamp
    });

    await timeEntry.save();

    res.status(201).json({
      success: true,
      message: "Time entry started successfully",
      data: {
        timeEntry: {
          id: timeEntry._id,
          taskId: timeEntry.taskId,
          startTimestamp: timeEntry.startTimestamp,
          focusScore: timeEntry.focusScore,
          entryStatus: timeEntry.entryStatus,
          productivityTags: timeEntry.productivityTags,
          estimatedNetTime: timeEntry.getNetProductiveTime(),
        },
      },
    });
  } catch (error) {
    console.error("Create Time Entry Error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Invalid time entry data",
        details: errors,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Duplicate Error",
        message: "Time entry already exists",
      });
    }

    // Handle CastError (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: `Invalid ${error.path}: ${error.value}`,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to create time entry",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Stop/complete an active time entry
 * @route   PUT /api/v1/time-entries/:entryId/stop
 * @access  Private
 */
export const stopTimeEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entryId } = req.params;
    const { endTimestamp, focusScore, additionalNotes } = req.body;

    // Find the time entry
    const timeEntry = await TimeEntry.findOne({
      _id: entryId,
      userId, // Ensure user owns this entry
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Time entry not found",
      });
    }

    // Check if already completed
    if (timeEntry.entryStatus === "completed") {
      return res.status(400).json({
        success: false,
        error: "Already Completed",
        message: "This time entry is already completed",
      });
    }

    // Check if it's paused
    if (timeEntry.entryStatus === "paused") {
      return res.status(400).json({
        success: false,
        error: "Entry Paused",
        message: "Please resume the time entry before stopping it",
      });
    }

    // Update the time entry
    const updateData = {
      endTimestamp: endTimestamp || new Date(),
      entryStatus: "completed",
    };

    // Update focus score if provided
    if (focusScore !== undefined) {
      if (focusScore < 1 || focusScore > 5) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "Focus score must be between 1 and 5",
        });
      }
      updateData.focusScore = Math.round(focusScore);
    }

    // Update notes if provided
    if (additionalNotes !== undefined) {
      updateData.additionalNotes = String(additionalNotes).substring(0, 500);
    }

    const updatedEntry = await TimeEntry.findByIdAndUpdate(
      entryId,
      updateData,
      { new: true, runValidators: true }
    );

    // Calculate net productive time
    const netProductiveTime = updatedEntry.getNetProductiveTime();

    res.json({
      success: true,
      message: "Time entry stopped successfully",
      data: {
        timeEntry: {
          id: updatedEntry._id,
          taskId: updatedEntry.taskId,
          startTimestamp: updatedEntry.startTimestamp,
          endTimestamp: updatedEntry.endTimestamp,
          durationInMinutes: updatedEntry.durationInMinutes,
          netProductiveTime,
          focusScore: updatedEntry.focusScore,
          entryStatus: updatedEntry.entryStatus,
          interruptionsCount: updatedEntry.interruptionLogs?.length || 0,
        },
        summary: {
          totalTime: updatedEntry.durationInMinutes,
          productiveTime: netProductiveTime,
          efficiency:
            updatedEntry.durationInMinutes > 0
              ? (netProductiveTime / updatedEntry.durationInMinutes).toFixed(2)
              : 0,
        },
      },
    });
  } catch (error) {
    console.error("Stop Time Entry Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Invalid time entry ID",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to stop time entry",
    });
  }
};

/**
 * @desc    Get all time entries for the authenticated user
 * @route   GET /api/v1/time-entries
 * @access  Private
 */
export const getUserTimeEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      startDate,
      endDate,
      taskId,
      category,
      minFocusScore,
      includeInterruptions = false,
      limit = 50,
      page = 1,
      sortBy = "startTimestamp",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = { userId };

    // Date range filter
    if (startDate || endDate) {
      query.startTimestamp = {};
      if (startDate) {
        query.startTimestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startTimestamp.$lte = new Date(endDate);
      }
    }

    // Task filter
    if (taskId) {
      query.taskId = taskId;
    }

    // Focus score filter
    if (minFocusScore) {
      query.focusScore = { $gte: parseInt(minFocusScore) };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const timeEntries = await TimeEntry.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("taskId", "taskTitle category") // Populate task details if needed
      .lean();

    // Get total count for pagination metadata
    const total = await TimeEntry.countDocuments(query);

    // Process time entries
    const processedEntries = timeEntries.map((entry) => ({
      id: entry._id,
      taskId: entry.taskId,
      taskTitle:
        entry.title ||
        entry.taskId?.taskTitle ||
        entry.additionalNotes ||
        "Untitled Task",
      category: entry.taskId?.category,
      startTimestamp: entry.startTimestamp,
      endTimestamp: entry.endTimestamp,
      durationInMinutes: entry.durationInMinutes,
      focusScore: entry.focusScore,
      entryStatus: entry.entryStatus,
      productivityTags: entry.productivityTags,
      additionalNotes: entry.additionalNotes,
      interruptionCount: entry.interruptionLogs?.length || 0,
      netProductiveTime: includeInterruptions
        ? entry.durationInMinutes -
          (entry.interruptionLogs?.reduce(
            (sum, i) => sum + (i.durationInMinutes || 0),
            0
          ) || 0)
        : undefined,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));

    res.json({
      success: true,
      data: processedEntries,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + timeEntries.length < total,
      },
    });
  } catch (error) {
    console.error("Get Time Entries Error:", error);

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch time entries",
    });
  }
};

/**
 * @desc    Get currently active time entry
 * @route   GET /api/v1/time-entries/current
 * @access  Private
 */
export const getActiveTimeEntry = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeEntry = await TimeEntry.findOne({
      userId,
      entryStatus: "active",
    }).populate("taskId", "taskTitle category priority");

    if (!activeEntry) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "No active time entry found",
      });
    }

    // Calculate elapsed time
    const now = new Date();
    const elapsedMs = now - activeEntry.startTimestamp;
    const elapsedMinutes = Math.round(elapsedMs / 60000);

    res.json({
      success: true,
      data: {
        id: activeEntry._id,
        task: {
          id: activeEntry.taskId?._id,
          id: activeEntry.taskId?._id,
          title:
            activeEntry.title ||
            activeEntry.taskId?.taskTitle ||
            activeEntry.additionalNotes ||
            "Untitled Task",
          category: activeEntry.taskId?.category,
          priority: activeEntry.taskId?.priority,
        },
        startTimestamp: activeEntry.startTimestamp,
        elapsedMinutes,
        focusScore: activeEntry.focusScore,
        productivityTags: activeEntry.productivityTags,
        additionalNotes: activeEntry.additionalNotes,
        interruptionLogs: activeEntry.interruptionLogs,
      },
    });
  } catch (error) {
    console.error("Get Active Time Entry Error:", error);

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch active time entry",
    });
  }
};

/**
 * @desc    Log an interruption for a time entry
 * @route   POST /api/v1/time-entries/:entryId/interruptions
 * @access  Private
 */
export const logInterruption = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entryId } = req.params;
    const {
      reason,
      startTimestamp,
      endTimestamp,
      durationInMinutes,
      wasNecessary = false,
    } = req.body;

    // Validate required fields
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Interruption reason is required",
      });
    }

    // Find the time entry
    const timeEntry = await TimeEntry.findOne({
      _id: entryId,
      userId,
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Time entry not found",
      });
    }

    // Check if time entry is active
    if (timeEntry.entryStatus !== "active") {
      return res.status(400).json({
        success: false,
        error: "Invalid Operation",
        message: "Can only log interruptions for active time entries",
      });
    }

    // Create interruption log
    const interruption = {
      reason: String(reason).substring(0, 200),
      startTimestamp: startTimestamp || new Date(),
      endTimestamp: endTimestamp || new Date(),
      durationInMinutes: durationInMinutes || 0,
      wasNecessary,
    };

    // If startTimestamp but no endTimestamp, set duration to 0 (ongoing)
    if (startTimestamp && !endTimestamp) {
      interruption.durationInMinutes = 0;
    }

    // Add interruption to time entry
    timeEntry.interruptionLogs.push(interruption);
    await timeEntry.save();

    res.status(201).json({
      success: true,
      message: "Interruption logged successfully",
      data: {
        interruptionId:
          timeEntry.interruptionLogs[timeEntry.interruptionLogs.length - 1]._id,
        reason: interruption.reason,
        durationInMinutes: interruption.durationInMinutes,
        wasNecessary: interruption.wasNecessary,
        totalInterruptions: timeEntry.interruptionLogs.length,
      },
    });
  } catch (error) {
    console.error("Log Interruption Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Invalid interruption data",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to log interruption",
    });
  }
};

/**
 * @desc    Update a time entry
 * @route   PUT /api/v1/time-entries/:entryId
 * @access  Private
 */
export const updateTimeEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entryId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    // title is allowed to stay in updateData

    // Validate focus score if being updated
    if (updateData.focusScore !== undefined) {
      if (updateData.focusScore < 1 || updateData.focusScore > 5) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "Focus score must be between 1 and 5",
        });
      }
      updateData.focusScore = Math.round(updateData.focusScore);
    }

    // Validate productivity tags
    if (updateData.productivityTags !== undefined) {
      if (!Array.isArray(updateData.productivityTags)) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "Productivity tags must be an array",
        });
      }
      updateData.productivityTags = updateData.productivityTags
        .filter((tag) => typeof tag === "string")
        .slice(0, 10);
    }

    // Find and update the time entry
    const timeEntry = await TimeEntry.findOneAndUpdate(
      { _id: entryId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Time entry not found",
      });
    }

    res.json({
      success: true,
      message: "Time entry updated successfully",
      data: {
        timeEntry: {
          id: timeEntry._id,
          taskId: timeEntry.taskId,
          startTimestamp: timeEntry.startTimestamp,
          endTimestamp: timeEntry.endTimestamp,
          durationInMinutes: timeEntry.durationInMinutes,
          focusScore: timeEntry.focusScore,
          entryStatus: timeEntry.entryStatus,
          productivityTags: timeEntry.productivityTags,
          additionalNotes: timeEntry.additionalNotes,
        },
      },
    });
  } catch (error) {
    console.error("Update Time Entry Error:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Invalid update data",
        details: errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Invalid time entry ID",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to update time entry",
    });
  }
};

/**
 * @desc    Delete a time entry
 * @route   DELETE /api/v1/time-entries/:entryId
 * @access  Private
 */
export const deleteTimeEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entryId } = req.params;

    const timeEntry = await TimeEntry.findOneAndDelete({
      _id: entryId,
      userId,
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Time entry not found",
      });
    }

    res.json({
      success: true,
      message: "Time entry deleted successfully",
      data: {
        deletedEntryId: entryId,
        taskId: timeEntry.taskId,
        durationInMinutes: timeEntry.durationInMinutes,
      },
    });
  } catch (error) {
    console.error("Delete Time Entry Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Invalid time entry ID",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to delete time entry",
    });
  }
};
