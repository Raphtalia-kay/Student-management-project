import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";
import {
  loginStudentSchema,
  registerStudentSchema,
} from "../schema/auth.schema.js";

const router = express.Router();
const { registerStudent, loginStudent, getProfile } = authController;

router.post("/register", validate(registerStudentSchema), registerStudent);
router.post("/login", validate(loginStudentSchema), loginStudent);
router.get("/profile", authMiddleware, getProfile);

export default router;
