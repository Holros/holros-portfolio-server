"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillSchema = void 0;
const zod_1 = require("zod");
exports.skillSchema = zod_1.z
    .object({
    shortName: zod_1.z.string().trim().min(1, "Short name is required"),
    fullName: zod_1.z.string().trim().min(1, "Full name is required"),
})
    .strict();
//# sourceMappingURL=skillSchema.js.map