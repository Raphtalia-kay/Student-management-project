import studentController from "../controllers/studentController.js";
import express from "express";

const router = express.Router();
const {
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchByName,
  filterByMajor,
  sortFilter
} = studentController;
router.get("/", sortFilter);
router.get("/search", searchByName);
router.get("/filter", filterByMajor);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
