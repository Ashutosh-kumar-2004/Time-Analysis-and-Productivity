import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import navbarRoutes from "./routes/navbarRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

import protect from "./middleware/auth.js";

const app = express();

connectDB();
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(protect);
app.use("/api/navbar",navbarRoutes);
app.use("/profile",profileRoutes);
app.use("/api/projects",projectRoutes);

app.get("/api/serverStatus", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
