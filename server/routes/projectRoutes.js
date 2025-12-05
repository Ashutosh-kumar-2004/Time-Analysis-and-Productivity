import express from "express";
import {
  addProject,
  deleteProject,
  getAllUserProjects,restoreProject
} from "../controllers/projectControllers.js";

const router = express.Router();

router.get("/get-all-user-project", getAllUserProjects);
router.post("/add-project", addProject);
router.patch("/delete-project/:projectId", deleteProject);
router.patch("/restore-project/:projectId", restoreProject);

export default router;
