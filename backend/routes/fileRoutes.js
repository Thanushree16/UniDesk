import express from "express";
import multer from "multer";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { protect } from "../middleware/authMiddleware.js";
import File from "../models/File.js";
import { supabase } from "../config/supabase.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// ================== PDF TEXT EXTRACT ==================
async function extractPdfText(buffer) {
  const uint8Array = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
  });

  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map((item) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

// ================== UPLOAD ==================
router.post(
  "/upload/:subjectId",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      const { subjectId } = req.params;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let summary = "";

      // ===== PDF + GROQ AI =====
      if (file.mimetype === "application/pdf") {
        try {
          const text = await extractPdfText(file.buffer);

          console.log("PDF TEXT LENGTH:", text.length);

          const limitedText = text.substring(0, 6000);

          const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "user",
                  content: `Summarize this academic PDF in 5 short bullet points.
Mention important concepts clearly.
Keep language simple for university students.

${limitedText}`,
                },
              ],
              temperature: 0.3,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          summary = response.data.choices[0].message.content;
        } catch (err) {
          console.log("AI SUMMARY ERROR:", err.response?.data || err.message);
          summary = "AI summary unavailable";
        }
      }

      // ===== FILE NAME =====
      const fileName = `${Date.now()}-${file.originalname}`;

      // ===== UPLOAD TO SUPABASE =====
      const { error } = await supabase.storage
        .from("unidesk-files")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      // ===== GET PUBLIC URL =====
      const { data } = supabase.storage
        .from("unidesk-files")
        .getPublicUrl(fileName);

      // ===== SAVE TO DB =====
      const newFile = await File.create({
        fileName: file.originalname,
        fileUrl: data.publicUrl,
        fileType: file.mimetype,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        subject: subjectId,
        publicId: fileName,
        summary,
      });

      // ===== NOTIFICATION =====
      await Notification.create({
        user: req.user.id,
        message: `File uploaded: ${file.originalname}`,
      });

      res.json({
        success: true,
        file: newFile,
        summary,
      });
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// ================== OTHER ROUTES ==================
router.get("/subject/:subjectId", protect, async (req, res) => {
  const files = await File.find({ subject: req.params.subjectId }).sort({
    createdAt: -1,
  });
  res.json(files);
});

router.get("/count/:subjectId", protect, async (req, res) => {
  const count = await File.countDocuments({
    subject: req.params.subjectId,
  });
  res.json({ count });
});

router.delete("/:fileId", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await file.deleteOne();

    await Notification.create({
      user: req.user.id,
      message: `File deleted: ${file.fileName}`,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/total-count", protect, async (req, res) => {
  const count = await File.countDocuments();
  res.json({ count });
});

export default router;