import express from "express";
import multer from "multer";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import officeParser from "officeparser";

import { protect } from "../middleware/authMiddleware.js";
import File from "../models/File.js";
import { supabase } from "../config/supabase.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// ================== TEXT EXTRACTORS ==================

async function extractPdfText(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return fullText;
}

async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractOfficeText(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    officeParser.parseOfficeAsync(buffer, { outputErrorToConsole: false })
      .then(resolve)
      .catch(reject);
  });
}

async function extractText(file) {
  const { mimetype, buffer } = file;

  if (mimetype === "application/pdf") {
    return await extractPdfText(buffer);
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    return await extractDocxText(buffer);
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    mimetype === "application/vnd.ms-powerpoint"
  ) {
    return await extractOfficeText(buffer, mimetype);
  }

  if (mimetype === "text/plain") {
    return buffer.toString("utf-8");
  }

  return "";
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

      try {
        const text = await extractText(file);

        if (text.trim().length > 0) {
          const limitedText = text.substring(0, 6000);

          const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "user",
                  content: `Summarize this academic document in 5 short bullet points.
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
        } else {
          summary = "No text content could be extracted from this file.";
        }
      } catch (err) {
        console.log("AI SUMMARY ERROR:", err.response?.data || err.message);
        summary = "AI summary unavailable";
      }

      const fileName = `${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from("unidesk-files")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data } = supabase.storage
        .from("unidesk-files")
        .getPublicUrl(fileName);

      const newFile = await File.create({
        fileName: file.originalname,
        fileUrl: data.publicUrl,
        fileType: file.mimetype,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        subject: subjectId,
        publicId: fileName,
        summary,
      });

      await Notification.create({
        user: req.user.id,
        message: `File uploaded: ${file.originalname}`,
      });

      res.json({ success: true, file: newFile, summary });
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// ================== OTHER ROUTES ==================
router.get("/subject/:subjectId", protect, async (req, res) => {
  const files = await File.find({ subject: req.params.subjectId }).sort({ createdAt: -1 });
  res.json(files);
});

router.get("/count/:subjectId", protect, async (req, res) => {
  const count = await File.countDocuments({ subject: req.params.subjectId });
  res.json({ count });
});

router.delete("/:fileId", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

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