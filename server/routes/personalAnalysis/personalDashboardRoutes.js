import express from "express";
import { getDashboardStats } from "../../controllers/personalAnalysis/personalDashboardController.js";
import protect from "../../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboardStats);

export default router;
