import express from "express";
import {
  createQuickTask,
  createTask,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.post("/quick", createQuickTask);
router.put("/:taskId", updateTask);
router.put("/:taskId/status", updateTaskStatus);


// ⬜ GET /api/tasks           - Get all tasks (with filters)
// ⬜ GET /api/tasks/:id       - Get single task with subtasks/comments

// ⬜ DELETE /api/tasks/:id    - Delete task
// ⬜ PUT /api/tasks/:id/status - Update status

// option 2
// ⬜ POST /api/tasks/:taskId/subtasks       - Add subtask
// ⬜ PUT /api/tasks/:taskId/subtasks/:subtaskId  - Update subtask
// ⬜ DELETE /api/tasks/:taskId/subtasks/:subtaskId - Remove subtask
// ⬜ POST /api/tasks/:taskId/subtasks/:subtaskId/comments - Add comment
// ⬜ POST /api/tasks/:taskId/subtasks/:subtaskId/time     - Log hours

export default router;
