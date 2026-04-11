import z from "zod";

export const registerStudentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(20),
  email: z.email("Invalid Email"),
  age: z.number().positive("Age must be positive"),
  major: z.string().trim().min(1, "Major is required").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "admin"]).optional(),
});

export const loginStudentSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "admin"]).optional(),
});
