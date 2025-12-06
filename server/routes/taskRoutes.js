import express from "express";
import {
  createQuickTask,
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { addSubtask } from "../controllers/subTaskControllers.js";

const router = express.Router();

router.post("/", createTask);
router.post("/quick", createQuickTask);
router.put("/:taskId", updateTask);
router.put("/:taskId/status", updateTaskStatus);
router.delete("/:taskId", deleteTask);

// Sub Task api
router.post("/:taskId/subtasks", addSubtask);

// pending works
// ⬜ GET /api/tasks           - Get all tasks (with filters)
// ⬜ GET /api/tasks/:id       - Get single task with subtasks/comments

// option 2
// ⬜ PUT /api/tasks/:taskId/subtasks/:subtaskId  - Update subtask
// ⬜ DELETE /api/tasks/:taskId/subtasks/:subtaskId - Remove subtask
// ⬜ POST /api/tasks/:taskId/subtasks/:subtaskId/comments - Add comment
// ⬜ POST /api/tasks/:taskId/subtasks/:subtaskId/time     - Log hours

export default router;
