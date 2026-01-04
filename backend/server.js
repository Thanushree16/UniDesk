import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); //Allows frontend (localhost:5173) to talk to backend.
app.use(express.json()); //Allows backend to read JSON from requests.

// Test route using simple route - /health
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Start server (only if DB is ready or connected)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
