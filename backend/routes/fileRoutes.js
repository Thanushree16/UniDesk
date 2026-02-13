import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import File from "../models/File.js";
import { supabase } from "../config/supabase.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


//to upload a file
router.post("/upload/:subjectId", protect, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { subjectId } = req.params;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("unidesk-files")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // Get public URL
    const { data } = supabase.storage
      .from("unidesk-files")
      .getPublicUrl(fileName);

    const newFile = await File.create({
      fileName: file.originalname,
      fileUrl: data.publicUrl,
      fileType: file.mimetype,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      subject: subjectId,
      publicId: fileName, // important for delete
    });

  
    await Notification.create({
      user: req.user.id,
      message: `File uploaded: ${file.originalname}`,
    });

    res.json({ success: true, file: newFile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//to get files by subject
router.get("/subject/:subjectId", protect, async (req, res) => {
  const files = await File.find({ subject: req.params.subjectId });
  res.json(files);
});


//to count a file
router.get("/count/:subjectId", protect, async (req, res) => {
  const count = await File.countDocuments({ subject: req.params.subjectId });
  res.json({ count });
});

//to delete a file
router.delete("/:fileId", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const { error } = await supabase.storage
      .from("unidesk-files")
      .remove([file.publicId]);

    if (error) throw error;

    //Delete from MongoDB
    await file.deleteOne();

    await Notification.create({
      user: req.user.id,
      message: `File deleted: ${file.fileName}`,
    });

    res.json({ message: "File deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
