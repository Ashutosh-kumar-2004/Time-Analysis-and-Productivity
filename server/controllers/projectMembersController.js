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

export const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body; // ID of the member to add

    const currentUserId = req.user.id;

    const project = await Project.findById(projectId)
      .populate("managingUserId", "_id")
      .populate("teamMembers", "_id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is a manager
    const isManager = project.managingUserId.some(
      (user) => user._id.toString() === currentUserId.toString()
    );

    if (!isManager) {
      return res
        .status(403)
        .json({ message: "Not authorized Contact Managers" });
    }

    // Check if user exists
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add user to teamMembers if not already present
    if (
      project.teamMembers.some((u) => u._id.toString() === userId.toString())
    ) {
      return res.status(400).json({ message: "User already in project" });
    }

    // Remove from suspended/removed if present
    project.suspendedMembers = project.suspendedMembers.filter(
      (u) => u.toString() !== userId.toString()
    );
    project.removedMembers = project.removedMembers.filter(
      (u) => u.toString() !== userId.toString()
    );

    project.teamMembers.push(userId);
    user.projects.push(projectId);
    await project.save();
    await user.save();

    res
      .status(200)
      .json({ message: "Member added successfully", member: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const suspendProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user.id;

    const project = await Project.findById(projectId)
      .populate("managingUserId", "_id")
      .populate("teamMembers", "_id firstName lastName email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is a manager
    const isManager = project.managingUserId.some(
      (user) => user._id.toString() === currentUserId.toString()
    );

    if (!isManager) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if user is part of teamMembers
    const memberIndex = project.teamMembers.findIndex(
      (u) => u._id.toString() === userId.toString()
    );
    if (memberIndex === -1) {
      return res.status(400).json({ message: "User is not an active member" });
    }

    // Move user from teamMembers to suspendedMembers
    const suspendedMember = project.teamMembers[memberIndex];
    project.teamMembers.splice(memberIndex, 1);
    project.suspendedMembers.push(suspendedMember);

    await project.save();

    res.status(200).json({
      success: true,
      message: "Member suspended successfully",
      suspendedMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const revokeProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;
    const currentUserId = req.user.id;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    // Fetch project
    const project = await Project.findById(projectId)
      .populate("teamMembers", "_id firstName lastName email")
      .populate("suspendedMembers", "_id firstName lastName email")
      .populate("managingUserId", "_id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is manager
    const isManager = project.managingUserId.some(
      (u) => u._id.toString() === currentUserId.toString()
    );
    if (!isManager) {
      return res
        .status(403)
        .json({ message: "Only managers can revoke members" });
    }

    // Check if the member is actually suspended
    const suspendedIndex = project.suspendedMembers.findIndex(
      (u) => u._id.toString() === memberId.toString()
    );
    if (suspendedIndex === -1) {
      return res.status(400).json({ message: "User is not suspended" });
    }

    // Move member from suspendedMembers to teamMembers
    const revokedMember = project.suspendedMembers[suspendedIndex];
    project.suspendedMembers.splice(suspendedIndex, 1);
    project.teamMembers.push(revokedMember._id);

    await project.save();

    res.status(200).json({
      message: "Member successfully revoked",
      revokedMember,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const softRemoveProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;
    const currentUserId = req.user.id;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    // Fetch project
    const project = await Project.findById(projectId)
      .populate("teamMembers", "_id firstName lastName email")
      .populate("managingUserId", "_id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is manager
    const isManager = project.managingUserId.some(
      (u) => u._id.toString() === currentUserId.toString()
    );
    if (!isManager) {
      return res
        .status(403)
        .json({ message: "Only managers can remove members" });
    }

    // Check if the member exists in teamMembers
    const memberIndex = project.teamMembers.findIndex(
      (u) => u._id.toString() === memberId.toString()
    );
    
    if (memberIndex === -1) {
      // Also check if member is already in removedMembers (soft-removed)
      const isAlreadyRemoved = project.removedMembers.some(
        (id) => id.toString() === memberId.toString()
      );
      
      if (isAlreadyRemoved) {
        return res.status(400).json({ message: "User is already removed from the project" });
      }
      
      return res.status(400).json({ message: "User is not a member of this project" });
    }

    // Prevent removing a manager (optional - you can remove this check if managers can be removed)
    const isMemberAlsoManager = project.managingUserId.some(
      (u) => u._id.toString() === memberId.toString()
    );
    
    if (isMemberAlsoManager) {
      return res.status(400).json({ 
        message: "Cannot remove a manager from the project. Please assign a new manager first." 
      });
    }

    // Remove member from teamMembers and add to removedMembers (soft remove)
    const removedMember = project.teamMembers[memberIndex];
    project.teamMembers.splice(memberIndex, 1);
    
    // Add to removedMembers array
    if (!project.removedMembers.includes(removedMember._id)) {
      project.removedMembers.push(removedMember._id);
    }

    await project.save();

    res.status(200).json({
      message: "Member successfully removed from project",
      removedMember,
      removedAt: new Date(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};