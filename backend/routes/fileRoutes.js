import express from "express";
import { File } from "../models/File.js";
import { Subject } from "../models/Subject.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// upload file
router.post("/:subjectId", upload.single("file"), async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const newFile = await File.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      subject: subjectId,
    });

    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// all files of a subject
router.get("/subject/:subjectId", async (req, res) => {
  try {
    const files = await File.find({ subject: req.params.subjectId });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//count of files in a subject
router.get("/count/:subjectId", async (req, res) => {
  try {
    const count = await File.countDocuments({ subjectId: req.params.subjectId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
