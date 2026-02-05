import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import subjectRoutes from "./routes/subjectRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

connectDB();

app.use("/api/subjects", subjectRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("UniDesk API running");
});

app.listen(5000, () => console.log("Server running on port 5000"));
