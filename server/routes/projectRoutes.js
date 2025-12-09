import express from "express";
import {
  addProject,
  deleteProject,
  getAllUserProjects,
  getProjectTasks,
  restoreProject,
} from "../controllers/projectControllers.js";
// import { getProjectFullDetails } from "../controllers/projectDataControllers.js";

const router = express.Router();

router.get("/get-all-user-project", getAllUserProjects);
// router.get("/get-all-project-details/:projectId", getProjectFullDetails);

// get project task
router.get("/:projectId/tasks", getProjectTasks);

router.post("/add-project", addProject);
router.patch("/delete-project/:projectId", deleteProject);
router.patch("/restore-project/:projectId", restoreProject);

export default router;
