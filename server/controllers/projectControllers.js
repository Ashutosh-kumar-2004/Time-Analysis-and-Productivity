import User from "../modal/User.js";
import Project from "../modal/Project.js";

export const addProject = async (req, res) => {
  try {
    const creatorId = req.user.id; // from JWT
    console.log(creatorId);
    const {
      name,
      description,
      projectAvatar,
      color,
      tags,
      priority,
      managingUserId,
    } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    }

    // Default managingUserId to creator if not provided
    const managerId = managingUserId || creatorId;

    // Initialize teamMembers with creator
    const teamMembers = [creatorId];

    // Create project document
    const newProject = new Project({
      name,
      description,
      projectAvatar,
      color,
      tags,
      priority,
      managingUserId: managerId,
      projectStartedBy: creatorId,
      teamMembers,
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error("Add Project Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getAllUserProjects = () => {};
