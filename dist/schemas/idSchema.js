"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = void 0;
const zod_1 = require("zod");
exports.idSchema = zod_1.z
    .object({
    id: zod_1.z.string().trim().uuid("ID must be a valid UUID"),
})
    .strict();
//# sourceMappingURL=idSchema.js.map