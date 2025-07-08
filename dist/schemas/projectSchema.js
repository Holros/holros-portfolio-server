"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialProjectSchema = exports.projectSchema = void 0;
const zod_1 = require("zod");
const baseSchema = zod_1.z
    .object({
    isMobileApp: zod_1.z.boolean(),
    projectName: zod_1.z.string().trim().min(1, "Project name is required"),
    githubLink: zod_1.z
        .string()
        .trim()
        .url("GitHub link must be a valid URL")
        .optional(),
    liveLink: zod_1.z.string().trim().url("Live link must be a valid URL").optional(),
    androidLink: zod_1.z
        .string()
        .trim()
        .url("Android link must be a valid URL")
        .optional(),
    iosLink: zod_1.z.string().trim().url("IOS link must be a valid URL").optional(),
    skills: zod_1.z
        .array(zod_1.z.object({ shortName: zod_1.z.string().trim().toLowerCase() }))
        .min(1, "At least one skill must be selected"),
})
    .strict();
exports.projectSchema = baseSchema.superRefine((data, ctx) => {
    if (data.isMobileApp) {
        if (!data.androidLink || data.androidLink === "") {
            ctx.addIssue({
                path: ["androidLink"],
                message: "Android link is required for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (!data.iosLink || data.iosLink === "") {
            ctx.addIssue({
                path: ["iosLink"],
                message: "iOS link is required for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.liveLink && data.liveLink !== "") {
            ctx.addIssue({
                path: ["liveLink"],
                message: "Live link should not be provided for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.githubLink && data.githubLink !== "") {
            ctx.addIssue({
                path: ["githubLink"],
                message: "GitHub link should not be provided for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
    }
    else {
        if (!data.liveLink || data.liveLink === "") {
            ctx.addIssue({
                path: ["liveLink"],
                message: "Live link is required for web projects.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.androidLink && data.androidLink !== "") {
            ctx.addIssue({
                path: ["androidLink"],
                message: "Android link should not be provided for web projects.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.iosLink && data.iosLink !== "") {
            ctx.addIssue({
                path: ["iosLink"],
                message: "iOS link should not be provided for web projects.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
    }
});
exports.partialProjectSchema = baseSchema
    .partial()
    .superRefine((data, ctx) => {
    if (data.isMobileApp === true) {
        if (!data.androidLink || data.androidLink === "") {
            ctx.addIssue({
                path: ["androidLink"],
                message: "Android link is required for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (!data.iosLink || data.iosLink === "") {
            ctx.addIssue({
                path: ["iosLink"],
                message: "iOS link is required for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.liveLink) {
            ctx.addIssue({
                path: ["liveLink"],
                message: "Live link should not be provided for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.githubLink) {
            ctx.addIssue({
                path: ["githubLink"],
                message: "GitHub link should not be provided for mobile apps.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
    }
    if (data.isMobileApp === false) {
        if (!data.liveLink || data.liveLink === "") {
            ctx.addIssue({
                path: ["liveLink"],
                message: "Live link is required for web projects.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.androidLink) {
            ctx.addIssue({
                path: ["androidLink"],
                message: "Android link should not be provided for web projects.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
        if (data.iosLink) {
            ctx.addIssue({
                path: ["iosLink"],
                message: "iOS link should not be provided for web projects.",
                code: zod_1.z.ZodIssueCode.custom,
            });
        }
    }
});
//# sourceMappingURL=projectSchema.js.map