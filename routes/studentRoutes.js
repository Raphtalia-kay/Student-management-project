import { get } from "mongoose";
import studentController from "../controllers/studentController.js";
import express from "express";

const router = express.Router();
const {
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
} = studentController;

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
