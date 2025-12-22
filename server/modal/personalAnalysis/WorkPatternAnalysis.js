import mongoose from "mongoose";

const WorkPatternAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    analysisPeriod: {
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
        enum: ["weekly", "monthly", "quarterly"],
        required: true,
      },
    },

    // Behavioral Patterns
    workHabitPatterns: {
      mostProductiveDays: [
        {
          dayName: String,
          productivityScore: Number,
          averageFocusScore: Number,
        },
      ],
      optimalStartTime: {
        hour: Number,
        minute: Number,
        successRate: Number,
      },
      naturalBreakPatterns: [
        {
          intervalInMinutes: Number,
          frequency: Number,
        },
      ],
    },

    // Task Management Patterns
    taskCompletionPatterns: {
      averageEstimationAccuracy: Number, // percentage
      mostAccuratelyEstimatedCategories: [
        {
          category: String,
          accuracyPercentage: Number,
        },
      ],
      typicalOverrunCategories: [
        {
          category: String,
          averageOverrunPercentage: Number,
        },
      ],
    },

    // Focus & Distraction Analysis
    focusPatterns: {
      averageFocusDurationInMinutes: Number,
      typicalDistractionTriggers: [
        {
          trigger: String,
          frequency: Number,
          averageDurationInMinutes: Number,
        },
      ],
      recoveryTimeAfterInterruption: {
        averageInMinutes: Number,
        medianInMinutes: Number,
      },
    },

    // Productivity Cycles
    productivityCycles: {
      dailyRhythm: [
        {
          hourOfDay: Number,
          typicalProductivityLevel: Number,
        },
      ],
      weeklyRhythm: {
        productivityTrend: String, // 'increasing', 'decreasing', 'stable'
        peakDay: String,
        slumpDay: String,
      },
    },

    // Efficiency Metrics
    efficiencyBenchmarks: {
      tasksPerHour: Number,
      productiveMinutesPerDay: Number,
      focusToOutputRatio: Number,
    },

    // Improvement Trends
    progressMetrics: {
      focusScoreTrend: {
        direction: String,
        percentageChange: Number,
      },
      efficiencyTrend: {
        direction: String,
        percentageChange: Number,
      },
      estimationAccuracyTrend: {
        direction: String,
        percentageChange: Number,
      },
    },

    // Recommendations
    personalizedRecommendations: [
      {
        recommendationType: {
          type: String,
          enum: [
            "schedule_optimization",
            "focus_improvement",
            "task_planning",
            "habit_formation",
          ],
        },
        title: String,
        description: String,
        expectedImpact: Number, // 1-5 scale
        implementationDifficulty: Number, // 1-5 scale
        supportingData: mongoose.Schema.Types.Mixed,
      },
    ],

    // Analysis Metadata
    analysisTimestamp: {
      type: Date,
      default: Date.now,
    },
    dataPointsAnalyzed: {
      type: Number,
      default: 0,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
WorkPatternAnalysisSchema.index({ userId: 1, "analysisPeriod.startDate": -1 });
WorkPatternAnalysisSchema.index({
  userId: 1,
  "analysisPeriod.periodType": 1,
  "analysisPeriod.endDate": -1,
});

const WorkPatternAnalysis = mongoose.model(
  "WorkPatternAnalysis",
  WorkPatternAnalysisSchema
);
export default WorkPatternAnalysis;
