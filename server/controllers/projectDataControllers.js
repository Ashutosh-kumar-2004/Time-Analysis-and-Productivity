// controllers/projectController.js
import Project from "../modal/Project.js";
import Task from "../modal/Task.js";

export const getProjectFullDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const currentUserId = req.user.id; // assuming you have auth middleware

    if (!projectId) {
      return res.status(400).json({ success: false, message: "Project ID is required" });
    }

    // Fetch project and populate team members and managers
    const project = await Project.findById(projectId)
      .populate("teamMembers", "_id firstName lastName email avatar")
      .populate("suspendedMembers", "_id firstName lastName email avatar")
      .populate("removedMembers", "_id firstName lastName email avatar")
      .populate("invitedMembers", "_id firstName lastName email avatar")
      .populate("managingUserId", "_id firstName lastName email avatar")
      .populate("projectStartedBy", "_id firstName lastName email avatar")
      .lean(); // lean() makes it a plain JS object, easier to modify

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Fetch tasks and populate subtasks, comments, replies, and reactions
    const tasks = await Task.find({ projectId: project._id })
      .populate("createdBy", "_id firstName lastName email avatar")
      .populate("assignedTo", "_id firstName lastName email avatar")
      .populate({
        path: "subtasks.assignedTo",
        select: "_id firstName lastName email avatar"
      })
      .lean();

    // Populate comments -> user, reactions, replies -> user, reactions
    tasks.forEach(task => {
      if (task.subtasks && task.subtasks.length) {
        task.subtasks.forEach(subtask => {
          if (subtask.comments && subtask.comments.length) {
            subtask.comments.forEach(comment => {
              comment.user = comment.user?._id ? comment.user : comment.user; // keep populated user if already
              comment.replies.forEach(reply => {
                reply.user = reply.user?._id ? reply.user : reply.user;
                reply.reactions.forEach(reaction => {
                  reaction.user = reaction.user?._id ? reaction.user : reaction.user;
                });
              });
              comment.reactions.forEach(reaction => {
                reaction.user = reaction.user?._id ? reaction.user : reaction.user;
              });
            });
          }
        });
      }
    });

    // Attach tasks to project
    project.tasks = tasks;

    return res.status(200).json({
      success: true,
      message: "Project Fetched Successfully",
      projects: [project],
      currentUserId,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
