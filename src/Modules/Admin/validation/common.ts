import { z } from "zod";

export const baseStringSchema = z
  .string()
  .trim()
  .min(1, "Field cannot be empty");

export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must include at least one special character"
  );
