"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const serverResponse_1 = require("../../utils/serverResponse");
const validate_1 = require("../../middlewares/validate");
const userSchema_1 = require("../../schemas/userSchema");
const db_1 = require("../../utils/db");
const userRouter = express_1.default.Router();
userRouter.post("/create", (0, validate_1.validate)(userSchema_1.userSchema), async (req, res) => {
    const { firstName, lastName, email, homePageAbout, jobTitle, landingPageAbout, resumeLink, password, } = req.body;
    const isUser = await db_1.prisma.user.findUnique({
        where: { email: email },
    });
    if (isUser)
        return (0, serverResponse_1.errorResponse)(res, "User already exists", null, 400);
    const securePassword = await bcryptjs_1.default.hash(password, 12);
    const createdUser = await db_1.prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            homePageAbout: homePageAbout,
            jobTitle: jobTitle,
            landingPageAbout: landingPageAbout,
            resumeLink: resumeLink,
            hashedPassword: securePassword,
        },
        omit: { hashedPassword: true },
    });
    (0, serverResponse_1.successResponse)(res, "User created successfully", createdUser, 201);
});
userRouter.patch("/update", (0, validate_1.validate)(userSchema_1.userSchema.partial()), async (req, res) => {
    const { id } = req.user;
    const { password, ...dataToUpdate } = req.body;
    const isUser = await db_1.prisma.user.findUnique({
        where: { id: id },
    });
    if (!isUser) {
        return (0, serverResponse_1.errorResponse)(res, "User does not exist", null, 404);
    }
    let securePassword = null;
    if (password)
        securePassword = await bcryptjs_1.default.hash(password, 12);
    const updatedUser = await db_1.prisma.user.update({
        where: { id: id },
        data: {
            ...dataToUpdate,
            ...(securePassword && { hashedPassword: securePassword }),
        },
        omit: { hashedPassword: true },
    });
    (0, serverResponse_1.successResponse)(res, "User updated successfully", updatedUser, 200);
});
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map