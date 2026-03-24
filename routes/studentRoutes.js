import studentController from "../controllers/studentController.js";
import express from "express";

const router = express.Router();
const { getAllStudents, getStudentById } = studentController;
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

export default router;
