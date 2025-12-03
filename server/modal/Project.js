// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    projectAvatar: { type: String, default: "" },
    color: { type: String, default: "#007bff" },
    status:{ type: String, enum: ["In Progress", "Started", "Completed"], default: "Started" },
    tags: [{ type: String }],
    archived: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },

    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    suspendedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    removedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    invitedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

    managingUserId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],

    projectStartedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },

    totalDuration: { type: Number, default: 0 }, // minutes
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Calculate total duration
projectSchema.pre("save", function (next) {
  if (this.isModified("startDate") || this.isModified("endDate")) {
    if (this.startDate && this.endDate) {
      const duration = this.endDate - this.startDate;
      this.totalDuration = Math.round(duration / (1000 * 60));
    }
  }
  next();
});

// Utility static method
projectSchema.statics.getProjectName = async function (projectId) {
  const project = await this.findById(projectId);
  return project ? project.name : null;
};

export default mongoose.model("Project", projectSchema);
