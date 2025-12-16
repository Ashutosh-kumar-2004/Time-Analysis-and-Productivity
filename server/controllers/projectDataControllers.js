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
    // adding the current user id to the project array
    project.currentUserId = currentUserId;
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

export const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ success: false, message: "Project ID is required" });
    }

    // Fetch all tasks for the project
    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "firstName lastName email")
      .lean();

    // 1. Status Distribution
    const statusCounts = { todo: 0, "in-progress": 0, completed: 0 };
    tasks.forEach((task) => {
      const status = task.status || "todo";
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });

    const statusDistribution = [
      { name: "Todo", value: statusCounts.todo, color: "#9CA3AF" }, // Gray
      { name: "In Progress", value: statusCounts["in-progress"], color: "#3B82F6" }, // Blue
      { name: "Completed", value: statusCounts.completed, color: "#10B981" }, // Green
    ];

    // 2. Priority Distribution
    const priorityCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    tasks.forEach((task) => {
      const priority = task.priority || "medium";
      if (priorityCounts[priority] !== undefined) {
        priorityCounts[priority]++;
      }
    });

    const priorityDistribution = [
      { name: "Low", value: priorityCounts.low, color: "#10B981" },
      { name: "Medium", value: priorityCounts.medium, color: "#F59E0B" },
      { name: "High", value: priorityCounts.high, color: "#EF4444" },
      { name: "Critical", value: priorityCounts.critical, color: "#7F1D1D" },
    ];

    // 3. Member Workload (Assigned Tasks & Hours)
    const memberStats = {}; // { userId: { name, tasks, loggedHours, estimatedHours } }
    
    tasks.forEach((task) => {
      const assignee = task.assignedTo;
      const assigneeId = assignee ? assignee._id.toString() : "unassigned";
      const assigneeName = assignee ? `${assignee.firstName} ${assignee.lastName}` : "Unassigned";

      if (!memberStats[assigneeId]) {
        memberStats[assigneeId] = {
          name: assigneeName,
          tasks: 0,
          loggedHours: 0,
          estimatedHours: 0,
        };
      }

      memberStats[assigneeId].tasks++;
      memberStats[assigneeId].loggedHours += (task.loggedHours || 0);
      memberStats[assigneeId].estimatedHours += (task.estimatedHours || 0);

      // Add subtask hours if relevant (logic depends if we want task-level usage or subtask rollup. 
      // Task model has User-Logged hours on Task AND Subtask. Usually we sum them up or take task.loggedHours if user enters it there).
    });

    const memberWorkload = Object.values(memberStats).map(stat => ({
        name: stat.name,
        Tasks: stat.tasks,
        "Logged Hours": Math.round(stat.loggedHours * 10) / 10,
        "Estimated Hours": Math.round(stat.estimatedHours * 10) / 10
    }));

    // 4. Task Efficiency & Inefficiency
    const activeTasks = tasks
        .filter(t => t.loggedHours > 0 || t.estimatedHours > 0);
    
    // Top 10 most efficient/active for chart
    const taskEfficiency = activeTasks
        .map(t => ({
            name: t.title.length > 20 ? t.title.substring(0, 20) + '...' : t.title,
            "Logged Hours": t.loggedHours || 0,
            "Estimated Hours": t.estimatedHours || 0,
            status: t.status
        }))
        .sort((a, b) => b["Logged Hours"] - a["Logged Hours"])
        .slice(0, 10);

    // 5. Advanced Insights
    
    // Inefficiency: Logged > Estimated
    const inefficientTasks = tasks
        .filter(t => t.estimatedHours > 0 && t.loggedHours > t.estimatedHours)
        .map(t => ({
            id: t._id,
            title: t.title,
            exceededBy: (t.loggedHours - t.estimatedHours).toFixed(1) + " hrs",
            sso: t.assignedTo ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}` : "Unassigned"
        }));

    // Delays: Past Due & Not Completed
    const overdueTasks = tasks
        .filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed")
        .map(t => ({
            id: t._id,
            title: t.title,
            dueDate: new Date(t.dueDate).toLocaleDateString(),
            daysOverdue: Math.ceil((new Date() - new Date(t.dueDate)) / (1000 * 60 * 60 * 24))
        }));

    // Fake Productivity: High hours (>5) but status is 'todo' (no progress tracked)
    const suspicionTasks = tasks
        .filter(t => t.loggedHours > 5 && t.status === "todo")
        .map(t => ({
            id: t._id,
            title: t.title,
            loggedHours: t.loggedHours,
            reason: "High logged hours with 'Todo' status"
        }));

    // Burnout Risk: Members with > 40 estimated hours of incomplete work
    // (We actually need to sum this up from `memberStats` we built earlier)
    const burnoutRisk = Object.values(memberStats)
        .filter(stat => stat.estimatedHours > 40) // Threshold can be adjusted
        .map(stat => ({
            name: stat.name,
            totalHours: stat.estimatedHours.toFixed(1)
        }));

    return res.status(200).json({
      success: true,
      data: {
        statusDistribution,
        priorityDistribution,
        memberWorkload,
        taskEfficiency,
        advanced: {
            inefficientTasks,
            overdueTasks,
            suspicionTasks,
            burnoutRisk
        }
      },
    });
  } catch (error) {
    console.error("Error fetching project analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
