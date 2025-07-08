import { z } from "zod";
export const skillSchema = z
  .object({
    shortName: z.string().trim().min(1, "Short name is required"),
    fullName: z.string().trim().min(1, "Full name is required"),
  })
  .strict();
