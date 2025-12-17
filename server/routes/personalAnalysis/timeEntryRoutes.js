import express from "express";
import {
  createTimeEntry,
  stopTimeEntry,
  getUserTimeEntries,
  getActiveTimeEntry,
  logInterruption,
  updateTimeEntry,
  deleteTimeEntry,
} from "../../controllers/personal/timeEntry.js";

const router = express.Router();

router.route("/").post(createTimeEntry).get(getUserTimeEntries);

router.route("/current").get(getActiveTimeEntry);

router.route("/:entryId").put(updateTimeEntry).delete(deleteTimeEntry);

router.put("/:entryId/stop", stopTimeEntry);
router.post("/:entryId/interruptions", logInterruption);

export default router;
