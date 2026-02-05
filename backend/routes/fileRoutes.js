import express from "express";
import File from "../models/File.js";

const router = express.Router();

// GET files by subject
router.get("/:subjectId", async (req, res) => {
  const files = await File.find({ subjectId: req.params.subjectId });
  res.json(files);
});

// ADD file
router.post("/", async (req, res) => {
  const file = new File(req.body);
  const saved = await file.save();
  res.status(201).json(saved);
});

export default router;
