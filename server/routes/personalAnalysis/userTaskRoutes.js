import express from "express";
import {
  getUserTasks,
  createUserTask,
  updateUserTask,
  updateTaskProgress,
  getTaskAnalytics,
  deleteUserTask,
} from "../../controllers/personal/userTask.js";

const router = express.Router();

router.route("/").get(getUserTasks).post(createUserTask);

router.route("/:taskId").put(updateUserTask).delete(deleteUserTask);

router.route("/:taskId/progress").put(updateTaskProgress);

router.route("/:taskId/analytics").get(getTaskAnalytics);

export default router;
