import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import subjectRoutes from "./routes/subjectRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://unidesk-six.vercel.app", 
      "https://unidesk-project.vercel.app"  
    ],
    credentials: true 
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/subjects", subjectRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("UniDesk API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));