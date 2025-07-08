import { z } from "zod";

export const userSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .trim()
      .max(50, "Last name must be less than 50 characters"),
    email: z
      .string()
      .email("Email must be a valid email address")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .trim()
      .min(7, "Pawword can't be less than 7 characters"),
    homePageAbout: z.string().trim(),
    jobTitle: z
      .string()
      .trim()
      .max(100, "Job title must be less than 100 characters"),
    landingPageAbout: z.string().trim(),
    resumeLink: z.string().trim().url("Resume link must be a valid URL"),
  })
  .strict();
