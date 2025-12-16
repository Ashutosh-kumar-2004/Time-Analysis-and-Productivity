import express from "express";
import {
  addProject,
  deleteProject,
  getAllUserProjects,
  getAllUsers,
  getProjectTasks,
  restoreProject,

} from "../controllers/projectControllers.js";
import { getProjectFullDetails } from "../controllers/projectDataControllers.js";
import {
  addProjectMember,
  getProjectMembers,
  revokeProjectMember,
  softRemoveProjectMember,
  suspendProjectMember,
} from "../controllers/projectMembersController.js";

const router = express.Router();

// get all the user list for the create task
router.get("/get-all-users-for-task-list-assingment", getAllUsers);

router.get("/get-all-user-project", getAllUserProjects);
router.get("/get-all-project-details/:projectId", getProjectFullDetails);

// get project task
router.get("/:projectId/tasks", getProjectTasks);

// project actions
router.post("/add-project", addProject);
router.patch("/delete-project/:projectId", deleteProject);
router.patch("/restore-project/:projectId", restoreProject);

// Get all members of a project
router.get("/:projectId/members", getProjectMembers);
router.post("/:projectId/members", addProjectMember);
router.put("/:projectId/members/suspend", suspendProjectMember);
router.put("/:projectId/members/revoke", revokeProjectMember);
router.put("/:projectId/members/remove", softRemoveProjectMember);

// // Manager actions

export default router;
