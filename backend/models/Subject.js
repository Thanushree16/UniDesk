import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);

