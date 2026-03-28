import studentController from "../controllers/studentController.js";
import express from "express";

const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchByName,
  filterByMajor
} = studentController;
router.get("/", getAllStudents);
router.get("/search", searchByName);
router.get("/search", filterByMajor);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
