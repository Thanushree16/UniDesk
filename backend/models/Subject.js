import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileType: { type: String },
    fileSize: { type: String },
    fileUrl: { type: String, required: true },

  },
  { timestamps: true }
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
