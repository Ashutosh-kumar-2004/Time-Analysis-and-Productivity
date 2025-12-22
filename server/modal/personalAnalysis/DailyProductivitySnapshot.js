import mongoose from "mongoose";

const DailyProductivitySnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    snapshotDate: {
      type: Date,
      required: true,
      index: true,
    },
    // Time Allocation Metrics
    totalTimeTrackedInMinutes: {
      type: Number,
      default: 0,
    },
    netProductiveTimeInMinutes: {
      type: Number,
      default: 0,
    },
    interruptionTimeInMinutes: {
      type: Number,
      default: 0,
    },

    // Task Completion Metrics
    totalTasksAssigned: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    tasksInProgress: {
      type: Number,
      default: 0,
    },
    tasksPending: {
      type: Number,
      default: 0,
    },

    // Quality Metrics
    averageFocusScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 0,
    },
    taskCompletionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    efficiencyRatio: {
      type: Number, // netProductiveTime / totalTimeTracked
      default: 0,
    },

    // Category Distribution
    timeByCategory: {
      work: { type: Number, default: 0 },
      personal: { type: Number, default: 0 },
      learning: { type: Number, default: 0 },
      health: { type: Number, default: 0 },
      administrative: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },

    // Priority Analysis
    timeByPriority: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 },
    },

    // Time Block Analysis
    peakProductivityHours: [
      {
        hourOfDay: Number, // 0-23
        productivityScore: Number,
        tasksCompleted: Number,
      },
    ],

    // Work Rhythm Analysis
    averageTaskDurationInMinutes: {
      type: Number,
      default: 0,
    },
    longestUninterruptedSessionInMinutes: {
      type: Number,
      default: 0,
    },
    taskSwitchCount: {
      type: Number,
      default: 0,
    },

    // Date components for aggregation
    calendarData: {
      dayOfWeek: Number, // 0-6
      weekNumber: Number,
      month: Number,
      quarter: Number,
      year: Number,
      isWeekend: Boolean,
    },

    // Personal Assessment (optional)
    selfAssessment: {
      energyLevel: { type: Number, min: 1, max: 5 },
      satisfactionScore: { type: Number, min: 1, max: 5 },
      challengeLevel: { type: Number, min: 1, max: 5 },
    },

    // Derived Insights
    keyInsights: [
      {
        insightType: String,
        description: String,
        metricValue: Number,
        comparisonToAverage: Number,
      },
    ],

    improvementAreas: [
      {
        area: String,
        suggestion: String,
        priority: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate derived metrics before saving
DailyProductivitySnapshotSchema.pre("save", function (next) {
  // Calculate calendar data
  const date = new Date(this.snapshotDate);
  this.calendarData = {
    dayOfWeek: date.getDay(),
    weekNumber: this.getWeekNumber(date),
    month: date.getMonth() + 1,
    quarter: Math.floor((date.getMonth() + 3) / 3),
    year: date.getFullYear(),
    isWeekend: date.getDay() === 0 || date.getDay() === 6,
  };

  // Calculate efficiency ratio
  if (this.totalTimeTrackedInMinutes > 0) {
    this.efficiencyRatio =
      this.netProductiveTimeInMinutes / this.totalTimeTrackedInMinutes;
  }

  // Calculate task completion percentage
  if (this.totalTasksAssigned > 0) {
    this.taskCompletionPercentage =
      (this.tasksCompleted / this.totalTasksAssigned) * 100;
  }

  next();
});

// Helper method to get week number
DailyProductivitySnapshotSchema.methods.getWeekNumber = function (date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Indexes for optimized queries
DailyProductivitySnapshotSchema.index(
  { userId: 1, snapshotDate: 1 },
  { unique: true }
);
DailyProductivitySnapshotSchema.index({
  userId: 1,
  "calendarData.weekNumber": 1,
  "calendarData.year": 1,
});
DailyProductivitySnapshotSchema.index({
  userId: 1,
  "calendarData.month": 1,
  "calendarData.year": 1,
});
DailyProductivitySnapshotSchema.index({ userId: 1, efficiencyRatio: -1 });
DailyProductivitySnapshotSchema.index({ userId: 1, averageFocusScore: -1 });

const DailyProductivitySnapshot = mongoose.model(
  "DailyProductivitySnapshot",
  DailyProductivitySnapshotSchema
);
export default DailyProductivitySnapshot;
