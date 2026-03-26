import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    major: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

export const Student = mongoose.model("Student", studentSchema);

export default Student;
