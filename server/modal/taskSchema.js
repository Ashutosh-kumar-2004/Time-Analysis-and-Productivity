import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      default: "",
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    // Project Relationship
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },

    // Task Status
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "completed", "blocked"],
      default: "todo",
    },

    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Assignee (optional - can be assigned at subtask level instead)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Time Tracking (USER-ENTERED ONLY)
    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
      default: 0,
    },

    // USER TELLS hours worked (trust-based)
    loggedHours: {
      type: Number,
      min: [0, "Logged hours cannot be negative"],
      default: 0,
    },

    // Optional: User can add note about what they did
    workDescription: {
      type: String,
      default: "",
      maxlength: [1000, "Work description cannot exceed 1000 characters"],
    },

    // Dates
    dueDate: {
      type: Date,
    },

    startDate: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    // Subtasks Array (Embedded Documents)
    subtasks: [
      {
        // Basic Info
        title: {
          type: String,
          required: [true, "Subtask title is required"],
          trim: true,
          maxlength: [200, "Subtask title cannot exceed 200 characters"],
        },

        description: {
          type: String,
          default: "",
          maxlength: [
            1000,
            "Subtask description cannot exceed 1000 characters",
          ],
        },

        // Assignment
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        // Time Tracking (USER-ENTERED)
        estimatedHours: {
          type: Number,
          min: [0, "Estimated hours cannot be negative"],
          default: 0,
        },

        // USER TELLS hours worked on this subtask
        loggedHours: {
          type: Number,
          min: [0, "Logged hours cannot be negative"],
          default: 0,
        },

        // Optional: What user did during these hours
        workNotes: {
          type: String,
          default: "",
          maxlength: [500, "Work notes cannot exceed 500 characters"],
        },

        // Status
        status: {
          type: String,
          enum: ["todo", "in-progress", "completed"],
          default: "todo",
        },

        // Completion Tracking
        completedAt: {
          type: Date,
        },

        // Comments & Reactions (For collaboration only - NOT for time tracking)
        comments: [
          {
            // Comment Details
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },

            text: {
              type: String,
              required: [true, "Comment text is required"],
              trim: true,
              maxlength: [2000, "Comment cannot exceed 2000 characters"],
            },

            createdAt: {
              type: Date,
              default: Date.now,
            },

            editedAt: {
              type: Date,
            },

            isEdited: {
              type: Boolean,
              default: false,
            },

            // Nested Replies
            replies: [
              {
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
                },

                text: {
                  type: String,
                  required: [true, "Reply text is required"],
                  trim: true,
                  maxlength: [1000, "Reply cannot exceed 1000 characters"],
                },

                createdAt: {
                  type: Date,
                  default: Date.now,
                },

                editedAt: {
                  type: Date,
                },

                isEdited: {
                  type: Boolean,
                  default: false,
                },

                // Reactions on Replies
                reactions: [
                  {
                    user: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User",
                      required: true,
                    },

                    type: {
                      type: String,
                      enum: [
                        "like",
                        "dislike",
                        "love",
                        "laugh",
                        "wow",
                        "sad",
                        "angry",
                        "check",
                        "fire",
                      ],
                      required: true,
                    },

                    createdAt: {
                      type: Date,
                      default: Date.now,
                    },
                  },
                ],
              },
            ],

            // Reactions on Main Comment
            reactions: [
              {
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
                },

                type: {
                  type: String,
                  enum: [
                    "like",
                    "dislike",
                    "love",
                    "laugh",
                    "wow",
                    "sad",
                    "angry",
                    "check",
                    "fire",
                  ],
                  required: true,
                },

                createdAt: {
                  type: Date,
                  default: Date.now,
                },
              },
            ],

            // Mentions
            mentions: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],

            // Pinned Status
            isPinned: {
              type: Boolean,
              default: false,
            },
          },
        ],

        // Created/Updated timestamps for subtask
        createdAt: {
          type: Date,
          default: Date.now,
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Labels/Tags
    labels: [
      {
        type: String,
        trim: true,
      },
    ],

    // Created By
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Privacy Settings
    isPrivate: {
      type: Boolean,
      default: false,
    },

    // Order for sorting within project
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ============ MIDDLEWARE ============

// Auto-calculate task totals from subtasks
taskSchema.pre("save", function (next) {
  // Calculate total logged hours from subtasks (USER-ENTERED)
  const subtaskLoggedHours = this.subtasks.reduce((total, subtask) => {
    return total + (subtask.loggedHours || 0);
  }, 0);

  // Task's loggedHours is what USER ENTERS at task level
  // We don't auto-add subtask hours - user decides

  // Calculate total estimated hours from subtasks
  const subtaskEstimatedHours = this.subtasks.reduce((total, subtask) => {
    return total + (subtask.estimatedHours || 0);
  }, 0);

  // If task has no estimated hours but subtasks do, suggest it
  if (!this.estimatedHours && subtaskEstimatedHours > 0) {
    this.estimatedHours = subtaskEstimatedHours;
  }

  // Auto-update status based on subtasks
  if (this.subtasks.length > 0) {
    const completedSubtasks = this.subtasks.filter(
      (st) => st.status === "completed"
    ).length;
    const totalSubtasks = this.subtasks.length;

    if (completedSubtasks === 0) {
      this.status = "todo";
    } else if (completedSubtasks === totalSubtasks) {
      this.status = "completed";
      this.completedAt = this.completedAt || new Date();
    } else if (completedSubtasks > 0) {
      this.status = "in-progress";
    }
  }

  // If task has loggedHours but no subtasks, it's in progress
  if (
    this.loggedHours > 0 &&
    this.subtasks.length === 0 &&
    this.status === "todo"
  ) {
    this.status = "in-progress";
  }

  next();
});

// ============ VIRTUAL PROPERTIES ============

// Calculate completion percentage
taskSchema.virtual("completionPercentage").get(function () {
  if (this.subtasks.length === 0) {
    return this.status === "completed" ? 100 : 0;
  }

  const completedSubtasks = this.subtasks.filter(
    (st) => st.status === "completed"
  ).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Calculate total comments (including replies)
taskSchema.virtual("totalComments").get(function () {
  return this.subtasks.reduce((total, subtask) => {
    const mainComments = subtask.comments.length;
    const replyComments = subtask.comments.reduce((replyTotal, comment) => {
      return replyTotal + comment.replies.length;
    }, 0);
    return total + mainComments + replyComments;
  }, 0);
});

// Calculate total reactions
taskSchema.virtual("totalReactions").get(function () {
  return this.subtasks.reduce((total, subtask) => {
    return subtask.comments.reduce((commentTotal, comment) => {
      const mainReactions = comment.reactions.length;
      const replyReactions = comment.replies.reduce((replyTotal, reply) => {
        return replyTotal + reply.reactions.length;
      }, 0);
      return commentTotal + mainReactions + replyReactions;
    }, 0);
  }, 0);
});

// SUGGESTED total hours (for analytics) - but user can override
taskSchema.virtual("suggestedTotalHours").get(function () {
  const subtaskHours = this.subtasks.reduce((total, subtask) => {
    return total + (subtask.loggedHours || 0);
  }, 0);

  // Return either user-entered task hours OR sum of subtask hours
  return this.loggedHours > 0 ? this.loggedHours : subtaskHours;
});

// ============ STATIC METHODS ============

// Find tasks by project
taskSchema.statics.findByProject = function (projectId) {
  return this.find({ projectId }).sort({ order: 1, createdAt: -1 });
};

// Find tasks assigned to user
taskSchema.statics.findByAssignee = function (userId) {
  return this.find({
    $or: [{ assignedTo: userId }, { "subtasks.assignedTo": userId }],
  });
};

// Get task statistics for project (based on USER-ENTERED hours)
taskSchema.statics.getProjectStats = async function (projectId) {
  const tasks = await this.find({ projectId });

  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    totalEstimatedHours: tasks.reduce(
      (sum, t) => sum + (t.estimatedHours || 0),
      0
    ),
    totalLoggedHours: tasks.reduce((sum, t) => sum + (t.loggedHours || 0), 0), // USER-ENTERED
    overdueTasks: tasks.filter(
      (t) => t.dueDate && t.dueDate < new Date() && t.status !== "completed"
    ).length,

    // Average efficiency (based on user entries)
    avgEfficiency:
      tasks.length > 0
        ? tasks.reduce((sum, t) => {
            if (t.estimatedHours > 0 && t.loggedHours > 0) {
              return sum + t.estimatedHours / t.loggedHours;
            }
            return sum;
          }, 0) /
          tasks.filter((t) => t.estimatedHours > 0 && t.loggedHours > 0).length
        : 0,
  };
};

// ============ INSTANCE METHODS ============

// Add subtask to task
taskSchema.methods.addSubtask = function (subtaskData) {
  this.subtasks.push({
    ...subtaskData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Update order if not provided
  const newSubtask = this.subtasks[this.subtasks.length - 1];
  if (!newSubtask.order) {
    newSubtask.order = this.subtasks.length - 1;
  }

  return this.save();
};

// USER LOGS HOURS on task
taskSchema.methods.logHours = function (hours, workDescription = "") {
  this.loggedHours = hours;
  this.workDescription = workDescription;

  // Auto-update status if hours logged
  if (hours > 0 && this.status === "todo") {
    this.status = "in-progress";
  }

  return this.save();
};

// USER LOGS HOURS on subtask
taskSchema.methods.logSubtaskHours = function (
  subtaskIndex,
  hours,
  workNotes = ""
) {
  if (subtaskIndex >= 0 && subtaskIndex < this.subtasks.length) {
    this.subtasks[subtaskIndex].loggedHours = hours;
    this.subtasks[subtaskIndex].workNotes = workNotes;

    // Auto-update subtask status
    if (hours > 0 && this.subtasks[subtaskIndex].status === "todo") {
      this.subtasks[subtaskIndex].status = "in-progress";
    }

    return this.save();
  }
  throw new Error("Subtask not found");
};

// Mark task as completed (USER DECIDES when it's done)
taskSchema.methods.markComplete = function () {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// Mark subtask as completed
taskSchema.methods.markSubtaskComplete = function (subtaskIndex) {
  if (subtaskIndex >= 0 && subtaskIndex < this.subtasks.length) {
    this.subtasks[subtaskIndex].status = "completed";
    this.subtasks[subtaskIndex].completedAt = new Date();
    return this.save();
  }
  throw new Error("Subtask not found");
};

// Add comment to subtask (for collaboration, not time tracking)
taskSchema.methods.addComment = function (subtaskIndex, commentData) {
  if (subtaskIndex >= 0 && subtaskIndex < this.subtasks.length) {
    this.subtasks[subtaskIndex].comments.push({
      ...commentData,
      createdAt: new Date(),
    });
    return this.save();
  }
  throw new Error("Subtask not found");
};

// Add reaction to comment
taskSchema.methods.addReaction = function (
  subtaskIndex,
  commentIndex,
  reactionData
) {
  if (subtaskIndex >= 0 && subtaskIndex < this.subtasks.length) {
    const subtask = this.subtasks[subtaskIndex];
    if (commentIndex >= 0 && commentIndex < subtask.comments.length) {
      const comment = subtask.comments[commentIndex];

      // Check if user already reacted with this type
      const existingReaction = comment.reactions.find(
        (r) =>
          r.user.toString() === reactionData.user.toString() &&
          r.type === reactionData.type
      );

      if (!existingReaction) {
        comment.reactions.push({
          ...reactionData,
          createdAt: new Date(),
        });
        return this.save();
      }
    }
  }
  throw new Error("Comment not found");
};

export default mongoose.model("Task", taskSchema);
