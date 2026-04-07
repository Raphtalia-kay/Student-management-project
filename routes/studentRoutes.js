import { get } from "mongoose";
import studentController from "../controllers/studentController.js";
import express from "express";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../schema/student.schema.js";
import { validate } from "../middleware/validateMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";

const router = express.Router();
const {
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
} = studentController;
const { registerStudent, loginStudent, getProfile } = authController;

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authMiddleware, getProfile);

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", validate(createStudentSchema), createStudent);
router.put("/:id", validate(updateStudentSchema), updateStudent);
router.delete("/:id", deleteStudent);

export default router;
