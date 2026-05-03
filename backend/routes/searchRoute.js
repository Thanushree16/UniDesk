import express from "express";
import { Subject } from "../models/Subject.js";
import File from "../models/File.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/search?q=query
router.get("/", protect, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ subjects: [], files: [] });
    }

    const regex = new RegExp(q.trim(), "i");

    const [subjects, files] = await Promise.all([
      Subject.find({ subjectName: regex }).limit(5),
      File.find({ fileName: regex }).populate("subject", "subjectName").limit(5),
    ]);

    res.json({ subjects, files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;