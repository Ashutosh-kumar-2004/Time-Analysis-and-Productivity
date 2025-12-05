import User from "../modal/User.js";
import Project from "../modal/Project.js";

// export const addProject = async (req, res) => {
//   try {
//     const creatorId = req.user.id; // from JWT

//     const {
//       name,
//       description,

//       tags,
//       priority,
//       managingUserId,
//       startDate: startDateStr,
//       endDate: endDateStr,
//     } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Project name is required",
//       });
//     }

//     if (!endDateStr) {
//       return res.status(400).json({
//         success: false,
//         message: "End date is required for project duration calculation",
//       });
//     }

//     // Convert UI date strings to Date objects
//     const startDate = startDateStr ? new Date(startDateStr) : new Date(); // default to now
//     const endDate = new Date(endDateStr);

//     // Ensure endDate is after startDate
//     if (endDate <= startDate) {
//       return res.status(400).json({
//         success: false,
//         message: "End date must be after start date",
//       });
//     }

//     const managerIds = managingUserId ? [managingUserId] : [creatorId];

//     // Create project document
//     const newProject = new Project({
//       name,
//       description,

//       tags,
//       priority,
//       managingUserId: managerIds,
//       projectStartedBy: creatorId,
//       teamMembers: [creatorId],
//       startDate,
//       endDate,
//     });

//     const savedProject = await newProject.save();

//     return res.status(201).json({
//       success: true,
//       message: "Project created successfully",
//       project: savedProject,
//     });
//   } catch (error) {
//     console.error("Add Project Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

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
