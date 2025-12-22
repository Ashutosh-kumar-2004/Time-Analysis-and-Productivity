import mongoose from "mongoose";

const ProductivityGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goalTitle: {
      type: String,
      required: true,
      trim: true,
    },
    goalDescription: {
      type: String,
      trim: true,
    },
    goalType: {
      type: String,
      enum: [
        "time_allocation",
        "task_completion",
        "focus_improvement",
        "efficiency_gain",
        "habit_formation",
        "category_balance",
      ],
      required: true,
    },

    // Goal Parameters
    targetMetrics: {
      metricName: String,
      targetValue: Number,
      currentValue: { type: Number, default: 0 },
      unit: String,
    },

    // Time Frame
    goalPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      periodType: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "custom"],
        required: true,
      },
    },

    // Progress Tracking
    progressData: {
      completionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      dailyProgress: [
        {
          date: Date,
          value: Number,
          notes: String,
        },
      ],
      lastUpdated: Date,
    },

    // Success Criteria
    successThreshold: {
      type: Number, // percentage to consider goal achieved
      default: 80,
    },

    goalStatus: {
      type: String,
      enum: [
        "active",
        "completed",
        "behind_schedule",
        "ahead_of_schedule",
        "abandoned",
      ],
      default: "active",
    },

    // Related Categories/Tasks
    relatedCategories: [String],
    priorityLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Motivation & Rewards
    motivationNotes: {
      type: String,
      trim: true,
    },
    rewardDescription: {
      type: String,
      trim: true,
    },

    // Review & Reflection
    weeklyReviews: [
      {
        reviewDate: Date,
        progressScore: Number,
        challenges: [String],
        adjustments: [String],
        confidenceLevel: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate progress before saving
ProductivityGoalSchema.pre("save", function (next) {
  if (this.targetMetrics.currentValue && this.targetMetrics.targetValue) {
    this.progressData.completionPercentage =
      (this.targetMetrics.currentValue / this.targetMetrics.targetValue) * 100;

    // Update goal status based on progress
    if (this.progressData.completionPercentage >= this.successThreshold) {
      this.goalStatus = "completed";
    } else if (
      this.progressData.completionPercentage < 50 &&
      new Date() > new Date(this.goalPeriod.startDate)
    ) {
      this.goalStatus = "behind_schedule";
    } else if (this.progressData.completionPercentage > 70) {
      this.goalStatus = "ahead_of_schedule";
    }
  }

  this.progressData.lastUpdated = new Date();
  next();
});

// Method to update progress
ProductivityGoalSchema.methods.updateProgress = function (
  newValue,
  notes = ""
) {
  this.targetMetrics.currentValue = newValue;

  // Add to daily progress
  this.progressData.dailyProgress.push({
    date: new Date(),
    value: newValue,
    notes,
  });

  return this.save();
};

// Indexes
ProductivityGoalSchema.index({ userId: 1, goalStatus: 1 });
ProductivityGoalSchema.index({ userId: 1, "goalPeriod.endDate": 1 });
ProductivityGoalSchema.index({ userId: 1, goalType: 1 });
ProductivityGoalSchema.index({
  userId: 1,
  "progressData.completionPercentage": -1,
});

const ProductivityGoal = mongoose.model(
  "ProductivityGoal",
  ProductivityGoalSchema
);
export default ProductivityGoal;
