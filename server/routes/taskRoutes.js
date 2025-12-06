import express from "express";
import {
  createQuickTask,
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
  getTasks,
} from "../controllers/taskController.js";
import {
  addSubtask,
  deleteSubtask,
  logSubtaskHours,
  updateSubtask,
} from "../controllers/subTaskControllers.js";

const router = express.Router();

router.post("/", createTask);
router.post("/quick", createQuickTask);
router.put("/:taskId", updateTask);
router.put("/:taskId/status", updateTaskStatus);
router.delete("/:taskId", deleteTask);

// Sub Task api
router.post("/:taskId/subtasks", addSubtask);
router.put("/:taskId/subtasks/:subtaskId", updateSubtask);
router.delete("/:taskId/subtasks/:subtaskId", deleteSubtask);
router.post("/:taskId/subtasks/:subtaskId/time", logSubtaskHours);
router.get("/", getTasks);

// pending works
// ⬜ GET /api/tasks           - Get all tasks (with filters)
// ⬜ GET /api/tasks/:id       - Get single task with subtasks/comments

// option 2
// ⬜ POST /api/tasks/:taskId/subtasks/:subtaskId/comments - Add comment

export default router;
