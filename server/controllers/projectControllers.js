import Task from "../modal/Task.js";
import Project from "../modal/Project.js";
import User from "../modal/User.js";
export const addProject = async (req, res) => {
  try {
    const creatorId = req.user.id; // from JWT

    const {
      name,
      description,
      color,
      tags,
      priority,
      managingUserId,
      startDate: startDateStr,
      endDate: endDateStr,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!endDateStr) {
      return res.status(400).json({
        success: false,
        message: "End date is required for project duration calculation",
      });
    }

    // Convert UI date strings to Date objects
    const startDate = startDateStr ? new Date(startDateStr) : new Date(); // default to now
    const endDate = new Date(endDateStr);

    // Ensure endDate is after startDate
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const managerIds = managingUserId ? [managingUserId] : [creatorId];

    // Create project document
    const newProject = new Project({
      name,
      description,
      color,
      tags,
      priority,
      managingUserId: managerIds,
      projectStartedBy: creatorId,
      teamMembers: [creatorId],
      startDate,
      endDate,
    });

    const savedProject = await newProject.save();

    // POPULATE THE USER DATA BEFORE SENDING RESPONSE
    const populatedProject = await Project.findById(savedProject._id)
      .populate("managingUserId", "firstName lastName email _id")
      .populate("projectStartedBy", "firstName lastName email _id")
      .populate("teamMembers", "firstName lastName email _id");

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Add Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find all projects where the user is a managing user, team member, or projectStartedBy
    const projects = await Project.find({
      $or: [
        { managingUserId: userId },
        { teamMembers: userId },
        { projectStartedBy: userId },
      ],
    })
      .populate("teamMembers", "firstName lastName email _id")
      .populate("projectStartedBy", "firstName lastName email _id")
      .populate("managingUserId", "firstName lastName email _id");

    res.status(200).json({
      success: true,
      message: "Project Fetched Successfully",
      projects,
      currentUserId: req.user.id,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find and update
    let project = await Project.findById(projectId);
    project.archived = true;
    await project.save();

    //  Populate user data before sending response
    project = await Project.findById(projectId)
      .populate("managingUserId", "firstName lastName email _id")
      .populate("projectStartedBy", "firstName lastName email _id")
      .populate("teamMembers", "firstName lastName email _id");

    return res.status(200).json({
      success: true,
      message: "Project archived successfully",
      project,
      currentUserId: req.user.id,
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const restoreProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find and update
    let project = await Project.findById(projectId);
    project.archived = false;
    await project.save();

    //  Populate user data before sending response
    project = await Project.findById(projectId)
      .populate("managingUserId", "firstName lastName email _id")
      .populate("projectStartedBy", "firstName lastName email _id")
      .populate("teamMembers", "firstName lastName email _id");

    return res.status(200).json({
      success: true,
      message: "Project archived successfully",
      project,
      currentUserId: req.user.id,
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Get all tasks for a specific project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 2. Get all tasks for this project sorted in the order in which newest first
    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 }).lean();

    // 3. Calculate simple stats
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress"
    ).length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;

    // 4. Return response
    res.status(200).json({
      success: true,
      message: "Project tasks fetched successfully",
      data: {
        tasks: tasks,
        stats: {
          total: totalTasks,
          todo: todoTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching tasks",
      error: error.message,
    });
  }
};

// get all the user detail for the create task modal here the data will be use to assign the task to the user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id firstName email lastName avatar");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};