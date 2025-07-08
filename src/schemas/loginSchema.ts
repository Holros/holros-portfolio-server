import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Email must be a valid email address")
      .toLowerCase(),
    password: z
      .string()
      .trim()
      .min(7, "Pawword can't be less than 7 characters"),
  })
  .strict();
