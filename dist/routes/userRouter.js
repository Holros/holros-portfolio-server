"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../generated/prisma");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const serverResponse_1 = require("../utils/serverResponse");
const zod_1 = require("zod");
const validate_1 = require("../middlewares/validate");
const getPaginationObject_1 = __importDefault(require("../utils/getPaginationObject"));
const userRouter = express_1.default.Router();
const prisma = new prisma_1.PrismaClient().$extends((0, extension_accelerate_1.withAccelerate)());
userRouter.get("/", async (req, res) => {
    const user = await prisma.user.findFirst({
        where: {
            email: { equals: process.env.MY_EMAIL, mode: "insensitive" },
        },
        include: {
            testimonials: true,
            skills: true,
        },
        omit: { hashedPassword: true },
    });
    if (user)
        (0, serverResponse_1.successResponse)(res, "Data fetched successfully", user, 200);
    else
        (0, serverResponse_1.errorResponse)(res, "User don't exist", null, 404);
});
userRouter.get("/skills", async (req, res) => {
    const skills = await prisma.skill.findMany({
        where: {
            userId: process.env.MY_USER_ID,
        },
        orderBy: {
            projects: { _count: "desc" },
        },
    });
    (0, serverResponse_1.successResponse)(res, skills.length > 0
        ? "Skills fetched successfully"
        : "No skills available yet", skills, 200);
});
const querySchema = zod_1.z
    .object({
    skills: zod_1.z.string().array().optional(),
    page: zod_1.z.coerce.number().min(1).optional().default(1),
})
    .strict();
userRouter.get("/projects", (0, validate_1.validate)(querySchema, "query"), async (req, res) => {
    const { skills, page } = req.safeQuery;
    const pageNumber = Number(page);
    const skillArray = Array.isArray(skills) ? skills : skills ? [skills] : [];
    const filters = skillArray.length > 0
        ? {
            AND: skillArray.map((skill) => ({
                skills: {
                    some: {
                        shortName: skill.toString().toLowerCase(),
                    },
                },
            })),
        }
        : {};
    const projects = await prisma.project.findMany({
        where: {
            userId: process.env.MY_USER_ID,
            ...filters,
        },
        include: {
            skills: true,
        },
        take: 10,
        skip: (pageNumber - 1) * 10,
        orderBy: {
            index: "desc",
        },
    });
    const totalCount = await prisma.project.count({
        where: { userId: process.env.MY_USER_ID, ...filters },
    });
    const paginationObject = (0, getPaginationObject_1.default)(totalCount, pageNumber);
    (0, serverResponse_1.successResponse)(res, projects.length > 0
        ? "Projects fetched successfully"
        : "No matching projects found", {
        projects,
        pageination: paginationObject,
    }, 200);
});
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map