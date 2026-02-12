import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import File from "../models/File.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload/:subjectId", protect, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { subjectId } = req.params;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = `${Date.now()}-${file.originalname}`;

    // upload to supabase
    const { error } = await supabase.storage
      .from("unidesk-files")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // get public URL
    const { data } = supabase.storage
      .from("unidesk-files")
      .getPublicUrl(fileName);

    const newFile = await File.create({
      fileName: file.originalname,
      fileUrl: data.publicUrl,
      fileType: file.mimetype,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      subject: subjectId,
    });

    res.json({ success: true, file: newFile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/subject/:subjectId", protect, async (req, res) => {
  const files = await File.find({ subject: req.params.subjectId });
  res.json(files);
});

router.get("/count/:subjectId", protect, async (req, res) => {
  const count = await File.countDocuments({ subject: req.params.subjectId });
  res.json({ count });
});

router.get("/open/:fileId", async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) return res.status(404).json({ message: "File not found" });

    const response = await fetch(file.fileUrl);
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", file.fileType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.fileName}"`
    );

    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
