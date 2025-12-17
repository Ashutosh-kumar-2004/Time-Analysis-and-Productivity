import express from "express";
import {
  createDailyCheckIn,
  getTodayCheckIn,
  getCheckInHistory,
} from "../../controllers/personal/dailyCheckIn.js";

const router = express.Router();

router.route("/").post(createDailyCheckIn);
router.route("/today").get(getTodayCheckIn);
router.route("/history").get(getCheckInHistory);

export default router;
