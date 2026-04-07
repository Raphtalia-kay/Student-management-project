import { get } from "mongoose";
import studentController from "../controllers/studentController.js";
import express from "express";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../schema/student.schema.js";
import { validate } from "../middleware/validateMiddleware.js";

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
router.post("/", validate(createStudentSchema), createStudent);
router.put("/:id", validate(updateStudentSchema), updateStudent);
router.delete("/:id", deleteStudent);

export default router;
