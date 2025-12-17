import UserTask from "../../modal/personalAnalysis/UserTask.js";

/**
 * @desc    Create a new user task
 * @route   POST /api/v1/user-tasks
 * @access  Private
 */
export const createUserTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      taskTitle,
      taskDescription,
      category = "academic_studies",
      priorityLevel = "medium",
      estimatedDurationInMinutes = 60,
      deadlineDate,
      tags = [],
      subject,
      courseCode,
      isRecurring = false,
      recurrencePattern,
    } = req.body;

    // Validate required fields
    if (!taskTitle) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Task title is required",
      });
    }

    // Validate category
    const validCategories = [
      "academic_studies",
      "assignment_work",
      "project_development",
      "exam_preparation",
      "research_work",
      "skill_learning",
      "personal_development",
      "health_fitness",
      "social_activities",
      "administrative",
      "other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Invalid task category",
      });
    }

    // Create task
    const userTask = new UserTask({
      userId,
      taskTitle,
      taskDescription,
      category,
      priorityLevel,
      estimatedDurationInMinutes: Math.max(0, estimatedDurationInMinutes),
      deadlineDate: deadlineDate ? new Date(deadlineDate) : null,
      tags: Array.isArray(tags)
        ? tags.filter((tag) => typeof tag === "string").slice(0, 10)
        : [],
      subject,
      courseCode,
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : undefined,
      taskStatus: "not_started",
      productivityMetrics: {
        totalTimeSpentInMinutes: 0,
        effectiveProductiveTime: 0,
        averageFocusScore: 0,
        completionEfficiency: 0,
        interruptionsCount: 0,
        estimatedAccuracy: 0,
      },
    });

    await userTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          id: userTask._id,
          title: userTask.taskTitle,
          category: userTask.category,
          priority: userTask.priorityLevel,
          estimatedDuration: userTask.estimatedDurationInMinutes,
          status: userTask.taskStatus,
          deadline: userTask.deadlineDate,
          isOverdue: userTask.isOverdue,
          daysUntilDeadline: userTask.daysUntilDeadline,
          createdAt: userTask.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Create User Task Error:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Invalid task data",
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to create task",
    });
  }
};

/**
 * @desc    Get user's tasks with filters
 * @route   GET /api/v1/user-tasks
 * @access  Private
 */
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      status,
      category,
      priority,
      overdue,
      dueToday,
      search,
      limit = 20,
      page = 1,
      sortBy = "deadlineDate",
      sortOrder = "asc",
    } = req.query;

    // Build query
    const query = { userId };

    // Status filter
    if (status) {
      query.taskStatus = status;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Priority filter
    if (priority) {
      query.priorityLevel = priority;
    }

    // Overdue filter
    if (overdue === "true") {
      const now = new Date();
      query.deadlineDate = { $lt: now };
      query.taskStatus = { $ne: "completed" };
    }

    // Due today filter
    if (dueToday === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      query.deadlineDate = {
        $gte: today,
        $lt: tomorrow,
      };
    }

    // Search filter
    if (search) {
      query.$or = [
        { taskTitle: { $regex: search, $options: "i" } },
        { taskDescription: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const tasks = await UserTask.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await UserTask.countDocuments(query);

    // Process tasks with virtuals
    const processedTasks = tasks.map((task) => ({
      id: task._id,
      title: task.taskTitle,
      description: task.taskDescription,
      category: task.category,
      priority: task.priorityLevel,
      status: task.taskStatus,
      estimatedDuration: task.estimatedDurationInMinutes,
      actualDuration: task.productivityMetrics.totalTimeSpentInMinutes,
      deadline: task.deadlineDate,
      isOverdue:
        new Date(task.deadlineDate) < new Date() &&
        task.taskStatus !== "completed",
      daysUntilDeadline: task.deadlineDate
        ? Math.ceil(
            (new Date(task.deadlineDate) - new Date()) / (1000 * 60 * 60 * 24)
          )
        : null,
      completionPercentage: task.completionPercentage,
      tags: task.tags,
      subject: task.subject,
      productivityScore: task.productivityMetrics.averageFocusScore,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    // Get summary statistics
    const summary = await UserTask.getUserTaskSummary(userId);

    res.json({
      success: true,
      data: {
        tasks: processedTasks,
        summary,
      },
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + tasks.length < total,
      },
    });
  } catch (error) {
    console.error("Get User Tasks Error:", error);

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch tasks",
    });
  }
};

/**
 * @desc    Update a user task
 * @route   PUT /api/v1/user-tasks/:taskId
 * @access  Private
 */
export const updateUserTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const updateData = req.body;

    // Remove restricted fields
    delete updateData._id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.productivityMetrics; // Can't update metrics directly

    // Find and update task
    const task = await UserTask.findOneAndUpdate(
      { _id: taskId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: {
        task: {
          id: task._id,
          title: task.taskTitle,
          status: task.taskStatus,
          priority: task.priorityLevel,
          deadline: task.deadlineDate,
          completionPercentage: task.completionPercentage,
          isOverdue: task.isOverdue,
        },
      },
    });
  } catch (error) {
    console.error("Update User Task Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Invalid update data",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Invalid task ID",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to update task",
    });
  }
};

/**
 * @desc    Update task progress (time spent, focus, completion)
 * @route   PUT /api/v1/user-tasks/:taskId/progress
 * @access  Private
 */
export const updateTaskProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const {
      timeSpentInMinutes,
      focusScore,
      isCompleted,
      userRating,
      feedback,
    } = req.body;

    // Find task
    const task = await UserTask.findOne({
      _id: taskId,
      userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Task not found",
      });
    }

    // Update progress using the model method
    await task.updateProgress({
      timeSpentInMinutes: timeSpentInMinutes || 0,
      focusScore,
      isCompleted: isCompleted || false,
      userRating,
      feedback,
    });

    // Re-fetch to get updated data
    const updatedTask = await UserTask.findById(taskId);

    res.json({
      success: true,
      message: "Task progress updated successfully",
      data: {
        task: {
          id: updatedTask._id,
          title: updatedTask.taskTitle,
          status: updatedTask.taskStatus,
          completionPercentage: updatedTask.completionPercentage,
          totalTimeSpent:
            updatedTask.productivityMetrics.totalTimeSpentInMinutes,
          averageFocusScore: updatedTask.productivityMetrics.averageFocusScore,
          productivityScore: updatedTask.getProductivityScore(),
          isCompleted: updatedTask.taskStatus === "completed",
        },
      },
    });
  } catch (error) {
    console.error("Update Task Progress Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Invalid task ID",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to update task progress",
    });
  }
};

/**
 * @desc    Get task analytics and insights
 * @route   GET /api/v1/user-tasks/:taskId/analytics
 * @access  Private
 */
export const getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const task = await UserTask.findOne({
      _id: taskId,
      userId,
    }).populate("timeEntries");

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Task not found",
      });
    }

    // Calculate various analytics
    const analytics = {
      basicMetrics: {
        estimatedDuration: task.estimatedDurationInMinutes,
        actualDuration: task.productivityMetrics.totalTimeSpentInMinutes,
        completionPercentage: task.completionPercentage,
        averageFocusScore: task.productivityMetrics.averageFocusScore,
        productivityScore: task.getProductivityScore(),
        efficiency: task.productivityMetrics.completionEfficiency,
        estimationAccuracy: task.productivityMetrics.estimatedAccuracy,
      },

      timeAnalysis: {
        daysSinceCreation: task.daysSinceCreation,
        daysUntilDeadline: task.daysUntilDeadline,
        isOverdue: task.isOverdue,
        urgencyScore: task.getUrgencyScore(),
      },

      performanceInsights: {
        // Compare estimated vs actual
        timeDifference:
          task.productivityMetrics.totalTimeSpentInMinutes -
          task.estimatedDurationInMinutes,
        timeDifferencePercentage:
          task.estimatedDurationInMinutes > 0
            ? ((task.productivityMetrics.totalTimeSpentInMinutes -
                task.estimatedDurationInMinutes) /
                task.estimatedDurationInMinutes) *
              100
            : 0,

        // Focus consistency
        focusConsistency:
          task.productivityMetrics.averageFocusScore >= 3.5
            ? "good"
            : task.productivityMetrics.averageFocusScore >= 2.5
            ? "average"
            : "needs_improvement",

        // Efficiency rating
        efficiencyRating:
          task.productivityMetrics.completionEfficiency > 120
            ? "excellent"
            : task.productivityMetrics.completionEfficiency > 90
            ? "good"
            : task.productivityMetrics.completionEfficiency > 70
            ? "average"
            : "below_average",
      },

      recommendations: [],
    };

    // Generate recommendations based on analytics
    if (
      task.productivityMetrics.totalTimeSpentInMinutes >
      task.estimatedDurationInMinutes * 1.5
    ) {
      analytics.recommendations.push({
        type: "time_management",
        message:
          "This task is taking significantly longer than estimated. Consider breaking it down into smaller subtasks.",
        priority: "high",
      });
    }

    if (task.productivityMetrics.averageFocusScore < 2.5) {
      analytics.recommendations.push({
        type: "focus_improvement",
        message:
          "Low focus scores detected. Try working in focused time blocks with fewer distractions.",
        priority: "medium",
      });
    }

    if (task.isOverdue && task.taskStatus !== "completed") {
      analytics.recommendations.push({
        type: "deadline_management",
        message:
          "Task is overdue. Consider renegotiating the deadline or prioritizing this task.",
        priority: "critical",
      });
    }

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get Task Analytics Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Invalid task ID",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch task analytics",
    });
  }
};

/**
 * @desc    Delete a user task
 * @route   DELETE /api/v1/user-tasks/:taskId
 * @access  Private
 */
export const deleteUserTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const task = await UserTask.findOneAndDelete({
      _id: taskId,
      userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Invalid task ID",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to delete task",
    });
  }
};
