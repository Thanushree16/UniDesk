import express from "express";
import axios from "axios";
import File from "../models/File.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, async (req, res) => {
  try {
    const { fileId, prompt } = req.body;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const text = file.summary || "No extracted content available.";

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `${prompt}

Use this study material:

${text}`,
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

    const answer = response.data.choices[0].message.content;

    res.json({ answer });
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "AI failed" });
  }
});

export default router;