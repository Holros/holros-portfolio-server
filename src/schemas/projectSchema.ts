import { z } from "zod";

const baseSchema = z
  .object({
    isMobileApp: z.boolean(),
    projectName: z.string().trim().min(1, "Project name is required"),

    githubLink: z
      .string()
      .trim()
      .url("GitHub link must be a valid URL")
      .optional(),
    liveLink: z.string().trim().url("Live link must be a valid URL").optional(),
    androidLink: z
      .string()
      .trim()
      .url("Android link must be a valid URL")
      .optional(),
    iosLink: z.string().trim().url("IOS link must be a valid URL").optional(),
    skills: z
      .array(z.object({ shortName: z.string().trim().toLowerCase() }))
      .min(1, "At least one skill must be selected"),
  })
  .strict();

export const projectSchema = baseSchema.superRefine((data, ctx) => {
  if (data.isMobileApp) {
    // For mobile apps: android + ios required, live/github must be empty
    if (!data.androidLink || data.androidLink === "") {
      ctx.addIssue({
        path: ["androidLink"],
        message: "Android link is required for mobile apps.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!data.iosLink || data.iosLink === "") {
      ctx.addIssue({
        path: ["iosLink"],
        message: "iOS link is required for mobile apps.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.liveLink && data.liveLink !== "") {
      ctx.addIssue({
        path: ["liveLink"],
        message: "Live link should not be provided for mobile apps.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.githubLink && data.githubLink !== "") {
      ctx.addIssue({
        path: ["githubLink"],
        message: "GitHub link should not be provided for mobile apps.",
        code: z.ZodIssueCode.custom,
      });
    }
  } else {
    // For web apps: liveLink required, android + ios must be empty
    if (!data.liveLink || data.liveLink === "") {
      ctx.addIssue({
        path: ["liveLink"],
        message: "Live link is required for web projects.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.androidLink && data.androidLink !== "") {
      ctx.addIssue({
        path: ["androidLink"],
        message: "Android link should not be provided for web projects.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.iosLink && data.iosLink !== "") {
      ctx.addIssue({
        path: ["iosLink"],
        message: "iOS link should not be provided for web projects.",
        code: z.ZodIssueCode.custom,
      });
    }

    // GitHub link is optional
  }
});

export const partialProjectSchema = baseSchema
  .partial()
  .superRefine((data, ctx) => {
    // Only validate conditions if isMobileApp is present
    if (data.isMobileApp === true) {
      if (!data.androidLink || data.androidLink === "") {
        ctx.addIssue({
          path: ["androidLink"],
          message: "Android link is required for mobile apps.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.iosLink || data.iosLink === "") {
        ctx.addIssue({
          path: ["iosLink"],
          message: "iOS link is required for mobile apps.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.liveLink) {
        ctx.addIssue({
          path: ["liveLink"],
          message: "Live link should not be provided for mobile apps.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.githubLink) {
        ctx.addIssue({
          path: ["githubLink"],
          message: "GitHub link should not be provided for mobile apps.",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.isMobileApp === false) {
      if (!data.liveLink || data.liveLink === "") {
        ctx.addIssue({
          path: ["liveLink"],
          message: "Live link is required for web projects.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.androidLink) {
        ctx.addIssue({
          path: ["androidLink"],
          message: "Android link should not be provided for web projects.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.iosLink) {
        ctx.addIssue({
          path: ["iosLink"],
          message: "iOS link should not be provided for web projects.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
