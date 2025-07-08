"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z
    .object({
    firstName: zod_1.z
        .string()
        .trim()
        .max(50, "First name must be less than 50 characters"),
    lastName: zod_1.z
        .string()
        .trim()
        .max(50, "Last name must be less than 50 characters"),
    email: zod_1.z
        .string()
        .email("Email must be a valid email address")
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string()
        .trim()
        .min(7, "Pawword can't be less than 7 characters"),
    homePageAbout: zod_1.z.string().trim(),
    jobTitle: zod_1.z
        .string()
        .trim()
        .max(100, "Job title must be less than 100 characters"),
    landingPageAbout: zod_1.z.string().trim(),
    resumeLink: zod_1.z.string().trim().url("Resume link must be a valid URL"),
})
    .strict();
//# sourceMappingURL=userSchema.js.map