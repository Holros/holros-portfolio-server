"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../../utils/db");
const serverResponse_1 = require("../../utils/serverResponse");
const uploadImageToCloud_1 = require("../../utils/uploadImageToCloud");
const validate_1 = require("../../middlewares/validate");
const idSchema_1 = require("../../schemas/idSchema");
const projectSchema_1 = require("../../schemas/projectSchema");
const normalizeFormData_1 = require("../../middlewares/normalizeFormData");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const projectRouter = express_1.default.Router();
projectRouter.post("/create", multer_1.default.single("projectPicture"), (0, normalizeFormData_1.normalizeFormData)(["isMobileApp"], ["skills"]), (0, validate_1.validate)(projectSchema_1.projectSchema), async (req, res) => {
    const { isMobileApp, projectName, githubLink = null, liveLink = null, androidLink = null, iosLink = null, skills, } = req.body;
    const file = req.file;
    if (!file) {
        return (0, serverResponse_1.errorResponse)(res, "Project picture is required", null, 400);
    }
    const projectPictureUrl = await (0, uploadImageToCloud_1.uploadImageToCloud)(file.buffer);
    const user = await db_1.prisma.user.findFirst({
        where: {
            email: { equals: process.env.MY_EMAIL, mode: "insensitive" },
        },
    });
    const addedProject = await db_1.prisma.project.create({
        data: {
            projectPicture: projectPictureUrl,
            isMobileApp: isMobileApp,
            projectName: projectName,
            githubLink: githubLink,
            liveLink: liveLink,
            androidLink: androidLink,
            iosLink: iosLink,
            userId: user?.id,
            skills: {
                connect: skills.map((skill) => ({
                    shortName: skill.shortName,
                })),
            },
        },
        include: {
            skills: true,
        },
    });
    (0, serverResponse_1.successResponse)(res, "Project created successfully", addedProject, 201);
});
projectRouter.patch("/update/:id", multer_1.default.single("projectPicture"), (0, normalizeFormData_1.normalizeFormData)(["isMobileApp"], ["skills"]), (0, validate_1.validate)(projectSchema_1.partialProjectSchema), (0, validate_1.validate)(idSchema_1.idSchema, "params"), async (req, res) => {
    const { id } = req.params;
    const { isMobileApp, projectName, githubLink, liveLink, androidLink, iosLink, skills, } = req.body;
    const existingProject = await db_1.prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
        return (0, serverResponse_1.errorResponse)(res, "Project not found", null, 404);
    }
    let projectPictureUrl;
    if (req.file) {
        projectPictureUrl = await (0, uploadImageToCloud_1.uploadImageToCloud)(req.file.buffer);
    }
    const updateData = {
        ...(isMobileApp !== undefined && { isMobileApp }),
        ...(projectName && { projectName }),
        ...(githubLink !== undefined && { githubLink }),
        ...(liveLink !== undefined && { liveLink }),
        ...(androidLink !== undefined && { androidLink }),
        ...(iosLink !== undefined && { iosLink }),
        ...(projectPictureUrl && { projectPicture: projectPictureUrl }),
    };
    const updatedProject = await db_1.prisma.project.update({
        where: { id },
        data: {
            ...updateData,
            ...(skills &&
                skills.length > 0 && {
                skills: {
                    set: [],
                    connect: skills.map((skill) => ({
                        shortName: skill.shortName,
                    })),
                },
            }),
        },
        include: {
            skills: true,
        },
    });
    (0, serverResponse_1.successResponse)(res, "Project updated successfully", updatedProject, 200);
});
exports.default = projectRouter;
//# sourceMappingURL=projectRouter.js.map