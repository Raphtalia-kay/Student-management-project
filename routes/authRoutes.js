import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";
import {
  loginStudentSchema,
  registerStudentSchema,
} from "../schema/auth.schema.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();
const { registerStudent, loginStudent, getProfile, logoutStudent } = authController;

router.post("/register", validate(registerStudentSchema), registerStudent);
router.post("/login", validate(loginStudentSchema), loginStudent);
router.get("/profile", authMiddleware, getProfile);
router.get("/logout",logoutStudent)

export default router;
