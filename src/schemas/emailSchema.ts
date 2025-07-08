import { z } from "zod";

export const emailSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Email must be a valid email address")
      .toLowerCase(),
  })
  .strict();
