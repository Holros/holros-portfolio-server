import { z } from "zod";

export const testimonialSchema = z.object({
    firstName: z
      .string()
      .trim()
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .trim()
      .max(50, "Last name must be less than 50 characters"),
    // profilePicture: z.string().trim().url("Profile picture must be a valid URL"),
    testimonial: z
      .string()
      .trim()
      .min(10, "Testimonial must be at least 10 characters long"),
  }).strict();
  