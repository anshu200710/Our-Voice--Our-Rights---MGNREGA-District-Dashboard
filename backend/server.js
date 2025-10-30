// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mgnregaRoutes from "./routes/mgnregaRoutes.js";
import geoRoutes from "./routes/geoRoutes.js";
import "./cron/scheduler.js"; // Auto refresh job

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// API routes
app.use("/api/mgnrega", mgnregaRoutes);
app.use("/api/geo", geoRoutes);

app.get("/", (req, res) => {
  res.send("MGNREGA Dashboard API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
