import mongoose from "mongoose";

const UserTaskSchema = new mongoose.Schema(
  {
    // Connection to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Task details
    taskTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    taskDescription: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // Categorization
    category: {
      type: String,
      required: true,
      enum: [
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
      ],
      default: "academic_studies",
    },

    subCategory: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    // Priority and importance
    priorityLevel: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },

    difficultyLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    // Time planning
    estimatedDurationInMinutes: {
      type: Number,
      min: 0,
      default: 60, // 1 hour default
    },

    plannedStartDate: {
      type: Date,
    },

    plannedEndDate: {
      type: Date,
    },

    deadlineDate: {
      type: Date,
    },

    // Task lifecycle
    taskStatus: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "paused",
        "completed",
        "deferred",
        "cancelled",
      ],
      default: "not_started",
    },

    actualStartDate: {
      type: Date,
    },

    actualCompletionDate: {
      type: Date,
    },

    // Progress tracking
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Tags for organization
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 30,
      },
    ],

    // Subject/Course association (for students)
    subject: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    courseCode: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    // Energy & focus requirements
    requiredFocusLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    energyRequirement: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    // Productivity metrics (calculated fields)
    productivityMetrics: {
      totalTimeSpentInMinutes: {
        type: Number,
        default: 0,
      },
      effectiveProductiveTime: {
        type: Number,
        default: 0,
      },
      averageFocusScore: {
        type: Number,
        max: 5,
        default: 0,
      },
      completionEfficiency: {
        type: Number, // actual_time / estimated_time
        default: 0,
      },
      interruptionsCount: {
        type: Number,
        default: 0,
      },
      estimatedAccuracy: {
        type: Number, // percentage difference
        default: 0,
      },
    },

    // Recurring tasks
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrencePattern: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "custom"],
      },
      interval: Number, // Every X days/weeks/months
      daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
      occurrences: Number, // Total number of occurrences
      nextOccurrenceDate: Date,
    },

    // Parent-child relationship for complex tasks
    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTask",
    },

    isSubtask: {
      type: Boolean,
      default: false,
    },

    subtasks: [
      {
        title: String,
        completed: Boolean,
        estimatedTime: Number,
      },
    ],

    // External references
    externalReferences: {
      googleCalendarEventId: String,
      notionPageId: String,
      trelloCardId: String,
      otherPlatformId: String,
    },

    // Notes and attachments
    notes: [
      {
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: Date,
      },
    ],

    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Rating and feedback
    userRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    feedback: {
      whatWentWell: String,
      challengesFaced: String,
      learnings: String,
      improvementsForNextTime: String,
    },

    // Metadata
    metadata: {
      createdVia: {
        type: String,
        enum: ["manual", "import", "template", "recurrence", "other"],
        default: "manual",
      },
      lastActivityAt: Date,
      streakCount: {
        type: Number,
        default: 0,
      },
      completionStreak: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for time entries (relationship with TimeEntry model)
UserTaskSchema.virtual("timeEntries", {
  ref: "TimeEntry",
  localField: "_id",
  foreignField: "taskId",
  justOne: false,
});

// Virtual for elapsed days since creation
UserTaskSchema.virtual("daysSinceCreation").get(function () {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days until deadline
UserTaskSchema.virtual("daysUntilDeadline").get(function () {
  if (!this.deadlineDate) return null;
  const now = new Date();
  const deadline = new Date(this.deadlineDate);
  const diffTime = deadline - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for overdue status
UserTaskSchema.virtual("isOverdue").get(function () {
  if (!this.deadlineDate || this.taskStatus === "completed") return false;
  const now = new Date();
  const deadline = new Date(this.deadlineDate);
  return now > deadline;
});

// Calculate completion efficiency before saving
UserTaskSchema.pre("save", function (next) {
  // Calculate completion efficiency if we have both estimated and actual time
  if (
    this.productivityMetrics.totalTimeSpentInMinutes > 0 &&
    this.estimatedDurationInMinutes > 0
  ) {
    this.productivityMetrics.completionEfficiency =
      (this.estimatedDurationInMinutes /
        this.productivityMetrics.totalTimeSpentInMinutes) *
      100;
  }

  // Calculate estimation accuracy
  if (
    this.estimatedDurationInMinutes > 0 &&
    this.productivityMetrics.totalTimeSpentInMinutes > 0
  ) {
    const difference = Math.abs(
      this.productivityMetrics.totalTimeSpentInMinutes -
        this.estimatedDurationInMinutes
    );
    this.productivityMetrics.estimatedAccuracy =
      ((this.estimatedDurationInMinutes - difference) /
        this.estimatedDurationInMinutes) *
      100;
  }

  // Update last activity timestamp
  this.metadata.lastActivityAt = new Date();

  next();
});

// Method to update progress
UserTaskSchema.methods.updateProgress = async function (progressData) {
  const {
    timeSpentInMinutes = 0,
    focusScore,
    isCompleted = false,
    userRating,
    feedback,
  } = progressData;

  // Update time spent
  this.productivityMetrics.totalTimeSpentInMinutes += timeSpentInMinutes;

  // Update average focus score
  if (focusScore !== undefined) {
    const currentTotal =
      this.productivityMetrics.averageFocusScore *
      (this.productivityMetrics.interruptionsCount || 1);
    this.productivityMetrics.interruptionsCount =
      (this.productivityMetrics.interruptionsCount || 0) + 1;
    this.productivityMetrics.averageFocusScore =
      (currentTotal + focusScore) / this.productivityMetrics.interruptionsCount;
  }

  // Update rating and feedback
  if (userRating !== undefined) this.userRating = userRating;
  if (feedback !== undefined) this.feedback = { ...this.feedback, ...feedback };

  // Update status if completed
  if (isCompleted) {
    this.taskStatus = "completed";
    this.actualCompletionDate = new Date();
    this.completionPercentage = 100;

    // Update streak
    if (this.metadata.completionStreak !== undefined) {
      this.metadata.completionStreak += 1;
    }
  }

  return this.save();
};

// Method to calculate productivity score
UserTaskSchema.methods.getProductivityScore = function () {
  const {
    completionPercentage,
    productivityMetrics: {
      averageFocusScore = 3,
      completionEfficiency = 100,
      estimatedAccuracy = 100,
    },
  } = this;

  // Weighted scoring system
  const completionWeight = 0.4;
  const focusWeight = 0.3;
  const efficiencyWeight = 0.2;
  const accuracyWeight = 0.1;

  const score =
    ((completionPercentage / 100) * completionWeight +
      (averageFocusScore / 5) * focusWeight +
      (Math.min(completionEfficiency, 200) / 200) * efficiencyWeight +
      (estimatedAccuracy / 100) * accuracyWeight) *
    100;

  return Math.round(score);
};

// Method to check if task should be done today
UserTaskSchema.methods.isDueToday = function () {
  if (!this.deadlineDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(this.deadlineDate);
  deadline.setHours(0, 0, 0, 0);

  return today.getTime() === deadline.getTime();
};

// Method to get task urgency score (1-10)
UserTaskSchema.methods.getUrgencyScore = function () {
  let score = 0;

  // Priority level contribution
  const priorityScores = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  score += priorityScores[this.priorityLevel] || 0;

  // Days until deadline contribution
  if (this.deadlineDate) {
    const daysUntil = this.daysUntilDeadline;
    if (daysUntil <= 0) {
      score += 4; // Overdue
    } else if (daysUntil <= 1) {
      score += 3; // Due tomorrow
    } else if (daysUntil <= 3) {
      score += 2; // Due in 3 days
    } else if (daysUntil <= 7) {
      score += 1; // Due in a week
    }
  }

  // Status contribution
  if (this.taskStatus === "in_progress") {
    score += 2;
  } else if (this.taskStatus === "not_started") {
    score += 1;
  }

  return Math.min(score, 10);
};

// Static method to get user's tasks summary
UserTaskSchema.statics.getUserTaskSummary = async function (userId) {
  const tasks = await this.find({ userId });

  const summary = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.taskStatus === "completed").length,
    inProgressTasks: tasks.filter((t) => t.taskStatus === "in_progress").length,
    notStartedTasks: tasks.filter((t) => t.taskStatus === "not_started").length,
    overdueTasks: tasks.filter((t) => t.isOverdue).length,

    totalEstimatedTime: tasks.reduce(
      (sum, task) => sum + (task.estimatedDurationInMinutes || 0),
      0
    ),
    totalActualTime: tasks.reduce(
      (sum, task) =>
        sum + (task.productivityMetrics.totalTimeSpentInMinutes || 0),
      0
    ),

    byCategory: {},
    byPriority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },

    averageProductivityScore: 0,
  };

  // Calculate category distribution
  tasks.forEach((task) => {
    summary.byCategory[task.category] =
      (summary.byCategory[task.category] || 0) + 1;
    summary.byPriority[task.priorityLevel] =
      (summary.byPriority[task.priorityLevel] || 0) + 1;
  });

  // Calculate average productivity score
  const completedTasks = tasks.filter((t) => t.taskStatus === "completed");
  if (completedTasks.length > 0) {
    const totalScore = completedTasks.reduce(
      (sum, task) => sum + task.getProductivityScore(),
      0
    );
    summary.averageProductivityScore = Math.round(
      totalScore / completedTasks.length
    );
  }

  return summary;
};

// Indexes for optimized queries
UserTaskSchema.index({ userId: 1, taskStatus: 1 });
UserTaskSchema.index({ userId: 1, deadlineDate: 1 });
UserTaskSchema.index({ userId: 1, category: 1 });
UserTaskSchema.index({ userId: 1, priorityLevel: 1 });
UserTaskSchema.index({ userId: 1, createdAt: -1 });
UserTaskSchema.index({ userId: 1, "metadata.lastActivityAt": -1 });
UserTaskSchema.index({ userId: 1, isOverdue: 1 });
UserTaskSchema.index({ userId: 1, plannedStartDate: 1 });
UserTaskSchema.index({
  userId: 1,
  isRecurring: 1,
  "recurrencePattern.nextOccurrenceDate": 1,
});

const UserTask = mongoose.model("UserTask", UserTaskSchema);
export default UserTask;
