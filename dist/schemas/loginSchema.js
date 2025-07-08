"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z
    .object({
    email: zod_1.z
        .string()
        .trim()
        .email("Email must be a valid email address")
        .toLowerCase(),
    password: zod_1.z
        .string()
        .trim()
        .min(7, "Pawword can't be less than 7 characters"),
})
    .strict();
//# sourceMappingURL=loginSchema.js.map