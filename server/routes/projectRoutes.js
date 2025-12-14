import express from "express";
import {
  addProject,
  deleteProject,
  getAllUserProjects,
  getProjectTasks,
  restoreProject,
} from "../controllers/projectControllers.js";
import { getProjectFullDetails } from "../controllers/projectDataControllers.js";
import { getProjectMembers } from "../controllers/projectMembersController.js";

const router = express.Router();

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

// // Manager actions
// router.post("/add", addMember);
// router.post("/suspend", suspendMember);
// router.post("/revoke", revokeMember);
// router.post("/remove", removeMember);

export default router;
