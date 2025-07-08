"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z
    .object({
    email: zod_1.z
        .string()
        .trim()
        .email("Email must be a valid email address")
        .toLowerCase(),
})
    .strict();
//# sourceMappingURL=emailSchema.js.map