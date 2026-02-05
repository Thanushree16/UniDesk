import express from "express";
import { Subject } from "../models/Subject.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", protect, async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

router.get("/:id", protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { subjectName, subjectCode, year, semester } = req.body;

    const subject = await Subject.create({
      subjectName,
      subjectCode,
      year,
      semester,
      files: [],
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/files", protect, async (req, res) => {
  try {
    const files = await File.find({ subjectId: req.params.id });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/files", protect, async (req, res) => {
  try {
    const { fileName, fileType, fileSize, filePath } = req.body;

    const file = await File.create({
      fileName,
      fileType,
      fileSize,
      filePath,
      subjectId: req.params.id,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
                     