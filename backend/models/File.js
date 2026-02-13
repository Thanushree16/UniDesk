
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, 
    publicId: { type: String }, 
    fileType: { type: String },
    fileSize: { type: String },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);