import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const subjectSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    files: [fileSchema],
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
