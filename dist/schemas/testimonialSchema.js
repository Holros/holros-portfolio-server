"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialSchema = void 0;
const zod_1 = require("zod");
exports.testimonialSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .max(50, "First name must be less than 50 characters"),
    lastName: zod_1.z
        .string()
        .trim()
        .max(50, "Last name must be less than 50 characters"),
    testimonial: zod_1.z
        .string()
        .trim()
        .min(10, "Testimonial must be at least 10 characters long"),
}).strict();
//# sourceMappingURL=testimonialSchema.js.map