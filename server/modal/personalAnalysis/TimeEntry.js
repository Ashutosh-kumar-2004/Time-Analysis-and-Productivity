// models/TimeEntry.model.js
import mongoose from "mongoose";

const TimeEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTask",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    startTimestamp: {
      type: Date,
      required: true,
    },
    endTimestamp: {
      type: Date,
    },
    durationInMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },
    entryStatus: {
      type: String,
      enum: ["active", "completed", "paused", "abandoned"],
      default: "active",
    },
    focusScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    interruptionLogs: [
      {
        reason: String,
        startTimestamp: Date,
        endTimestamp: Date,
        durationInMinutes: Number,
      },
    ],
    additionalNotes: {
      type: String,
      trim: true,
    },
    productivityTags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Automatically calculate duration before saving
TimeEntrySchema.pre("save", function (next) {
  if (this.endTimestamp && this.startTimestamp) {
    const timeDifferenceInMilliseconds =
      this.endTimestamp - this.startTimestamp;
    this.durationInMinutes = Math.round(timeDifferenceInMilliseconds / 60000);

    // Calculate interruption durations if any
    if (this.interruptionLogs && this.interruptionLogs.length > 0) {
      this.interruptionLogs.forEach((interruption) => {
        if (interruption.endTimestamp && interruption.startTimestamp) {
          const interruptionMilliseconds =
            interruption.endTimestamp - interruption.startTimestamp;
          interruption.durationInMinutes = Math.round(
            interruptionMilliseconds / 60000
          );
        }
      });
    }
  }
  next();
});

// Method to get total productive time (excluding interruptions)
TimeEntrySchema.methods.getNetProductiveTime = function () {
  let totalInterruptionTime = 0;

  if (this.interruptionLogs && this.interruptionLogs.length > 0) {
    totalInterruptionTime = this.interruptionLogs.reduce(
      (total, interruption) => {
        return total + (interruption.durationInMinutes || 0);
      },
      0
    );
  }

  return Math.max(0, this.durationInMinutes - totalInterruptionTime);
};

// Indexes for query optimization
TimeEntrySchema.index({ userId: 1, startTimestamp: -1 });
TimeEntrySchema.index({ taskId: 1, entryStatus: 1 });
TimeEntrySchema.index({
  userId: 1,
  startTimestamp: 1,
  endTimestamp: 1,
});

const TimeEntry = mongoose.model("TimeEntry", TimeEntrySchema);
export default TimeEntry;
