"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../middlewares/validate");
const loginSchema_1 = require("../schemas/loginSchema");
const zod_1 = require("zod");
const db_1 = require("../utils/db");
const serverResponse_1 = require("../utils/serverResponse");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authTokens_1 = require("../utils/authTokens");
const authRouter = express_1.default.Router();
authRouter.post("/login", (0, validate_1.validate)(loginSchema_1.loginSchema), async (req, res) => {
    const { email, password } = req.body;
    const user = await db_1.prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: "insensitive",
            },
        },
    });
    if (!user)
        return (0, serverResponse_1.errorResponse)(res, "Wrong email or password", null, 400);
    const { hashedPassword, ...userWithoutPassword } = user;
    const passwordMatches = await bcryptjs_1.default.compare(password, hashedPassword);
    if (!passwordMatches)
        return (0, serverResponse_1.errorResponse)(res, "Wrong email or password", null, 400);
    const tokens = (0, authTokens_1.generateTokens)(user);
    (0, serverResponse_1.successResponse)(res, "Login successful", {
        user: userWithoutPassword,
        tokens,
    }, 200);
});
const refreshTokenSchema = zod_1.z
    .object({
    refreshToken: zod_1.z.string(),
})
    .strict();
authRouter.post("/refresh", (0, validate_1.validate)(refreshTokenSchema), async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = (0, authTokens_1.refreshTokens)(refreshToken);
    (0, serverResponse_1.successResponse)(res, "Token refreshed", tokens, 200);
});
exports.default = authRouter;
//# sourceMappingURL=authRouter.js.map