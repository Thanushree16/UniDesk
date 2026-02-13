import express from "express";
import { Subject } from "../models/Subject.js";
import File from "../models/File.js";
import { Notification } from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all subjects
router.get("/", protect, async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

// GET single subject
router.get("/:id", protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE subject
router.post("/", protect, async (req, res) => {
  try {
    const { subjectName, subjectCode, year, semester } = req.body;

    const subject = await Subject.create({
      subjectName,
      subjectCode,
      year,
      semester,
    });

    // 🔔 notification
    await Notification.create({
      user: req.user.id,
      message: `Subject created: ${subject.subjectName}`,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET files of a subject
router.get("/:id/files", protect, async (req, res) => {
  try {
    const files = await File.find({ subject: req.params.id });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // delete all files inside subject
    await File.deleteMany({ subject: subject._id });

    await subject.deleteOne();

    
    await Notification.create({
      user: req.user.id,
      message: `Subject deleted: ${subject.subjectName}`,
    });

    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
