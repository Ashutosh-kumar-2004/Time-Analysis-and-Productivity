import express from "express";
import {
  addProject,
  deleteProject,
  getAllUserProjects,
} from "../controllers/projectControllers.js";

const router = express.Router();

router.get("/get-all-user-project", getAllUserProjects);
router.post("/add-project", addProject);
router.post("/delete-project/:projectId", deleteProject);

export default router;
