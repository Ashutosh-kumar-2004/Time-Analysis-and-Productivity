import Project from "../modal/Project.js";
import User from "../modal/User.js";

export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Extract current user id from JWT 
    const currentUserId = req.user.id;

    // Fetch project with team, suspended, removed members populated
    const project = await Project.findById(projectId)
      .populate("teamMembers", "firstName lastName email avatar")
      .populate("suspendedMembers", "firstName lastName email avatar")
      .populate("removedMembers", "firstName lastName email avatar")
      .populate("managingUserId", "_id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is a manager
    const isManager = project.managingUserId.some(
      (user) => user._id.toString() === currentUserId.toString()
    );

    res.status(200).json({
      projectId: project._id,
      projectName: project.name,
      currentUserId,
      isManager,
      teamMembers: project.teamMembers,
      suspendedMembers: project.suspendedMembers,
      removedMembers: project.removedMembers,
      managingUserId: project.managingUserId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};