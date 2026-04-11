import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(20),
  email: z.email("Invalid Email"),
  age: z.number().positive("Age must be positive"),
  major: z.string().trim().min(1, "Major is required").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "admin"]).optional(),
});

export const updateStudentSchema = z.object({
  name: z.string().trim().optional(),
  email: z.email("Invalid Email").optional(),
  age: z.number().positive("Age must be positive").optional(),
  major: z.string().trim().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(["student", "admin"]).optional(),
});
