import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import navbarRoutes from "./routes/navbarRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import protect from "./middleware/auth.js";
import timeEntryRoutes from "./routes/personalAnalysis/timeEntryRoutes.js";
import userTaskRoutes from "./routes/personalAnalysis/userTaskRoutes.js";
import productivityGoalRoutes from "./routes/personalAnalysis/productivityGoalRoutes.js";
import dailyCheckInRoutes from "./routes/personalAnalysis/dailyCheckInRoutes.js";
import personalDashboardRoutes from "./routes/personalAnalysis/personalDashboardRoutes.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(protect);
app.use("/api/navbar", navbarRoutes);
app.use("/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// personal routes
app.use("/api/user-tasks", userTaskRoutes);
app.use("/api/time-entries", timeEntryRoutes);
// app.use("/api/goals", productivityGoalRoutes);
app.use("/api/daily-check-in", dailyCheckInRoutes);
app.use("/api/personal-analysis", personalDashboardRoutes);

app.get("/api/serverStatus", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
