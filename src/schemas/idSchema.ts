import { z } from "zod";

export const idSchema = z
  .object({
    id: z.string().trim().uuid("ID must be a valid UUID"),
  })
  .strict();
