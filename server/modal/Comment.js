import mongoose from "mongoose";
import Task from "./Task.js";

const commentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },

    likesCount: { type: Number, default: 0 },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

// Like increment
commentSchema.methods.incrementLikes = function () {
  this.likesCount += 1;
  return this.save();
};

// Like decrement
commentSchema.methods.decrementLikes = function () {
  if (this.likesCount > 0) this.likesCount -= 1;
  return this.save();
};

// Auto-link comment to Task.comments
commentSchema.post("save", async function (doc) {
  if (doc.taskId) {
    await Task.findByIdAndUpdate(doc.taskId, {
      $addToSet: { comments: doc._id },
    });
  }
});

// Auto-unlink when comment deleted
commentSchema.post("findOneAndDelete", async function (doc) {
  if (doc?.taskId) {
    await Task.findByIdAndUpdate(doc.taskId, {
      $pull: { comments: doc._id },
    });
  }
});

export default mongoose.model("Comment", commentSchema);
