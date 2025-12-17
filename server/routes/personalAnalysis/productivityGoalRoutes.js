import express from "express";
import {
  createProductivityGoal,
  getProductivityGoals,
  updateGoalProgress,
} from "../../controllers/personal/productivityGoal.js";

const router = express.Router();

router.route("/").post(createProductivityGoal).get(getProductivityGoals);

router.route("/:id/progress").put(updateGoalProgress);

export default router;
