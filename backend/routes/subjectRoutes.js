import express from "express";
import { Subject } from "../models/Subject.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

router.get("/:id", async (req, res) => {
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


router.post("/", async (req, res) => {
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

router.get("/:id/files", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject.files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/:id/files", async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;

    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.files.push({
      fileName,
      fileType,
      fileSize,
      fileUrl,
    });

    await subject.save();

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
                     