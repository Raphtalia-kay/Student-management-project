import express from "express";
import {
  authLimiter,
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";
import {
  loginStudentSchema,
  registerStudentSchema,
} from "../schema/auth.schema.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getProfile,
  logoutStudent,
  refreshAccessToken,
  adminDashboard
} = authController;

router.post("/register", validate(registerStudentSchema), registerStudent);
router.post("/login", validate(loginStudentSchema), authLimiter, loginStudent);
router.post("/refresh", refreshAccessToken);
router.post(
  "/admin-dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  adminDashboard,
);
router.get("/profile", authMiddleware, getProfile);
router.get("/logout", logoutStudent);

export default router;
