import User from "../modal/User.js";
import Project from "../modal/Project.js";

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
      endDate: endDateStr
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
      endDate
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: savedProject,
    });

  } catch (error) {
    console.error("Add Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // only allow managingUserId or creator to archive
    if (
      !project.managingUserId.includes(req.user.id) &&
      project.projectStartedBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project",
      });
    }

    // Soft delete
    project.archived = true;
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project archived successfully",
      project,
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
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
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};
